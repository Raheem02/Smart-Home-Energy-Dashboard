import React, { useState } from 'react';
import { Appliance } from '../types';
import ApplianceCard from './ApplianceCard';
import Alert from './Alert';
import WeatherWidget from './WeatherWidget';
import EnergyTips from './EnergyTips';
import { formatEnergy } from '../utils/dataUtils';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Zap, 
  BarChart3, 
  Home, 
  Sun, 
  Moon, 
  Bell, 
  Calendar, 
  Lightbulb,
  Droplets,
  Flame,
  Wind,
  Plus
} from 'lucide-react';

interface DashboardProps {
  appliances: Appliance[];
  totalUsage: number;
  budget: number | null;
  alert: boolean;
  onSelectAppliance: (id: number) => void;
  onOpenBudgetSettings: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onOpenNotifications: () => void;
  onOpenEnergyReport: () => void;
  onToggleApplianceState: (id: number, isOn: boolean) => void;
  onAddDevice: () => void;
  notificationCount?: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  appliances,
  totalUsage,
  budget,
  alert,
  onSelectAppliance,
  onOpenBudgetSettings,
  onToggleTheme,
  isDarkMode,
  onOpenNotifications,
  onOpenEnergyReport,
  onToggleApplianceState,
  onAddDevice,
  notificationCount = 0
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Calculate usage percentage if budget exists
  const usagePercentage = budget ? (totalUsage / budget) * 100 : 0;
  
  // Get color based on usage percentage
  const getUsageColor = (percentage: number) => {
    if (percentage < 70) return 'from-green-400 to-green-600';
    if (percentage < 90) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  // Filter appliances based on active tab and filter
  const filteredAppliances = appliances.filter(appliance => {
    // Filter by power usage
    if (activeTab === 'all') {
      // No power filter
    } else if (activeTab === 'high' && appliance.currentPower_kw < 0.8) {
      return false;
    } else if (activeTab === 'medium' && (appliance.currentPower_kw < 0.3 || appliance.currentPower_kw >= 0.8)) {
      return false;
    } else if (activeTab === 'low' && appliance.currentPower_kw >= 0.3) {
      return false;
    }
    
    // Filter by category or location
    if (activeFilter === 'all') {
      return true;
    } else if (activeFilter === 'smart' && !appliance.isSmartDevice) {
      return false;
    } else if (activeFilter === 'regular' && appliance.isSmartDevice) {
      return false;
    } else if (appliance.category !== activeFilter && appliance.location !== activeFilter) {
      return false;
    }
    
    return true;
  });

  // Calculate energy distribution by category
  const energyByCategory = {
    lighting: appliances.filter(a => a.category === 'lighting').reduce((sum, a) => sum + a.currentPower_kw, 0),
    heating: appliances.filter(a => a.category === 'heating').reduce((sum, a) => sum + a.currentPower_kw, 0),
    cooling: appliances.filter(a => a.category === 'cooling').reduce((sum, a) => sum + a.currentPower_kw, 0),
    kitchen: appliances.filter(a => a.category === 'kitchen').reduce((sum, a) => sum + a.currentPower_kw, 0),
    other: appliances.filter(a => !['lighting', 'heating', 'cooling', 'kitchen'].includes(a.category || '')).reduce((sum, a) => sum + a.currentPower_kw, 0)
  };

  // Calculate total current power
  const totalCurrentPower = appliances.reduce((sum, a) => sum + a.currentPower_kw, 0);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'lighting': return <Lightbulb className="w-4 h-4" />;
      case 'heating': return <Flame className="w-4 h-4" />;
      case 'cooling': return <Wind className="w-4 h-4" />;
      case 'kitchen': return <Droplets className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  // Get unique categories and locations for filtering
  const categories = [...new Set(appliances.map(a => a.category))].filter(Boolean) as string[];
  const locations = [...new Set(appliances.map(a => a.location))].filter(Boolean) as string[];
  
  // All filter options
  const filterOptions = [
    { id: 'all', name: 'All Devices' },
    { id: 'smart', name: 'Smart Devices' },
    { id: 'regular', name: 'Regular Devices' },
    ...categories.map(cat => ({ id: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) })),
    ...locations.map(loc => ({ id: loc, name: loc }))
  ];
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gradient-to-br from-slate-900 to-slate-800' : 'animated-bg'} py-8 px-4 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-blue-700 to-indigo-700' : 'bg-gradient-to-br from-blue-600 to-indigo-600'} p-3 rounded-lg mr-4 animate-glow`}>
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 ${isDarkMode ? 'dark:from-blue-400 dark:to-indigo-400' : ''}`}>
                Smart Home Energy Dashboard
              </h1>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Monitor and optimize your home's energy consumption</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-white/80 backdrop-blur-sm text-gray-700 shadow-md'} hover:bg-opacity-80 transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative">
              <button
                onClick={onOpenNotifications}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-white/80 backdrop-blur-sm text-gray-700 shadow-md'} hover:bg-opacity-80 transition-colors`}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="notification-badge">{notificationCount > 9 ? '9+' : notificationCount}</span>
                )}
              </button>
            </div>
            
            <button
              onClick={onOpenEnergyReport}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-slate-800 text-gray-300' : 'bg-white/80 backdrop-blur-sm text-gray-700 shadow-md'} hover:bg-opacity-80 transition-colors`}
            >
              <Calendar className="w-5 h-5" />
            </button>
            
            <button
              onClick={onOpenBudgetSettings}
              className={`flex items-center px-5 py-2.5 ${isDarkMode ? 'bg-gradient-to-r from-blue-700 to-indigo-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <Settings className="w-5 h-5 mr-2" />
              {budget ? 'Update Budget' : 'Set Budget'}
            </button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Energy Summary Card */}
          <motion.div 
            className={`${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700' : 'bg-white/90 backdrop-blur-sm'} rounded-2xl shadow-xl p-6 col-span-1 lg:col-span-2 overflow-hidden relative energy-wave`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center`}>
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  Energy Summary
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className={`${isDarkMode ? 'bg-slate-700/50 backdrop-blur-sm' : 'bg-blue-50/80 backdrop-blur-sm'} p-4 rounded-xl`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Total Usage</p>
                    <div className="flex items-center">
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{formatEnergy(totalUsage)}</p>
                      <p className={`ml-1 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>kWh</p>
                    </div>
                  </div>
                  {budget && (
                    <div className={`${isDarkMode ? 'bg-slate-700/50 backdrop-blur-sm' : 'bg-indigo-50/80 backdrop-blur-sm'} p-4 rounded-xl`}>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Daily Budget</p>
                      <div className="flex items-center">
                        <p className={`text-3xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{formatEnergy(budget)}</p>
                        <p className={`ml-1 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>kWh</p>
                      </div>
                    </div>
                  )}
                  <div className={`${isDarkMode ? 'bg-slate-700/50 backdrop-blur-sm' : 'bg-green-50/80 backdrop-blur-sm'} p-4 rounded-xl`}>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Current Power</p>
                    <div className="flex items-center">
                      <p className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{totalCurrentPower.toFixed(2)}</p>
                      <p className={`ml-1 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>kW</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {budget && (
                <div className="flex flex-col items-center">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>Budget Usage</p>
                  <div className="circular-progress">
                    <div 
                      className="progress-value flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${usagePercentage < 70 ? '#10B981' : usagePercentage < 90 ? '#F59E0B' : '#EF4444'} ${usagePercentage * 3.6}deg, ${isDarkMode ? '#1e293b' : '#f3f4f6'} 0deg)`
                      }}
                    >
                      <span className={isDarkMode ? 'text-white' : ''}>{Math.round(usagePercentage)}%</span>
                    </div>
                  </div>
                  <div className="w-full mt-4">
                    <div className={`w-full h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${getUsageColor(usagePercentage)}`}
                        style={{ width: `${Math.min(usagePercentage, 100)}%`, transition: 'width 1s ease-in-out' }}
                      ></div>
                    </div>
                    <div className={`flex justify-between text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Energy distribution by category */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>Energy Distribution by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(energyByCategory).map(([category, power]) => (
                  <div key={category} className={`${isDarkMode ? 'bg-slate-700/50 backdrop-blur-sm' : 'bg-gray-50/80 backdrop-blur-sm'} p-2 rounded-lg`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <div className={`p-1 rounded-md ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} mr-1`}>
                          {getCategoryIcon(category)}
                        </div>
                        <span className={`text-xs capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{category}</span>
                      </div>
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {((power / totalCurrentPower) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className={`w-full h-1.5 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: `${(power / totalCurrentPower) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Weather Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <WeatherWidget isDarkMode={isDarkMode} />
          </motion.div>
        </div>
        
        {/* Alerts */}
        {alert && budget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Alert 
              message={
                usagePercentage >= 100
                  ? `Warning: You have exceeded your daily energy budget of ${formatEnergy(budget)} kWh!`
                  : `Warning: You are approaching your daily energy budget of ${formatEnergy(budget)} kWh!`
              }
              type={usagePercentage >= 100 ? 'danger' : 'warning'}
              isDarkMode={isDarkMode}
            />
          </motion.div>
        )}
        
        {/* Energy Tips */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <EnergyTips isDarkMode={isDarkMode} />
        </motion.div>
        
        {/* Appliances Grid */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex items-center mb-4 sm:mb-0">
              <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Appliance Energy Monitoring
              </h2>
            </div>
            
            <button
              onClick={onAddDevice}
              className={`flex items-center px-4 py-2 ${isDarkMode ? 'bg-gradient-to-r from-green-700 to-emerald-700' : 'bg-gradient-to-r from-green-600 to-emerald-600'} text-white rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Device
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  activeFilter === option.id 
                    ? isDarkMode ? 'bg-blue-900 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-300' 
                    : isDarkMode ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-transparent' : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-transparent shadow-sm'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
          
          <div className={`flex space-x-2 p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white/80 backdrop-blur-sm shadow-sm'} mb-6`}>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                activeTab === 'all' 
                  ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-gray-800 shadow-sm' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('high')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                activeTab === 'high' 
                  ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-gray-800 shadow-sm' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></div>
              High
            </button>
            <button
              onClick={() => setActiveTab('medium')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                activeTab === 'medium' 
                  ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-gray-800 shadow-sm' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5"></div>
              Medium
            </button>
            <button
              onClick={() => setActiveTab('low')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                activeTab === 'low' 
                  ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-white text-gray-800 shadow-sm' 
                  : isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
              Low
            </button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppliances.length > 0 ? (
            filteredAppliances.map((appliance, index) => (
              <motion.div
                key={appliance.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <ApplianceCard
                  appliance={appliance}
                  onClick={() => onSelectAppliance(appliance.id)}
                  onToggle={(isOn) => onToggleApplianceState(appliance.id, isOn)}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            ))
          ) : (
            <div className={`col-span-3 p-8 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-white/80 backdrop-blur-sm'} text-center`}>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No devices match your current filters.</p>
              <button
                onClick={() => {
                  setActiveTab('all');
                  setActiveFilter('all');
                }}
                className={`mt-4 px-4 py-2 ${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white rounded-lg`}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>Data updates every 5 seconds • Click on any appliance to view detailed energy history</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
