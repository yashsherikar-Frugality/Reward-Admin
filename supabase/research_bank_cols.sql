-- Research tables are shared by all banks: tag each row with its bank + source file.
do $$ declare t text; begin
  for t in select table_name from information_schema.tables where table_schema='public' and table_name like 'rs\_%' loop
    execute format('alter table %I add column if not exists bank text', t);
    execute format('alter table %I add column if not exists source_file text', t);
    execute format('create index if not exists %I on %I (bank)', t || '_bank_idx', t);
  end loop;
end $$;
