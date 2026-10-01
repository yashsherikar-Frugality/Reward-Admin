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
