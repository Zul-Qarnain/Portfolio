-- Site visit tracking: total page loads + unique-per-day visitors + recent IPs.
-- Run this whole file in the Supabase SQL editor. Safe to re-run.

create table if not exists public.site_visits (
  id         bigint generated always as identity primary key,
  ip         text         not null,
  path       text         not null,
  visited_at timestamptz  not null default now()
);

create index if not exists site_visits_visited_at_idx
  on public.site_visits (visited_at desc);
create index if not exists site_visits_ip_visited_at_idx
  on public.site_visits (ip, visited_at desc);
create index if not exists site_visits_path_visited_at_idx
  on public.site_visits (path, visited_at desc);

-- RLS with no policies: nobody reads or writes the table directly.
-- Access is only possible through the SECURITY DEFINER functions below.
alter table public.site_visits enable row level security;
revoke all on public.site_visits from anon, authenticated;

-- One row per page load. Also prunes past the retention window.
create or replace function public.record_site_visit(p_ip text, p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_visits (ip, path)
  values (
    left(coalesce(nullif(btrim(p_ip), ''), 'unknown'), 64),
    left(coalesce(nullif(btrim(p_path), ''), '/'), 200)
  );

  delete from public.site_visits
  where visited_at < now() - interval '30 days';
end;
$$;

revoke all on function public.record_site_visit(text, text) from public;
grant execute on function public.record_site_visit(text, text) to anon, authenticated;

-- Admin-only rollup. Returns totals, a 30-day daily series, a per-path
-- breakdown and the most recent visitor rows.
create or replace function public.get_site_visit_stats(p_recent_limit integer default 20)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_limit integer := least(greatest(coalesce(p_recent_limit, 20), 1), 100);
  result  jsonb;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  select jsonb_build_object(
    'total_page_loads', (
      select count(*) from site_visits
    ),
    'loads_today', (
      select count(*) from site_visits
      where visited_at >= date_trunc('day', now())
    ),
    'unique_visitors_today', (
      select count(distinct ip) from site_visits
      where visited_at >= date_trunc('day', now())
    ),
    'unique_visitors_30d', (
      select count(distinct ip) from site_visits
    ),
    'daily', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'day', to_char(d.day, 'YYYY-MM-DD'),
            'loads', d.loads,
            'unique_visitors', d.unique_visitors
          )
          order by d.day desc
        ),
        '[]'::jsonb
      )
      from (
        select date_trunc('day', visited_at) as day,
               count(*)                      as loads,
               count(distinct ip)            as unique_visitors
        from site_visits
        where visited_at >= now() - interval '30 days'
        group by 1
      ) d
    ),
    'by_path', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'path', p.path,
            'loads', p.loads,
            'unique_visitors', p.unique_visitors,
            'last_visited_at', p.last_visited_at
          )
          order by p.loads desc
        ),
        '[]'::jsonb
      )
      from (
        select path,
               count(*)           as loads,
               count(distinct ip) as unique_visitors,
               max(visited_at)    as last_visited_at
        from site_visits
        group by path
      ) p
    ),
    'recent', (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'ip', r.ip,
            'path', r.path,
            'visited_at', r.visited_at
          )
          order by r.rn
        ),
        '[]'::jsonb
      )
      from (
        select ip, path, visited_at,
               row_number() over (order by visited_at desc, id desc) as rn
        from site_visits
        order by visited_at desc, id desc
        limit v_limit
      ) r
    )
  ) into result;

  return result;
end;
$$;

revoke all on function public.get_site_visit_stats(integer) from public;
grant execute on function public.get_site_visit_stats(integer) to authenticated;
