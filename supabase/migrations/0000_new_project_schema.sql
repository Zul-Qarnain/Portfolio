-- New Supabase project: full schema for the portfolio.
-- Run BEFORE 0001_site_visits.sql and 0002_restore_data.sql.
-- Safe to re-run.

-- ---------------------------------------------------------------- blog_posts
create table if not exists public.blog_posts (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  content            text default '',
  excerpt            text default '',
  meta_description   text default '',
  meta_keywords      text default '',
  featured_image_url text default '',
  author_id          uuid,
  status             text not null default 'draft'
                     check (status in ('draft', 'published', 'archived')),
  published_at       timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  views_count        integer not null default 0,
  reading_time       integer not null default 0,
  featured           boolean not null default false,
  tags               text[] not null default '{}'
);

create index if not exists blog_posts_status_idx on public.blog_posts (status);
create index if not exists blog_posts_published_at_idx on public.blog_posts (published_at desc);

alter table public.blog_posts enable row level security;

-- Public site reads published posts with the anon key (src/lib/posts-utils.ts
-- builds /rest/v1/blog_posts URLs directly), so anon SELECT must stay open
-- but must never expose drafts.
drop policy if exists "blog_posts anon read published" on public.blog_posts;
create policy "blog_posts anon read published"
  on public.blog_posts for select to anon
  using (status = 'published');

drop policy if exists "blog_posts admin read all" on public.blog_posts;
create policy "blog_posts admin read all"
  on public.blog_posts for select to authenticated
  using (true);

drop policy if exists "blog_posts admin write" on public.blog_posts;
create policy "blog_posts admin write"
  on public.blog_posts for all to authenticated
  using (true) with check (true);

-- ----------------------------------------------------------- contact_messages
create table if not exists public.contact_messages (
  id              uuid primary key default gen_random_uuid(),
  user_email      text not null,
  user_name       text not null,
  message_content text not null,
  status          text not null default 'unread'
                  check (status in ('unread', 'read', 'archived')),
  client_ip       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx
  on public.contact_messages (status);

alter table public.contact_messages enable row level security;

-- Deliberately NO anon policy. In the previous project the anon key could
-- read every message plus sender emails and IPs; visitors hold that key.
-- Inserts go through the SECURITY DEFINER function below instead.
revoke all on public.contact_messages from anon;

drop policy if exists "contact_messages admin read" on public.contact_messages;
create policy "contact_messages admin read"
  on public.contact_messages for select to authenticated
  using (true);

drop policy if exists "contact_messages admin update" on public.contact_messages;
create policy "contact_messages admin update"
  on public.contact_messages for update to authenticated
  using (true) with check (true);

-- ------------------------------------------------------ submit_contact_message
create or replace function public.submit_contact_message(
  p_name text,
  p_email text,
  p_message text,
  p_ip text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pending integer;
begin
  if coalesce(length(btrim(p_name)), 0) = 0
     or coalesce(length(btrim(p_email)), 0) = 0
     or coalesce(length(btrim(p_message)), 0) = 0 then
    return jsonb_build_object('success', false, 'message', 'All fields are required.');
  end if;

  select count(*) into v_pending
  from contact_messages
  where lower(user_email) = lower(btrim(p_email))
    and status = 'unread';

  if v_pending > 0 then
    return jsonb_build_object(
      'success', false,
      'message', 'You already have a pending message.'
    );
  end if;

  insert into contact_messages (user_email, user_name, message_content, client_ip, status)
  values (
    lower(btrim(p_email)),
    left(btrim(p_name), 120),
    left(btrim(p_message), 8000),
    left(nullif(btrim(coalesce(p_ip, '')), ''), 64),
    'unread'
  );

  return jsonb_build_object('success', true, 'message', 'Message received.');
end;
$$;

revoke all on function public.submit_contact_message(text, text, text, text) from public;
grant execute on function public.submit_contact_message(text, text, text, text) to anon, authenticated;
