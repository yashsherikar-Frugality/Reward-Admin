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
