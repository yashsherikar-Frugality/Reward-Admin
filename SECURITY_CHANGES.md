# Security Remediation Summary — RewardGenius / Reward-Admin

Response to the three penetration-test findings (reported 2026-10-28 / 2026-10-29).
Commits: `f068b01` (login + database lock-down), `da291c3` (XSS, SheetJS, stats refresh).

| # | Finding | Severity | Status |
|---|---------|----------|--------|
| 1 | Unauthenticated full read/write/delete access to the database | Critical | Fixed |
| 2 | Stored XSS via unescaped `.innerHTML` rendering | High | Fixed (CSP not added, see below) |
| 3 | Outdated SheetJS (xlsx 0.18.5): prototype pollution + ReDoS | Medium | Fixed |

---

## 1. Unauthenticated database access

**Problem:** every table had an RLS policy `for all to anon, authenticated using (true)`, so anyone with the public anon key (shipped in `js/config.js`) could read, write and delete all data. The app had no login.

**Changes**
- **Supabase Auth login added.** New `js/auth.js` shows a sign-in screen. The app (`js/script1.js`) is only loaded after a valid session exists, so no data call is made while signed out. Signed-in email and a Sign out link are shown in the top bar. `index.html` loads `auth.js` instead of `script1.js`.
- **Admin allow-list.** New table `admin_users(email)` and function `is_admin()` (security definer, matches the JWT email case-insensitively). Being a Supabase Auth user alone is not enough; the email must also be in `admin_users`.
- **RLS rewritten, deny by default.** All `*_anon_all` policies were dropped and replaced with `*_admin_all ... to authenticated using (is_admin()) with check (is_admin())` on every table. The `anon` role has no access to any table.
- **Source of truth updated.** `supabase/RESET_AND_FULL_SCHEMA.sql` and `scripts/gen_workbook_schema.js` now create the admin-only policies, so a schema reset does not reintroduce the open policy. `supabase/lock_down_rls.sql` applies the change to the live database. `SUPABASE_SETUP.md` was updated.
- **Statistics table** `benefit_numeric_stats` is readable only by admins.
- **Statistics refresh is a background job.** Table-change triggers only mark a table as dirty; `pg_cron` recomputes statistics every minute (`refresh_dirty_stats()`, security definer). This removed the statement timeouts and an RLS error on uploads that an inline recompute caused. Statistics can lag an upload by up to a minute.

**Adding a new user (two steps, both required)**
1. Supabase > Authentication > Users > Add user (email + password, Auto Confirm User).
2. Add the email to the admin list: `insert into admin_users(email) values ('name@frugality.in') on conflict do nothing;`

Missing step 2 shows as `new row violates row-level security policy` on uploads.

Current admins: application.support, yash.sherikar, monika.dangi, atharva.amle (all @frugality.in).

## 2. Stored XSS

**Problem:** database values, Excel cell values, column headers and filenames were interpolated into `.innerHTML` strings with no escaping (53 `.innerHTML` sites).

**Changes (`js/script1.js`)**
- Added an `escapeHtml()` helper and applied it to all untrusted values at every sink: all six reported sinks (`diffRowsHtml`, `allDataTableHtml`, both points in `renderImportTable`, `renderOfferMappingPanel` including filename, `renderSheetImportPreview`) plus other sinks found: form fields, dropdown options, headers, filenames, attribute values.
- Removed inline-handler injection: cell-fix dropdowns passed the column name straight into inline JavaScript. They now read it from `data-` attributes.
- Escaping verified against the report's example payloads.

**Not done:** a Content-Security-Policy header. The app relies on inline `onclick` handlers, so a strict policy would break it and a permissive one adds little. Moving handlers to `addEventListener` would be the prerequisite.

## 3. Outdated SheetJS

**Changes**
- Replaced the CDN copy of xlsx 0.18.5 with a self-hosted **0.20.3** at `js/vendor/xlsx.full.min.js` (fixes GHSA-4r6h-8v6p-xvw6 and GHSA-5pgg-2g8v-p4x9).
- Added `js/xlsx_guard.js`, which wraps `XLSX.read` and rejects files over 25 MB or workbooks with more than 60 sheets before parsing (defence in depth).
- SheetJS is no longer on npm, so recheck https://cdn.sheetjs.com for new releases periodically.

---

## Other changes related to the work
- `.env` (database connection details) is git-ignored. `node_modules/` is also ignored.
- Card-ID safety prompt on save (existing behaviour): warns when a file's Card IDs are not auto-generated.

## Still open / recommended
- Supabase Auth: **disable public sign-ups** and keep Confirm email on, so only manually created users can log in.
- **Reset the database password**; it was shared in chat during this work.
- **Rotate the anon key** as the report recommends, once sign-in is confirmed working.
- The database was open until the lock-down was applied. Check `updated_at` / `created_at` for unexpected changes in that window.
- Add audit logging (who changed what) now that real identities exist.
- Add a CSP header after removing inline handlers.
- Browser-test sign-in and the five import screens after deployment. These were not tested in a browser during this work.
