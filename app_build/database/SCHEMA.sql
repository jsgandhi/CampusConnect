-- CampusConnect Relational Schema Blueprint (SCHEMA.sql)
-- Note: This SQL file serves as technical documentation for database design & entity modeling.
-- In the app_build MVP, in-memory JavaScript data arrays mirror this exact table schema.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'STUDENT_GOV', 'IT_DIRECTOR', 'ADMIN')),
    avatar_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    credits INT NOT NULL DEFAULT 3,
    instructor VARCHAR(255) NOT NULL,
    schedule VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    capacity INT NOT NULL DEFAULT 30,
    enrolled_count INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'ENROLLED',
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    event_date VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_by_role VARCHAR(50) NOT NULL,
    organizer_email VARCHAR(255) NOT NULL,
    rsvp_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS event_rsvps (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    rsvp_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    UNIQUE(event_id, user_email)
);

CREATE TABLE IF NOT EXISTS clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    meeting_schedule VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    member_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS club_memberships (
    id SERIAL PRIMARY KEY,
    club_id INT REFERENCES clubs(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'MEMBER',
    UNIQUE(club_id, user_email)
);

CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    advisor_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    appointment_date VARCHAR(50) NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    notes TEXT,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    ferpa_status VARCHAR(50) DEFAULT 'COMPLIANT'
);

CREATE TABLE IF NOT EXISTS policy_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    last_updated DATE DEFAULT CURRENT_DATE
);
