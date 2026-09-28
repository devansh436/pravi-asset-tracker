INSERT INTO users (id, name, email, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Admin', 'admin@example.com', 'ADMIN'),
  ('00000000-0000-0000-0000-000000000002', 'Demo Inspector', 'inspector@example.com', 'INSPECTOR'),
  ('00000000-0000-0000-0000-000000000003', 'Demo Maintenance', 'maintenance@example.com', 'MAINTENANCE'),
  ('00000000-0000-0000-0000-000000000004', 'Demo Viewer', 'viewer@example.com', 'VIEWER')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role;

INSERT INTO assets (id, asset_code, name, type, status, location_lat, location_lng, address, owner, installation_date, expected_eol, condition_score, criticality, description)
VALUES
  ('00000000-0000-0000-0000-000000000101', 'RD-DEL-001', 'Ring Road North', 'ROAD', 'OPERATIONAL', 28.7041, 77.1025, 'Outer Ring Road, Delhi', 'Delhi PWD', '2017-04-12', '2027-06-30', 88, 4, 'North arterial corridor'),
  ('00000000-0000-0000-0000-000000000102', 'RD-MUM-002', 'Harbour Link Road', 'ROAD', 'MAINTENANCE', 19.0176, 72.8562, 'Eastern Freeway, Mumbai', 'MSRDC', '2015-09-18', '2026-12-31', 35, 5, 'High-volume coastal connector'),
  ('00000000-0000-0000-0000-000000000103', 'RD-BLR-003', 'Airport Access Road', 'ROAD', 'UNDER_CONSTRUCTION', 13.1986, 77.7066, 'Kempegowda Airport Road, Bengaluru', 'BBMP', '2025-02-10', '2035-02-10', 70, 3, 'Airport expansion corridor'),
  ('00000000-0000-0000-0000-000000000104', 'RD-KOL-004', 'Old Canal Road', 'ROAD', 'RETIRED', 22.5726, 88.3639, 'Canal South Road, Kolkata', 'KMC', '1998-06-01', '2025-01-01', 20, 2, 'Superseded local road'),
  ('00000000-0000-0000-0000-000000000105', 'RD-HYD-005', 'Outer Ring Road East', 'ROAD', 'OPERATIONAL', 17.3850, 78.4867, 'ORR East, Hyderabad', 'HMDA', '2018-08-22', '2026-11-30', 45, 4, 'Eastern ring road section'),
  ('00000000-0000-0000-0000-000000000106', 'RD-PUN-006', 'University Avenue', 'ROAD', 'OPERATIONAL', 18.5204, 73.8567, 'University Circle, Pune', 'PMC', '2020-01-15', NULL, 92, 3, 'Urban collector road'),
  ('00000000-0000-0000-0000-000000000201', 'BR-AHM-001', 'Sabarmati River Bridge', 'BRIDGE', 'OPERATIONAL', 23.0225, 72.5714, 'Sabarmati Riverfront, Ahmedabad', 'AMC', '2016-11-20', '2028-11-20', 76, 5, 'Primary river crossing'),
  ('00000000-0000-0000-0000-000000000202', 'BR-CHN-002', 'Adyar Bridge', 'BRIDGE', 'OPERATIONAL', 13.0827, 80.2707, 'Adyar River, Chennai', 'GCC', '2014-03-11', '2026-10-15', 28, 5, 'Flood-prone bridge approach'),
  ('00000000-0000-0000-0000-000000000203', 'BR-JAI-003', 'Mansarovar Flyover', 'BRIDGE', 'OPERATIONAL', 26.9124, 75.7873, 'Mansarovar, Jaipur', 'JDA', '2019-07-09', '2030-07-09', 81, 4, 'Elevated urban crossing'),
  ('00000000-0000-0000-0000-000000000204', 'BR-LKO-004', 'Gomti Bypass Bridge', 'BRIDGE', 'UNDER_CONSTRUCTION', 26.8467, 80.9462, 'Gomti Nagar, Lucknow', 'LDA', '2025-05-19', '2035-05-19', 60, 3, 'New bypass crossing'),
  ('00000000-0000-0000-0000-000000000205', 'BR-KOC-005', 'Vembanad Rail Overpass', 'BRIDGE', 'OPERATIONAL', 9.9312, 76.2673, 'Kochi Port Road, Kochi', 'KMRL', '2017-12-03', '2027-12-03', 39, 5, 'Port access overpass'),
  ('00000000-0000-0000-0000-000000000301', 'BLD-BBS-001', 'Civic Operations Centre', 'BUILDING', 'OPERATIONAL', 20.2961, 85.8245, 'Janpath, Bhubaneswar', 'BMC', '2013-10-14', '2027-10-14', 67, 5, 'Municipal operations centre'),
  ('00000000-0000-0000-0000-000000000302', 'BLD-NOI-002', 'Sector 18 Service Hub', 'BUILDING', 'OPERATIONAL', 28.5706, 77.3219, 'Sector 18, Noida', 'NOIDA Authority', '2021-03-08', '2031-03-08', 90, 4, 'Public service facility'),
  ('00000000-0000-0000-0000-000000000303', 'BLD-JOD-003', 'Heritage Archive', 'BUILDING', 'OPERATIONAL', 26.2389, 73.0243, 'Old City, Jodhpur', 'Jodhpur Municipal Corp', '2008-05-27', '2026-09-30', 33, 4, 'Protected archive building'),
  ('00000000-0000-0000-0000-000000000304', 'BLD-VAR-004', 'Old Depot Building', 'BUILDING', 'RETIRED', 25.3176, 82.9739, 'Cantt Road, Varanasi', 'VMC', '1989-02-16', '2024-12-31', 18, 2, 'Decommissioned depot'),
  ('00000000-0000-0000-0000-000000000305', 'BLD-SUR-005', 'West Ward Library', 'BUILDING', 'OPERATIONAL', 21.1702, 72.8311, 'Adajan, Surat', 'SMC', '2016-01-21', '2028-01-21', 52, 3, 'Community library'),
  ('00000000-0000-0000-0000-000000000306', 'BLD-GUW-006', 'Emergency Response Centre', 'BUILDING', 'OPERATIONAL', 26.1445, 91.7362, 'Dispur, Guwahati', 'GMC', '2022-06-12', '2032-06-12', 84, 5, 'Regional emergency response centre')
ON CONFLICT (asset_code) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, status = EXCLUDED.status, location_lat = EXCLUDED.location_lat, location_lng = EXCLUDED.location_lng, address = EXCLUDED.address, owner = EXCLUDED.owner, installation_date = EXCLUDED.installation_date, expected_eol = EXCLUDED.expected_eol, condition_score = EXCLUDED.condition_score, criticality = EXCLUDED.criticality, description = EXCLUDED.description, updated_at = NOW();

INSERT INTO inspections (id, asset_id, inspector_id, inspection_date, condition_score, notes)
SELECT md5(id::text)::uuid, id, '00000000-0000-0000-0000-000000000002', CURRENT_TIMESTAMP - (row_number() OVER (ORDER BY asset_code) || ' days')::interval, condition_score, 'Seeded baseline inspection'
FROM assets
WHERE asset_code LIKE 'RD-%' OR asset_code LIKE 'BR-%' OR asset_code LIKE 'BLD-%'
ON CONFLICT (id) DO UPDATE SET condition_score = EXCLUDED.condition_score, notes = EXCLUDED.notes;

INSERT INTO defects (id, asset_id, inspection_id, type, severity, description, status, resolved_at)
VALUES
  ('00000000-0000-0000-0000-000002000001', '00000000-0000-0000-0000-000000000102', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000102' ORDER BY inspection_date DESC LIMIT 1), 'PAVEMENT', 'HIGH', 'Longitudinal cracking on eastbound lane', 'OPEN', NULL),
  ('00000000-0000-0000-0000-000002000002', '00000000-0000-0000-0000-000000000202', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000202' ORDER BY inspection_date DESC LIMIT 1), 'CONCRETE', 'CRITICAL', 'Pier scour and exposed reinforcement', 'IN_PROGRESS', NULL),
  ('00000000-0000-0000-0000-000002000003', '00000000-0000-0000-0000-000000000105', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000105' ORDER BY inspection_date DESC LIMIT 1), 'DRAINAGE', 'MEDIUM', 'Blocked shoulder drain', 'OPEN', NULL),
  ('00000000-0000-0000-0000-000002000004', '00000000-0000-0000-0000-000000000303', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000303' ORDER BY inspection_date DESC LIMIT 1), 'MOISTURE', 'HIGH', 'Water ingress in archive storage', 'RESOLVED', CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000002000005', '00000000-0000-0000-0000-000000000205', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000205' ORDER BY inspection_date DESC LIMIT 1), 'JOINT', 'MEDIUM', 'Expansion joint movement above tolerance', 'RESOLVED', CURRENT_TIMESTAMP),
  ('00000000-0000-0000-0000-000002000006', '00000000-0000-0000-0000-000000000301', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000301' ORDER BY inspection_date DESC LIMIT 1), 'HVAC', 'LOW', 'Air handling filter replacement due', 'OPEN', NULL),
  ('00000000-0000-0000-0000-000002000007', '00000000-0000-0000-0000-000000000201', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000201' ORDER BY inspection_date DESC LIMIT 1), 'BEARING', 'MEDIUM', 'Bearing lubrication overdue', 'IN_PROGRESS', NULL),
  ('00000000-0000-0000-0000-000002000008', '00000000-0000-0000-0000-000000000106', (SELECT id FROM inspections WHERE asset_id = '00000000-0000-0000-0000-000000000106' ORDER BY inspection_date DESC LIMIT 1), 'SIGNAGE', 'LOW', 'Faded lane marker signage', 'OPEN', NULL)
ON CONFLICT (id) DO UPDATE SET severity = EXCLUDED.severity, description = EXCLUDED.description, status = EXCLUDED.status, resolved_at = EXCLUDED.resolved_at;

INSERT INTO maintenance (id, asset_id, defect_id, title, description, priority, status, assigned_to, estimated_cost, actual_cost, scheduled_date, completed_date)
VALUES
  ('00000000-0000-0000-0000-000003000001', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000002000001', 'Resurface harbour link', 'Mill and overlay damaged lane', 'HIGH', 'IN_PROGRESS', '00000000-0000-0000-0000-000000000003', 850000, NULL, CURRENT_DATE + 10, NULL),
  ('00000000-0000-0000-0000-000003000002', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000002000002', 'Repair bridge pier', 'Underwater scour protection', 'CRITICAL', 'ASSIGNED', '00000000-0000-0000-0000-000000000003', 1250000, NULL, CURRENT_DATE + 20, NULL),
  ('00000000-0000-0000-0000-000003000003', '00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000002000003', 'Clear shoulder drainage', 'Jet and inspect blocked drain', 'MEDIUM', 'OPEN', NULL, 45000, NULL, CURRENT_DATE + 30, NULL),
  ('00000000-0000-0000-0000-000003000004', '00000000-0000-0000-0000-000000000303', '00000000-0000-0000-0000-000002000004', 'Archive waterproofing', 'Seal roof and restore storage wall', 'HIGH', 'COMPLETED', '00000000-0000-0000-0000-000000000003', 180000, 165000, CURRENT_DATE - 80, CURRENT_DATE - 20),
  ('00000000-0000-0000-0000-000003000005', '00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000002000005', 'Replace expansion joint', 'Replace joint assembly at pier 2', 'MEDIUM', 'COMPLETED', '00000000-0000-0000-0000-000000000003', 275000, 260000, CURRENT_DATE - 70, CURRENT_DATE - 25),
  ('00000000-0000-0000-0000-000003000006', '00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000002000006', 'Replace HVAC filters', 'Quarterly filter replacement', 'LOW', 'OPEN', NULL, 12000, NULL, CURRENT_DATE + 40, NULL)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, status = EXCLUDED.status, assigned_to = EXCLUDED.assigned_to, estimated_cost = EXCLUDED.estimated_cost, actual_cost = EXCLUDED.actual_cost, scheduled_date = EXCLUDED.scheduled_date, completed_date = EXCLUDED.completed_date;

INSERT INTO lifecycle_events (id, asset_id, from_status, to_status, changed_by, reason, event_time)
SELECT md5(id::text || '-initial')::uuid, id, NULL, 'PLANNED', '00000000-0000-0000-0000-000000000001', 'Seeded initial lifecycle event', created_at
FROM assets
WHERE asset_code LIKE 'RD-%' OR asset_code LIKE 'BR-%' OR asset_code LIKE 'BLD-%'
ON CONFLICT (id) DO NOTHING;

INSERT INTO lifecycle_events (id, asset_id, from_status, to_status, changed_by, reason, event_time)
SELECT md5(id::text || '-current')::uuid, id, 'PLANNED', status, '00000000-0000-0000-0000-000000000001', 'Seeded current lifecycle state', updated_at
FROM assets
WHERE status <> 'PLANNED' AND (asset_code LIKE 'RD-%' OR asset_code LIKE 'BR-%' OR asset_code LIKE 'BLD-%')
ON CONFLICT (id) DO NOTHING;
