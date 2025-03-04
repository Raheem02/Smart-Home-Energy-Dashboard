export interface Appliance {
  id: number;
  name: string;
  icon: string;
  currentPower_kw: number;
  history: EnergyEntry[];
  isOn?: boolean;
  isSmartDevice?: boolean;
  category?: string;
  location?: string;
  dailyUsage?: number;
  monthlyUsage?: number;
}

export interface EnergyEntry {
  timestamp: Date;
  energy_kwh: number;
  power_kw?: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  timestamp: Date;
  type: 'warning' | 'alert' | 'info' | 'success';
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}