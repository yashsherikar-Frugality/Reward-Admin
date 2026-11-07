# Supabase setup

## 1. Run the schema

Supabase dashboard → **SQL Editor**, run **both** files (order matters):

1. `supabase/migrations/0001_init.sql` — the app's per-page tables:
   `cards`, `offers`, `mcc_rules`, `card_benefits`, `benefit_milestones`,
   `benefit_partner_programs`.
2. `supabase/migrations/0002_workbook.sql` — one table per sheet of the source
   workbook, prefixed `wb_` (`wb_card_details`, `wb_lounge_details`,
   `wb_golf_benefits`, … 20 tables), every column kept as `text`. Table + label
   names come from sheet names only, with any leading issuer word stripped.
   Filled by the **Import Full Workbook** button. Regenerate after the workbook
   changes:
   `npm i --no-save xlsx@0.18.5 && node scripts/gen_workbook_schema.js [path/to/workbook.xlsx]`

RLS is **on** for every table: only signed-in users listed in `admin_users` can read/write,
`anon` gets nothing. The app shows a login screen (`js/auth.js`).

## 2. Add your keys

Edit `js/config.js`:

```js
window.SUPABASE_URL = 'https://xxxx.supabase.co';   // Project Settings → API → Project URL
window.SUPABASE_ANON_KEY = 'eyJ...';                // Project Settings → API → anon / public key
```

The anon key is safe to commit — it only grants what RLS allows.

## 3. Deploy

Static site, no build. Push to Vercel as-is. `config.js` ships with the keys,
or override it in a Vercel build step if you prefer.

## What is wired

| Page | Save | Compare |
|------|------|---------|
| Import From Excel (cards) | `cards` upsert (on `card_id`) | reads `cards`, matches on Card ID + Type + Issuer + Variant + Network + Sub Network |
| Import Offers | reads the `offers` sheet, **replaces** `wb_offers` | reads `wb_offers`, matches on `cardid` |
| Import Preferred Benefits | reads all 16 benefit sheets (Lounge…Reward Structure, every column), **replaces** each `wb_*` table | per sheet, reads its `wb_*` table, matches on `cardid` |
| MCC Imports | reads the `mcc` sheet, **replaces** `wb_mcc` | reads `wb_mcc` |
| Add Reward Rule (wizard) | flat card upsert + offers insert | — |
| Import From Excel → **Import Full Workbook** | reads every sheet, **replaces** every `wb_*` table | — |
| Extract Benefits | — | one checkbox per `wb_*` table; downloads `.xlsx`, one worksheet each |

The per-page importers, the wizard, and Full Workbook now all read the real
workbook column names. Preview tables show **every** column. Save is
replace-the-table (workbook = source of truth). `0001` `offers` / `mcc_rules` /
`card_benefits` still exist but are only written by the wizard now.

## Notes / follow-ups

- **Import Full Workbook is destructive**: each sheet's `wb_*` table is emptied
  and refilled. It's the single-source-of-truth model for that data.
- `wb_*` columns are all `text`; column names are snake_cased sheet headers,
  deduped positionally (`value`, `value_2` for the Lounge Int/Dom blocks).
- Two data models coexist: `0001` tables (per-page importers, app-shaped) and
  `wb_*` tables (raw workbook mirror). `docs/erd` only draws the `0001` six.
- `offers` and `mcc_rules` (0001) use plain `insert` — re-importing dupes rows.
  Add a unique key + `upsert` when you have a stable business key.
- RLS is locked to signed-in users listed in `admin_users` (run `supabase/lock_down_rls.sql` on an existing DB after deploying the login screen; disable public sign-ups).
