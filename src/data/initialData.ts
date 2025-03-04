import { Appliance, Notification } from '../types';
import { getRandomPower } from '../utils/dataUtils';

export const initialAppliances: Appliance[] = [
  { 
    id: 1, 
    name: "Refrigerator", 
    icon: "Refrigerator", 
    currentPower_kw: getRandomPower(0.1, 0.5), 
    history: [],
    isOn: true,
    isSmartDevice: true,
    category: "kitchen",
    location: "Kitchen",
    dailyUsage: 2.4,
    monthlyUsage: 72.0
  },
  { 
    id: 2, 
    name: "Television", 
    icon: "Tv", 
    currentPower_kw: getRandomPower(0.05, 0.3), 
    history: [],
    isOn: true,
    isSmartDevice: true,
    category: "entertainment",
    location: "Living Room",
    dailyUsage: 1.2,
    monthlyUsage: 36.0
  },
  { 
    id: 3, 
    name: "Heater", 
    icon: "Flame", 
    currentPower_kw: getRandomPower(0.5, 1.5), 
    history: [],
    isOn: true,
    isSmartDevice: false,
    category: "heating",
    location: "Living Room",
    dailyUsage: 8.0,
    monthlyUsage: 240.0
  },
  { 
    id: 4, 
    name: "Washing Machine", 
    icon: "Shirt", 
    currentPower_kw: getRandomPower(0.4, 1.2), 
    history: [],
    isOn: false,
    isSmartDevice: true,
    category: "laundry",
    location: "Utility Room",
    dailyUsage: 1.8,
    monthlyUsage: 54.0
  },
  { 
    id: 5, 
    name: "Dishwasher", 
    icon: "Utensils", 
    currentPower_kw: getRandomPower(0.3, 1.0), 
    history: [],
    isOn: false,
    isSmartDevice: true,
    category: "kitchen",
    location: "Kitchen",
    dailyUsage: 1.5,
    monthlyUsage: 45.0
  },
  { 
    id: 6, 
    name: "Air Conditioner", 
    icon: "Fan", 
    currentPower_kw: getRandomPower(0.8, 2.0), 
    history: [],
    isOn: true,
    isSmartDevice: true,
    category: "cooling",
    location: "Bedroom",
    dailyUsage: 6.0,
    monthlyUsage: 180.0
  },
  { 
    id: 7, 
    name: "Microwave Oven", 
    icon: "Utensils", 
    currentPower_kw: getRandomPower(0.7, 1.2), 
    history: [],
    isOn: false,
    isSmartDevice: false,
    category: "kitchen",
    location: "Kitchen",
    dailyUsage: 0.8,
    monthlyUsage: 24.0
  },
  { 
    id: 8, 
    name: "Water Pump", 
    icon: "Droplets", 
    currentPower_kw: getRandomPower(0.3, 0.8), 
    history: [],
    isOn: true,
    isSmartDevice: false,
    category: "utility",
    location: "Basement",
    dailyUsage: 2.0,
    monthlyUsage: 60.0
  },
  { 
    id: 9, 
    name: "Living Room Lights", 
    icon: "Lightbulb", 
    currentPower_kw: getRandomPower(0.05, 0.2), 
    history: [],
    isOn: true,
    isSmartDevice: true,
    category: "lighting",
    location: "Living Room",
    dailyUsage: 1.0,
    monthlyUsage: 30.0
  }
];

export const monthlyEnergyData = [
  { month: 'Jan', usage: 450, cost: 112.5, previousYearUsage: 480 },
  { month: 'Feb', usage: 420, cost: 105.0, previousYearUsage: 460 },
  { month: 'Mar', usage: 380, cost: 95.0, previousYearUsage: 430 },
  { month: 'Apr', usage: 350, cost: 87.5, previousYearUsage: 390 },
  { month: 'May', usage: 320, cost: 80.0, previousYearUsage: 350 },
  { month: 'Jun', usage: 380, cost: 95.0, previousYearUsage: 400 },
  { month: 'Jul', usage: 450, cost: 112.5, previousYearUsage: 470 },
  { month: 'Aug', usage: 480, cost: 120.0, previousYearUsage: 490 },
  { month: 'Sep', usage: 420, cost: 105.0, previousYearUsage: 430 },
  { month: 'Oct', usage: 380, cost: 95.0, previousYearUsage: 400 },
  { month: 'Nov', usage: 400, cost: 100.0, previousYearUsage: 420 },
  { month: 'Dec', usage: 460, cost: 115.0, previousYearUsage: 480 }
];

export const categoryEnergyData = [
  { name: 'Heating', value: 35, color: '#EF4444' },
  { name: 'Cooling', value: 25, color: '#3B82F6' },
  { name: 'Lighting', value: 15, color: '#F59E0B' },
  { name: 'Kitchen', value: 15, color: '#10B981' },
  { name: 'Entertainment', value: 5, color: '#8B5CF6' },
  { name: 'Other', value: 5, color: '#6B7280' }
];

export const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Energy Budget Alert",
    message: "You're approaching 90% of your daily energy budget.",
    time: "10 minutes ago",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    type: "warning",
    isRead: false,
    actionUrl: "/budget",
    actionText: "View Budget"
  },
  {
    id: 2,
    title: "Refrigerator Energy Spike",
    message: "Your refrigerator is consuming 30% more energy than usual.",
    time: "1 hour ago",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: "alert",
    isRead: false,
    actionUrl: "/appliances/1",
    actionText: "Check Appliance"
  },
  {
    id: 3,
    title: "Energy Saving Tip",
    message: "Lowering your thermostat by 1°F could save up to 3% on heating costs.",
    time: "3 hours ago",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: "info",
    isRead: true
  },
  {
    id: 4,
    title: "Monthly Report Available",
    message: "Your April energy report is now available to view.",
    time: "Yesterday",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    type: "info",
    isRead: true,
    actionUrl: "/reports",
    actionText: "View Report"
  },
  {
    id: 5,
    title: "Energy Goal Achieved",
    message: "Congratulations! You met your energy reduction goal this week.",
    time: "2 days ago",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    type: "success",
    isRead: true
  },
  {
    id: 6,
    title: "New Device Detected",
    message: "A new smart device has been detected on your network: Smart Thermostat.",
    time: "3 days ago",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: "info",
    isRead: true,
    actionUrl: "/devices/new",
    actionText: "Configure Device"
  },
  {
    id: 7,
    title: "Peak Energy Hours",
    message: "Energy rates will be higher between 4-7 PM today. Consider reducing usage during this time.",
    time: "4 hours ago",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    type: "warning",
    isRead: false
  },
  {
    id: 8,
    title: "Air Conditioner Maintenance",
    message: "Your air conditioner filter may need cleaning based on recent usage patterns.",
    time: "5 days ago",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    type: "info",
    isRead: true
  }
];