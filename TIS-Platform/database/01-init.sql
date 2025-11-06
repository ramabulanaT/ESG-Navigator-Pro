-- TIS Holdings Production Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    country VARCHAR(100),
    region VARCHAR(100),
    employee_count INTEGER,
    annual_revenue DECIMAL(15,2),
    is_jse_listed BOOLEAN DEFAULT false,
    has_global_footprint BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    organization_id UUID REFERENCES organizations(id),
    role VARCHAR(100) DEFAULT 'contact',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    overall_esg_score INTEGER,
    assessment_date DATE DEFAULT CURRENT_DATE,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    stage_name VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    probability DECIMAL(5,2),
    entered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_close_date DATE,
    stage_value DECIMAL(12,2),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS outreach_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    contact_email VARCHAR(255) NOT NULL,
    qualification_score INTEGER,
    estimated_value DECIMAL(12,2),
    outreach_type VARCHAR(50) DEFAULT 'Initial_Contact',
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'queued',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_organizations_industry ON organizations(industry);
CREATE INDEX IF NOT EXISTS idx_organizations_country ON organizations(country);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_org ON dashboard_metrics(organization_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_org ON pipeline_stages(organization_id);
CREATE INDEX IF NOT EXISTS idx_outreach_queue_org ON outreach_queue(organization_id);

INSERT INTO organizations (name, industry, country, region, employee_count, annual_revenue, is_jse_listed, has_global_footprint)
VALUES 
    ('University of Venda', 'Education', 'South Africa', 'Limpopo', 2500, 50000000, false, false),
    ('Sibanye-Stillwater', 'Mining', 'South Africa', 'Gauteng', 80000, 5200000000, true, true),
    ('Test JSE SME', 'Technology', 'South Africa', 'Western Cape', 150, 25000000, true, false)
ON CONFLICT DO NOTHING;

COMMIT;
