ALTER TABLE clients
ADD COLUMN IF NOT EXISTS auth_user_id UUID;

CREATE INDEX IF NOT EXISTS clients_auth_user_id_idx ON clients (auth_user_id);
