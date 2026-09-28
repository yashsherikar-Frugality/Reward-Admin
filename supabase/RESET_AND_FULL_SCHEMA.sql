-- ============================================================
-- RewardGenius — FULL RESET + REBUILD
-- Drops every table from any prior schema version, then creates
-- the complete current schema fresh. Paste this whole file into
-- Supabase SQL Editor -> Run. Safe on an empty project too.
-- ============================================================

-- ---- drop old tables (any prior version) ----
drop table if exists cards cascade;
drop table if exists offers cascade;
drop table if exists mcc_rules cascade;
drop table if exists card_benefits cascade;
drop table if exists benefit_milestones cascade;
drop table if exists benefit_partner_programs cascade;
drop table if exists wb_card_details cascade;
drop table if exists wb_lounge_details cascade;
drop table if exists wb_dining_discounts cascade;
drop table if exists wb_concierge_service cascade;
drop table if exists wb_golf_benefits cascade;
drop table if exists wb_movie_bogo cascade;
drop table if exists wb_spa_wellness_privileges cascade;
drop table if exists wb_insurance_benefits cascade;
drop table if exists wb_fees cascade;
drop table if exists wb_fee_waiver cascade;
drop table if exists wb_fuel_surcharge_waiver cascade;
drop table if exists wb_welcome_benefits_bonus cascade;
drop table if exists wb_reward_structure cascade;
drop table if exists wb_milestone_details cascade;
drop table if exists wb_partner_program_details cascade;
drop table if exists wb_token_enabled cascade;
drop table if exists wb_upi_supported cascade;
drop table if exists wb_contactless cascade;
drop table if exists wb_offers cascade;
drop table if exists wb_mcc cascade;
drop table if exists wb_lounge cascade;
drop table if exists wb_airport_transfer cascade;
drop table if exists wb_travel cascade;
drop table if exists wb_hotel cascade;
drop table if exists wb_airline cascade;
drop table if exists wb_forex_international cascade;
drop table if exists wb_reward_points cascade;
drop table if exists wb_milestone cascade;
drop table if exists wb_welcome cascade;
drop table if exists wb_renewal_benefit cascade;
drop table if exists wb_partner_and_transfer cascade;
drop table if exists wb_fuel cascade;
drop table if exists wb_dining cascade;
drop table if exists wb_golf cascade;
drop table if exists wb_movie cascade;
drop table if exists wb_spa_wellness cascade;
drop table if exists wb_concierge cascade;
drop table if exists wb_shopping cascade;
drop table if exists wb_ott_subscription cascade;
drop table if exists wb_insurance_protection cascade;
drop table if exists wb_travel_insurance cascade;
drop table if exists wb_purchase_protection cascade;
drop table if exists wb_personal_accident cascade;
drop table if exists wb_roadside_assistance cascade;
drop table if exists wb_ltf_lifetime_free cascade;
drop table if exists wb_status_benefits cascade;
drop table if exists wb_upi cascade;
drop table if exists wb_contactless cascade;

-- ---- rebuild complete current schema ----

-- RewardGenius schema — mapped from js/script1.js
-- Entities: cards (FIXED_COLUMNS + wizard), offers (OFFER_IMPORT_COLUMNS + reward sub-fields),
-- mcc_rules (MCC_IMPORT_COLUMNS), card_benefits + benefit_milestones + benefit_partner_programs
-- (Import Preferred Benefits page).
--
-- Run in Supabase SQL editor (or `supabase db push`).

-- ------------------------------------------------------------------
-- cards  (FIXED_COLUMNS keys, snake_cased; benefit_* are the yes/no flags)
-- ------------------------------------------------------------------
create table if not exists cards (
    card_id                 text primary key,          -- FIXED_COLUMNS "id" / wizard product_id
    instrument_type         text,
    issuer                  text,
    product                 text,                      -- variant
    network                 text,
    sub_network             text,
    issuer_country          text,
    card_status             text,
    card_status_date        text,
    card_web_link           text,
    card_alt_link           text,
    card_spend_per_point    text,
    card_rp_conversion      text,
    apr                     text,
    card_bill_cycle_duration text,
    card_bill_date          text,                      -- multi-select, comma-joined
    cobrand                 text,
    reward_program          text,
    age_min                 text,
    age_max                 text,
    credit_score            text,
    emp_type                text,
    salary                  text,
    product_type            text,
    nationality             text,
    fee_joining_type        text,
    fee_joining             text,
    fee_annual              text,
    fee_renewal             text,
    fee_waiver_spend        text,
    fee_waiver_period       text,
    benefit_concierge       boolean default false,
    benefit_dining          boolean default false,
    benefit_golf            boolean default false,
    benefit_movie           boolean default false,
    benefit_spa             boolean default false,
    benefit_insurance       boolean default false,
    benefit_fees            boolean default false,
    benefit_contactless     boolean default false,
    benefit_token_enabled   boolean default false,
    benefit_upi_supported   boolean default false,
    benefit_welcome         boolean default false,
    benefit_fee_waiver      boolean default false,
    benefit_fuel            boolean default false,
    benefit_lounge          boolean default false,
    benefit_milestone       boolean default false,
    benefit_partner_program boolean default false,
    benefit_airport_transfer   boolean default false,
    benefit_travel             boolean default false,
    benefit_hotel               boolean default false,
    benefit_airline             boolean default false,
    benefit_forex                boolean default false,
    benefit_reward_points       boolean default false,
    benefit_renewal_benefit     boolean default false,
    benefit_shopping            boolean default false,
    benefit_ott                  boolean default false,
    benefit_travel_insurance    boolean default false,
    benefit_purchase_protection boolean default false,
    benefit_personal_accident   boolean default false,
    benefit_roadside_assistance boolean default false,
    benefit_ltf                  boolean default false,
    benefit_status_benefits     boolean default false,
    created_at              timestamptz default now(),
    updated_at              timestamptz default now()
);

-- ------------------------------------------------------------------
-- offers  (OFFER_IMPORT_COLUMNS + saveOffer; reward_fields holds the
--          reward-type-specific sub-fields rp_*/cb_*/id_*/... as JSON)
-- ------------------------------------------------------------------
create table if not exists offers (
    id                  uuid primary key default gen_random_uuid(),
    card_id             text,                          -- no FK: an import may land before its card
    offer_id            text,
    category            text,
    sub_category        text,
    merchant            text,                          -- array in wizard, comma-joined here
    mcc                 text,
    reward_type         text,
    frequency           text,
    status              text,
    days                text,
    instance_period     text,
    person              text,
    min_tx              text,
    max_tx              text,
    max_benefit         text,
    start_date          text,
    end_date            text,
    weblink             text,
    payment_scope_type  text,
    payment_scope_value text,                          -- array in wizard, comma-joined here
    rp_expiry           text,
    coupon_code         text,
    platform            text,
    custom_platform     text,
    reward_fields       jsonb default '{}'::jsonb,
    created_at          timestamptz default now(),
    updated_at          timestamptz default now()
);
create index if not exists offers_card_id_idx  on offers (card_id);
create index if not exists offers_offer_id_idx on offers (offer_id);

-- ------------------------------------------------------------------
-- mcc_rules  (MCC_IMPORT_COLUMNS = Card, Offer ID, MCC, Inclusion, Exclusion)
-- ------------------------------------------------------------------
create table if not exists mcc_rules (
    id         uuid primary key default gen_random_uuid(),
    card_id    text,
    offer_id   text,
    mcc        text,
    inclusion  text,
    exclusion  text,
    created_at timestamptz default now()
);
create index if not exists mcc_rules_card_id_idx on mcc_rules (card_id);

-- ------------------------------------------------------------------
-- card_benefits  (Import Preferred Benefits: one detail row per card)
-- ------------------------------------------------------------------
create table if not exists card_benefits (
    card_id                  text primary key references cards (card_id) on delete cascade,
    lounge_program           text,
    lounge_dom_visits        text,
    lounge_dom_period        text,
    lounge_dom_frequency     text,
    lounge_dom_criteria      text,
    lounge_int_visits        text,
    lounge_int_period        text,
    lounge_int_frequency     text,
    lounge_int_criteria      text,
    golf_courses             text,
    golf_rounds              text,
    golf_period              text,
    golf_notes               text,
    dining_partner           text,
    dining_discount_type     text,
    dining_max_discount      text,
    dining_frequency         text,
    dining_min_spend         text,
    dining_notes             text,
    movie_partner            text,
    movie_discount_type      text,
    movie_max_discount       text,
    movie_frequency          text,
    movie_ticket_limit       text,
    movie_days               text,
    movie_notes              text,
    spa_partner              text,
    spa_discount             text,
    spa_max_discount         text,
    spa_frequency            text,
    spa_notes                text,
    concierge_notes          text,
    ins_provider             text,
    ins_coverage             text,
    ins_policy_link          text,
    ins_travel               boolean default false,
    ins_purchase_protection  boolean default false,
    ins_personal_accident    boolean default false,
    ins_extended_warranty    boolean default false,
    ins_lost_card_liability  boolean default false,
    fee_waiver_spend         text,
    fee_waiver_period        text,
    fuel_rate                text,
    fuel_max_waiver          text,
    fuel_period              text,
    fuel_min_tx              text,
    fuel_max_tx              text,
    welcome_value            text,
    welcome_benefit_type     text,
    welcome_free_text        text,
    updated_at               timestamptz default now()
);

-- milestone slabs (slab_no rows in the benefits sheet)
create table if not exists benefit_milestones (
    id                     uuid primary key default gen_random_uuid(),
    card_id                text references cards (card_id) on delete cascade,
    slab_no                integer,
    milestone_amount       text,
    milestone_period       text,
    milestone_benefit_value text,
    milestone_benefit_type text,
    milestone_benefit_comment text
);
create index if not exists benefit_milestones_card_id_idx on benefit_milestones (card_id);

-- partner programs (partner_no rows in the benefits sheet)
create table if not exists benefit_partner_programs (
    id                     uuid primary key default gen_random_uuid(),
    card_id                text references cards (card_id) on delete cascade,
    partner_no             integer,
    partner_program        text,
    partner_ratio          text,
    partner_min_transfer   text,
    partner_transfer_time  text
);
create index if not exists benefit_partner_programs_card_id_idx on benefit_partner_programs (card_id);

-- ------------------------------------------------------------------
-- Row Level Security
-- Deployed publicly on Vercel with the anon key, so anon needs full access.
-- ponytail: open policy — lock down to authenticated / per-role when auth is added.
-- ------------------------------------------------------------------
alter table cards                    enable row level security;
alter table offers                   enable row level security;
alter table mcc_rules                enable row level security;
alter table card_benefits            enable row level security;
alter table benefit_milestones       enable row level security;
alter table benefit_partner_programs enable row level security;

do $$
declare t text;
begin
    foreach t in array array['cards','offers','mcc_rules','card_benefits','benefit_milestones','benefit_partner_programs']
    loop
        execute format('drop policy if exists %I_anon_all on %I', t, t);
        execute format(
            'create policy %I_anon_all on %I for all to anon, authenticated using (true) with check (true)',
            t, t
        );
    end loop;
end $$;

-- GENERATED by scripts/gen_workbook_schema.js — do not edit by hand.
-- One table per sheet of the source workbook. Every column is text.
-- Re-run the generator to update.

-- Card Details  (999 data rows)
drop table if exists wb_card_details cascade;
create table wb_card_details (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    instrument_type text,
    issuer text,
    product text,
    network text,
    subnetwork text,
    issuercountry text,
    cardstatus text,
    cardstatusdate text,
    cardweblink text,
    cardaltlink text,
    card_spend_per_point text,
    card_rp_conversion text,
    apr text,
    card_bill_cycle_duration text,
    card_bill_date text,
    cobrand text,
    rewardprogram text,
    agemin text,
    agemax text,
    creditscore text,
    emptype text,
    salary text,
    producttype text,
    nationality text,
    fee_joining_type text,
    fee_joining text,
    fee_annual text,
    fee_renewal text,
    fee_waiver_spend text,
    fee_waiver_period text,
    benefit_concierge text,
    benefit_dining text,
    benefit_golf text,
    benefit_movie text,
    benefit_spa text,
    benefit_insurance text,
    benefit_fees text,
    benefit_contactless text,
    benefit_tokenenabled text,
    benefit_upisupported text,
    benefit_welcome text,
    benefit_feewaiver text,
    benefit_fuel text,
    benefit_lounge text,
    benefit_milestone text,
    benefit_partnerprogram text,
    benefit_airporttransfer text,
    benefit_travel text,
    benefit_hotel text,
    benefit_airline text,
    benefit_forex text,
    benefit_rewardpoints text,
    benefit_renewalbenefit text,
    benefit_shopping text,
    benefit_ott text,
    benefit_travelinsurance text,
    benefit_purchaseprotection text,
    benefit_personalaccident text,
    benefit_roadsideassistance text,
    benefit_ltf text,
    benefit_statusbenefits text,
    imported_at timestamptz default now()
);
create index wb_card_details_card_idx on wb_card_details (cardid);

-- Offers  (2288 data rows)
drop table if exists wb_offers cascade;
create table wb_offers (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    offerid text,
    category text,
    subcategory text,
    rewardtype text,
    frequency text,
    status text,
    days text,
    instanceperiod text,
    person text,
    mintx text,
    maxtx text,
    maxbenefit text,
    rewardcap text,
    startdate text,
    enddate text,
    weblink text,
    paymentscopetype text,
    paymentscopevalue text,
    rpexpiry text,
    couponcode text,
    platform text,
    customplatform text,
    rp_pointtype text,
    rp_calc text,
    cb_type text,
    cb_credit text,
    cb_limit text,
    cb_freq text,
    id_partner text,
    id_discount text,
    id_paymode text,
    id_max text,
    vd_slab text,
    vd_pct text,
    vd_max text,
    v_brand text,
    v_type text,
    v_value text,
    v_delivery text,
    am_airline text,
    am_program text,
    am_ratio text,
    am_time text,
    hp_chain text,
    hp_program text,
    hp_ratio text,
    hp_time text,
    c_program text,
    c_type text,
    c_conv text,
    c_validity text,
    imported_at timestamptz default now()
);
create index wb_offers_card_idx on wb_offers (cardid);

-- Lounge  (999 data rows)
drop table if exists wb_lounge cascade;
create table wb_lounge (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    lounge_usage_type text,
    lounge_type text,
    access_type text,
    domestic_international text,
    visits_per_period text,
    lounge_program text,
    eligible_airports text,
    eligible_terminals text,
    network_requirement text,
    boarding_pass_required text,
    cardholder_guest_rule text,
    guest_fee text,
    additional_visit_fee text,
    spend_threshold text,
    spend_lookback_period text,
    imported_at timestamptz default now()
);
create index wb_lounge_card_idx on wb_lounge (cardid);

-- Airport Transfer  (999 data rows)
drop table if exists wb_airport_transfer cascade;
create table wb_airport_transfer (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    transfer_provider text,
    transfer_type text,
    free_transfers text,
    transfer_frequency text,
    meet_and_greet text,
    meet_and_greet_count text,
    meet_and_greet_frequency text,
    eligible_airports text,
    eligible_cities text,
    minimum_spend text,
    booking_channel text,
    advance_booking text,
    guest_policy text,
    imported_at timestamptz default now()
);
create index wb_airport_transfer_card_idx on wb_airport_transfer (cardid);

-- Travel  (999 data rows)
drop table if exists wb_travel cascade;
create table wb_travel (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    travel_provider text,
    booking_channel text,
    travel_discount text,
    travel_reward_rate text,
    minimum_booking_value text,
    maximum_discount text,
    eligible_products text,
    blackout_period text,
    coupon_code text,
    travel_portal text,
    imported_at timestamptz default now()
);
create index wb_travel_card_idx on wb_travel (cardid);

-- Hotel  (999 data rows)
drop table if exists wb_hotel cascade;
create table wb_hotel (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    hotel_sub_benefits text,
    hotel_partner text,
    hotel_program text,
    discount_percent text,
    room_upgrade text,
    complimentary_night text,
    breakfast_included text,
    early_checkin text,
    late_checkout text,
    status_match text,
    eligible_properties text,
    blackout_dates text,
    imported_at timestamptz default now()
);
create index wb_hotel_card_idx on wb_hotel (cardid);

-- Airline  (999 data rows)
drop table if exists wb_airline cascade;
create table wb_airline (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    airline_partner text,
    airline_program text,
    discount_percent text,
    miles_bonus text,
    status_benefit text,
    upgrade_benefit text,
    eligible_routes text,
    booking_channel text,
    minimum_fare text,
    maximum_discount text,
    imported_at timestamptz default now()
);
create index wb_airline_card_idx on wb_airline (cardid);

-- Forex - International  (999 data rows)
drop table if exists wb_forex_international cascade;
create table wb_forex_international (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    forex_ccy_markup text,
    conversion_charge text,
    imported_at timestamptz default now()
);
create index wb_forex_international_card_idx on wb_forex_international (cardid);

-- Reward Points  (999 data rows)
drop table if exists wb_reward_points cascade;
create table wb_reward_points (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    reward_rule_id text,
    earn_category text,
    merchant text,
    expense_mode text,
    points_per_rupee text,
    multiplier text,
    base_reward_rate text,
    accelerated_reward_rate text,
    minimum_transaction text,
    monthly_cap_points text,
    monthly_cap_spend text,
    annual_cap_points text,
    excluded_mccs text,
    excluded_transaction_types text,
    imported_at timestamptz default now()
);
create index wb_reward_points_card_idx on wb_reward_points (cardid);

-- Milestone  (999 data rows)
drop table if exists wb_milestone cascade;
create table wb_milestone (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    milestone_id text,
    milestone_period text,
    milestone_tier text,
    spend_from text,
    spend_to text,
    milestone_benefit_type text,
    milestone_benefit_value text,
    cumulative_or_incremental text,
    milestone_reset text,
    milestone_achievement_date text,
    benefit_issuance_method text,
    stacking_rule text,
    imported_at timestamptz default now()
);
create index wb_milestone_card_idx on wb_milestone (cardid);

-- Welcome  (999 data rows)
drop table if exists wb_welcome cascade;
create table wb_welcome (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    welcome_benefit_id text,
    welcome_benefit_type text,
    welcome_benefit_component text,
    welcome_value text,
    joining_fee_linkage text,
    minimum_spend text,
    spend_period text,
    activation_required text,
    activation_deadline text,
    benefit_delivery_method text,
    redemption_portal text,
    delivery_timeline text,
    expiry_date text,
    component_realistic_value text,
    imported_at timestamptz default now()
);
create index wb_welcome_card_idx on wb_welcome (cardid);

-- Renewal Benefit  (999 data rows)
drop table if exists wb_renewal_benefit cascade;
create table wb_renewal_benefit (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    renewal_benefit_id text,
    renewal_benefit_type text,
    renewal_benefit_component text,
    renewal_value text,
    renewal_fee_linkage text,
    minimum_spend_for_renewal_benefit text,
    qualifying_period text,
    activation_required text,
    benefit_delivery_method text,
    redemption_portal text,
    delivery_timeline text,
    expiry_date text,
    realistic_value text,
    imported_at timestamptz default now()
);
create index wb_renewal_benefit_card_idx on wb_renewal_benefit (cardid);

-- Fee Waiver  (999 data rows)
drop table if exists wb_fee_waiver cascade;
create table wb_fee_waiver (
    id uuid primary key default gen_random_uuid(),
    card_id text,
    fee_type text,
    fee_amount text,
    waiver_amount text,
    waiver_threshold text,
    waiver_period text,
    qualifying_spend_definition text,
    exclusions text,
    automatic_waiver text,
    waiver_qualification_date text,
    partial_waiver_allowed text,
    imported_at timestamptz default now()
);
create index wb_fee_waiver_card_idx on wb_fee_waiver (card_id);

-- Partner & Transfer  (999 data rows)
drop table if exists wb_partner_and_transfer cascade;
create table wb_partner_and_transfer (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    redemption_mode text,
    partner_name text,
    conversion_ratio text,
    minimum_transfer text,
    transfer_increment text,
    transfer_fee text,
    transfer_time text,
    notes text,
    imported_at timestamptz default now()
);
create index wb_partner_and_transfer_card_idx on wb_partner_and_transfer (cardid);

-- Fuel  (999 data rows)
drop table if exists wb_fuel cascade;
create table wb_fuel (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    fuel_waiver_period text,
    fuel_max_tx_count text,
    fuel_count_period text,
    fuel_surcharge_rate text,
    waiver_rate text,
    waiver_type text,
    minimum_fuel_transaction text,
    maximum_fuel_transaction text,
    monthly_waiver_cap text,
    annual_waiver_cap text,
    eligible_fuel_stations text,
    eligible_mccs text,
    gst_reversal text,
    gst_reversal_rate text,
    fuel_reward_rate text,
    net_effective_fuel_benefit text,
    imported_at timestamptz default now()
);
create index wb_fuel_card_idx on wb_fuel (cardid);

-- Dining  (999 data rows)
drop table if exists wb_dining cascade;
create table wb_dining (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    dining_platform text,
    dining_discount_value text,
    dining_restaurant_mapping text,
    dining_program text,
    restaurant_name text,
    restaurant_id text,
    discount_percent text,
    cashback_percent text,
    minimum_bill text,
    maximum_discount text,
    eligible_days text,
    meal_type text,
    booking_platform text,
    reservation_required text,
    delivery_app text,
    dine_in_only text,
    tip_excluded text,
    tax_excluded text,
    imported_at timestamptz default now()
);
create index wb_dining_card_idx on wb_dining (cardid);

-- Golf  (999 data rows)
drop table if exists wb_golf cascade;
create table wb_golf (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    golf_benefit_type text,
    free_rounds text,
    round_frequency text,
    golf_course text,
    golf_course_network text,
    lesson_available text,
    lesson_count text,
    caddie_included text,
    guest_allowed text,
    booking_window text,
    handicap_requirement text,
    additional_round_fee text,
    imported_at timestamptz default now()
);
create index wb_golf_card_idx on wb_golf (cardid);

-- Movie  (999 data rows)
drop table if exists wb_movie cascade;
create table wb_movie (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    movie_platform text,
    ticket_benefit_type text,
    free_tickets text,
    discount_percent text,
    ticket_cap text,
    monthly_ticket_limit text,
    monthly_benefit_cap text,
    booking_fee text,
    eligible_days text,
    eligible_cinemas text,
    minimum_spend text,
    imported_at timestamptz default now()
);
create index wb_movie_card_idx on wb_movie (cardid);

-- SPA - Wellness  (999 data rows)
drop table if exists wb_spa_wellness cascade;
create table wb_spa_wellness (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    spa_provider text,
    spa_location text,
    service_type text,
    free_sessions text,
    session_value text,
    frequency text,
    discount_percent text,
    minimum_spend text,
    booking_required text,
    eligible_properties text,
    guest_policy text,
    imported_at timestamptz default now()
);
create index wb_spa_wellness_card_idx on wb_spa_wellness (cardid);

-- Concierge  (999 data rows)
drop table if exists wb_concierge cascade;
create table wb_concierge (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    concierge_provider text,
    service_categories text,
    availability text,
    operating_hours text,
    booking_channel text,
    international_support text,
    premium_services text,
    service_fee text,
    imported_at timestamptz default now()
);
create index wb_concierge_card_idx on wb_concierge (cardid);

-- Shopping  (999 data rows)
drop table if exists wb_shopping cascade;
create table wb_shopping (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    merchant text,
    merchant_category text,
    discount_percent text,
    cashback_percent text,
    minimum_transaction text,
    maximum_discount text,
    coupon_code text,
    campaign_frequency text,
    online_offline text,
    stacking_rule text,
    imported_at timestamptz default now()
);
create index wb_shopping_card_idx on wb_shopping (cardid);

-- OTT - Subscription  (999 data rows)
drop table if exists wb_ott_subscription cascade;
create table wb_ott_subscription (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    platform text,
    subscription_type text,
    subscription_duration text,
    subscription_value text,
    monthly_value text,
    annual_value text,
    activation_method text,
    renewal_rule text,
    minimum_spend text,
    imported_at timestamptz default now()
);
create index wb_ott_subscription_card_idx on wb_ott_subscription (cardid);

-- Insurance - Protection  (999 data rows)
drop table if exists wb_insurance_protection cascade;
create table wb_insurance_protection (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    policy_type text,
    insurer text,
    coverage_amount text,
    activation_trigger text,
    minimum_spend text,
    deductible text,
    covered_items text,
    exclusions text,
    claim_process text,
    claim_sla text,
    imported_at timestamptz default now()
);
create index wb_insurance_protection_card_idx on wb_insurance_protection (cardid);

-- Travel Insurance  (999 data rows)
drop table if exists wb_travel_insurance cascade;
create table wb_travel_insurance (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    policy_type text,
    insurer text,
    policy_number_reference text,
    coverage_amount text,
    coverage_currency text,
    activation_trigger text,
    minimum_ticket_spend text,
    trip_duration_limit text,
    geographical_coverage text,
    deductible text,
    medical_cover text,
    baggage_cover text,
    flight_delay_cover text,
    cancellation_cover text,
    exclusions text,
    claim_process_url text,
    policy_document_url text,
    imported_at timestamptz default now()
);
create index wb_travel_insurance_card_idx on wb_travel_insurance (cardid);

-- Purchase Protection  (999 data rows)
drop table if exists wb_purchase_protection cascade;
create table wb_purchase_protection (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    purchase_protection_amount text,
    coverage_period_days text,
    eligible_purchase_type text,
    minimum_purchase_value text,
    deductible text,
    claim_window text,
    exclusions text,
    imported_at timestamptz default now()
);
create index wb_purchase_protection_card_idx on wb_purchase_protection (cardid);

-- Personal Accident  (999 data rows)
drop table if exists wb_personal_accident cascade;
create table wb_personal_accident (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    accident_cover_amount text,
    activation_condition text,
    travel_requirement text,
    coverage_duration text,
    beneficiary_rule text,
    exclusions text,
    imported_at timestamptz default now()
);
create index wb_personal_accident_card_idx on wb_personal_accident (cardid);

-- Roadside Assistance  (999 data rows)
drop table if exists wb_roadside_assistance cascade;
create table wb_roadside_assistance (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    service_provider text,
    free_service_count text,
    service_types text,
    geographical_limit text,
    response_time text,
    additional_service_fee text,
    imported_at timestamptz default now()
);
create index wb_roadside_assistance_card_idx on wb_roadside_assistance (cardid);

-- LTF (Lifetime Free)  (999 data rows)
drop table if exists wb_ltf_lifetime_free cascade;
create table wb_ltf_lifetime_free (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    notes text,
    imported_at timestamptz default now()
);
create index wb_ltf_lifetime_free_card_idx on wb_ltf_lifetime_free (cardid);

-- Status Benefits  (999 data rows)
drop table if exists wb_status_benefits cascade;
create table wb_status_benefits (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    status_program text,
    status_level text,
    qualification_method text,
    status_validity text,
    upgrade_benefit text,
    late_checkout text,
    breakfast text,
    eligible_properties text,
    imported_at timestamptz default now()
);
create index wb_status_benefits_card_idx on wb_status_benefits (cardid);

-- UPI  (999 data rows)
drop table if exists wb_upi cascade;
create table wb_upi (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    notes text,
    imported_at timestamptz default now()
);
create index wb_upi_card_idx on wb_upi (cardid);

-- Contactless  (999 data rows)
drop table if exists wb_contactless cascade;
create table wb_contactless (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    available text,
    network text,
    per_txn_limit text,
    notes text,
    source_id text,
    imported_at timestamptz default now()
);
create index wb_contactless_card_idx on wb_contactless (cardid);

-- Token Enabled  (999 data rows)
drop table if exists wb_token_enabled cascade;
create table wb_token_enabled (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    available text,
    supported_networks text,
    token_provider text,
    notes text,
    source_id text,
    imported_at timestamptz default now()
);
create index wb_token_enabled_card_idx on wb_token_enabled (cardid);

-- MCC  (999 data rows)
drop table if exists wb_mcc cascade;
create table wb_mcc (
    id uuid primary key default gen_random_uuid(),
    card text,
    offer_id text,
    mcc text,
    inclusion text,
    exclusion text,
    imported_at timestamptz default now()
);

-- Fees  (999 data rows)
drop table if exists wb_fees cascade;
create table wb_fees (
    id uuid primary key default gen_random_uuid(),
    cardid text,
    cardname text,
    issuer text,
    network text,
    subnetwork text,
    cardstatus text,
    feetype text,
    feeamount text,
    feeperiod text,
    applicabletaxes text,
    feewaivereligible text,
    feewaiverspend text,
    feewaiverperiod text,
    termsandconditions text,
    sourceofficial text,
    sourcesecondary text,
    startdate text,
    enddate text,
    cardstatusdate text,
    cobrand text,
    cobrandname text,
    status text,
    imported_at timestamptz default now()
);
create index wb_fees_card_idx on wb_fees (cardid);

do $$
declare t text;
begin
    foreach t in array array['wb_card_details', 'wb_offers', 'wb_lounge', 'wb_airport_transfer', 'wb_travel', 'wb_hotel', 'wb_airline', 'wb_forex_international', 'wb_reward_points', 'wb_milestone', 'wb_welcome', 'wb_renewal_benefit', 'wb_fee_waiver', 'wb_partner_and_transfer', 'wb_fuel', 'wb_dining', 'wb_golf', 'wb_movie', 'wb_spa_wellness', 'wb_concierge', 'wb_shopping', 'wb_ott_subscription', 'wb_insurance_protection', 'wb_travel_insurance', 'wb_purchase_protection', 'wb_personal_accident', 'wb_roadside_assistance', 'wb_ltf_lifetime_free', 'wb_status_benefits', 'wb_upi', 'wb_contactless', 'wb_token_enabled', 'wb_mcc', 'wb_fees']
    loop
        execute format('alter table %I enable row level security', t);
        execute format('drop policy if exists %I_anon_all on %I', t, t);
        execute format('create policy %I_anon_all on %I for all to anon, authenticated using (true) with check (true)', t, t);
    end loop;
end $$;

-- Adds the Reward Cap column that was missing from 0001_init.sql's offers table.
-- Points/units reward types (Reward Points, Air Miles, Hotel Points, Coins) cap
-- on units earned, separate from the currency-type max_benefit (₹) cap.
alter table offers add column if not exists reward_cap text;

-- Adds the 15 benefit flags that were missing from the original cards table
-- (they existed in the wizard checklist but flatCard() never wrote them, and
-- the cards table was never migrated for them). Safe to re-run.
alter table cards add column if not exists benefit_airport_transfer   boolean default false;
alter table cards add column if not exists benefit_travel             boolean default false;
alter table cards add column if not exists benefit_hotel              boolean default false;
alter table cards add column if not exists benefit_airline            boolean default false;
alter table cards add column if not exists benefit_forex              boolean default false;
alter table cards add column if not exists benefit_reward_points      boolean default false;
alter table cards add column if not exists benefit_renewal_benefit    boolean default false;
alter table cards add column if not exists benefit_shopping           boolean default false;
alter table cards add column if not exists benefit_ott                boolean default false;
alter table cards add column if not exists benefit_travel_insurance   boolean default false;
alter table cards add column if not exists benefit_purchase_protection boolean default false;
alter table cards add column if not exists benefit_personal_accident  boolean default false;
alter table cards add column if not exists benefit_roadside_assistance boolean default false;
alter table cards add column if not exists benefit_ltf                boolean default false;
alter table cards add column if not exists benefit_status_benefits    boolean default false;

-- Adds the 29 reward-type sub-field columns (rp_/cb_/id_/vd_/v_/am_/hp_/c_*) as
-- flat columns on the app-shape `offers` table, matching wb_offers and the Excel
-- template. They stay nullable text — only the sub-fields for an offer's own
-- reward type get filled, the rest stay null.
--
-- `reward_fields` (jsonb) is kept, not replaced: it's what every existing query
-- and the app's read path already use, and jsonb is strictly more useful than a
-- stringified blob (indexable, queryable per key). These flat columns are purely
-- additive for direct SQL/BI access; js/db.js now writes to both on save.
alter table offers add column if not exists rp_pointtype text;
alter table offers add column if not exists rp_calc text;
alter table offers add column if not exists cb_type text;
alter table offers add column if not exists cb_credit text;
alter table offers add column if not exists cb_limit text;
alter table offers add column if not exists cb_freq text;
alter table offers add column if not exists id_partner text;
alter table offers add column if not exists id_discount text;
alter table offers add column if not exists id_paymode text;
alter table offers add column if not exists id_max text;
alter table offers add column if not exists vd_slab text;
alter table offers add column if not exists vd_pct text;
alter table offers add column if not exists vd_max text;
alter table offers add column if not exists v_brand text;
alter table offers add column if not exists v_type text;
alter table offers add column if not exists v_value text;
alter table offers add column if not exists v_delivery text;
alter table offers add column if not exists am_airline text;
alter table offers add column if not exists am_program text;
alter table offers add column if not exists am_ratio text;
alter table offers add column if not exists am_time text;
alter table offers add column if not exists hp_chain text;
alter table offers add column if not exists hp_program text;
alter table offers add column if not exists hp_ratio text;
alter table offers add column if not exists hp_time text;
alter table offers add column if not exists c_program text;
alter table offers add column if not exists c_type text;
alter table offers add column if not exists c_conv text;
alter table offers add column if not exists c_validity text;

-- Type tightening from the Supabase gaps review — the subset that's safe to do
-- automatically (verified against the real column set; tolerant USING clauses so
-- odd/legacy text values become NULL instead of failing the migration).
--
-- Deliberately NOT done here (see chat for why):
--   * text -> varchar with no length cap: Postgres treats these identically
--     (same storage, same behavior) — there's no real gap to fix.
--   * date columns (start_date, end_date, cardstatusdate, expiry_date, ...):
--     several already hold non-date text ("N/A", "TBC", "Ongoing") from the
--     app's own missing-value fill — casting would either fail the migration or
--     silently null out real annotations. Needs a cleanup pass first.
--   * offers.reward_fields jsonb -> text/varchar: would just stringify the JSON,
--     losing per-key querying. Kept as jsonb; flat columns were added alongside
--     it instead (0005_offers_flat_reward_fields.sql).
--   * offers.merchant / offers.mcc "extra" columns: still used by the manual
--     Add Reward Rule wizard — not dropped.

-- ---------- booleans (blank/unrecognised -> null, not a hard failure) ----------
alter table cards alter column cobrand type boolean using
    (case when cobrand is null or trim(cobrand) = '' then null
          when lower(trim(cobrand)) in ('yes','true','1','y') then true else false end);

alter table wb_dining alter column dine_in_only type boolean using
    (case when dine_in_only is null or trim(dine_in_only) = '' then null
          when lower(trim(dine_in_only)) in ('yes','true','1','y') then true else false end);
alter table wb_dining alter column tip_excluded type boolean using
    (case when tip_excluded is null or trim(tip_excluded) = '' then null
          when lower(trim(tip_excluded)) in ('yes','true','1','y') then true else false end);
alter table wb_dining alter column tax_excluded type boolean using
    (case when tax_excluded is null or trim(tax_excluded) = '' then null
          when lower(trim(tax_excluded)) in ('yes','true','1','y') then true else false end);

alter table wb_fee_waiver alter column partial_waiver_allowed type boolean using
    (case when partial_waiver_allowed is null or trim(partial_waiver_allowed) = '' then null
          when lower(trim(partial_waiver_allowed)) in ('yes','true','1','y') then true else false end);

alter table wb_fees alter column feewaivereligible type boolean using
    (case when feewaivereligible is null or trim(feewaivereligible) = '' then null
          when lower(trim(feewaivereligible)) in ('yes','true','1','y') then true else false end);
alter table wb_fees alter column cobrand type boolean using
    (case when cobrand is null or trim(cobrand) = '' then null
          when lower(trim(cobrand)) in ('yes','true','1','y') then true else false end);

alter table wb_airport_transfer alter column meet_and_greet type boolean using
    (case when meet_and_greet is null or trim(meet_and_greet) = '' then null
          when lower(trim(meet_and_greet)) in ('yes','true','1','y') then true else false end);

alter table wb_contactless alter column available type boolean using
    (case when available is null or trim(available) = '' then null
          when lower(trim(available)) in ('yes','true','1','y') then true else false end);

alter table wb_golf alter column lesson_available type boolean using
    (case when lesson_available is null or trim(lesson_available) = '' then null
          when lower(trim(lesson_available)) in ('yes','true','1','y') then true else false end);

alter table wb_lounge alter column boarding_pass_required type boolean using
    (case when boarding_pass_required is null or trim(boarding_pass_required) = '' then null
          when lower(trim(boarding_pass_required)) in ('yes','true','1','y') then true else false end);

alter table wb_token_enabled alter column available type boolean using
    (case when available is null or trim(available) = '' then null
          when lower(trim(available)) in ('yes','true','1','y') then true else false end);

-- ---------- numerics (currency symbols/commas/text stripped; blank -> null) ----------
alter table cards alter column fee_joining type numeric using nullif(regexp_replace(fee_joining, '[^0-9.\-]', '', 'g'), '')::numeric;
alter table cards alter column fee_annual  type numeric using nullif(regexp_replace(fee_annual,  '[^0-9.\-]', '', 'g'), '')::numeric;
alter table cards alter column fee_renewal type numeric using nullif(regexp_replace(fee_renewal, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_dining alter column minimum_bill type numeric using nullif(regexp_replace(minimum_bill, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_fee_waiver alter column fee_amount       type numeric using nullif(regexp_replace(fee_amount,       '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_fee_waiver alter column waiver_amount    type numeric using nullif(regexp_replace(waiver_amount,    '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_fee_waiver alter column waiver_threshold type numeric using nullif(regexp_replace(waiver_threshold, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_fuel alter column minimum_fuel_transaction type numeric using nullif(regexp_replace(minimum_fuel_transaction, '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_fuel alter column maximum_fuel_transaction type numeric using nullif(regexp_replace(maximum_fuel_transaction, '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_fuel alter column monthly_waiver_cap       type numeric using nullif(regexp_replace(monthly_waiver_cap,       '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_fuel alter column annual_waiver_cap        type numeric using nullif(regexp_replace(annual_waiver_cap,        '[^0-9.\-]', '', 'g'), '')::numeric;

alter table mcc_rules alter column mcc type numeric using nullif(regexp_replace(mcc, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_insurance_protection alter column minimum_spend type numeric using nullif(regexp_replace(minimum_spend, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_milestone alter column spend_from type numeric using nullif(regexp_replace(spend_from, '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_milestone alter column spend_to   type numeric using nullif(regexp_replace(spend_to,   '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_movie alter column free_tickets         type numeric using nullif(regexp_replace(free_tickets,         '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_movie alter column monthly_ticket_limit type numeric using nullif(regexp_replace(monthly_ticket_limit, '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_movie alter column monthly_benefit_cap  type numeric using nullif(regexp_replace(monthly_benefit_cap,  '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_ott_subscription alter column subscription_value type numeric using nullif(regexp_replace(subscription_value, '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_ott_subscription alter column monthly_value      type numeric using nullif(regexp_replace(monthly_value,      '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_ott_subscription alter column annual_value       type numeric using nullif(regexp_replace(annual_value,       '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_ott_subscription alter column minimum_spend      type numeric using nullif(regexp_replace(minimum_spend,      '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_partner_and_transfer alter column minimum_transfer  type numeric using nullif(regexp_replace(minimum_transfer,  '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_partner_and_transfer alter column transfer_increment type numeric using nullif(regexp_replace(transfer_increment, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_purchase_protection alter column coverage_period_days type numeric using nullif(regexp_replace(coverage_period_days, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_renewal_benefit alter column realistic_value type numeric using nullif(regexp_replace(realistic_value, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_reward_points alter column points_per_rupee   type numeric using nullif(regexp_replace(points_per_rupee,   '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_reward_points alter column minimum_transaction type numeric using nullif(regexp_replace(minimum_transaction, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_shopping alter column minimum_transaction type numeric using nullif(regexp_replace(minimum_transaction, '[^0-9.\-]', '', 'g'), '')::numeric;

alter table wb_welcome alter column minimum_spend            type numeric using nullif(regexp_replace(minimum_spend,            '[^0-9.\-]', '', 'g'), '')::numeric;
alter table wb_welcome alter column component_realistic_value type numeric using nullif(regexp_replace(component_realistic_value, '[^0-9.\-]', '', 'g'), '')::numeric;

