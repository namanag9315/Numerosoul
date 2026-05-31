ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ;

ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS invoice_number TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS video_conference_url TEXT,
  ADD COLUMN IF NOT EXISTS calendar_event_id TEXT,
  ADD COLUMN IF NOT EXISTS session_notes TEXT,
  ADD COLUMN IF NOT EXISTS report_url TEXT,
  ADD COLUMN IF NOT EXISTS follow_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_customer_message_at TIMESTAMPTZ;

UPDATE bookings
SET invoice_number = 'NOS-' || TO_CHAR(COALESCE(created_at, NOW()), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(id::TEXT, 1, 8))
WHERE invoice_number IS NULL;

CREATE INDEX IF NOT EXISTS bookings_invoice_number_idx ON bookings (invoice_number);
CREATE INDEX IF NOT EXISTS bookings_follow_up_at_idx ON bookings (follow_up_at)
WHERE follow_up_at IS NOT NULL AND follow_up_sent_at IS NULL;
CREATE INDEX IF NOT EXISTS clients_marketing_opt_in_idx ON clients (marketing_opt_in);
