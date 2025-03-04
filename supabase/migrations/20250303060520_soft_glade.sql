-- Initial data for appliances
INSERT INTO appliances (id, name, icon, current_power_kw) VALUES (1, 'Refrigerator', 'Refrigerator', 0.3);
INSERT INTO appliances (id, name, icon, current_power_kw) VALUES (2, 'Television', 'Tv', 0.2);
INSERT INTO appliances (id, name, icon, current_power_kw) VALUES (3, 'Heater', 'Flame', 1.0);
INSERT INTO appliances (id, name, icon, current_power_kw) VALUES (4, 'Washing Machine', 'Shirt', 0.8);
INSERT INTO appliances (id, name, icon, current_power_kw) VALUES (5, 'Dishwasher', 'Utensils', 0.6);
INSERT INTO appliances (id, name, icon, current_power_kw) VALUES (6, 'Air Conditioner', 'Fan', 1.2);

-- Initial budget for default user
INSERT INTO budgets (id, daily_budget_kwh, user_id) VALUES (1, 20.0, 'default');

-- Sample energy entries for the last 24 hours
-- Refrigerator entries
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '24 HOUR', 0.075, 1);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '20 HOUR', 0.08, 1);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '16 HOUR', 0.07, 1);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '12 HOUR', 0.075, 1);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '8 HOUR', 0.08, 1);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '4 HOUR', 0.075, 1);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP, 0.075, 1);

-- Television entries
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '12 HOUR', 0.05, 2);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '8 HOUR', 0.05, 2);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '4 HOUR', 0.05, 2);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP, 0.05, 2);

-- Heater entries
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '24 HOUR', 0.25, 3);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '20 HOUR', 0.25, 3);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '16 HOUR', 0.25, 3);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '12 HOUR', 0.25, 3);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '8 HOUR', 0.25, 3);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP - INTERVAL '4 HOUR', 0.25, 3);
INSERT INTO energy_entries (timestamp, energy_kwh, appliance_id) 
VALUES (CURRENT_TIMESTAMP, 0.25, 3);