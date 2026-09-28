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
