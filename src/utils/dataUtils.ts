import { Appliance, EnergyEntry, Notification } from '../types';

export const getRandomPower = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

export const calculateTotalUsage = (appliances: Appliance[]): number => {
  return appliances.reduce((sum, appliance) => {
    return (
      sum +
      appliance.history.reduce((acc, entry) => acc + entry.energy_kwh, 0)
    );
  }, 0);
};

export const generateHistoryEntry = (currentPower_kw: number): EnergyEntry => {
  // Calculate energy used in 15 minutes (0.25 hours)
  const energy_kwh = currentPower_kw * 0.25;
  return {
    timestamp: new Date(),
    energy_kwh,
    power_kw: currentPower_kw
  };
};

export const limitHistoryData = (history: EnergyEntry[], hoursToKeep: number = 24): EnergyEntry[] => {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - hoursToKeep);
  
  return history.filter(entry => entry.timestamp > cutoffTime);
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const formatPower = (power: number): string => {
  return power.toFixed(2);
};

export const formatEnergy = (energy: number): string => {
  return energy.toFixed(2);
};

export const calculateCost = (energy: number, rate: number): number => {
  return energy * rate;
};

export const calculateCarbonFootprint = (energy: number): number => {
  // Average carbon intensity: 0.85 kg CO2 per kWh
  return energy * 0.85;
};

export const getEnergyTrend = (history: EnergyEntry[]): 'increasing' | 'decreasing' | 'stable' => {
  if (history.length < 2) return 'stable';
  
  const sortedHistory = [...history].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  const firstHalf = sortedHistory.slice(0, Math.floor(sortedHistory.length / 2));
  const secondHalf = sortedHistory.slice(Math.floor(sortedHistory.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.energy_kwh, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.energy_kwh, 0) / secondHalf.length;
  
  const percentChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  
  if (percentChange > 5) return 'increasing';
  if (percentChange < -5) return 'decreasing';
  return 'stable';
};

export const getPeakUsageTime = (history: EnergyEntry[]): string => {
  if (history.length === 0) return 'N/A';
  
  const peakEntry = history.reduce((max, entry) => 
    entry.energy_kwh > max.energy_kwh ? entry : max, history[0]);
  
  return formatTime(peakEntry.timestamp);
};

export const formatRelativeTime = (timestamp: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return timestamp.toLocaleDateString();
  }
};

export const generateNotificationId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000);
};

export const createNotification = (title: string, message: string, type: 'warning' | 'alert' | 'info' | 'success'): Notification => {
  return {
    id: generateNotificationId(),
    title,
    message,
    time: formatRelativeTime(new Date()),
    timestamp: new Date(),
    type,
    isRead: false
  };
};