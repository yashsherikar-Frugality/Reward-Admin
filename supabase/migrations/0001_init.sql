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
