/* Runs supabase/bulk_import.sql directly against Postgres.
 * Reads connection info from env vars (PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE)
 * so the password never lands in a file.
 *   node scripts/run_bulk_import.js
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'bulk_import.sql'), 'utf8');
const client = new Client({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE || 'postgres',
    ssl: { rejectUnauthorized: false },
});

(async () => {
    console.log('connecting...');
    await client.connect();
    console.log('connected. running bulk_import.sql (', (sql.length / 1024 / 1024).toFixed(1), 'MB )...');
    const start = Date.now();
    await client.query(sql);
    console.log('done in', ((Date.now() - start) / 1000).toFixed(1), 's');

    const counts = await client.query(`
        select 'cards' t, count(*) n from cards
        union all select 'offers', count(*) from offers
        union all select 'mcc_rules', count(*) from mcc_rules
    `);
    counts.rows.forEach(r => console.log(r.t, ':', r.n));

    await client.end();
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
