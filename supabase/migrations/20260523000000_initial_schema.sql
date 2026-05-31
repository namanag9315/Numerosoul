CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id),
  service_id UUID REFERENCES services(id),
  booking_date DATE NOT NULL,
  time_slot TIME NOT NULL,
  mode TEXT CHECK (mode IN ('video', 'whatsapp', 'in_person')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  amount_paid INTEGER,
  focus_areas TEXT,
  additional_dobs TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percent INTEGER,
  discount_flat INTEGER,
  valid_until DATE,
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS tool_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- No public RLS policies are created for clients or bookings.
-- Supabase service-role requests bypass RLS, so only server-side service-role
-- code can read or write these tables.

CREATE INDEX IF NOT EXISTS bookings_booking_date_idx ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
CREATE INDEX IF NOT EXISTS bookings_service_id_idx ON bookings (service_id);
CREATE INDEX IF NOT EXISTS coupons_code_idx ON coupons (code);
CREATE INDEX IF NOT EXISTS services_slug_idx ON services (slug);

INSERT INTO services (name, slug, price_min, price_max, duration_minutes, description)
VALUES
  ('Personal Full Reading', 'personal-full-reading', 1500, 2500, 90, 'Full life path, destiny, personality, timing, and energetic pattern analysis.'),
  ('Baby Name Numerology', 'baby-name-numerology', 1000, 2000, 45, 'Lucky baby name suggestions and spelling checks with a PDF report.'),
  ('Vehicle Number', 'vehicle-number', 500, 800, 30, 'Vehicle registration number vibration and owner compatibility check.'),
  ('Phone Number Check', 'phone-number-check', 500, 800, 30, 'Mobile number vibration analysis for communication and opportunity.'),
  ('Name Correction', 'name-correction', 1500, 3000, 60, 'Name spelling adjustments for better alignment and luck.'),
  ('Business Numerology', 'business-numerology', 2000, 4000, 60, 'Brand name, launch date, color, and founder compatibility guidance.'),
  ('Marriage Compatibility', 'marriage-compatibility', 1500, 2500, 60, 'Life path and destiny compatibility reading for partners.'),
  ('Career & Finance', 'career-finance', 1500, 2500, 60, 'Career cycles, financial patterns, and timing guidance.'),
  ('House Number', 'house-number', 800, 1200, 30, 'Home vibration and resident compatibility analysis.'),
  ('Lo Shu Grid Analysis', 'lo-shu-grid-analysis', 1000, 2000, 45, 'Chinese Lo Shu grid personality and missing number reading.'),
  ('Personal Year Forecast', 'personal-year-forecast', 1200, 2000, 45, 'Personal year and month forecast with timing guidance.'),
  ('Corporate Team Reading', 'corporate-team-reading', 5000, 15000, 180, 'Team dynamics, leadership compatibility, and group numerology reading.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  price_min = EXCLUDED.price_min,
  price_max = EXCLUDED.price_max,
  duration_minutes = EXCLUDED.duration_minutes,
  description = EXCLUDED.description,
  is_active = TRUE;

INSERT INTO coupons (code, discount_percent, discount_flat, valid_until, max_uses, is_active)
VALUES
  ('SOUL10', 10, NULL, NULL, 100, TRUE),
  ('NUMERA500', NULL, 500, NULL, 50, TRUE)
ON CONFLICT (code) DO UPDATE SET
  discount_percent = EXCLUDED.discount_percent,
  discount_flat = EXCLUDED.discount_flat,
  valid_until = EXCLUDED.valid_until,
  max_uses = EXCLUDED.max_uses,
  is_active = EXCLUDED.is_active;
