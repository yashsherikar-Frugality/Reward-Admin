-- Closes the "unauthenticated database access" finding.
-- Replaces the open anon policies with: signed-in AND listed in admin_users.
--
-- BEFORE running this:
--   1. Deploy the version of the app that has the login screen (js/auth.js).
--   2. Supabase > Authentication > Providers > Email: turn OFF "Allow new users to sign up"
--      and keep "Confirm email" ON. Create your admin users under Authentication > Users.
--   3. Put their emails in admin_users (edit the insert below).
-- Running it earlier locks the live app out.

create table if not exists admin_users (email text primary key);
alter table admin_users enable row level security;   -- no policy = not reachable through the API

insert into admin_users (email) values
    ('application.support@frugality.in')
on conflict do nothing;

create or replace function is_admin() returns boolean language sql stable security definer set search_path = public as $$
    select exists (select 1 from admin_users where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')))
$$;

do $$
declare t text;
begin
    for t in
        select table_name from information_schema.tables
        where table_schema = 'public' and table_type = 'BASE TABLE' and table_name <> 'admin_users'
    loop
        execute format('alter table %I enable row level security', t);
        execute format('drop policy if exists %I_anon_all on %I', t, t);
        execute format('drop policy if exists %I_admin_all on %I', t, t);
        execute format('drop policy if exists benefit_numeric_stats_read on %I', t);
        execute format('create policy %I_admin_all on %I for all to authenticated using (is_admin()) with check (is_admin())', t, t);
    end loop;
end $$;
