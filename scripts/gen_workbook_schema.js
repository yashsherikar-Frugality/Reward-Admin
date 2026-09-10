/*
 * Reads the source workbook and regenerates:
 *   supabase/migrations/0002_workbook.sql   — one table per sheet, every column, RLS open
 *   js/workbook_schema.js                    — window.WORKBOOK_SCHEMA used by the importer
 *
 * Table + label names are derived from sheet names only — any leading bank word
 * (see BANK_WORDS) is stripped so nothing is issuer-specific.
 *
 * Re-run whenever the workbook's sheets or headers change:
 *   npm i --no-save xlsx@0.18.5 && node scripts/gen_workbook_schema.js [path/to/workbook.xlsx]
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const WB = process.argv[2] || path.join(ROOT, 'HDFC_Credit_Cards_final.xlsx');

// Leading issuer words to drop from sheet names so table names stay generic.
const BANK_WORDS = ['hdfc', 'icici', 'sbi', 'axis', 'kotak', 'yes', 'idfc', 'rbl', 'amex', 'american express', 'citi', 'hsbc', 'standard chartered', 'indusind', 'au', 'bob', 'bank of baroda', 'pnb'];
const stripBank = (name) => {
    let s = String(name).trim();
    for (const w of BANK_WORDS) {
        const re = new RegExp('^' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b[\\s_-]*', 'i');
        if (re.test(s)) { s = s.replace(re, ''); break; }
    }
    return s.trim() || String(name).trim();
};

const snake = (s) => String(s)
    .replace(/%/g, ' pct ')
    .replace(/[₹$]/g, ' inr ')
    .replace(/&/g, ' and ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_+/g, '_') || 'col';

// wb_ prefix keeps these clear of the per-page import tables in 0001 (cards, offers, mcc_rules).
// Bank word stripped first so "HDFC Card Details" -> wb_card_details.
const tableName = (sheet) => 'wb_' + snake(stripBank(sheet)).replace(/^(\d)/, '_$1');

// Dedupe repeated / colliding column names within one sheet: foo, foo_2, foo_3 ...
function dedupe(names) {
    const seen = {};
    return names.map((n) => {
        let base = snake(n);
        if (/^\d/.test(base)) base = 'c_' + base;
        seen[base] = (seen[base] || 0) + 1;
        return seen[base] === 1 ? base : `${base}_${seen[base]}`;
    });
}

// Sheets to ignore entirely (matched on bank-stripped, case-insensitive name).
const SKIP_SHEETS = ['audit log'];

// Per-sheet column corrections — align the workbook headers to the Preferred
// Benefits / Benefit Detail field names. Keyed by bank-stripped sheet name, then
// by exact header text. Headers not listed fall through to plain snake_case.
// Positional order still comes from the sheet; this only renames.
const SHEET_COLUMN_RENAME = {
    'Lounge Details': {
        'Variant': 'variant', 'subNetwork': 'sub_network',
        'Loung Access (Y/N)': 'lounge_access',
        'Int Visit Count': 'int_visits_per_period', 'Int Count period': 'int_visit_period',
        'Int Eligibility': 'int_eligibility_condition',
        'Eligibility Spend Applicable (Y/N)': 'int_spend_required', 'Eligibility type': 'int_spend_eligibility_type',
        'Value': 'int_spend_threshold', 'Period': 'int_spend_lookback_period', 'Mode of Access': 'int_access_type',
        'Dom Visit Count': 'dom_visits_per_period', 'Dom Count period': 'dom_visit_period',
        'DomEligibility': 'dom_eligibility_condition',
        'cardId': 'card_id', 'cardName': 'card_name', 'cardStatus': 'card_status',
        'startDate': 'start_date', 'endDate': 'end_date',
        // second (Dom) block — dedupe suffix _2 is renamed here explicitly
        'Eligibility Spend Applicable (Y/N)_2': 'dom_spend_required', 'Eligibility type_2': 'dom_spend_eligibility_type',
        'Value_2': 'dom_spend_threshold', 'Period_2': 'dom_spend_lookback_period', 'Mode of Access_2': 'dom_access_type',
    },
    'Dining Discounts': {
        'cardId': 'card_id', 'cardName': 'card_name', 'diningProgram': 'dining_program',
        'merchantName': 'restaurant_name', 'offerType': 'benefit_type',
        'discountValue': 'discount_percent', 'discountType': 'discount_type',
        'minTransaction': 'minimum_bill', 'maxDiscount': 'maximum_discount',
        'eligibilityType': 'eligibility_type', 'eligibilityCriteria': 'eligibility_condition',
        'paymentMethod': 'payment_method', 'daysApplicable': 'eligible_days',
        'diningCategory': 'dining_category', 'validFrom': 'effective_from', 'validTo': 'effective_to',
        'status': 'benefit_status', 'termsAndConditions': 'terms_and_conditions',
        'source': 'source_id', 'sourceType': 'source_type',
        'subNetwork': 'sub_network', 'cardStatus': 'card_status', 'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Golf Benefits': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'benefitStatus': 'benefit_status', 'golfBenefitType': 'golf_benefit_type',
        'complimentaryGames': 'free_rounds', 'gamesPeriod': 'round_frequency',
        'complimentaryLessons': 'lesson_count', 'lessonsPeriod': 'lesson_period',
        'greenFeeWaiver': 'green_fee_waiver', 'eligibilityCondition': 'eligibility_condition',
        'bookingAdvance': 'booking_window', 'guestPolicy': 'guest_allowed',
        'concierge': 'concierge_booking', 'notes': 'notes', 'source': 'source_id', 'sourceUrl': 'source_url',
        'spendAmount': 'spend_requirement', 'courseList': 'golf_course', 'termsAndConditions': 'terms_and_conditions',
        'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Movie BOGO': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'benefitStatus': 'benefit_status', 'platform': 'movie_platform', 'offerType': 'ticket_benefit_type',
        'ticketType': 'ticket_type', 'bookingDays': 'eligible_days', 'minimumTickets': 'minimum_tickets',
        'freeTickets': 'free_tickets', 'maxDiscountPerTicket': 'ticket_cap', 'maxBenefitPeriod': 'monthly_benefit_cap',
        'couponCode': 'coupon_code', 'eligibilityCondition': 'eligibility_condition', 'paymentMethod': 'payment_method',
        'bookingChannel': 'booking_channel', 'notes': 'notes', 'source': 'source_id', 'sourceUrl': 'source_url',
        'spendAmount': 'minimum_spend', 'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Spa-Wellness Privileges': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'spaPrivilegeAvailable': 'spa_privilege_available', 'wellnessProgram': 'spa_provider',
        'merchantName': 'spa_location', 'benefitType': 'service_type', 'discountOrValue': 'discount_percent',
        'eligibilityCriteria': 'eligibility_condition', 'paymentMethod': 'payment_method', 'location': 'spa_location_city',
        'bookingMethod': 'booking_required', 'serviceHours': 'service_hours',
        'termsAndConditions': 'terms_and_conditions', 'sourceType': 'source_type', 'sourceLink': 'source_url',
        'spendAmount': 'minimum_spend', 'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Insurance Benefits': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'insuranceAvailable': 'insurance_available', 'insuranceType': 'policy_type', 'benefitDetail': 'benefit_detail',
        'coverageAmount': 'coverage_amount', 'coverageCondition': 'activation_trigger', 'insuredPerson': 'insured_person',
        'activationRequirement': 'activation_requirement', 'claimProcess': 'claim_process', 'insurer': 'insurer',
        'premiumType': 'premium_type', 'exclusionsOrLimitations': 'exclusions',
        'termsAndConditions': 'terms_and_conditions', 'sourceOfficial': 'source_official', 'sourceSecondary': 'source_secondary',
        'spendAmount': 'minimum_spend', 'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Fee Waiver': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'feeType': 'fee_type', 'waiverSpend': 'waiver_threshold', 'period': 'waiver_period',
        'waiverTarget': 'waiver_target', 'termsAndConditions': 'terms_and_conditions', 'sourceOfficial': 'source_official',
        'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Fuel Surcharge Waiver': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'benefitStatus': 'benefit_status', 'fuelSurchargeDetails': 'fuel_surcharge_details',
        'fuelWaiverRate(%)': 'waiver_rate', 'maxWaiver(₹)': 'monthly_waiver_cap', 'maxWaiverPeriod': 'waiver_cap_period',
        'minTx(₹)': 'minimum_fuel_transaction', 'maxTx(₹)': 'maximum_fuel_transaction',
        'eligibilityCriteria': 'eligibility_condition', 'termsAndConditions': 'terms_and_conditions',
        'sourceOfficial': 'source_official', 'spendAmount': 'spend_requirement',
        'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Welcome Benefits-Bonus': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'welcomeBenefitDetails': 'welcome_benefit_component', 'value': 'welcome_value', 'type': 'welcome_benefit_type',
        'spendAmount': 'minimum_spend', 'eligibilityCriteria': 'eligibility_condition',
        'activationRequirement': 'activation_required', 'termsAndConditions': 'terms_and_conditions',
        'sourceOfficial': 'source_official', 'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Milestone Details': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'slab': 'milestone_tier', 'amountSpent': 'spend_to', 'durationPeriod': 'milestone_period',
        'value': 'milestone_benefit_value', 'type': 'milestone_benefit_type',
        'eligibilityCriteria': 'eligibility_condition', 'termsAndConditions': 'terms_and_conditions',
        'sourceOfficial': 'source_official', 'sourceSecondary': 'source_secondary',
        'startDate': 'start_date', 'endDate': 'end_date',
    },
    'Partner Program Details': {
        'cardId': 'card_id', 'cardName': 'card_name', 'subNetwork': 'sub_network', 'cardStatus': 'card_status',
        'partnerProgram': 'partner_program', 'partnerName': 'partner_name', 'conversionRatio': 'transfer_ratio',
        'minTransferPoints': 'minimum_transfer', 'transferTime': 'transfer_time',
        'eligibilityCriteria': 'eligibility_condition', 'termsAndConditions': 'terms_and_conditions',
        'sourceOfficial': 'source_official', 'sourceSecondary': 'source_secondary',
        'startDate': 'start_date', 'endDate': 'end_date',
    },
};

const wb = XLSX.readFile(WB);
const schema = {};
const sqlParts = [
    '-- GENERATED by scripts/gen_workbook_schema.js — do not edit by hand.',
    '-- One table per sheet of the source workbook. Every column is text.',
    '-- Re-run the generator to update.',
    ''
];

wb.SheetNames.forEach((sheet) => {
    if (SKIP_SHEETS.includes(stripBank(sheet).toLowerCase())) return;
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1, defval: '' });
    const rawHeader = (rows[0] || []).map((h) => String(h).trim()).filter((h) => h !== '');
    if (rawHeader.length === 0) return;

    let cols = dedupe(rawHeader);
    const table = tableName(sheet);

    // Apply the per-sheet column corrections (Preferred Benefits field names).
    const renameMap = SHEET_COLUMN_RENAME[stripBank(sheet)];
    if (renameMap) {
        const seenRaw = {};
        const rawKeys = rawHeader.map((h) => {
            seenRaw[h] = (seenRaw[h] || 0) + 1;
            return seenRaw[h] === 1 ? h : `${h}_${seenRaw[h]}`;
        });
        cols = rawKeys.map((rk, i) => renameMap[rk] || renameMap[rawHeader[i]] || cols[i]);
        cols = dedupe(cols);   // final safety pass
    }

    // which column carries the card id (for indexing)
    const cardIdCol = cols[rawHeader.findIndex((h) => /^card ?id$/i.test(h))] || null;

    // `cols` is positional: column i in the sheet's header row -> cols[i].
    // key = real sheet name (needed to find the sheet in the uploaded file);
    // label = bank-stripped, shown on the Extract Benefits checkboxes.
    schema[sheet] = { table, label: stripBank(sheet), cardIdCol, cols };

    sqlParts.push(`-- ${schema[sheet].label}  (${rows.length - 1} data rows)`);
    sqlParts.push(`drop table if exists ${table} cascade;`);
    sqlParts.push(`create table ${table} (`);
    sqlParts.push(`    id uuid primary key default gen_random_uuid(),`);
    sqlParts.push(cols.map((c) => `    ${c} text`).join(',\n') + ',');
    sqlParts.push(`    imported_at timestamptz default now()`);
    sqlParts.push(`);`);
    if (cardIdCol) sqlParts.push(`create index ${table}_card_idx on ${table} (${cardIdCol});`);
    sqlParts.push('');
});

// RLS: open policy for anon + authenticated on every generated table.
sqlParts.push('do $$');
sqlParts.push('declare t text;');
sqlParts.push('begin');
sqlParts.push(`    foreach t in array array[${Object.values(schema).map((s) => `'${s.table}'`).join(', ')}]`);
sqlParts.push('    loop');
sqlParts.push("        execute format('alter table %I enable row level security', t);");
sqlParts.push("        execute format('drop policy if exists %I_anon_all on %I', t, t);");
sqlParts.push("        execute format('create policy %I_anon_all on %I for all to anon, authenticated using (true) with check (true)', t, t);");
sqlParts.push('    end loop;');
sqlParts.push('end $$;');
sqlParts.push('');

fs.writeFileSync(path.join(ROOT, 'supabase/migrations/0002_workbook.sql'), sqlParts.join('\n'));
fs.writeFileSync(
    path.join(ROOT, 'js/workbook_schema.js'),
    '// GENERATED by scripts/gen_workbook_schema.js — do not edit by hand.\n' +
    'window.WORKBOOK_SCHEMA = ' + JSON.stringify(schema, null, 2) + ';\n'
);

console.log('sheets mapped:', Object.keys(schema).length);
Object.entries(schema).forEach(([s, v]) =>
    console.log(`  ${s}  ->  ${v.table}  (${v.cols.length} cols, card id: ${v.cardIdCol || '—'})`)
);
