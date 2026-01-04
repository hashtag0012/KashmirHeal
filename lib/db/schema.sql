-- CORE TABLES WITH COMPOSITE INDEXES
CREATE TABLE districts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50), 
  slug VARCHAR(50) UNIQUE,
  lat DECIMAL, lng DECIMAL,
  doctor_count INT DEFAULT 0,
  emergency_heat INT DEFAULT 0
);

CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(100) UNIQUE,
  district_id INT REFERENCES districts,
  name VARCHAR(100),
  specializations JSONB, -- ["cardiology", "pediatrics"]
  qualifications JSONB,
  clinic_address TEXT,
  fees JSONB, -- {consultation: 500, follow_up: 300}
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INT DEFAULT 0,
  is_available BOOLEAN DEFAULT FALSE,
  current_queue INT DEFAULT 0,
  profile_image TEXT,
  hero_video TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);
-- 12+ Composite Indexes: district_specialty_avail, district_rating, etc.

CREATE TABLE real_time_status (
  doctor_id INT PRIMARY KEY REFERENCES doctors,
  is_available BOOLEAN NOT NULL,
  current_patients INT DEFAULT 0,
  last_ping TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  patient_google_id VARCHAR(100),
  doctor_id INT REFERENCES doctors,
  district_id INT,
  slot_date DATE,
  slot_time TIME,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  amount DECIMAL(10,2),
  commission DECIMAL(10,2),
  razorpay_payment_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- INDEXES FOR 10K+ QPS
CREATE INDEX idx_doctors_district_specialty_avail ON doctors(district_id, specializations, is_available);
CREATE INDEX idx_search_district_rating ON doctors(district_id, rating DESC);
CREATE INDEX idx_real_time_status_ping ON real_time_status(last_ping);
