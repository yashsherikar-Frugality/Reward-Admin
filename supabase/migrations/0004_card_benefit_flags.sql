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
