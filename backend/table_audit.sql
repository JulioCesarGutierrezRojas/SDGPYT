-- This schema is used to log changes made to tables in the database.
CREATE SCHEMA IF NOT EXISTS audit;

CREATE TABLE audit.audit_log (
  id           BIGSERIAL      PRIMARY KEY,
  event_time   TIMESTAMP      NOT NULL DEFAULT now(),
  username     TEXT           NOT NULL,
  table_name   TEXT           NOT NULL,
  move         TEXT           NOT NULL,               -- INSERT, UPDATE, DELETE
  data_before  JSONB,
  data_after   JSONB
);

-- This function is triggered before any INSERT, UPDATE, or DELETE operation
CREATE OR REPLACE FUNCTION audit.audit_if_modified()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_user TEXT;
BEGIN
  v_user := COALESCE(current_setting('app.current_user', true), 'unknown');
  INSERT INTO audit.audit_log (
    event_time, username, table_name, move, data_before, data_after
  ) VALUES (
    now(),
    v_user,
    TG_TABLE_NAME,
    TG_OP,
    -- OLD solo existe en UPDATE/DELETE
    CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    -- NEW solo existe en INSERT/UPDATE
    CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN NEW;
END;
$$;

-- Create the trigger for all tables in the public schema
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT table_schema, table_name
      FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_type   = 'BASE TABLE'
  LOOP
    EXECUTE format(
      'CREATE TRIGGER %1$I_audit
         BEFORE INSERT OR UPDATE OR DELETE
         ON %1$I
         FOR EACH ROW EXECUTE FUNCTION audit.audit_if_modified();',
      r.table_name
    );
  END LOOP;
END;
$$;