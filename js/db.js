// Supabase data layer for RewardGenius.
// Loaded after config.js + the supabase-js CDN, before script1.js.
// Exposes window.RGDB.{fetch,save}* — all async, all swallow errors (alert + return
// empty/false) so a bad key never breaks the page.
//
// Note: script1.js top-level `const`s (FIXED_COLUMNS, OFFER_IMPORT_COLUMNS, ...) and
// `function`s (getColVal, genericVal) are global bindings reachable by bare name at
// call time — they are NOT properties of `window`, so don't prefix them.

(function () {
    const url = window.SUPABASE_URL || '';
    const key = window.SUPABASE_ANON_KEY || '';
    const configured = url && key && !url.includes('YOUR-PROJECT') && !key.includes('YOUR-ANON');
    const sb = configured && window.supabase ? window.supabase.createClient(url, key) : null;

    let warned = false;
    function notConfigured() {
        if (!warned) { warned = true; alert('Supabase is not configured yet — set window.SUPABASE_URL / window.SUPABASE_ANON_KEY in js/config.js'); }
        return true;
    }
    function fail(where, err) {
        console.error('[RGDB] ' + where, err);
        alert('Database error (' + where + '): ' + (err && err.message ? err.message : err));
    }

    // Missing values are stored as a placeholder instead of empty/NULL.
    // Set MISSING_TEXT = '' (and MISSING_NUM = null) to go back to real NULLs.
    const MISSING_TEXT = 'N/A';
    const MISSING_NUM = '0.0';
    const isEmpty = (v) => v == null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
    const looksNumericField = (k) => /(_rate|_percent|_amount|_value|_fee|_cap|_count|_visits|_rounds|_sessions|_tickets|_limit|_spend|_bill|_points|_score|_min|_max|_transaction|_markup|_ratio|_duration|_days|per_rupee)$/i.test(k || '') || /^(min|max)_/i.test(k || '');
    const fill = (v, key) => isEmpty(v) ? (looksNumericField(key) ? MISSING_NUM : MISSING_TEXT) : v;

    // ---- schema catalog (js/schema_catalog.js): renamed columns + typed columns ----
    const CAT = () => (window.SCHEMA_CATALOG && window.SCHEMA_CATALOG.tables) || {};
    const catCols = (table) => (CAT()[table] || {}).columns || {};
    const toNew = (table) => { const m = {}; Object.entries(catCols(table)).forEach(([n, c]) => { if (c.from && c.from !== n) m[c.from] = n; }); return m; };   // old -> new
    const toOld = (table) => { const m = {}; Object.entries(toNew(table)).forEach(([o, n]) => { m[n] = o; }); return m; };                                 // new -> old
    const PLACEHOLDER = /^(|n\/a|na|nan|null|none|-|0\.0)$/i;
    function parseNum(v) {
        let t = String(v).trim();
        if (PLACEHOLDER.test(t)) return null;
        if (/^nil$/i.test(t)) return 0;
        t = t.replace(/\s*\+$/, '').replace(/\s*(years?|yrs?)$/i, '').replace(/^(₹|rs\.?|inr)\s*/i, '').replace(/,/g, '').trim();
        const m = t.match(/^([0-9]+(?:\.[0-9]+)?)\s*(lakhs?|lacs?|crores?|cr|l|k|m|%)?$/i);
        if (!m) return null;
        const mult = { lakh: 1e5, lakhs: 1e5, lac: 1e5, lacs: 1e5, l: 1e5, crore: 1e7, crores: 1e7, cr: 1e7, k: 1e3, m: 1e6 }[(m[2] || '').toLowerCase()] || 1;
        return Number(m[1]) * mult;
    }
    function parseBool(v) {
        if (typeof v === 'boolean') return v;
        const t = String(v).trim().toLowerCase();
        if (PLACEHOLDER.test(t)) return null;
        if (['true', 't', 'yes', 'y', '1'].includes(t) || /^(yes|automatic|included)\b/.test(t)) return true;
        if (['false', 'f', 'no', 'n', '0'].includes(t) || /^no\b/.test(t)) return false;
        return null;
    }
    function parseDate(v) {
        const t = String(v).trim();
        let m = t.match(/^(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
        m = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
        return null;
    }
    // PM dropdown lists: case-insensitive match returns the canonical list value; the UI says "Amex", the PM list says "American Express".
    const listFor = (table, col) => { const l = ((window.SCHEMA_CATALOG || {}).lists || []).find(x => x.t === table && x.col === col); return l ? l.items : null; };
    const NETWORK_ALIAS = { amex: 'American Express' };
    const canon = (table, col, v) => {
        if (table === 'cards' && col === 'network' && NETWORK_ALIAS[String(v).trim().toLowerCase()]) return NETWORK_ALIAS[String(v).trim().toLowerCase()];
        const items = listFor(table, col);
        const hit = items && items.find(x => String(x).toLowerCase() === String(v).trim().toLowerCase());
        return hit !== undefined && hit !== null ? hit : v;
    };
    // null when the value fits the PM column (type, length, dropdown list), otherwise a short reason.
    function checkValue(table, key, v) {
        const k = table === 'cards' ? cardCol(key) : key;
        const col = toNew(table)[k] || k, c = catCols(table)[col];
        if (!c || isEmpty(v) || PLACEHOLDER.test(String(v).trim())) return null;
        const type = String(c.type), t = String(v).trim();
        const items = listFor(table, col);
        if (items && !/^(boolean|numeric|integer|bigint)/i.test(type)) {
            const cv = canon(table, col, t);
            return items.some(x => String(x).toLowerCase() === String(cv).toLowerCase()) ? null : 'not in the PM dropdown list';
        }
        if (/^boolean/i.test(type)) return parseBool(t) === null ? 'must be Yes/No' : null;
        if (/^date/i.test(type)) return parseDate(t) === null ? 'must be a date' : null;
        if (/^(numeric|integer|bigint)/i.test(type)) {
            const p = parseNum(t);
            if (p === null) return 'must be a number';
            const m = type.match(/numeric\((\d+),(\d+)\)/i);
            if (m && Math.abs(p) >= Math.pow(10, Number(m[1]) - Number(m[2]))) return 'number too large';
            if (items && !items.some(x => Number(x) === p)) return 'not in the PM dropdown list';
            return null;
        }
        const n = type.match(/varchar\((\d+)\)/i);
        if (n && t.length > Number(n[1])) return 'too long (max ' + n[1] + ')';
        return null;
    }
    // Rename legacy keys to the catalog's column names, convert typed columns; anything that does
    // not parse is stored in <col>_raw (when the table has one) instead of being lost.
    function toDbRecord(table, rec) {
        const nn = toNew(table), cols = catCols(table), dropped = (CAT()[table] || {}).dropped || [], out = {};
        Object.keys(rec).forEach(k => {
            if (dropped.includes(k)) return;   // column removed by the catalog migration (value lives in reward_fields)
            const col = nn[k] || k, c = cols[col];
            let v = rec[k];
            const type = c ? String(c.type) : '';
            const typed = /^(numeric|integer|bigint|boolean|date)/i.test(type);
            if (!typed) { out[col] = (typeof v === 'string' && !isEmpty(v)) ? canon(table, col, v) : v; return; }
            if (isEmpty(v)) { out[col] = null; return; }
            let p = null;
            if (/^boolean/i.test(type)) p = parseBool(v);
            else if (/^date/i.test(type)) p = parseDate(v);
            else { p = parseNum(v); if (p != null && /^(integer|bigint)/i.test(type)) p = Math.round(p); }
            // Strict columns: a value that does not parse is sent as-is so the database rejects it loudly (never silently lost).
            out[col] = (p == null && !PLACEHOLDER.test(String(v).trim())) ? v : p;
        });
        return out;
    }
    // DB row -> row keyed by the legacy names the UI/compare code uses; typed values as strings, <col>_raw fills gaps.
    function fromDbRow(table, row) {
        const oo = toOld(table), cols = catCols(table), out = { ...row };
        Object.keys(cols).forEach(col => {
            if (!(col in row)) return;
            let v = row[col];
            const type = String((cols[col] || {}).type || '');
            if (v == null && row[col + '_raw'] != null) v = row[col + '_raw'];
            else if (v != null && /^(boolean|numeric|integer|bigint|date)/i.test(type)) v = String(v);
            out[col] = v;
            if (table === 'cards' && col === 'network' && v === 'American Express') { v = 'Amex'; out[col] = v; }
            if (oo[col]) out[oo[col]] = v;
        });
        return out;
    }

    const toBool = (v) => v === true || ['true', 'yes', '1', 'y'].includes(String(v == null ? '' : v).trim().toLowerCase());
    const toArrText = (v) => Array.isArray(v) ? v.join(',') : (v == null ? '' : String(v));
    const blank = (v) => fill(v);
    const colVal = (row, k) => (typeof getColVal === 'function' ? getColVal(row, k) : (row[k] ?? ''));
    const genVal = (row, k) => (typeof genericVal === 'function' ? genericVal(row, k) : (row[k] ?? ''));
    const fixedCols = () => (typeof FIXED_COLUMNS !== 'undefined' ? FIXED_COLUMNS : []);
    const offerCols = () => (typeof OFFER_IMPORT_COLUMNS !== 'undefined' ? OFFER_IMPORT_COLUMNS : []);
    const rewardSubIds = () => (typeof REWARD_SUB_FIELD_IDS !== 'undefined' ? [...REWARD_SUB_FIELD_IDS] : []);

    // toDbRecord for typed columns, placeholder fill for plain text columns.
    function typedFill(table, rec) {
        const cols = catCols(table), nn = toNew(table);
        const out = {};
        Object.keys(rec).forEach(k => {
            const c = cols[nn[k] || k], typed = c && /^(numeric|integer|bigint|boolean|date)/i.test(String(c.type));
            if (CAT()[table] && isEmpty(rec[k])) { out[k] = null; return; }   // catalog tables: blank = NULL (CHECK lists / typed columns reject placeholders)
            out[k] = (typed || k === 'updated_at' || (rec[k] !== null && typeof rec[k] === 'object')) ? rec[k] : fill(rec[k], k);
        });
        const rec2 = toDbRecord(table, out);
        ['id', 'imported_at', 'created_at'].forEach(k => { if (rec2[k] == null) delete rec2[k]; });   // let the column defaults apply
        return rec2;
    }

    // ---- cards -----------------------------------------------------
    const CARD_COL = {
        id: 'card_id', subNetwork: 'sub_network', issuerCountry: 'issuer_country',
        cardStatus: 'card_status', cardStatusDate: 'card_status_date',
        cardWebLink: 'card_web_link', cardAltLink: 'card_alt_link',
        rewardProgram: 'reward_program', ageMin: 'age_min', ageMax: 'age_max',
        creditScore: 'credit_score', empType: 'emp_type', productType: 'product_type',
        benefit_tokenEnabled: 'benefit_token_enabled', benefit_upiSupported: 'benefit_upi_supported',
        benefit_feeWaiver: 'benefit_fee_waiver', benefit_partnerProgram: 'benefit_partner_program',
        benefit_airportTransfer: 'benefit_airport_transfer', benefit_rewardPoints: 'benefit_reward_points',
        benefit_renewalBenefit: 'benefit_renewal_benefit', benefit_travelInsurance: 'benefit_travel_insurance',
        benefit_purchaseProtection: 'benefit_purchase_protection', benefit_personalAccident: 'benefit_personal_accident',
        benefit_roadsideAssistance: 'benefit_roadside_assistance', benefit_statusBenefits: 'benefit_status_benefits'
    };
    const cardCol = (k) => CARD_COL[k] || k;

    function cardRowToRecord(row) {
        const rec = {};
        fixedCols().forEach(({ key }) => {
            const v = colVal(row, key);
            rec[cardCol(key)] = key.startsWith('benefit_') ? toBool(v) : v;
        });
        rec.updated_at = new Date().toISOString();
        return typedFill('cards', rec);
    }

    async function fetchCards() {
        if (!sb) { notConfigured(); return []; }
        try {
            const { data, error } = await sb.from('cards').select('*');
            if (error) throw error;
            return (data || []).map(r => fromDbRow('cards', r));
        } catch (e) { fail('fetch cards', e); return []; }
    }
    async function saveCards(rows) {
        if (!sb) { notConfigured(); return false; }
        try {
            const recs = (rows || []).map(cardRowToRecord).filter(r => r.card_id);
            if (!recs.length) { alert('No rows with a Card ID to save.'); return false; }
            const { error } = await sb.from('cards').upsert(recs, { onConflict: 'card_id' });
            if (error) throw error;
            return true;
        } catch (e) { fail('save cards', e); return false; }
    }

    // ---- offers --------------------------------------------------
    const OFFER_COL = {
        cardId: 'card_id', offerId: 'offer_id', subCategory: 'sub_category',
        rewardType: 'reward_type', instancePeriod: 'instance_period', minTx: 'min_tx',
        maxTx: 'max_tx', maxBenefit: 'max_benefit', rewardCap: 'reward_cap', startDate: 'start_date', endDate: 'end_date',
        paymentScopeType: 'payment_scope_type', paymentScopeValue: 'payment_scope_value',
        rpExpiry: 'rp_expiry', couponCode: 'coupon_code', customPlatform: 'custom_platform'
    };
    const OFFER_COL_REV = Object.fromEntries(Object.entries(OFFER_COL).map(([a, b]) => [b, a]));

    function offerRowToRecord(row) {
        const rec = { reward_fields: {} };
        offerCols().forEach(k => {
            let v = genVal(row, k);
            if (k === 'paymentScopeValue') v = toArrText(v);
            rec[OFFER_COL[k] || k] = blank(v);
        });
        if (row.merchant !== undefined) rec.merchant = toArrText(row.merchant);
        const rf = row.rewardFields || {};
        Object.keys(rf).forEach(k => { rec.reward_fields[k] = rf[k]; });
        rewardSubIds().forEach(k => {
            const v = genVal(row, k);
            if (v !== '' && v != null) rec.reward_fields[k] = v;
        });
        // Also write flat columns alongside the jsonb blob for direct SQL/BI access, but only the
        // ones the table still has (the catalog dropped the flattened cb_/id_/vd_/v_/am_/hp_/c_ copies).
        const offerCatCols = catCols('offers');
        Object.keys(rec.reward_fields).forEach(k => { if (offerCatCols[k.toLowerCase()]) rec[k.toLowerCase()] = rec.reward_fields[k]; });
        rec.updated_at = new Date().toISOString();
        return typedFill('offers', rec);
    }
    function offerRecordToRow(rec) {
        const row = {};
        const old = fromDbRow('offers', rec);
        Object.keys(old).forEach(c => { row[OFFER_COL_REV[c] || c] = old[c]; });
        Object.assign(row, rec.reward_fields || {});
        return row;
    }

    async function fetchOffers() {
        if (!sb) { notConfigured(); return []; }
        try {
            const { data, error } = await sb.from('offers').select('*');
            if (error) throw error;
            return (data || []).map(offerRecordToRow);
        } catch (e) { fail('fetch offers', e); return []; }
    }
    async function saveOffers(rows) {
        if (!sb) { notConfigured(); return false; }
        try {
            const recs = (rows || []).map(offerRowToRecord);
            if (!recs.length) { alert('No offers to save.'); return false; }
            const { error } = await sb.from('offers').insert(recs);
            if (error) throw error;
            return true;
        } catch (e) { fail('save offers', e); return false; }
    }

    // ---- mcc_rules ----------------------------------------------
    async function fetchMcc() {
        if (!sb) { notConfigured(); return []; }
        try {
            const { data, error } = await sb.from('mcc_rules').select('*');
            if (error) throw error;
            return (data || []).map(r => fromDbRow('mcc_rules', r)).map(r => ({
                'Card': r.card_id, 'Offer ID': r.offer_id, 'MCC': r.mcc,
                'Inclusion': r.inclusion, 'Exclusion': r.exclusion
            }));
        } catch (e) { fail('fetch mcc', e); return []; }
    }
    async function saveMcc(rows) {
        if (!sb) { notConfigured(); return false; }
        try {
            const recs = (rows || []).map(r => typedFill('mcc_rules', {
                card_id: genVal(r, 'Card'), offer_id: genVal(r, 'Offer ID'), mcc: genVal(r, 'MCC'),
                inclusion: genVal(r, 'Inclusion'), exclusion: genVal(r, 'Exclusion')
            }));
            if (!recs.length) { alert('No MCC rows to save.'); return false; }
            const { error } = await sb.from('mcc_rules').insert(recs);
            if (error) throw error;
            return true;
        } catch (e) { fail('save mcc', e); return false; }
    }

    // ---- benefits (card_benefits + child tables) ----------------
    // Text detail columns on card_benefits (order irrelevant).
    const BENEFIT_TEXT_COLS = [
        'lounge_program', 'lounge_dom_visits', 'lounge_dom_period', 'lounge_dom_frequency', 'lounge_dom_criteria',
        'lounge_int_visits', 'lounge_int_period', 'lounge_int_frequency', 'lounge_int_criteria',
        'golf_courses', 'golf_rounds', 'golf_period', 'golf_notes',
        'dining_partner', 'dining_discount_type', 'dining_max_discount', 'dining_frequency', 'dining_min_spend', 'dining_notes',
        'movie_partner', 'movie_discount_type', 'movie_max_discount', 'movie_frequency', 'movie_ticket_limit', 'movie_days', 'movie_notes',
        'spa_partner', 'spa_discount', 'spa_max_discount', 'spa_frequency', 'spa_notes',
        'concierge_notes', 'ins_provider', 'ins_coverage', 'ins_policy_link',
        'fee_waiver_spend', 'fee_waiver_period',
        'fuel_rate', 'fuel_max_waiver', 'fuel_period', 'fuel_min_tx', 'fuel_max_tx',
        'welcome_value', 'welcome_benefit_type', 'welcome_free_text'
    ];
    const BENEFIT_BOOL_COLS = ['ins_travel', 'ins_purchase_protection', 'ins_personal_accident', 'ins_extended_warranty', 'ins_lost_card_liability'];
    // imported-row key -> table column (camelCase leftovers from the wizard/sheet)
    const BENEFIT_ALIAS = { ins_policyLink: 'ins_policy_link', ins_purchaseProtection: 'ins_purchase_protection', ins_personalAccident: 'ins_personal_accident', ins_extendedWarranty: 'ins_extended_warranty', ins_lostCardLiability: 'ins_lost_card_liability' };

    function benefitPick(main, col) {
        if (main[col] !== undefined) return main[col];
        const aliasKey = Object.keys(BENEFIT_ALIAS).find(k => BENEFIT_ALIAS[k] === col);
        return aliasKey && main[aliasKey] !== undefined ? main[aliasKey] : undefined;
    }

    async function fetchBenefits() {
        if (!sb) { notConfigured(); return []; }
        try {
            const { data, error } = await sb.from('card_benefits').select('*');
            if (error) throw error;
            return (data || []).map(r => ({ ...r, cardId: r.card_id }));
        } catch (e) { fail('fetch benefits', e); return []; }
    }
    async function saveBenefits(main, slabs, partners) {
        if (!sb) { notConfigured(); return false; }
        try {
            const cardId = String((main && (main.cardId || main.id)) || '').trim();
            if (!cardId) { alert('Benefits row has no Card ID.'); return false; }
            const rec = { card_id: cardId, updated_at: new Date().toISOString() };
            BENEFIT_TEXT_COLS.forEach(c => { rec[c] = fill(benefitPick(main, c), c); });
            BENEFIT_BOOL_COLS.forEach(c => { const v = benefitPick(main, c); rec[c] = String(v === undefined ? false : toBool(v)); });

            let r = await sb.from('card_benefits').upsert(rec, { onConflict: 'card_id' });
            if (r.error) throw r.error;

            await sb.from('benefit_milestones').delete().eq('card_id', cardId);
            const ms = (slabs || []).map((s, i) => ({
                card_id: cardId, slab_no: parseInt(s.slab_no, 10) || i + 1,
                milestone_amount: fill(s.milestone_amount, 'milestone_amount'), milestone_period: fill(s.milestone_period),
                milestone_benefit_value: fill(s.milestone_benefit_value, 'benefit_value'), milestone_benefit_type: fill(s.milestone_benefit_type),
                milestone_benefit_comment: fill(s.milestone_benefit_comment)
            }));
            if (ms.length) { r = await sb.from('benefit_milestones').insert(ms); if (r.error) throw r.error; }

            await sb.from('benefit_partner_programs').delete().eq('card_id', cardId);
            const pp = (partners || []).map((p, i) => ({
                card_id: cardId, partner_no: parseInt(p.partner_no, 10) || i + 1,
                partner_program: fill(p.partner_program), partner_ratio: fill(p.partner_ratio, 'ratio'),
                partner_min_transfer: fill(p.partner_minTransfer, 'min_transfer'), partner_transfer_time: fill(p.partner_transferTime)
            }));
            if (pp.length) { r = await sb.from('benefit_partner_programs').insert(pp); if (r.error) throw r.error; }
            return true;
        } catch (e) { fail('save benefits', e); return false; }
    }

    // Generic read — used by the Extract Benefits page.
    async function fetchTable(name) {
        if (!sb) { notConfigured(); return []; }
        try {
            const { data, error } = await sb.from(name).select('*');
            if (error) throw error;
            return (data || []).map(r => fromDbRow(name, r));
        } catch (e) { fail('fetch ' + name, e); return []; }
    }

    // Rows of `table` where `col` equals `val` (case-insensitive). Used by All Data Check.
    async function fetchWhere(table, col, val) {
        if (!sb) { notConfigured(); return []; }
        if (!col) return [];
        try {
            const { data, error } = await sb.from(table).select('*').ilike(toNew(table)[col] || col, String(val).trim());
            if (error) throw error;
            return (data || []).map(r => fromDbRow(table, r));
        } catch (e) { fail('fetch ' + table + ' where ' + col, e); return []; }
    }

    // Rows where `col` is in `values` (list). Empty list -> no rows.
    async function fetchWhereIn(table, col, values) {
        if (!sb) { notConfigured(); return []; }
        if (!col || !values || !values.length) return [];
        try {
            const { data, error } = await sb.from(table).select('*').in(toNew(table)[col] || col, values);
            if (error) throw error;
            return (data || []).map(r => fromDbRow(table, r));
        } catch (e) { fail('fetch ' + table + ' in ' + col, e); return []; }
    }

    // Rows matching an {col: value} filter (case-insensitive equals per key).
    async function fetchByFilter(table, filter) {
        if (!sb) { notConfigured(); return []; }
        try {
            let q = sb.from(table).select('*');
            Object.entries(filter).forEach(([k, v]) => { if (v) q = q.ilike(toNew(table)[k] || k, String(v).trim()); });
            const { data, error } = await q;
            if (error) throw error;
            return (data || []).map(r => fromDbRow(table, r));
        } catch (e) { fail('fetch ' + table + ' by filter', e); return []; }
    }

    // Insert `rows` into `table`. Never deletes anything — Save always appends.
    // Duplicate detection happens on the "Compare with Database" preview (New /
    // Updated / Unchanged badges) before Save is even clicked; cleaning up a
    // real duplicate afterward is a deliberate manual step (SQL), not automatic.
    async function insertRows(table, rows) {
        if (!sb) { notConfigured(); return 0; }
        try {
            // Replace empty cells with the missing-value placeholder.
            const filled = rows.map(r => table.startsWith('rs_') ? r : typedFill(table, r));   // research sheets keep real blanks
            let done = 0;
            for (let i = 0; i < filled.length; i += 500) {
                const chunk = filled.slice(i, i + 500);
                const { error } = await sb.from(table).insert(chunk);
                if (error) throw error;
                done += chunk.length;
            }
            return done;
        } catch (e) { fail('replace ' + table, e); return -1; }
    }

    window.RGDB = {
        get configured() { return !!sb; },
        client: sb,
        fetchCards, saveCards,
        fetchOffers, saveOffers,
        fetchMcc, saveMcc,
        fetchBenefits, saveBenefits,
        fetchTable, fetchWhere, fetchWhereIn, fetchByFilter, insertRows, checkValue
    };
})();
