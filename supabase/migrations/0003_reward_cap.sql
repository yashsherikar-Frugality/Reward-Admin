-- Adds the Reward Cap column that was missing from 0001_init.sql's offers table.
-- Points/units reward types (Reward Points, Air Miles, Hotel Points, Coins) cap
-- on units earned, separate from the currency-type max_benefit (₹) cap.
alter table offers add column if not exists reward_cap text;
