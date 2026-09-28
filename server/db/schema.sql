CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  role VARCHAR NOT NULL CHECK (role IN ('ADMIN', 'INSPECTOR', 'MAINTENANCE', 'VIEWER')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY,
  asset_code VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('ROAD', 'BRIDGE', 'BUILDING')),
  status VARCHAR NOT NULL CHECK (status IN ('PLANNED', 'UNDER_CONSTRUCTION', 'OPERATIONAL', 'MAINTENANCE', 'RETIRED')),
  parent_asset_id UUID NULL REFERENCES assets(id),
  location_lat DECIMAL NOT NULL,
  location_lng DECIMAL NOT NULL,
  address TEXT NULL,
  owner VARCHAR NULL,
  installation_date DATE NULL,
  expected_eol DATE NULL,
  condition_score DECIMAL NULL CHECK (condition_score BETWEEN 0 AND 100),
  criticality INT NULL CHECK (criticality BETWEEN 1 AND 5),
  description TEXT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES assets(id),
  inspector_id UUID NOT NULL REFERENCES users(id),
  inspection_date TIMESTAMP NOT NULL DEFAULT NOW(),
  condition_score DECIMAL NOT NULL CHECK (condition_score BETWEEN 0 AND 100),
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS defects (
  id UUID PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES assets(id),
  inspection_id UUID NOT NULL REFERENCES inspections(id),
  type VARCHAR NOT NULL,
  severity VARCHAR NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  description TEXT NULL,
  status VARCHAR NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')),
  photo_url TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS maintenance (
  id UUID PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES assets(id),
  defect_id UUID NULL REFERENCES defects(id),
  title VARCHAR NOT NULL,
  description TEXT NULL,
  priority VARCHAR NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status VARCHAR NOT NULL CHECK (status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED')),
  assigned_to UUID NULL REFERENCES users(id),
  estimated_cost DECIMAL NULL,
  actual_cost DECIMAL NULL,
  scheduled_date DATE NULL,
  completed_date DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lifecycle_events (
  id UUID PRIMARY KEY,
  asset_id UUID NOT NULL REFERENCES assets(id),
  from_status VARCHAR NULL,
  to_status VARCHAR NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  reason TEXT NULL,
  event_time TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_asset_code ON assets(asset_code);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_condition_score ON assets(condition_score);
CREATE INDEX IF NOT EXISTS idx_assets_parent_asset_id ON assets(parent_asset_id);
CREATE INDEX IF NOT EXISTS idx_inspections_asset_id ON inspections(asset_id);
CREATE INDEX IF NOT EXISTS idx_defects_asset_id ON defects(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_asset_id ON maintenance(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance(status);
CREATE INDEX IF NOT EXISTS idx_lifecycle_events_asset_id ON lifecycle_events(asset_id);