-- Supabase's ALTER DEFAULT PRIVILEGES grants EXECUTE on new public functions to anon
-- regardless of `revoke ... from public`, so revoke the role explicitly.
-- Without this, the admin-only RPCs are reachable by anyone holding the publishable
-- key and rely solely on the in-function auth.uid() guard.
revoke execute on function public.get_contact_messages() from anon, public;
revoke execute on function public.mark_message_read(uuid) from anon, public;
revoke execute on function public.delete_contact_message(uuid) from anon, public;
revoke execute on function public.delete_contact_messages_bulk(uuid[]) from anon, public;
revoke execute on function public.get_site_visit_stats(integer) from anon, public;

grant execute on function public.get_contact_messages() to authenticated;
grant execute on function public.mark_message_read(uuid) to authenticated;
grant execute on function public.delete_contact_message(uuid) to authenticated;
grant execute on function public.delete_contact_messages_bulk(uuid[]) to authenticated;
grant execute on function public.get_site_visit_stats(integer) to authenticated;
