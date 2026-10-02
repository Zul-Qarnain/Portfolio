-- Admin messages UI (src/app/adminpacha/dashboard/messages/page.tsx) calls these
-- four RPCs first and only falls back to direct table access on error.
create or replace function public.get_contact_messages()
returns setof public.contact_messages
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  return query select * from contact_messages order by created_at desc;
end;
$$;

create or replace function public.mark_message_read(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  update contact_messages set status = 'read', updated_at = now() where id = p_id;
end;
$$;

create or replace function public.delete_contact_message(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  delete from contact_messages where id = p_id;
end;
$$;

create or replace function public.delete_contact_messages_bulk(p_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;

  delete from contact_messages where id = any(coalesce(p_ids, '{}'::uuid[]));
end;
$$;

revoke all on function public.get_contact_messages() from public;
revoke all on function public.mark_message_read(uuid) from public;
revoke all on function public.delete_contact_message(uuid) from public;
revoke all on function public.delete_contact_messages_bulk(uuid[]) from public;

grant execute on function public.get_contact_messages() to authenticated;
grant execute on function public.mark_message_read(uuid) to authenticated;
grant execute on function public.delete_contact_message(uuid) to authenticated;
grant execute on function public.delete_contact_messages_bulk(uuid[]) to authenticated;

-- Makes the UI's direct-access delete fallback work if an RPC is ever unavailable.
drop policy if exists "contact_messages admin delete" on public.contact_messages;
create policy "contact_messages admin delete"
  on public.contact_messages for delete to authenticated
  using (true);
