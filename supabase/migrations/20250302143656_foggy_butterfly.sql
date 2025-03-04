-- Create appliances table
CREATE TABLE IF NOT EXISTS appliances (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(255) NOT NULL,
    current_power_kw DOUBLE PRECISION NOT NULL DEFAULT 0
);

-- Create energy_entries table
CREATE TABLE IF NOT EXISTS energy_entries (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    energy_kwh DOUBLE PRECISION NOT NULL,
    appliance_id BIGINT NOT NULL,
    FOREIGN KEY (appliance_id) REFERENCES appliances(id) ON DELETE CASCADE
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    daily_budget_kwh DOUBLE PRECISION NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    UNIQUE (user_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_energy_entries_timestamp ON energy_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_energy_entries_appliance ON energy_entries(appliance_id);