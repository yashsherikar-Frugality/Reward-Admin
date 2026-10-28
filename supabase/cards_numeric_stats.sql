-- Mean/median/mode/max/min for the "numeric" columns on cards. Every column
-- there is actually varchar with messy text mixed in — currency symbols,
-- commas, "21+"/"<65"-style prefixes, "Custom"/"N/A"/"LTF". Stripped to plain
-- digits where that's safe; a non-numeric value becomes NULL and is excluded
-- (not treated as 0), so stats reflect only the rows that actually have a
-- real number.
--
-- Deliberately NOT included: salary ("12L+" lakh notation — stripping to "12"
-- would silently lose the x100,000 multiplier and misrepresent it), apr and
-- card_spend_per_point (a large fraction of rows hold a full sentence, not a
-- number, e.g. "52.86% p.a. (3.6% per month)" or "Domestic: ₹100 = 2 RP..." —
-- a leading-number extraction there would be guessing, not cleaning).

with cleaned as (
    select
        nullif(regexp_replace(fee_joining, '[^0-9.]', '', 'g'), '')::numeric as fee_joining_n,
        nullif(regexp_replace(fee_annual, '[^0-9.]', '', 'g'), '')::numeric as fee_annual_n,
        nullif(regexp_replace(fee_renewal, '[^0-9.]', '', 'g'), '')::numeric as fee_renewal_n,
        nullif(regexp_replace(fee_waiver_spend, '[^0-9.]', '', 'g'), '')::numeric as fee_waiver_spend_n,
        nullif(regexp_replace(age_min, '[^0-9.]', '', 'g'), '')::numeric as age_min_n,
        nullif(regexp_replace(age_max, '[^0-9.]', '', 'g'), '')::numeric as age_max_n,
        nullif(regexp_replace(credit_score, '[^0-9.]', '', 'g'), '')::numeric as credit_score_n
    from cards
)
select 'fee_joining' as column_name,
       round(avg(fee_joining_n), 2) as mean,
       percentile_cont(0.5) within group (order by fee_joining_n) as median,
       mode() within group (order by fee_joining_n) as mode,
       max(fee_joining_n) as max, min(fee_joining_n) as min,
       count(fee_joining_n) as non_null_rows
from cleaned
union all
select 'fee_annual',
       round(avg(fee_annual_n), 2),
       percentile_cont(0.5) within group (order by fee_annual_n),
       mode() within group (order by fee_annual_n),
       max(fee_annual_n), min(fee_annual_n), count(fee_annual_n)
from cleaned
union all
select 'fee_renewal',
       round(avg(fee_renewal_n), 2),
       percentile_cont(0.5) within group (order by fee_renewal_n),
       mode() within group (order by fee_renewal_n),
       max(fee_renewal_n), min(fee_renewal_n), count(fee_renewal_n)
from cleaned
union all
select 'fee_waiver_spend',
       round(avg(fee_waiver_spend_n), 2),
       percentile_cont(0.5) within group (order by fee_waiver_spend_n),
       mode() within group (order by fee_waiver_spend_n),
       max(fee_waiver_spend_n), min(fee_waiver_spend_n), count(fee_waiver_spend_n)
from cleaned
union all
select 'age_min',
       round(avg(age_min_n), 2),
       percentile_cont(0.5) within group (order by age_min_n),
       mode() within group (order by age_min_n),
       max(age_min_n), min(age_min_n), count(age_min_n)
from cleaned
union all
select 'age_max',
       round(avg(age_max_n), 2),
       percentile_cont(0.5) within group (order by age_max_n),
       mode() within group (order by age_max_n),
       max(age_max_n), min(age_max_n), count(age_max_n)
from cleaned
union all
select 'credit_score',
       round(avg(credit_score_n), 2),
       percentile_cont(0.5) within group (order by credit_score_n),
       mode() within group (order by credit_score_n),
       max(credit_score_n), min(credit_score_n), count(credit_score_n)
from cleaned;
