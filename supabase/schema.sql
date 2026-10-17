-- ==============================================================================
-- AI LEAD DESK: PRODUCTION DATABASE SCHEMA (POSTGRESQL & SUPABASE)
-- Multilingual Admissions Counselling & Lead Management Platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STAFF PROFILES & ROLES
CREATE TYPE user_role AS ENUM ('Administrator', 'Admissions Counsellor', 'Prospective Student');

CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'Admissions Counsellor',
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. VERIFIED COURSES & KNOWLEDGE BASE
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    duration TEXT NOT NULL,
    fees NUMERIC(10, 2) NOT NULL CHECK (fees >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_terms TEXT NOT NULL,
    approved_discounts JSONB DEFAULT '[]'::jsonb,
    schedules TEXT[] DEFAULT '{}',
    delivery_mode VARCHAR(50) NOT NULL CHECK (delivery_mode IN ('Online', 'Classroom', 'Hybrid')),
    syllabus JSONB DEFAULT '[]'::jsonb,
    demo_details TEXT,
    placement_support TEXT,
    verified_placement_stats TEXT,
    source_reference TEXT,
    last_verified_date DATE,
    verified_by UUID REFERENCES staff_profiles(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. LEADS & STUDENT CRM
CREATE TYPE lead_source AS ENUM ('WhatsApp', 'Instagram', 'Website', 'Phone Call', 'Walk-in', 'Referral');
CREATE TYPE pipeline_stage AS ENUM (
    'New', 
    'AI Counselling', 
    'Qualified', 
    'Demo Booked', 
    'Demo Completed', 
    'Follow-up Required', 
    'Admission Confirmed', 
    'Not Interested'
);
CREATE TYPE lead_temperature AS ENUM ('Hot', 'Warm', 'Cold');

CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    raw_phone TEXT NOT NULL,
    normalized_phone VARCHAR(25) NOT NULL,
    email TEXT,
    preferred_language VARCHAR(50) DEFAULT 'English',
    education_background TEXT,
    graduation_year INT,
    study_gap_years INT DEFAULT 0,
    career_goal TEXT,
    course_interest TEXT,
    budget_range TEXT,
    preferred_schedule VARCHAR(50),
    source lead_source NOT NULL DEFAULT 'Website',
    stage pipeline_stage NOT NULL DEFAULT 'New',
    score INT NOT NULL DEFAULT 50 CHECK (score BETWEEN 0 AND 100),
    temperature lead_temperature NOT NULL DEFAULT 'Warm',
    score_breakdown JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    last_interaction TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    suggested_next_action JSONB DEFAULT '{}'::jsonb,
    follow_up_due_date TIMESTAMPTZ,
    assigned_counsellor_id UUID REFERENCES staff_profiles(id),
    communication_consent BOOLEAN NOT NULL DEFAULT TRUE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    duplicate_of_id UUID REFERENCES leads(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for normalized phone and email resolution
CREATE INDEX idx_leads_normalized_phone ON leads(normalized_phone);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_leads_assigned ON leads(assigned_counsellor_id);

-- 4. DETECTED OBJECTIONS
CREATE TABLE lead_objections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    supporting_quote TEXT NOT NULL,
    confidence INT NOT NULL CHECK (confidence BETWEEN 0 AND 100),
    suggested_response TEXT NOT NULL,
    requires_human_intervention BOOLEAN NOT NULL DEFAULT FALSE,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_objections_lead_id ON lead_objections(lead_id);

-- 5. CONVERSATIONS & CHANNELS
CREATE TYPE conversation_status AS ENUM ('ai_active', 'human_takeover', 'completed');

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL DEFAULT 'Web',
    status conversation_status NOT NULL DEFAULT 'ai_active',
    taken_over_by_id UUID REFERENCES staff_profiles(id),
    takeover_reason TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CONVERSATION MESSAGES
CREATE TYPE message_sender AS ENUM ('student', 'ai', 'counsellor', 'system');

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    sender message_sender NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'English',
    is_voice BOOLEAN NOT NULL DEFAULT FALSE,
    audio_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);

-- 7. APPOINTMENT SLOTS & CAPACITY SAFEGUARDS
CREATE TABLE appointment_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    slot_date DATE NOT NULL,
    slot_time VARCHAR(50) NOT NULL,
    counsellor_id UUID REFERENCES staff_profiles(id),
    mode VARCHAR(50) NOT NULL CHECK (mode IN ('Online', 'Offline Campus')),
    venue_or_link TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 20,
    booked_count INT NOT NULL DEFAULT 0 CHECK (booked_count <= capacity),
    status VARCHAR(50) NOT NULL DEFAULT 'Available',
    CONSTRAINT unique_counsellor_slot UNIQUE (counsellor_id, slot_date, slot_time)
);

-- 8. APPOINTMENTS (DEMO BOOKINGS)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    slot_id UUID NOT NULL REFERENCES appointment_slots(id),
    status VARCHAR(50) NOT NULL DEFAULT 'Booked' CHECK (status IN ('Booked', 'Completed', 'Cancelled', 'Rescheduled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_lead_slot_booking UNIQUE (lead_id, slot_id)
);

-- 9. FOLLOW-UP TASKS
CREATE TABLE follow_up_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reason TEXT NOT NULL,
    preferred_channel VARCHAR(50) NOT NULL DEFAULT 'WhatsApp',
    suggested_message TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('High', 'Medium', 'Low')),
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    assigned_to_id UUID REFERENCES staff_profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. ADAPTIVE APTITUDE ASSESSMENTS
CREATE TABLE aptitude_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_score INT NOT NULL CHECK (total_score BETWEEN 0 AND 100),
    dominant_aptitude TEXT NOT NULL,
    recommended_track TEXT NOT NULL,
    explanation TEXT NOT NULL,
    strengths TEXT[] DEFAULT '{}',
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    performed_by_id UUID REFERENCES staff_profiles(id),
    performed_by_name TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_objections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can view active verified courses
CREATE POLICY "Public can view verified courses" ON courses
    FOR SELECT USING (is_active = TRUE AND is_verified = TRUE);

-- Public/Student can insert lead enquiry
CREATE POLICY "Public can insert new enquiry" ON leads
    FOR INSERT WITH CHECK (TRUE);

-- Authenticated counsellors and admins can view and manage leads
CREATE POLICY "Staff can view assigned leads" ON leads
    FOR SELECT TO authenticated
    USING (
        auth.uid() = assigned_counsellor_id OR 
        EXISTS (SELECT 1 FROM staff_profiles WHERE id = auth.uid() AND role = 'Administrator')
    );

-- Only admins can verify courses
CREATE POLICY "Admins can update courses" ON courses
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM staff_profiles WHERE id = auth.uid() AND role = 'Administrator'));
