/*
 * Applies the PM's lookup sheets (test/Cards_DB +Later changes.xlsx) to the live cards table.
 *   node scripts/clean_cards_pm.js          dry run: coverage report only
 *   node scripts/clean_cards_pm.js --apply  backup + add columns + update, one transaction
 * Originals are copied to backup_20261118.cards_preclean first. Rows are never deleted.
 */
const fs = require('fs'), os = require('os'), path = require('path'), { Client } = require('pg'), X = require('xlsx');
fs.readFileSync('.env', 'utf8').split(/\r?\n/).forEach(l => { const m = l.match(/^(\w+)=(.*)$/); if (m) process.env[m[1]] = m[2]; });
const APPLY = process.argv.includes('--apply');
const wb = X.readFile('test/Cards_DB +Later changes.xlsx');
const sheet = n => X.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '' }).slice(1).filter(r => r.some(c => c !== ''));

// "â‚¹" style mojibake -> real characters (the PM file and some DB values carry it)
const MOJI = [['Ã¢â€šÂ¹', '₹'], ['â‚¹', '₹'], ['â€”', '—'], ['â€“', '–'], ['â€™', '’'], ['â‚¬', '€']];
const fixMoji = s => typeof s === 'string' ? MOJI.reduce((t, [a, b]) => t.split(a).join(b), s) : s;
const fz = s => fixMoji(String(s == null ? '' : s)).toLowerCase().replace(/[^a-z0-9.]/g, '');
const asNum = s => { const t = String(s == null ? '' : s).replace(/[,%\s]/g, ''); return t !== '' && !isNaN(Number(t)) ? Number(t) : null; };
const keys = s => { const n = asNum(s); return n === null ? [fz(s)] : ['#' + n, '~' + n.toFixed(2)]; };
const txt = v => { const t = String(v == null ? '' : v).trim(); return t === '' || /^tbc$/i.test(t) ? null : fixMoji(t); };

function lookup(rows, keyOf) {
  const m = new Map(), conflicts = [];
  for (const r of rows) for (const k of keyOf(r)) {
    if (m.has(k) && !k.startsWith('~') && JSON.stringify(m.get(k)) !== JSON.stringify(r)) conflicts.push(k);
    if (!m.has(k) || !k.startsWith('~')) m.set(k, r);
  }
  return { m, conflicts: [...new Set(conflicts)] };
}
const find = (lk, raw) => { for (const k of keys(raw)) if (lk.m.has(k)) return lk.m.get(k); return null; };

const L = {
  apr: lookup(sheet('apr'), r => keys(r[1])),
  sal: lookup(sheet('Salary'), r => keys(r[0])),
  rp: lookup(sheet('Card_Rp'), r => [fz(r[0])]),
  spp: lookup(sheet('card_spend_per_point'), r => keys(r[0])),
  pt: lookup(sheet('Product type').filter(r => r[3] !== '' && r[0] !== 'network'), r => [fz(r[0]) + '|' + fz(r[1]) + '|' + fz(r[2])]),
};
const billing = sheet('BillingDays').filter(r => r[0] !== 'Issuer')
  .map(r => ({ k: fz(String(r[0]).replace(/\(.*?\)/g, '')), min: asNum(r[1]), max: asNum(r[2]) }));
const NET = { americanexpress: 'amex' };
const nullish = v => v == null || /^null$/i.test(String(v));

(async () => {
  const c = new Client({ ssl: { rejectUnauthorized: false } }); await c.connect();
  const rows = (await c.query('select card_id, issuer, network, sub_network, product_type, annual_percentage_rate_pct apr, salary, salary_raw, reward_point_conversion_rate rp, spend_amount_per_reward_point spp, spend_amount_per_reward_point_raw spp_raw from cards')).rows;
  const upd = [], miss = { apr: [], sal: [], rp: [], spp: [], pt: [] }, hit = { apr: 0, sal: 0, rp: 0, spp: 0, pt: 0, grace: 0 };
  for (const r of rows) {
    const u = { card_id: r.card_id };
    // apr: clean value is a plain number string or PM text ("upto 42", "NA")
    if (!nullish(r.apr)) {
      const h = find(L.apr, r.apr);
      if (h) { hit.apr++; u.annual_percentage_rate_pct = String(h[2]); }
      else if (asNum(r.apr) !== null) u.annual_percentage_rate_pct = String(asNum(r.apr)); // "47.88%" -> "47.88"
      else miss.apr.push(r.apr);
    }
    // salary (annual). Text results (NA / as per corporate agreement) go to salary_raw
    const sraw = r.salary_raw != null ? r.salary_raw : r.salary;
    if (!nullish(sraw)) {
      const h = find(L.sal, sraw);
      if (h) {
        hit.sal++;
        const v = asNum(h[1]);
        if (v !== null) { u.salary = v; u.salary_raw = null; }
        else { u.salary = /no minimum/i.test(h[1]) ? 0 : null; u.salary_raw = txt(h[1]); }
      } else miss.sal.push(sraw);
    }
    // reward point conversion text -> cashback / mile / program split
    if (!nullish(r.rp)) {
      const h = L.rp.m.get(fz(r.rp));
      if (h) { hit.rp++; Object.assign(u, { rp_cashback_value: asNum(h[1]), rp_mile_value: asNum(h[2]), rp_mile_name: txt(h[3]), rp_program_value: asNum(h[4]), rp_program_name: txt(h[5]) }); }
      else miss.rp.push(r.rp);
    }
    // spend per point -> clean amount + domestic/international earn rate + mile/program extras
    const praw = r.spp_raw != null ? r.spp_raw : r.spp;
    if (!nullish(praw)) {
      const h = find(L.spp, praw);
      if (h) {
        hit.spp++;
        const v = asNum(h[1]);
        u.spend_amount_per_reward_point = v; u.spend_amount_per_reward_point_raw = v === null ? txt(h[1]) : null;
        Object.assign(u, { earn_points_domestic: asNum(h[2]), earn_points_international: asNum(h[3]), spend_mile_rate: asNum(h[4]), spend_mile_name: txt(h[5]), spend_program_rate: asNum(h[6]), spend_program_name: txt(h[7]) });
      } else miss.spp.push(praw);
    }
    // product type
    const nk = fz(r.network), pk = (NET[nk] || nk) + '|' + fz(r.sub_network) + '|' + fz(r.product_type);
    const ph = L.pt.m.get(pk);
    if (ph) { hit.pt++; u.product_type = ph[3]; } else miss.pt.push([r.network, r.sub_network, r.product_type].join(' | '));
    // grace period (issuer level min/max days statement -> due date)
    const ik = fz(String(r.issuer).replace(/\(.*?\)/g, ''));
    const b = billing.find(x => x.min !== null && ik.startsWith(x.k));
    if (b) { hit.grace++; u.grace_period_min_days = b.min; u.grace_period_max_days = b.max; }
    upd.push(u);
  }
  const uniq = a => Object.entries(a.reduce((o, v) => (o[v] = (o[v] || 0) + 1, o), {})).map(([k, v]) => k + ' x' + v);
  console.log('cards', rows.length, 'hits', JSON.stringify(hit));
  for (const k of Object.keys(L)) if (L[k].conflicts.length) console.log('lookup conflicts', k, L[k].conflicts.slice(0, 5));
  for (const k of Object.keys(miss)) console.log('no match', k, miss[k].length, uniq(miss[k]).slice(0, 12));
  fs.writeFileSync(path.join(os.tmpdir(), 'clean_updates.json'), JSON.stringify(upd));
  if (!APPLY) { await c.end(); return; }

  const NEWCOLS = [['rp_cashback_value', 'numeric(8,4)'], ['rp_mile_value', 'numeric(8,4)'], ['rp_mile_name', 'varchar(100)'], ['rp_program_value', 'numeric(8,4)'], ['rp_program_name', 'varchar(100)'],
    ['earn_points_domestic', 'numeric(8,4)'], ['earn_points_international', 'numeric(8,4)'], ['spend_mile_rate', 'numeric(8,4)'], ['spend_mile_name', 'varchar(100)'], ['spend_program_rate', 'numeric(8,4)'], ['spend_program_name', 'varchar(100)']];
  await c.query('begin');
  try {
    await c.query('drop table if exists backup_20261118.cards_preclean');
    await c.query('create table backup_20261118.cards_preclean as table public.cards');
    await c.query('alter table backup_20261118.cards_preclean enable row level security');
    for (const [n, t] of NEWCOLS) await c.query(`alter table cards add column if not exists ${n} ${t}`);
    for (const u of upd) {
      const ks = Object.keys(u).filter(k => k !== 'card_id'); if (!ks.length) continue;
      await c.query('update cards set ' + ks.map((k, i) => `${k} = $${i + 2}`).join(', ') + ' where card_id = $1', [u.card_id, ...ks.map(k => u[k])]);
    }
    // mojibake in every text column of cards
    const tc = (await c.query("select column_name from information_schema.columns where table_schema='public' and table_name='cards' and data_type in ('character varying','text')")).rows.map(r => r.column_name);
    for (const col of tc) for (const [a, b] of MOJI) await c.query(`update cards set ${col} = replace(${col}, $1, $2) where ${col} like '%' || $1 || '%'`, [a, b]);
    // product_type dropdown list now follows the PM's assigned types
    const types = [...new Set(sheet('Product type').filter(r => r[3] !== '' && r[0] !== 'network').map(r => r[3]))];
    await c.query("delete from catalog_lists where table_name='cards' and column_name='product_type'");
    for (const [i, t] of types.entries()) await c.query("insert into catalog_lists values ('cards','product_type',$1,$2)", [t, i]);
    fs.writeFileSync(path.join(os.tmpdir(), 'pt_types.json'), JSON.stringify(types));
    await c.query('commit'); console.log('APPLIED');
  } catch (e) { await c.query('rollback'); console.error('ROLLED BACK', e.message); process.exitCode = 1; }
  await c.end();
})();
