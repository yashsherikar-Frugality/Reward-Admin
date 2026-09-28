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
