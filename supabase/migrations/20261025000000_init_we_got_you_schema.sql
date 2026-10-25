-- ====================================================================
-- WE GOT YOU: Database Architecture Migration
-- Initial Location: San Jose de Buenavista, Antique, Philippines
-- Target: PostgreSQL with PostGIS & Row Level Security (RLS)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. ENUM TYPES
CREATE TYPE user_role_type AS ENUM ('customer', 'provider', 'admin');

CREATE TYPE service_mode_type AS ENUM ('SHOP_VISIT', 'HOME_SERVICE', 'ROADSIDE_ASSISTANCE');

CREATE TYPE verification_status_type AS ENUM (
  'UNCLAIMED_LISTING',
  'REGISTRATION_STARTED',
  'PENDING_VERIFICATION',
  'APPROVED',
  'NEEDS_ADDITIONAL_INFO',
  'REJECTED',
  'SUSPENDED'
);

CREATE TYPE booking_status_type AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'AWAITING_PROVIDER',
  'PROVIDER_ACCEPTED',
  'AWAITING_QUOTE',
  'QUOTE_SENT',
  'QUOTE_ACCEPTED',
  'SCHEDULED',
  'IN_PROGRESS',
  'PROVIDER_MARKED_COMPLETE',
  'COMPLETED',
  'CANCELLED',
  'DECLINED',
  'EXPIRED',
  'DISPUTED'
);

CREATE TYPE dispatch_status_type AS ENUM (
  'LOOKING_FOR_PROVIDER',
  'OFFER_SENT',
  'PROVIDER_ACCEPTED',
  'ETA_PROVIDED',
  'PROVIDER_EN_ROUTE',
  'ARRIVED',
  'ASSISTANCE_IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'UNFULFILLED'
);

CREATE TYPE priority_level_type AS ENUM ('LOW', 'NORMAL', 'HIGH', 'CRITICAL');

-- 3. MUNICIPALITIES & BARANGAYS (Geographic Foundation for Antique)
CREATE TABLE municipalities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  province VARCHAR(100) NOT NULL DEFAULT 'Antique',
  postal_code VARCHAR(10) NOT NULL DEFAULT '5700',
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE barangays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  municipality_id UUID NOT NULL REFERENCES municipalities(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  location GEOGRAPHY(POINT, 4326),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(municipality_id, name)
);

-- 4. USERS & PROFILES
CREATE TABLE profiles (
  id UUID PRIMARY KEY, -- matches auth.users.id
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(25),
  avatar_url TEXT,
  preferred_municipality_id UUID REFERENCES municipalities(id),
  preferred_barangay_id UUID REFERENCES barangays(id),
  preferred_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role_type NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label VARCHAR(50) NOT NULL DEFAULT 'Home',
  street_address TEXT NOT NULL,
  municipality_id UUID NOT NULL REFERENCES municipalities(id),
  barangay_id UUID REFERENCES barangays(id),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  location GEOGRAPHY(POINT, 4326),
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICE CATEGORIES & SUBCATEGORIES
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50) NOT NULL,
  color_hex VARCHAR(10) NOT NULL DEFAULT '#2563EB',
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE service_subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROVIDERS & BUSINESS PROFILES
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  business_name VARCHAR(150) NOT NULL,
  business_type VARCHAR(50) NOT NULL DEFAULT 'INDEPENDENT_TECHNICIAN',
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  contact_phone VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255),
  street_address TEXT NOT NULL,
  municipality_id UUID NOT NULL REFERENCES municipalities(id),
  barangay_id UUID REFERENCES barangays(id),
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  verification_status verification_status_type NOT NULL DEFAULT 'UNCLAIMED_LISTING',
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_accepting_bookings BOOLEAN NOT NULL DEFAULT true,
  is_roadside_active BOOLEAN NOT NULL DEFAULT false,
  average_rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  review_count INT NOT NULL DEFAULT 0,
  callout_fee_php NUMERIC(10,2) DEFAULT 0.00,
  min_service_price_php NUMERIC(10,2) DEFAULT 0.00,
  opening_hours_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_service_modes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  mode service_mode_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider_id, mode)
);

CREATE TABLE provider_specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  subcategory_id UUID REFERENCES service_subcategories(id) ON DELETE CASCADE,
  specialty_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id),
  title VARCHAR(150) NOT NULL,
  description TEXT,
  estimated_price_min_php NUMERIC(10,2) NOT NULL,
  estimated_price_max_php NUMERIC(10,2),
  requires_diagnostic BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  has_verified_identity BOOLEAN NOT NULL DEFAULT false,
  has_verified_contact BOOLEAN NOT NULL DEFAULT false,
  has_verified_business_permit BOOLEAN NOT NULL DEFAULT false,
  has_verified_credentials BOOLEAN NOT NULL DEFAULT false,
  reviewer_id UUID REFERENCES profiles(id),
  notes TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SERVICE REQUESTS & BOOKINGS
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES service_categories(id),
  service_mode service_mode_type NOT NULL,
  problem_title VARCHAR(200) NOT NULL,
  problem_description TEXT NOT NULL,
  customer_contact_phone VARCHAR(30) NOT NULL,
  street_address TEXT NOT NULL,
  municipality_id UUID NOT NULL REFERENCES municipalities(id),
  barangay_id UUID REFERENCES barangays(id),
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  location GEOGRAPHY(POINT, 4326),
  preferred_schedule TIMESTAMPTZ,
  current_status booking_status_type NOT NULL DEFAULT 'SUBMITTED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE service_request_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  scheduled_at TIMESTAMPTZ,
  status booking_status_type NOT NULL DEFAULT 'SUBMITTED',
  cancellation_reason TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  previous_status booking_status_type,
  new_status booking_status_type NOT NULL,
  changed_by UUID NOT NULL REFERENCES profiles(id),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. QUOTATIONS
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  provider_id UUID NOT NULL REFERENCES providers(id),
  total_amount_php NUMERIC(10,2) NOT NULL,
  labor_fee_php NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  parts_fee_php NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  callout_fee_php NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  valid_until TIMESTAMPTZ,
  notes TEXT,
  is_accepted BOOLEAN DEFAULT false,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quote_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  description VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price_php NUMERIC(10,2) NOT NULL,
  total_price_php NUMERIC(10,2) NOT NULL
);

-- 9. ROADSIDE ASSISTANCE & DISPATCH SYSTEM
CREATE TABLE roadside_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id),
  vehicle_type VARCHAR(50) NOT NULL, -- Motorcycle, Car, Tricycle, Van, Truck
  vehicle_model VARCHAR(100),
  issue_category VARCHAR(100) NOT NULL, -- Flat Tire, Dead Battery, Engine Stall, Towing
  description TEXT NOT NULL,
  contact_phone VARCHAR(30) NOT NULL,
  pickup_address TEXT NOT NULL,
  latitude NUMERIC(9,6) NOT NULL,
  longitude NUMERIC(9,6) NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  assigned_provider_id UUID REFERENCES providers(id),
  dispatch_status dispatch_status_type NOT NULL DEFAULT 'LOOKING_FOR_PROVIDER',
  eta_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE dispatch_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadside_request_id UUID NOT NULL REFERENCES roadside_requests(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  offer_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, DECLINED, EXPIRED
  offered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- 10. REAL-TIME COMMUNICATION
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  roadside_request_id UUID REFERENCES roadside_requests(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  body TEXT NOT NULL,
  target_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TRUST & SAFETY (Authentic Reviews & Disputes)
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  overall_rating INT NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  rating_quality INT CHECK (rating_quality >= 1 AND rating_quality <= 5),
  rating_professionalism INT CHECK (rating_professionalism >= 1 AND rating_professionalism <= 5),
  rating_communication INT CHECK (rating_communication >= 1 AND rating_communication <= 5),
  rating_value INT CHECK (rating_value >= 1 AND rating_value <= 5),
  rating_timeliness INT CHECK (rating_timeliness >= 1 AND rating_timeliness <= 5),
  review_text TEXT,
  image_url TEXT,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE review_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE UNIQUE,
  provider_id UUID NOT NULL REFERENCES providers(id),
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  filed_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN, UNDER_REVIEW, RESOLVED, DISMISSED
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  target_provider_id UUID REFERENCES providers(id),
  target_review_id UUID REFERENCES reviews(id),
  reason TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. RESEARCHED PROVIDER LEADS (Admin Import & Staging)
CREATE TABLE provider_leads (
  id VARCHAR(50) PRIMARY KEY,
  business_name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(150),
  services TEXT NOT NULL,
  location TEXT NOT NULL,
  barangay VARCHAR(100),
  municipality VARCHAR(100) NOT NULL DEFAULT 'San Jose de Buenavista',
  phone VARCHAR(100),
  source_type VARCHAR(100),
  evidence_strength VARCHAR(100),
  mobile_roadside_dispatch VARCHAR(50) DEFAULT 'Not established',
  outreach_status VARCHAR(50) DEFAULT 'Not contacted',
  reference_url TEXT,
  verification_notes TEXT,
  latitude NUMERIC(9,6),
  longitude NUMERIC(9,6),
  location_geo GEOGRAPHY(POINT, 4326),
  is_promoted_to_provider BOOLEAN NOT NULL DEFAULT false,
  promoted_provider_id UUID REFERENCES providers(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. SPATIAL & PERFORMANCE INDEXES
CREATE INDEX idx_providers_location ON providers USING GIST (location);
CREATE INDEX idx_municipalities_location ON municipalities USING GIST (location);
CREATE INDEX idx_barangays_location ON barangays USING GIST (location);
CREATE INDEX idx_service_requests_location ON service_requests USING GIST (location);
CREATE INDEX idx_roadside_requests_location ON roadside_requests USING GIST (location);
CREATE INDEX idx_provider_leads_location ON provider_leads USING GIST (location_geo);

CREATE INDEX idx_providers_category ON provider_specialties (category_id);
CREATE INDEX idx_providers_verification ON providers (verification_status);
CREATE INDEX idx_service_requests_customer ON service_requests (customer_id);
CREATE INDEX idx_bookings_provider ON bookings (provider_id);
CREATE INDEX idx_messages_conversation ON messages (conversation_id);
CREATE INDEX idx_reviews_provider ON reviews (provider_id);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE barangays ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_service_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadside_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_leads ENABLE ROW LEVEL SECURITY;

-- Public discovery read policies
CREATE POLICY "Public read for active municipalities" ON municipalities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for barangays" ON barangays FOR SELECT USING (true);
CREATE POLICY "Public read for active categories" ON service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for active subcategories" ON service_subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for published providers" ON providers FOR SELECT USING (is_published = true);
CREATE POLICY "Public read for provider service modes" ON provider_service_modes FOR SELECT USING (true);
CREATE POLICY "Public read for provider specialties" ON provider_specialties FOR SELECT USING (true);
CREATE POLICY "Public read for provider services" ON provider_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for unmoderated reviews" ON reviews FOR SELECT USING (is_moderated = false);
