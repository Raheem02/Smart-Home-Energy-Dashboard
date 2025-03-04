import React, { useState } from 'react';
import { Appliance } from '../types';
import { formatPower } from '../utils/dataUtils';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface ApplianceCardProps {
  appliance: Appliance;
  onClick: () => void;
  onToggle: (isOn: boolean) => void;
  isDarkMode: boolean;
}

const ApplianceCard: React.FC<ApplianceCardProps> = ({ appliance, onClick, onToggle, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[appliance.icon];
  
  // Calculate power usage level for color and styles
  const getPowerLevelColor = (power: number, isOn: boolean) => {
    if (!isOn) return {
      bg: isDarkMode ? 'bg-slate-800' : 'bg-gray-100',
      border: isDarkMode ? 'border-slate-700' : 'border-gray-200',
      text: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      iconBg: isDarkMode ? 'bg-slate-700' : 'bg-gray-200',
      iconColor: isDarkMode ? 'text-gray-300' : 'text-gray-500',
      progressBg: 'from-gray-300 to-gray-400'
    };
    
    if (power < 0.3) return {
      bg: isDarkMode 
        ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30' 
        : 'bg-gradient-to-br from-green-50 to-emerald-100',
      border: isDarkMode ? 'border-green-800/50' : 'border-green-200',
      text: isDarkMode ? 'text-green-400' : 'text-green-700',
      iconBg: isDarkMode ? 'bg-green-800/50' : 'bg-green-100',
      iconColor: isDarkMode ? 'text-green-400' : 'text-green-600',
      progressBg: 'from-green-400 to-green-500'
    };
    if (power < 0.8) return {
      bg: isDarkMode 
        ? 'bg-gradient-to-br from-yellow-900/30 to-amber-900/30' 
        : 'bg-gradient-to-br from-yellow-50 to-amber-100',
      border: isDarkMode ? 'border-yellow-800/50' : 'border-yellow-200',
      text: isDarkMode ? 'text-yellow-400' : 'text-yellow-700',
      iconBg: isDarkMode ? 'bg-yellow-800/50' : 'bg-yellow-100',
      iconColor: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
      progressBg: 'from-yellow-400 to-yellow-500'
    };
    return {
      bg: isDarkMode 
        ? 'bg-gradient-to-br from-red-900/30 to-rose-900/30' 
        : 'bg-gradient-to-br from-red-50 to-rose-100',
      border: isDarkMode ? 'border-red-800/50' : 'border-red-200',
      text: isDarkMode ? 'text-red-400' : 'text-red-700',
      iconBg: isDarkMode ? 'bg-red-800/50' : 'bg-red-100',
      iconColor: isDarkMode ? 'text-red-400' : 'text-red-600',
      progressBg: 'from-red-400 to-red-500'
    };
  };

  const colorScheme = getPowerLevelColor(appliance.currentPower_kw, appliance.isOn || false);
  const powerPercentage = Math.min(Math.round(appliance.currentPower_kw * 100), 100);
  
  // Calculate energy cost (₹20 per kWh)
  const energyCost = appliance.currentPower_kw * 20; 

  // Handle toggle
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(!(appliance.isOn || false));
  };

  return (
    <motion.div 
      onClick={onClick} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-5 rounded-xl shadow-md border ${colorScheme.border} ${colorScheme.bg} 
                  transition-all duration-300 hover:shadow-xl cursor-pointer card-hover relative overflow-hidden`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Quick actions overlay */}
      {isHovered && (
        <motion.div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex space-x-3">
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }} 
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icons.BarChart3 className="w-5 h-5 text-blue-600" />
            </motion.button>
            <motion.button 
              onClick={handleToggle} 
              className={`p-2 ${appliance.isOn ? 'bg-red-500' : 'bg-green-500'} rounded-full hover:opacity-90 transition-opacity`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icons.Power className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button 
              onClick={(e) => {
                e.stopPropagation();
                // Schedule action would go here
              }} 
              className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icons.Clock className="w-5 h-5 text-purple-600" />
            </motion.button>
          </div>
        </motion.div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <h3 className={`text-lg font-semibold ${colorScheme.text}`}>{appliance.name}</h3>
          {appliance.isSmartDevice && (
            <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              Smart
            </span>
          )}
        </div>
        <div className={`p-2 rounded-full ${colorScheme.iconBg}`}>
          {IconComponent && <IconComponent className={`w-5 h-5 ${colorScheme.iconColor}`} />}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Current Power</p>
          <div className="flex items-center">
            <p className={`text-sm font-medium ${colorScheme.text}`}>{formatPower(appliance.currentPower_kw)} kW</p>
            <div className="relative ml-2 tooltip">
              <Icons.Info className="w-4 h-4 text-gray-400" />
              <span className="tooltip-text text-xs">
                ~₹{energyCost.toFixed(2)}/hr
              </span>
            </div>
          </div>
        </div>
        
        <div className={`w-full h-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${colorScheme.progressBg} ${appliance.isOn ? 'animate-pulse-slow' : ''}`}
            style={{ width: `${appliance.isOn ? powerPercentage : 0}%`, transition: 'width 0.5s ease-in-out' }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-1">
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>0 kW</span>
          <span className={`text-xs font-medium ${colorScheme.text}`}>{appliance.isOn ? `${powerPercentage}%` : 'Off'}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${
            !appliance.isOn ? 'bg-gray-400' :
            appliance.currentPower_kw < 0.3 ? 'bg-green-500' : 
            appliance.currentPower_kw < 0.8 ? 'bg-yellow-500' : 'bg-red-500'
          } mr-1.5`}></div>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {!appliance.isOn ? 'Standby' :
             appliance.currentPower_kw < 0.3 ? 'Low' : 
             appliance.currentPower_kw < 0.8 ? 'Medium' : 'High'} Usage
          </span>
        </div>
        
        <label className="switch">
          <input 
            type="checkbox" 
            checked={appliance.isOn || false} 
            onChange={() => onToggle(!(appliance.isOn || false))}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="slider"></span>
        </label>
      </div>
      
      {/* Usage stats */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-2">
        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} p-2 rounded-lg`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today</p>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {(appliance.dailyUsage || 0).toFixed(2)} kWh
          </p>
        </div>
        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} p-2 rounded-lg`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly</p>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {(appliance.monthlyUsage || 0).toFixed(2)} kWh
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplianceCard;