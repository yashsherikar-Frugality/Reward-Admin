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

    const toBool = (v) => v === true || ['true', 'yes', '1', 'y'].includes(String(v == null ? '' : v).trim().toLowerCase());
    const toArrText = (v) => Array.isArray(v) ? v.join(',') : (v == null ? '' : String(v));
    const blank = (v) => fill(v);
    const colVal = (row, k) => (typeof getColVal === 'function' ? getColVal(row, k) : (row[k] ?? ''));
    const genVal = (row, k) => (typeof genericVal === 'function' ? genericVal(row, k) : (row[k] ?? ''));
    const fixedCols = () => (typeof FIXED_COLUMNS !== 'undefined' ? FIXED_COLUMNS : []);
    const offerCols = () => (typeof OFFER_IMPORT_COLUMNS !== 'undefined' ? OFFER_IMPORT_COLUMNS : []);
    const rewardSubIds = () => (typeof REWARD_SUB_FIELD_IDS !== 'undefined' ? [...REWARD_SUB_FIELD_IDS] : []);

    // ---- cards -----------------------------------------------------
    const CARD_COL = {
        id: 'card_id', subNetwork: 'sub_network', issuerCountry: 'issuer_country',
        cardStatus: 'card_status', cardStatusDate: 'card_status_date',
        cardWebLink: 'card_web_link', cardAltLink: 'card_alt_link',
        rewardProgram: 'reward_program', ageMin: 'age_min', ageMax: 'age_max',
        creditScore: 'credit_score', empType: 'emp_type', productType: 'product_type',
        benefit_tokenEnabled: 'benefit_token_enabled', benefit_upiSupported: 'benefit_upi_supported',
        benefit_feeWaiver: 'benefit_fee_waiver', benefit_partnerProgram: 'benefit_partner_program'
    };
    const cardCol = (k) => CARD_COL[k] || k;

    function cardRowToRecord(row) {
        const rec = {};
        fixedCols().forEach(({ key }) => {
            const v = colVal(row, key);
            rec[cardCol(key)] = key.startsWith('benefit_') ? toBool(v) : blank(v);
        });
        rec.updated_at = new Date().toISOString();
        return rec;
    }

    async function fetchCards() {
        if (!sb) { notConfigured(); return []; }
        try {
            const { data, error } = await sb.from('cards').select('*');
            if (error) throw error;
            return data || [];
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
        maxTx: 'max_tx', maxBenefit: 'max_benefit', startDate: 'start_date', endDate: 'end_date',
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
        rec.updated_at = new Date().toISOString();
        return rec;
    }
    function offerRecordToRow(rec) {
        const row = {};
        Object.keys(rec).forEach(c => { row[OFFER_COL_REV[c] || c] = rec[c]; });
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
            return (data || []).map(r => ({
                'Card': r.card_id, 'Offer ID': r.offer_id, 'MCC': r.mcc,
                'Inclusion': r.inclusion, 'Exclusion': r.exclusion
            }));
        } catch (e) { fail('fetch mcc', e); return []; }
    }
    async function saveMcc(rows) {
        if (!sb) { notConfigured(); return false; }
        try {
            const recs = (rows || []).map(r => ({
                card_id: blank(genVal(r, 'Card')), offer_id: blank(genVal(r, 'Offer ID')), mcc: blank(genVal(r, 'MCC')),
                inclusion: blank(genVal(r, 'Inclusion')), exclusion: blank(genVal(r, 'Exclusion'))
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
            BENEFIT_BOOL_COLS.forEach(c => { const v = benefitPick(main, c); rec[c] = v === undefined ? false : toBool(v); });

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
            return data || [];
        } catch (e) { fail('fetch ' + name, e); return []; }
    }

    // Rows of `table` where `col` equals `val` (case-insensitive). Used by All Data Check.
    async function fetchWhere(table, col, val) {
        if (!sb) { notConfigured(); return []; }
        if (!col) return [];
        try {
            const { data, error } = await sb.from(table).select('*').ilike(col, String(val).trim());
            if (error) throw error;
            return data || [];
        } catch (e) { fail('fetch ' + table + ' where ' + col, e); return []; }
    }

    // Rows where `col` is in `values` (list). Empty list -> no rows.
    async function fetchWhereIn(table, col, values) {
        if (!sb) { notConfigured(); return []; }
        if (!col || !values || !values.length) return [];
        try {
            const { data, error } = await sb.from(table).select('*').in(col, values);
            if (error) throw error;
            return data || [];
        } catch (e) { fail('fetch ' + table + ' in ' + col, e); return []; }
    }

    // Rows matching an {col: value} filter (case-insensitive equals per key).
    async function fetchByFilter(table, filter) {
        if (!sb) { notConfigured(); return []; }
        try {
            let q = sb.from(table).select('*');
            Object.entries(filter).forEach(([k, v]) => { if (v) q = q.ilike(k, String(v).trim()); });
            const { data, error } = await q;
            if (error) throw error;
            return data || [];
        } catch (e) { fail('fetch ' + table + ' by filter', e); return []; }
    }

    // Wipe a table and insert `rows` (chunked). Used by the full-workbook import,
    // where the spreadsheet is the single source of truth for that table.
    async function replaceRows(table, rows) {
        if (!sb) { notConfigured(); return 0; }
        try {
            const del = await sb.from(table).delete().not('id', 'is', null);
            if (del.error) throw del.error;
            // Replace empty cells with the missing-value placeholder.
            const filled = rows.map(r => {
                const o = {};
                for (const k of Object.keys(r)) o[k] = fill(r[k], k);
                return o;
            });
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
        fetchCards, saveCards,
        fetchOffers, saveOffers,
        fetchMcc, saveMcc,
        fetchBenefits, saveBenefits,
        fetchTable, fetchWhere, fetchWhereIn, fetchByFilter, replaceRows
    };
})();
