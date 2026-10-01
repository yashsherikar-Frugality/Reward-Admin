-- ============================================================
-- RewardGenius — FULL RESET + REBUILD
-- Drops every table from any prior schema version, then creates
-- the complete current schema fresh — correct column names/types
-- from the start, so no rename/retype migration is needed after.
-- Paste this whole file into Supabase SQL Editor -> Run.
-- Safe on an empty project too.
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

-- ---- rebuild complete current schema (0001-0007; 0008 is a rename-only
--      patch for pre-existing tables and does not apply to a fresh build) ----

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
    card_id                 varchar primary key,          -- FIXED_COLUMNS "id" / wizard product_id
    instrument_type         varchar,
    issuer                  varchar,
    product                 varchar,                      -- variant
    network                 varchar,
    sub_network             varchar,
    issuer_country          varchar,
    card_status             varchar,
    card_status_date        varchar,
    card_web_link           varchar,
    card_alt_link           varchar,
    card_spend_per_point    varchar,
    card_rp_conversion      varchar,
    apr                     varchar,
    card_bill_cycle_duration varchar,
    card_bill_date          varchar,                      -- multi-select, comma-joined
    cobrand                 varchar,
    reward_program          varchar,
    age_min                 varchar,
    age_max                 varchar,
    credit_score            varchar,
    emp_type                varchar,
    salary                  varchar,
    product_type            varchar,
    nationality             varchar,
    fee_joining_type        varchar,
    fee_joining             varchar,
    fee_annual              varchar,
    fee_renewal             varchar,
    fee_waiver_spend        varchar,
    fee_waiver_period       varchar,
    benefit_concierge       varchar default 'false',
    benefit_dining          varchar default 'false',
    benefit_golf            varchar default 'false',
    benefit_movie           varchar default 'false',
    benefit_spa             varchar default 'false',
    benefit_insurance       varchar default 'false',
    benefit_fees            varchar default 'false',
    benefit_contactless     varchar default 'false',
    benefit_token_enabled   varchar default 'false',
    benefit_upi_supported   varchar default 'false',
    benefit_welcome         varchar default 'false',
    benefit_fee_waiver      varchar default 'false',
    benefit_fuel            varchar default 'false',
    benefit_lounge          varchar default 'false',
    benefit_milestone       varchar default 'false',
    benefit_partner_program varchar default 'false',
    benefit_airport_transfer   varchar default 'false',
    benefit_travel             varchar default 'false',
    benefit_hotel               varchar default 'false',
    benefit_airline             varchar default 'false',
    benefit_forex                varchar default 'false',
    benefit_reward_points       varchar default 'false',
    benefit_renewal_benefit     varchar default 'false',
    benefit_shopping            varchar default 'false',
    benefit_ott                  varchar default 'false',
    benefit_travel_insurance    varchar default 'false',
    benefit_purchase_protection varchar default 'false',
    benefit_personal_accident   varchar default 'false',
    benefit_roadside_assistance varchar default 'false',
    benefit_ltf                  varchar default 'false',
    benefit_status_benefits     varchar default 'false',
    created_at              timestamptz default now(),
    updated_at              timestamptz default now()
);

-- ------------------------------------------------------------------
-- offers  (OFFER_IMPORT_COLUMNS + saveOffer; reward_fields holds the
--          reward-type-specific sub-fields rp_*/cb_*/id_*/... as JSON)
-- ------------------------------------------------------------------
create table if not exists offers (
    id                  uuid primary key default gen_random_uuid(),
    card_id             varchar,                          -- no FK: an import may land before its card
    offer_id            varchar,
    category            varchar,
    sub_category        varchar,
    merchant            varchar,                          -- array in wizard, comma-joined here
    mcc                 varchar,
    reward_type         varchar,
    frequency           varchar,
    status              varchar,
    days                varchar,
    instance_period     varchar,
    person              varchar,
    min_tx              varchar,
    max_tx              varchar,
    max_benefit         varchar,
    start_date          varchar,
    end_date            varchar,
    weblink             varchar,
    payment_scope_type  varchar,
    payment_scope_value varchar,                          -- array in wizard, comma-joined here
    rp_expiry           varchar,
    coupon_code         varchar,
    platform            varchar,
    custom_platform     varchar,
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
    card_id    varchar,
    offer_id   varchar,
    mcc        varchar,
    inclusion  varchar,
    exclusion  varchar,
    created_at timestamptz default now()
);
create index if not exists mcc_rules_card_id_idx on mcc_rules (card_id);

-- ------------------------------------------------------------------
-- card_benefits  (Import Preferred Benefits: one detail row per card)
-- ------------------------------------------------------------------
create table if not exists card_benefits (
    card_id                  varchar primary key references cards (card_id) on delete cascade,
    lounge_program           varchar,
    lounge_dom_visits        varchar,
    lounge_dom_period        varchar,
    lounge_dom_frequency     varchar,
    lounge_dom_criteria      varchar,
    lounge_int_visits        varchar,
    lounge_int_period        varchar,
    lounge_int_frequency     varchar,
    lounge_int_criteria      varchar,
    golf_courses             varchar,
    golf_rounds              varchar,
    golf_period              varchar,
    golf_notes               varchar,
    dining_partner           varchar,
    dining_discount_type     varchar,
    dining_max_discount      varchar,
    dining_frequency         varchar,
    dining_min_spend         varchar,
    dining_notes             varchar,
    movie_partner            varchar,
    movie_discount_type      varchar,
    movie_max_discount       varchar,
    movie_frequency          varchar,
    movie_ticket_limit       varchar,
    movie_days               varchar,
    movie_notes              varchar,
    spa_partner              varchar,
    spa_discount             varchar,
    spa_max_discount         varchar,
    spa_frequency            varchar,
    spa_notes                varchar,
    concierge_notes          varchar,
    ins_provider             varchar,
    ins_coverage             varchar,
    ins_policy_link          varchar,
    ins_travel               varchar default 'false',
    ins_purchase_protection  varchar default 'false',
    ins_personal_accident    varchar default 'false',
    ins_extended_warranty    varchar default 'false',
    ins_lost_card_liability  varchar default 'false',
    fee_waiver_spend         varchar,
    fee_waiver_period        varchar,
    fuel_rate                varchar,
    fuel_max_waiver          varchar,
    fuel_period              varchar,
    fuel_min_tx              varchar,
    fuel_max_tx              varchar,
    welcome_value            varchar,
    welcome_benefit_type     varchar,
    welcome_free_text        varchar,
    updated_at               timestamptz default now()
);

-- milestone slabs (slab_no rows in the benefits sheet)
create table if not exists benefit_milestones (
    id                     uuid primary key default gen_random_uuid(),
    card_id                varchar references cards (card_id) on delete cascade,
    slab_no                integer,
    milestone_amount       varchar,
    milestone_period       varchar,
    milestone_benefit_value varchar,
    milestone_benefit_type varchar,
    milestone_benefit_comment varchar
);
create index if not exists benefit_milestones_card_id_idx on benefit_milestones (card_id);

-- partner programs (partner_no rows in the benefits sheet)
create table if not exists benefit_partner_programs (
    id                     uuid primary key default gen_random_uuid(),
    card_id                varchar references cards (card_id) on delete cascade,
    partner_no             integer,
    partner_program        varchar,
    partner_ratio          varchar,
    partner_min_transfer   varchar,
    partner_transfer_time  varchar
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
    card_id varchar,
    instrument_type varchar,
    issuer varchar,
    product varchar,
    network varchar,
    sub_network varchar,
    issuer_country varchar,
    card_status varchar,
    card_status_date varchar,
    card_web_link varchar,
    card_alt_link varchar,
    card_spend_per_point varchar,
    card_rp_conversion varchar,
    apr varchar,
    card_bill_cycle_duration varchar,
    card_bill_date varchar,
    cobrand varchar,
    reward_program varchar,
    age_min varchar,
    age_max varchar,
    credit_score varchar,
    emp_type varchar,
    salary varchar,
    product_type varchar,
    nationality varchar,
    fee_joining_type varchar,
    fee_joining varchar,
    fee_annual varchar,
    fee_renewal varchar,
    fee_waiver_spend varchar,
    fee_waiver_period varchar,
    benefit_concierge varchar,
    benefit_dining varchar,
    benefit_golf varchar,
    benefit_movie varchar,
    benefit_spa varchar,
    benefit_insurance varchar,
    benefit_fees varchar,
    benefit_contactless varchar,
    benefit_token_enabled varchar,
    benefit_upi_supported varchar,
    benefit_welcome varchar,
    benefit_fee_waiver varchar,
    benefit_fuel varchar,
    benefit_lounge varchar,
    benefit_milestone varchar,
    benefit_partner_program varchar,
    benefit_airport_transfer varchar,
    benefit_travel varchar,
    benefit_hotel varchar,
    benefit_airline varchar,
    benefit_forex varchar,
    benefit_reward_points varchar,
    benefit_renewal_benefit varchar,
    benefit_shopping varchar,
    benefit_ott varchar,
    benefit_travel_insurance varchar,
    benefit_purchase_protection varchar,
    benefit_personal_accident varchar,
    benefit_roadside_assistance varchar,
    benefit_ltf varchar,
    benefit_status_benefits varchar,
    imported_at timestamptz default now()
);
create index wb_card_details_card_idx on wb_card_details (card_id);

-- Offers  (2288 data rows)
drop table if exists wb_offers cascade;
create table wb_offers (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    offer_id varchar,
    category varchar,
    sub_category varchar,
    reward_type varchar,
    frequency varchar,
    status varchar,
    days varchar,
    instance_period varchar,
    person varchar,
    min_tx varchar,
    max_tx varchar,
    max_benefit varchar,
    reward_cap varchar,
    start_date varchar,
    end_date varchar,
    weblink varchar,
    payment_scope_type varchar,
    payment_scope_value varchar,
    rp_expiry varchar,
    coupon_code varchar,
    platform varchar,
    custom_platform varchar,
    rp_point_type varchar,
    rp_calc varchar,
    cb_type varchar,
    cb_credit varchar,
    cb_limit varchar,
    cb_freq varchar,
    id_partner varchar,
    id_discount varchar,
    id_paymode varchar,
    id_max varchar,
    vd_slab varchar,
    vd_pct varchar,
    vd_max varchar,
    v_brand varchar,
    v_type varchar,
    v_value varchar,
    v_delivery varchar,
    am_airline varchar,
    am_program varchar,
    am_ratio varchar,
    am_time varchar,
    hp_chain varchar,
    hp_program varchar,
    hp_ratio varchar,
    hp_time varchar,
    c_program varchar,
    c_type varchar,
    c_conv varchar,
    c_validity varchar,
    imported_at timestamptz default now()
);
create index wb_offers_card_idx on wb_offers (card_id);

-- Lounge  (999 data rows)
drop table if exists wb_lounge cascade;
create table wb_lounge (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    lounge_usage_type varchar,
    lounge_type varchar,
    access_type varchar,
    domestic_international varchar,
    visits_per_period varchar,
    lounge_program varchar,
    eligible_airports varchar,
    eligible_terminals varchar,
    network_requirement varchar,
    boarding_pass_required varchar,
    cardholder_guest_rule varchar,
    guest_fee varchar,
    additional_visit_fee varchar,
    spend_threshold varchar,
    spend_lookback_period varchar,
    imported_at timestamptz default now()
);
create index wb_lounge_card_idx on wb_lounge (card_id);

-- Airport Transfer  (999 data rows)
drop table if exists wb_airport_transfer cascade;
create table wb_airport_transfer (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    transfer_provider varchar,
    transfer_type varchar,
    free_transfers varchar,
    transfer_frequency varchar,
    meet_and_greet varchar,
    meet_and_greet_count varchar,
    meet_and_greet_frequency varchar,
    eligible_airports varchar,
    eligible_cities varchar,
    minimum_spend varchar,
    booking_channel varchar,
    advance_booking varchar,
    guest_policy varchar,
    imported_at timestamptz default now()
);
create index wb_airport_transfer_card_idx on wb_airport_transfer (card_id);

-- Travel  (999 data rows)
drop table if exists wb_travel cascade;
create table wb_travel (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    travel_provider varchar,
    booking_channel varchar,
    travel_discount varchar,
    travel_reward_rate varchar,
    minimum_booking_value varchar,
    maximum_discount varchar,
    eligible_products varchar,
    blackout_period varchar,
    coupon_code varchar,
    travel_portal varchar,
    imported_at timestamptz default now()
);
create index wb_travel_card_idx on wb_travel (card_id);

-- Hotel  (999 data rows)
drop table if exists wb_hotel cascade;
create table wb_hotel (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    hotel_sub_benefits varchar,
    hotel_partner varchar,
    hotel_program varchar,
    discount_percent varchar,
    room_upgrade varchar,
    complimentary_night varchar,
    breakfast_included varchar,
    early_checkin varchar,
    late_checkout varchar,
    status_match varchar,
    eligible_properties varchar,
    blackout_dates varchar,
    imported_at timestamptz default now()
);
create index wb_hotel_card_idx on wb_hotel (card_id);

-- Airline  (999 data rows)
drop table if exists wb_airline cascade;
create table wb_airline (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    airline_partner varchar,
    airline_program varchar,
    discount_percent varchar,
    miles_bonus varchar,
    status_benefit varchar,
    upgrade_benefit varchar,
    eligible_routes varchar,
    booking_channel varchar,
    minimum_fare varchar,
    maximum_discount varchar,
    imported_at timestamptz default now()
);
create index wb_airline_card_idx on wb_airline (card_id);

-- Forex - International  (999 data rows)
drop table if exists wb_forex_international cascade;
create table wb_forex_international (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    forex_ccy_markup varchar,
    conversion_charge varchar,
    imported_at timestamptz default now()
);
create index wb_forex_international_card_idx on wb_forex_international (card_id);

-- Reward Points  (999 data rows)
drop table if exists wb_reward_points cascade;
create table wb_reward_points (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    reward_rule_id varchar,
    earn_category varchar,
    merchant varchar,
    expense_mode varchar,
    points_per_rupee varchar,
    multiplier varchar,
    base_reward_rate varchar,
    accelerated_reward_rate varchar,
    minimum_transaction varchar,
    monthly_cap_points varchar,
    monthly_cap_spend varchar,
    annual_cap_points varchar,
    excluded_mccs varchar,
    excluded_transaction_types varchar,
    imported_at timestamptz default now()
);
create index wb_reward_points_card_idx on wb_reward_points (card_id);

-- Milestone  (999 data rows)
drop table if exists wb_milestone cascade;
create table wb_milestone (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    milestone_id varchar,
    milestone_period varchar,
    milestone_tier varchar,
    spend_from varchar,
    spend_to varchar,
    milestone_benefit_type varchar,
    milestone_benefit_value varchar,
    cumulative_or_incremental varchar,
    milestone_reset varchar,
    milestone_achievement_date varchar,
    benefit_issuance_method varchar,
    stacking_rule varchar,
    imported_at timestamptz default now()
);
create index wb_milestone_card_idx on wb_milestone (card_id);

-- Welcome  (999 data rows)
drop table if exists wb_welcome cascade;
create table wb_welcome (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    welcome_benefit_id varchar,
    welcome_benefit_type varchar,
    welcome_benefit_component varchar,
    welcome_value varchar,
    joining_fee_linkage varchar,
    minimum_spend varchar,
    spend_period varchar,
    activation_required varchar,
    activation_deadline varchar,
    benefit_delivery_method varchar,
    redemption_portal varchar,
    delivery_timeline varchar,
    expiry_date varchar,
    component_realistic_value varchar,
    imported_at timestamptz default now()
);
create index wb_welcome_card_idx on wb_welcome (card_id);

-- Renewal Benefit  (999 data rows)
drop table if exists wb_renewal_benefit cascade;
create table wb_renewal_benefit (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    renewal_benefit_id varchar,
    renewal_benefit_type varchar,
    renewal_benefit_component varchar,
    renewal_value varchar,
    renewal_fee_linkage varchar,
    minimum_spend_for_renewal_benefit varchar,
    qualifying_period varchar,
    activation_required varchar,
    benefit_delivery_method varchar,
    redemption_portal varchar,
    delivery_timeline varchar,
    expiry_date varchar,
    realistic_value varchar,
    imported_at timestamptz default now()
);
create index wb_renewal_benefit_card_idx on wb_renewal_benefit (card_id);

-- Fee Waiver  (999 data rows)
drop table if exists wb_fee_waiver cascade;
create table wb_fee_waiver (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    fee_type varchar,
    fee_amount varchar,
    waiver_amount varchar,
    waiver_threshold varchar,
    waiver_period varchar,
    qualifying_spend_definition varchar,
    exclusions varchar,
    automatic_waiver varchar,
    waiver_qualification_date varchar,
    partial_waiver_allowed varchar,
    imported_at timestamptz default now()
);
create index wb_fee_waiver_card_idx on wb_fee_waiver (card_id);

-- Partner & Transfer  (999 data rows)
drop table if exists wb_partner_and_transfer cascade;
create table wb_partner_and_transfer (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    redemption_mode varchar,
    partner_name varchar,
    conversion_ratio varchar,
    minimum_transfer varchar,
    transfer_increment varchar,
    transfer_fee varchar,
    transfer_time varchar,
    notes varchar,
    imported_at timestamptz default now()
);
create index wb_partner_and_transfer_card_idx on wb_partner_and_transfer (card_id);

-- Fuel  (999 data rows)
drop table if exists wb_fuel cascade;
create table wb_fuel (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    fuel_waiver_period varchar,
    fuel_max_tx_count varchar,
    fuel_count_period varchar,
    fuel_surcharge_rate varchar,
    waiver_rate varchar,
    waiver_type varchar,
    minimum_fuel_transaction varchar,
    maximum_fuel_transaction varchar,
    monthly_waiver_cap varchar,
    annual_waiver_cap varchar,
    eligible_fuel_stations varchar,
    eligible_mccs varchar,
    gst_reversal varchar,
    gst_reversal_rate varchar,
    fuel_reward_rate varchar,
    net_effective_fuel_benefit varchar,
    imported_at timestamptz default now()
);
create index wb_fuel_card_idx on wb_fuel (card_id);

-- Dining  (999 data rows)
drop table if exists wb_dining cascade;
create table wb_dining (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    dining_platform varchar,
    dining_discount_value varchar,
    dining_restaurant_mapping varchar,
    dining_program varchar,
    restaurant_name varchar,
    restaurant_id varchar,
    discount_percent varchar,
    cashback_percent varchar,
    minimum_bill varchar,
    maximum_discount varchar,
    eligible_days varchar,
    meal_type varchar,
    booking_platform varchar,
    reservation_required varchar,
    delivery_app varchar,
    dine_in_only varchar,
    tip_excluded varchar,
    tax_excluded varchar,
    imported_at timestamptz default now()
);
create index wb_dining_card_idx on wb_dining (card_id);

-- Golf  (999 data rows)
drop table if exists wb_golf cascade;
create table wb_golf (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    golf_benefit_type varchar,
    free_rounds varchar,
    round_frequency varchar,
    golf_course varchar,
    golf_course_network varchar,
    lesson_available varchar,
    lesson_count varchar,
    caddie_included varchar,
    guest_allowed varchar,
    booking_window varchar,
    handicap_requirement varchar,
    additional_round_fee varchar,
    imported_at timestamptz default now()
);
create index wb_golf_card_idx on wb_golf (card_id);

-- Movie  (999 data rows)
drop table if exists wb_movie cascade;
create table wb_movie (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    movie_platform varchar,
    ticket_benefit_type varchar,
    free_tickets varchar,
    discount_percent varchar,
    ticket_cap varchar,
    monthly_ticket_limit varchar,
    monthly_benefit_cap varchar,
    booking_fee varchar,
    eligible_days varchar,
    eligible_cinemas varchar,
    minimum_spend varchar,
    imported_at timestamptz default now()
);
create index wb_movie_card_idx on wb_movie (card_id);

-- SPA - Wellness  (999 data rows)
drop table if exists wb_spa_wellness cascade;
create table wb_spa_wellness (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    spa_provider varchar,
    spa_location varchar,
    service_type varchar,
    free_sessions varchar,
    session_value varchar,
    frequency varchar,
    discount_percent varchar,
    minimum_spend varchar,
    booking_required varchar,
    eligible_properties varchar,
    guest_policy varchar,
    imported_at timestamptz default now()
);
create index wb_spa_wellness_card_idx on wb_spa_wellness (card_id);

-- Concierge  (999 data rows)
drop table if exists wb_concierge cascade;
create table wb_concierge (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    concierge_provider varchar,
    service_categories varchar,
    availability varchar,
    operating_hours varchar,
    booking_channel varchar,
    international_support varchar,
    premium_services varchar,
    service_fee varchar,
    imported_at timestamptz default now()
);
create index wb_concierge_card_idx on wb_concierge (card_id);

-- Shopping  (999 data rows)
drop table if exists wb_shopping cascade;
create table wb_shopping (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    merchant varchar,
    merchant_category varchar,
    discount_percent varchar,
    cashback_percent varchar,
    minimum_transaction varchar,
    maximum_discount varchar,
    coupon_code varchar,
    campaign_frequency varchar,
    online_offline varchar,
    stacking_rule varchar,
    imported_at timestamptz default now()
);
create index wb_shopping_card_idx on wb_shopping (card_id);

-- OTT - Subscription  (999 data rows)
drop table if exists wb_ott_subscription cascade;
create table wb_ott_subscription (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    platform varchar,
    subscription_type varchar,
    subscription_duration varchar,
    subscription_value varchar,
    monthly_value varchar,
    annual_value varchar,
    activation_method varchar,
    renewal_rule varchar,
    minimum_spend varchar,
    imported_at timestamptz default now()
);
create index wb_ott_subscription_card_idx on wb_ott_subscription (card_id);

-- Insurance - Protection  (999 data rows)
drop table if exists wb_insurance_protection cascade;
create table wb_insurance_protection (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    policy_type varchar,
    insurer varchar,
    coverage_amount varchar,
    activation_trigger varchar,
    minimum_spend varchar,
    deductible varchar,
    covered_items varchar,
    exclusions varchar,
    claim_process varchar,
    claim_sla varchar,
    imported_at timestamptz default now()
);
create index wb_insurance_protection_card_idx on wb_insurance_protection (card_id);

-- Travel Insurance  (999 data rows)
drop table if exists wb_travel_insurance cascade;
create table wb_travel_insurance (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    policy_type varchar,
    insurer varchar,
    policy_number_reference varchar,
    coverage_amount varchar,
    coverage_currency varchar,
    activation_trigger varchar,
    minimum_ticket_spend varchar,
    trip_duration_limit varchar,
    geographical_coverage varchar,
    deductible varchar,
    medical_cover varchar,
    baggage_cover varchar,
    flight_delay_cover varchar,
    cancellation_cover varchar,
    exclusions varchar,
    claim_process_url varchar,
    policy_document_url varchar,
    imported_at timestamptz default now()
);
create index wb_travel_insurance_card_idx on wb_travel_insurance (card_id);

-- Purchase Protection  (999 data rows)
drop table if exists wb_purchase_protection cascade;
create table wb_purchase_protection (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    purchase_protection_amount varchar,
    coverage_period_days varchar,
    eligible_purchase_type varchar,
    minimum_purchase_value varchar,
    deductible varchar,
    claim_window varchar,
    exclusions varchar,
    imported_at timestamptz default now()
);
create index wb_purchase_protection_card_idx on wb_purchase_protection (card_id);

-- Personal Accident  (999 data rows)
drop table if exists wb_personal_accident cascade;
create table wb_personal_accident (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    accident_cover_amount varchar,
    activation_condition varchar,
    travel_requirement varchar,
    coverage_duration varchar,
    beneficiary_rule varchar,
    exclusions varchar,
    imported_at timestamptz default now()
);
create index wb_personal_accident_card_idx on wb_personal_accident (card_id);

-- Roadside Assistance  (999 data rows)
drop table if exists wb_roadside_assistance cascade;
create table wb_roadside_assistance (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    service_provider varchar,
    free_service_count varchar,
    service_types varchar,
    geographical_limit varchar,
    response_time varchar,
    additional_service_fee varchar,
    imported_at timestamptz default now()
);
create index wb_roadside_assistance_card_idx on wb_roadside_assistance (card_id);

-- LTF (Lifetime Free)  (999 data rows)
drop table if exists wb_ltf_lifetime_free cascade;
create table wb_ltf_lifetime_free (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    notes varchar,
    imported_at timestamptz default now()
);
create index wb_ltf_lifetime_free_card_idx on wb_ltf_lifetime_free (card_id);

-- Status Benefits  (999 data rows)
drop table if exists wb_status_benefits cascade;
create table wb_status_benefits (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    status_program varchar,
    status_level varchar,
    qualification_method varchar,
    status_validity varchar,
    upgrade_benefit varchar,
    late_checkout varchar,
    breakfast varchar,
    eligible_properties varchar,
    imported_at timestamptz default now()
);
create index wb_status_benefits_card_idx on wb_status_benefits (card_id);

-- UPI  (999 data rows)
drop table if exists wb_upi cascade;
create table wb_upi (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    notes varchar,
    imported_at timestamptz default now()
);
create index wb_upi_card_idx on wb_upi (card_id);

-- Contactless  (999 data rows)
drop table if exists wb_contactless cascade;
create table wb_contactless (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    available varchar,
    network varchar,
    per_txn_limit varchar,
    notes varchar,
    source_id varchar,
    imported_at timestamptz default now()
);
create index wb_contactless_card_idx on wb_contactless (card_id);

-- Token Enabled  (999 data rows)
drop table if exists wb_token_enabled cascade;
create table wb_token_enabled (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    available varchar,
    supported_networks varchar,
    token_provider varchar,
    notes varchar,
    source_id varchar,
    imported_at timestamptz default now()
);
create index wb_token_enabled_card_idx on wb_token_enabled (card_id);

-- MCC  (999 data rows)
drop table if exists wb_mcc cascade;
create table wb_mcc (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    offer_id varchar,
    mcc varchar,
    inclusion varchar,
    exclusion varchar,
    imported_at timestamptz default now()
);

-- Fees  (999 data rows)
drop table if exists wb_fees cascade;
create table wb_fees (
    id uuid primary key default gen_random_uuid(),
    card_id varchar,
    card_name varchar,
    issuer varchar,
    network varchar,
    sub_network varchar,
    card_status varchar,
    fee_type varchar,
    fee_amount varchar,
    fee_period varchar,
    applicable_taxes varchar,
    fee_waiver_eligible varchar,
    fee_waiver_spend varchar,
    fee_waiver_period varchar,
    terms_and_conditions varchar,
    source_official varchar,
    source_secondary varchar,
    start_date varchar,
    end_date varchar,
    card_status_date varchar,
    co_brand varchar,
    co_brand_name varchar,
    status varchar,
    imported_at timestamptz default now()
);
create index wb_fees_card_idx on wb_fees (card_id);

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
alter table offers add column if not exists reward_cap varchar;

-- Adds the 15 benefit flags that were missing from the original cards table
-- (they existed in the wizard checklist but flatCard() never wrote them, and
-- the cards table was never migrated for them). Safe to re-run.
alter table cards add column if not exists benefit_airport_transfer   varchar default 'false';
alter table cards add column if not exists benefit_travel             varchar default 'false';
alter table cards add column if not exists benefit_hotel              varchar default 'false';
alter table cards add column if not exists benefit_airline            varchar default 'false';
alter table cards add column if not exists benefit_forex              varchar default 'false';
alter table cards add column if not exists benefit_reward_points      varchar default 'false';
alter table cards add column if not exists benefit_renewal_benefit    varchar default 'false';
alter table cards add column if not exists benefit_shopping           varchar default 'false';
alter table cards add column if not exists benefit_ott                varchar default 'false';
alter table cards add column if not exists benefit_travel_insurance   varchar default 'false';
alter table cards add column if not exists benefit_purchase_protection varchar default 'false';
alter table cards add column if not exists benefit_personal_accident  varchar default 'false';
alter table cards add column if not exists benefit_roadside_assistance varchar default 'false';
alter table cards add column if not exists benefit_ltf                varchar default 'false';
alter table cards add column if not exists benefit_status_benefits    varchar default 'false';

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

-- Converts every data column in every table to varchar (unbounded) —
-- functionally identical to text, but this also fixes every column that got
-- manually changed to date/integer/boolean/etc. via the Table Editor GUI,
-- which is what kept breaking the bulk imports ('N/A' isn't a valid date or
-- integer, but it's always a valid varchar).
--
-- Skipped on purpose (these aren't swappable without breaking the app):
--   * id columns              — uuid primary keys
--   * created_at/updated_at/imported_at — timestamptz, used for sorting/defaults
--   * reward_fields (offers)  — jsonb; converting it would just stringify the
--     JSON and break the per-key reward-field reads/writes in js/db.js
--
-- Safe to re-run — columns already varchar are skipped automatically.
do $$
declare r record;
begin
    for r in
        select table_name, column_name
        from information_schema.columns
        where table_schema = 'public'
          and data_type not in ('character varying', 'uuid', 'timestamp with time zone', 'jsonb')
          and column_name <> 'id'
    loop
        execute format('alter table %I alter column %I type varchar using %I::varchar', r.table_name, r.column_name, r.column_name);
    end loop;
end $$;

