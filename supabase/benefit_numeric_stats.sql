-- Mean/median/mode/min/max for the numeric-ish varchar columns on the
-- fuel, travel insurance, welcome and milestone benefit tables.
-- Stored in one table (not a view) so it survives as a fast-read cache;
-- a statement-level trigger on each source table recomputes that
-- table's rows whenever it is inserted/updated/deleted into (bulk
-- imports only pay for one recompute, not one per row).

create table if not exists benefit_numeric_stats (
    source_table   varchar not null,
    column_name    varchar not null,
    mean           numeric,
    median         numeric,
    mode           numeric,
    min            numeric,
    max            numeric,
    non_null_rows  bigint,
    computed_at    timestamptz default now(),
    primary key (source_table, column_name)
);

-- Only accepts a cell that IS a number (optional currency prefix, comma
-- thousands separators) start to finish. Anything with extra wording —
-- "Rs 1,200 to Rs 2,400 per year", "Unlimited", "1% surcharge" — is
-- rejected as null rather than silently mangled into a bogus digit blob
-- (stripping non-digit chars from a range used to concatenate both ends
-- into one huge fake number, e.g. "1,200 to 2,400" -> "12002400").
create or replace function clean_numeric(val varchar) returns numeric as $$
declare
    stripped text;
begin
    if val is null then
        return null;
    end if;
    stripped := regexp_replace(trim(val), '^(₹|Rs\.?|INR)\s*', '', 'i');
    stripped := trim(replace(stripped, ',', ''));
    if stripped ~ '^[0-9]+(\.[0-9]+)?$' then
        return stripped::numeric;
    else
        return null;
    end if;
end;
$$ language plpgsql immutable;

-- Like clean_numeric but also accepts a lakh/crore suffix ("₹3 crore" = 30,000,000).
create or replace function clean_amount_units(val varchar) returns numeric as $$
declare
    m text[];
begin
    if val is null then
        return null;
    end if;
    m := regexp_match(replace(regexp_replace(trim(val), '^(₹|Rs\.?|INR)\s*', '', 'i'), ',', ''),
                      '^([0-9]+(?:\.[0-9]+)?)\s*(lakhs?|lacs?|crores?|cr)?$', 'i');
    if m is null then
        return null;
    end if;
    return m[1]::numeric * case lower(coalesce(m[2], ''))
        when '' then 1
        when 'lakh' then 100000 when 'lakhs' then 100000 when 'lac' then 100000 when 'lacs' then 100000
        else 10000000
    end;
end;
$$ language plpgsql immutable;

-- For rate/percent fields a bare number is unit-ambiguous (is "1" 1% or
-- a flat fee?) so only a cell that literally carries a % sign counts
-- (a bare 0 is unambiguous, so it counts too).
create or replace function clean_percent(val varchar) returns numeric as $$
declare
    stripped text;
begin
    if val is null then
        return null;
    end if;
    stripped := trim(val);
    if stripped !~ '%' and stripped !~ '^0(\.0+)?$' then
        return null;
    end if;
    stripped := trim(replace(replace(stripped, '%', ''), ',', ''));
    if stripped ~ '^[0-9]+(\.[0-9]+)?$' then
        return stripped::numeric;
    else
        return null;
    end if;
end;
$$ language plpgsql immutable;

-- wb_fuel ---------------------------------------------------------------
create or replace function refresh_wb_fuel_stats() returns void as $$
begin
    delete from benefit_numeric_stats where source_table = 'wb_fuel';

    with cleaned as (
        select
            clean_percent(fuel_surcharge_rate) as fuel_surcharge_rate_n,
            clean_percent(waiver_rate) as waiver_rate_n,
            clean_numeric(minimum_fuel_transaction) as minimum_fuel_transaction_n,
            clean_numeric(maximum_fuel_transaction) as maximum_fuel_transaction_n,
            clean_numeric(monthly_waiver_cap) as monthly_waiver_cap_n,
            clean_numeric(annual_waiver_cap) as annual_waiver_cap_n,
            clean_percent(fuel_reward_rate) as fuel_reward_rate_n
        from wb_fuel
    )
    insert into benefit_numeric_stats (source_table, column_name, mean, median, mode, min, max, non_null_rows)
    select 'wb_fuel', 'fuel_surcharge_rate', round(avg(fuel_surcharge_rate_n), 2),
           percentile_cont(0.5) within group (order by fuel_surcharge_rate_n),
           mode() within group (order by fuel_surcharge_rate_n),
           min(fuel_surcharge_rate_n), max(fuel_surcharge_rate_n), count(fuel_surcharge_rate_n)
    from cleaned
    union all
    select 'wb_fuel', 'waiver_rate', round(avg(waiver_rate_n), 2),
           percentile_cont(0.5) within group (order by waiver_rate_n),
           mode() within group (order by waiver_rate_n),
           min(waiver_rate_n), max(waiver_rate_n), count(waiver_rate_n)
    from cleaned
    union all
    select 'wb_fuel', 'minimum_fuel_transaction', round(avg(minimum_fuel_transaction_n), 2),
           percentile_cont(0.5) within group (order by minimum_fuel_transaction_n),
           mode() within group (order by minimum_fuel_transaction_n),
           min(minimum_fuel_transaction_n), max(minimum_fuel_transaction_n), count(minimum_fuel_transaction_n)
    from cleaned
    union all
    select 'wb_fuel', 'maximum_fuel_transaction', round(avg(maximum_fuel_transaction_n), 2),
           percentile_cont(0.5) within group (order by maximum_fuel_transaction_n),
           mode() within group (order by maximum_fuel_transaction_n),
           min(maximum_fuel_transaction_n), max(maximum_fuel_transaction_n), count(maximum_fuel_transaction_n)
    from cleaned
    union all
    select 'wb_fuel', 'monthly_waiver_cap', round(avg(monthly_waiver_cap_n), 2),
           percentile_cont(0.5) within group (order by monthly_waiver_cap_n),
           mode() within group (order by monthly_waiver_cap_n),
           min(monthly_waiver_cap_n), max(monthly_waiver_cap_n), count(monthly_waiver_cap_n)
    from cleaned
    union all
    select 'wb_fuel', 'annual_waiver_cap', round(avg(annual_waiver_cap_n), 2),
           percentile_cont(0.5) within group (order by annual_waiver_cap_n),
           mode() within group (order by annual_waiver_cap_n),
           min(annual_waiver_cap_n), max(annual_waiver_cap_n), count(annual_waiver_cap_n)
    from cleaned
    union all
    select 'wb_fuel', 'fuel_reward_rate', round(avg(fuel_reward_rate_n), 2),
           percentile_cont(0.5) within group (order by fuel_reward_rate_n),
           mode() within group (order by fuel_reward_rate_n),
           min(fuel_reward_rate_n), max(fuel_reward_rate_n), count(fuel_reward_rate_n)
    from cleaned;
end;
$$ language plpgsql security definer set search_path = public;

-- wb_travel_insurance -----------------------------------------------------
create or replace function refresh_wb_travel_insurance_stats() returns void as $$
begin
    delete from benefit_numeric_stats where source_table = 'wb_travel_insurance';

    -- exact duplicate rows (same card + same values) counted once; INR and USD kept apart
    with cleaned as (
        select distinct on (card_id, coverage_currency, coverage_amount, minimum_ticket_spend, deductible)
            coalesce(coverage_currency, 'unknown') as cur,
            clean_amount_units(coverage_amount) as coverage_amount_n,
            clean_amount_units(minimum_ticket_spend) as minimum_ticket_spend_n,
            clean_amount_units(deductible) as deductible_n
        from wb_travel_insurance
    ),
    long as (
        select cur, 'coverage_amount' as col, coverage_amount_n as v from cleaned
        union all select cur, 'minimum_ticket_spend', minimum_ticket_spend_n from cleaned
        union all select cur, 'deductible', deductible_n from cleaned
    )
    insert into benefit_numeric_stats (source_table, column_name, mean, median, mode, min, max, non_null_rows)
    select 'wb_travel_insurance', col || ' (' || cur || ')', round(avg(v), 2),
           percentile_cont(0.5) within group (order by v),
           mode() within group (order by v),
           min(v), max(v), count(v)
    from long
    group by cur, col;
end;
$$ language plpgsql security definer set search_path = public;

-- Every other table: generic -------------------------------------------------
-- For each text/number column, keep stats only if at least one cell is a
-- clean number (lakh/crore suffixes converted). id / *_id / *_at / *_url columns and
-- code-like columns (product, mcc, merchant, milestone_tier) are skipped (not measures).
create or replace function refresh_table_stats(tbl text) returns void as $$
declare
    col text;
begin
    delete from benefit_numeric_stats where source_table = tbl;
    for col in
        select column_name from information_schema.columns
        where table_schema = 'public' and table_name = tbl
          and data_type in ('character varying','text','numeric','integer','bigint','smallint','double precision','real')
          and column_name <> 'id' and column_name !~ '(_id|_at|_url)$'
          and column_name not in ('product','mcc','merchant','milestone_tier')
    loop
        execute format($f$
            insert into benefit_numeric_stats (source_table, column_name, mean, median, mode, min, max, non_null_rows)
            select %L, %L, round(avg(v), 2),
                   percentile_cont(0.5) within group (order by v),
                   mode() within group (order by v),
                   min(v), max(v), count(v)
            from (select clean_amount_units(%I::text) as v from %I) t
            having count(v) > 0
        $f$, tbl, col, col, tbl);
    end loop;
end;
$$ language plpgsql security definer set search_path = public;

-- Writes must stay fast (the website's anon role times out after 3s), so the trigger
-- only marks the table as changed; a one-minute pg_cron job does the recompute.
create table if not exists stats_dirty (source_table text primary key);
alter table stats_dirty enable row level security;   -- no policy: only the security-definer functions touch it

create or replace function mark_stats_dirty() returns trigger as $$
begin
    insert into stats_dirty (source_table) values (tg_table_name) on conflict do nothing;
    return null;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function refresh_dirty_stats() returns void as $$
declare
    t text;
begin
    if not pg_try_advisory_lock(7351001) then return; end if;
    for t in delete from stats_dirty returning source_table loop
        if t = 'wb_fuel' then perform refresh_wb_fuel_stats();
        elsif t = 'wb_travel_insurance' then perform refresh_wb_travel_insurance_stats();
        else perform refresh_table_stats(t);
        end if;
    end loop;
    perform pg_advisory_unlock(7351001);
end;
$$ language plpgsql security definer set search_path = public;

create extension if not exists pg_cron;
select cron.unschedule(jobid) from cron.job where jobname = 'refresh-stats';
select cron.schedule('refresh-stats', '* * * * *', 'select refresh_dirty_stats()');

-- Stats are readable by signed-in admins only, written only by the security-definer functions.
alter table benefit_numeric_stats enable row level security;
drop policy if exists benefit_numeric_stats_read on benefit_numeric_stats;
drop policy if exists benefit_numeric_stats_admin_all on benefit_numeric_stats;
create policy benefit_numeric_stats_admin_all on benefit_numeric_stats for select to authenticated using (is_admin());

-- Attach the marker trigger to every table (except the stats/queue/allowlist tables).
do $$
declare
    t text;
begin
    drop trigger if exists wb_welcome_stats_trg on wb_welcome;
    drop trigger if exists wb_milestone_stats_trg on wb_milestone;
    drop trigger if exists wb_fuel_stats_trg on wb_fuel;
    drop trigger if exists wb_travel_insurance_stats_trg on wb_travel_insurance;
    drop function if exists wb_welcome_stats_trigger();
    drop function if exists wb_milestone_stats_trigger();
    drop function if exists wb_fuel_stats_trigger();
    drop function if exists wb_travel_insurance_stats_trigger();
    drop function if exists table_stats_trigger() cascade;
    drop function if exists refresh_wb_welcome_stats();
    drop function if exists refresh_wb_milestone_stats();
    for t in
        select table_name from information_schema.tables
        where table_schema = 'public' and table_type = 'BASE TABLE'
          and table_name not in ('benefit_numeric_stats','stats_dirty','admin_users')
    loop
        execute format('drop trigger if exists table_stats_trg on %I', t);
        execute format('create trigger table_stats_trg after insert or update or delete on %I for each statement execute function mark_stats_dirty()', t);
    end loop;
end $$;

select refresh_wb_fuel_stats();
select refresh_wb_travel_insurance_stats();
