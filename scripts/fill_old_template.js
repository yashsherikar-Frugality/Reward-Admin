/*
 * Fill the ORIGINAL Import From Excel template with the HDFC workbook data.
 * Reads HDFC_Credit_Cards_final.xlsx, maps each sheet's columns to the
 * import_template_old column names, writes import_template_old_filled.xlsx.
 *
 *   npm i --no-save xlsx@0.18.5
 *   node scripts/fill_old_template.js [source.xlsx] [out.xlsx]
 */
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const ONE_ROW = process.argv.includes('--one');   // keep only the first data row per sheet
const args = process.argv.slice(2).filter((a) => a !== '--one');
const SRC = args[0] || path.join(ROOT, 'HDFC_Credit_Cards_final.xlsx');
const OUT = args[1] || path.join(ROOT, ONE_ROW ? 'import_template_old_sample.xlsx' : 'import_template_old_filled.xlsx');

// FIXED_COLUMNS keys from script1.js -> the Card Details sheet header
const script = fs.readFileSync(path.join(ROOT, 'js', 'script1.js'), 'utf8');
const grab = (n) => eval(script.match(new RegExp('const ' + n + '\\s*=\\s*(\\[[\\s\\S]*?\\]);'))[1]);
const CARD_COLS = grab('FIXED_COLUMNS').map((c) => c.key);
const OFFER_COLS = grab('OFFER_IMPORT_COLUMNS');
const MCC_COLS = grab('MCC_IMPORT_COLUMNS');

// -- source header -> template column, per sheet --------------------
const MAP = {
    // sheet in HDFC file : { templateSheetName, cols: { templateCol: sourceHeader } }
    'HDFC Card Details': { out: 'Card Details', cols: {
        id: 'cardId', instrument_type: 'instrument_type', issuer: 'issuer', product: 'product',
        network: 'network', subNetwork: 'subNetwork', issuerCountry: 'issuerCountry',
        cardStatus: 'cardStatus', cardStatusDate: 'cardStatusDate', cardWebLink: 'cardWebLink',
        cardAltLink: 'cardAltLink', card_spend_per_point: 'card_spend_per_point',
        card_rp_conversion: 'card_rp_conversion', apr: 'APR|%', card_bill_cycle_duration: 'card_bill_cycle_duration',
        card_bill_date: 'card_bill_date', cobrand: 'cobrand', rewardProgram: 'rewardProgram',
        ageMin: 'ageMin', ageMax: 'ageMax', creditScore: 'creditScore', empType: 'empType',
        salary: 'salary', productType: 'productType', nationality: 'nationality',
        fee_joining_type: 'fee_joining_type', fee_joining: 'fee_joining', fee_annual: 'fee_annual',
        fee_renewal: 'fee_renewal', fee_waiver_spend: 'fee_waiver_spend', fee_waiver_period: 'fee_waiver_period',
        benefit_concierge: 'benefit_concierge', benefit_dining: 'benefit_dining', benefit_golf: 'benefit_golf',
        benefit_movie: 'benefit_movie', benefit_spa: 'benefit_spa', benefit_insurance: 'benefit_insurance',
        benefit_fees: 'benefit_fees', benefit_contactless: 'benefit_contactless',
        benefit_tokenEnabled: 'benefit_tokenEnabled', benefit_upiSupported: 'benefit_upiSupported',
        benefit_welcome: 'benefit_welcome', benefit_feeWaiver: 'benefit_feeWaiver', benefit_fuel: 'benefit_fuel',
        benefit_lounge: 'benefit_lounge', benefit_milestone: 'benefit_milestone', benefit_partnerProgram: 'benefit_partnerProgram',
    }},
    'offers': { out: 'Offers', cols: {
        cardId: 'cardId', offerId: 'offerId', category: 'category', subCategory: 'subCategory',
        rewardType: 'rewardType', frequency: 'frequency', status: 'status', days: 'days',
        instancePeriod: 'instancePeriod', person: 'personType', minTx: 'minTx', maxTx: 'maxTx',
        maxBenefit: 'maxBenefit', startDate: 'startDate', endDate: 'endDate', weblink: 'weblink',
        paymentScopeType: 'paymentScopeType', paymentScopeValue: 'paymentScopeValue',
        rpExpiry: 'rpExpiry', couponCode: 'couponCode', platform: 'platform', customPlatform: 'customPlatform',
    }},
    'mcc': { out: 'MCC', cols: {
        'Card': 'cardId', 'Offer ID': 'Offer ID', 'MCC': 'MCC Code(s)',
        'Inclusion': 'Inclusion/Exclusion', 'Exclusion': 'Criteria',
    }},
    'Lounge Details ': { out: 'Lounge', cols: {
        cardId: 'cardId',
        lounge_program: 'Mode of Access', lounge_dom_visits: 'Dom Visit Count',
        lounge_dom_period: 'Dom Count period', lounge_dom_frequency: 'Dom Count period',
        lounge_dom_criteria: 'DomEligibility',
        lounge_int_visits: 'Int Visit Count', lounge_int_period: 'Int Count period',
        lounge_int_frequency: 'Int Count period', lounge_int_criteria: 'Int Eligibility',
    }},
    'Golf Benefits': { out: 'Golf', cols: {
        cardId: 'cardId', golf_courses: 'courseList', golf_rounds: 'complimentaryGames',
        golf_period: 'gamesPeriod', golf_notes: 'notes',
    }},
    'Dining Discounts': { out: 'Dining', cols: {
        cardId: 'cardId', dining_partner: 'diningProgram', dining_discount_type: 'discountType',
        dining_max_discount: 'maxDiscount', dining_frequency: 'frequency',
        dining_min_spend: 'minTransaction', dining_notes: 'termsAndConditions',
    }},
    'Movie BOGO': { out: 'Movie', cols: {
        cardId: 'cardId', movie_partner: 'platform', movie_discount_type: 'offerType',
        movie_max_discount: 'maxDiscountPerTicket', movie_frequency: 'frequency',
        movie_ticket_limit: 'freeTickets', movie_days: 'bookingDays', movie_notes: 'notes',
    }},
    'Spa-Wellness Privileges': { out: 'Spa', cols: {
        cardId: 'cardId', spa_partner: 'wellnessProgram', spa_discount: 'discountOrValue',
        spa_max_discount: 'discountOrValue', spa_frequency: 'frequency', spa_notes: 'termsAndConditions',
    }},
    'Concierge Service': { out: 'Concierge', cols: {
        cardId: 'cardId', concierge_notes: 'serviceDescription',
    }},
    'Insurance Benefits': { out: 'Insurance', cols: {
        cardId: 'cardId', ins_provider: 'insurer', ins_coverage: 'coverageAmount', ins_policyLink: 'sourceOfficial',
    }},
    'Fee Waiver': { out: 'Fee Waiver', cols: {
        cardId: 'cardId', fee_waiver_spend: 'waiverSpend', fee_waiver_period: 'period',
    }},
    'Fuel Surcharge Waiver': { out: 'Fuel', cols: {
        cardId: 'cardId', fuel_rate: 'fuelWaiverRate(%)', fuel_max_waiver: 'maxWaiver(₹)',
        fuel_period: 'maxWaiverPeriod', fuel_min_tx: 'minTx(₹)', fuel_max_tx: 'maxTx(₹)',
    }},
    'Welcome Benefits-Bonus': { out: 'Welcome', cols: {
        cardId: 'cardId', welcome_value: 'value', welcome_benefit_type: 'type', welcome_free_text: 'welcomeBenefitDetails',
    }},
    'Milestone Details': { out: 'Milestone', cols: {
        cardId: 'cardId', slab_no: 'slab', milestone_amount: 'amountSpent', milestone_period: 'durationPeriod',
        milestone_benefit_value: 'value', milestone_benefit_type: 'type', milestone_benefit_comment: 'eligibilityCriteria',
    }},
    'Partner Program Details': { out: 'Partner Program', cols: {
        cardId: 'cardId', partner_program: 'partnerProgram', partner_ratio: 'conversionRatio',
        partner_minTransfer: 'minTransferPoints', partner_transferTime: 'transferTime',
    }},
};

const TEMPLATE_COLS = {
    'Card Details': CARD_COLS,
    'Offers': OFFER_COLS,
    'MCC': MCC_COLS,
    'Lounge': ['cardId', 'lounge_program', 'lounge_dom_visits', 'lounge_dom_period', 'lounge_dom_frequency', 'lounge_dom_criteria', 'lounge_int_visits', 'lounge_int_period', 'lounge_int_frequency', 'lounge_int_criteria'],
    'Golf': ['cardId', 'golf_courses', 'golf_rounds', 'golf_period', 'golf_notes'],
    'Dining': ['cardId', 'dining_partner', 'dining_discount_type', 'dining_max_discount', 'dining_frequency', 'dining_min_spend', 'dining_notes'],
    'Movie': ['cardId', 'movie_partner', 'movie_discount_type', 'movie_max_discount', 'movie_frequency', 'movie_ticket_limit', 'movie_days', 'movie_notes'],
    'Spa': ['cardId', 'spa_partner', 'spa_discount', 'spa_max_discount', 'spa_frequency', 'spa_notes'],
    'Concierge': ['cardId', 'concierge_notes'],
    'Insurance': ['cardId', 'ins_provider', 'ins_coverage', 'ins_policyLink'],
    'Fee Waiver': ['cardId', 'fee_waiver_spend', 'fee_waiver_period'],
    'Fuel': ['cardId', 'fuel_rate', 'fuel_max_waiver', 'fuel_period', 'fuel_min_tx', 'fuel_max_tx'],
    'Welcome': ['cardId', 'welcome_value', 'welcome_benefit_type', 'welcome_free_text'],
    'Milestone': ['cardId', 'slab_no', 'milestone_amount', 'milestone_period', 'milestone_benefit_value', 'milestone_benefit_type', 'milestone_benefit_comment'],
    'Partner Program': ['cardId', 'partner_no', 'partner_program', 'partner_ratio', 'partner_minTransfer', 'partner_transferTime'],
};

const src = XLSX.readFile(SRC);
const wb = XLSX.utils.book_new();
const order = ['Card Details', 'Offers', 'Lounge', 'Golf', 'Dining', 'Movie', 'Spa', 'Concierge', 'Insurance', 'Fee Waiver', 'Fuel', 'Welcome', 'Milestone', 'Partner Program', 'MCC'];

const built = {};
for (const [srcName, cfg] of Object.entries(MAP)) {
    const ws = src.Sheets[srcName];
    if (!ws) { console.warn('missing source sheet:', srcName); continue; }
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    const outCols = TEMPLATE_COLS[cfg.out];
    const aoa = [outCols.slice()];
    rows.forEach((r, i) => {
        const line = outCols.map((tc) => {
            if (tc === 'partner_no') return i + 1;
            const srcHeader = cfg.cols[tc];
            if (!srcHeader) return '';
            const key = Object.keys(r).find((k) => k.toLowerCase() === String(srcHeader).toLowerCase());
            return key ? r[key] : '';
        });
        if (line.some((v) => String(v).trim() !== '' && String(v).trim() !== '0')) aoa.push(line);
    });
    const final = ONE_ROW ? aoa.slice(0, 2) : aoa;
    built[cfg.out] = final;
    console.log(cfg.out.padEnd(18), (final.length - 1) + ' rows');
}

order.forEach((name) => {
    if (built[name]) XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(built[name]), name);
});
XLSX.writeFile(wb, OUT);
console.log('\nWritten:', OUT);
