import React, { useState } from 'react';
import { X, Calendar, BarChart3, LineChart, AreaChart as AreaChartIcon, Download, Share2 } from 'lucide-react';
import { AreaChart, Area, BarChart as RechartsBarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Appliance } from '../types';
import { formatTime, formatDate } from '../utils/dataUtils';
import { motion } from 'framer-motion';

interface EnergyChartProps {
  appliance: Appliance;
  onClose: () => void;
  isDarkMode: boolean;
}

const EnergyChart: React.FC<EnergyChartProps> = ({ appliance, onClose, isDarkMode }) => {
  const [chartType, setChartType] = useState<'area' | 'bar' | 'composed'>('area');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  // Process data for the chart
  const processData = () => {
    if (!appliance.history || appliance.history.length === 0) {
      return [];
    }
    
    // Sort history by timestamp
    const sortedHistory = [...appliance.history].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    // Filter based on time range
    const now = new Date();
    const cutoffTime = new Date();
    
    if (timeRange === 'day') {
      cutoffTime.setDate(now.getDate() - 1);
    } else if (timeRange === 'week') {
      cutoffTime.setDate(now.getDate() - 7);
    } else {
      cutoffTime.setMonth(now.getMonth() - 1);
    }
    
    const filteredHistory = sortedHistory.filter(entry => 
      new Date(entry.timestamp) >= cutoffTime
    );
    
    // Format data for chart
    return filteredHistory.map(entry => ({
      time: formatTime(new Date(entry.timestamp)),
      date: formatDate(new Date(entry.timestamp)),
      energy: entry.energy_kwh,
      power: entry.power_kw || 0
    }));
  };
  
  const chartData = processData();
  
  // Filter data based on time range
  const filteredData = chartData.filter((_, index) => {
    if (timeRange === 'day') {
      // For day view, show all data points
      return true;
    } else if (timeRange === 'week') {
      // For week view, sample data to avoid overcrowding
      return index % 4 === 0;
    } else {
      // For month view, sample data even more
      return index % 12 === 0;
    }
  });
  
  // Calculate total energy consumption
  const totalEnergy = appliance.history.reduce((sum, entry) => sum + entry.energy_kwh, 0);
  
  // Calculate estimated cost (₹20 per kWh)
  const estimatedCost = totalEnergy * 20;
  
  // Get chart colors based on dark mode
  const chartColors = {
    stroke: isDarkMode ? '#60A5FA' : '#3B82F6',
    fill: isDarkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)'
  };

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black' : 'bg-black'} bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm`}>
      <motion.div 
        className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-2xl shadow-2xl p-6 w-full max-w-4xl`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-lg mr-3`}>
              <BarChart3 className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {appliance.name} Energy Usage
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {timeRange === 'day' ? 'Last 24 hours' : timeRange === 'week' ? 'Last 7 days' : 'Last 30 days'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`text-gray-400 hover:${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors p-2 hover:${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-full`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'} p-4 rounded-xl`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Total Energy</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{totalEnergy.toFixed(2)} kWh</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {timeRange === 'day' ? 'Last 24 hours' : timeRange === 'week' ? 'Last 7 days' : 'Last 30 days'}
            </p>
          </div>
          <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-green-50'} p-4 rounded-xl`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Estimated Cost</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>₹{estimatedCost.toFixed(2)}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>At ₹20/kWh</p>
          </div>
          <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-purple-50'} p-4 rounded-xl`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Current Power</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>{appliance.currentPower_kw.toFixed(2)} kW</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              {appliance.isOn ? 'Device is active' : 'Device is inactive'}
            </p>
          </div>
        </div>
        
        {/* Chart controls */}
        <div className="flex flex-col sm:flex-row justify-between mb-4">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
                chartType === 'area' 
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                  : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <AreaChartIcon className="w-4 h-4 mr-1.5" />
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
                chartType === 'bar' 
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                  : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Bar
            </button>
            <button
              onClick={() => setChartType('composed')}
              className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
                chartType === 'composed' 
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                  : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LineChart className="w-4 h-4 mr-1.5" />
              Combined
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                timeRange === 'day' 
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                  : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                timeRange === 'week' 
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                  : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                timeRange === 'month' 
                  ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                  : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              30d
            </button>
          </div>
        </div>
        
        {/* Chart */}
        {filteredData.length > 0 ? (
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#E5E7EB'} />
                  <XAxis 
                    dataKey={timeRange === 'day' ? 'time' : 'date'} 
                    stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value.toFixed(2)}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1E293B' : 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none',
                      color: isDarkMode ? '#E2E8F0' : 'inherit'
                    }}
                    formatter={(value: number) => [`${value.toFixed(3)} kWh`, 'Energy']}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="energy" 
                    stroke={chartColors.stroke}
                    fill={chartColors.fill}
                    strokeWidth={2}
                    name="Energy (kWh)"
                  />
                </AreaChart>
              ) : chartType === 'bar' ? (
                <RechartsBarChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#E5E7EB'} />
                  <XAxis 
                    dataKey={timeRange === 'day' ? 'time' : 'date'} 
                    stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value.toFixed(2)}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1E293B' : 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none',
                      color: isDarkMode ? '#E2E8F0' : 'inherit'
                    }}
                    formatter={(value: number) => [`${value.toFixed(3)} kWh`, 'Energy']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="energy" 
                    fill={chartColors.stroke}
                    name="Energy (kWh)"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              ) : (
                <ComposedChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#E5E7EB'} />
                  <XAxis 
                    dataKey={timeRange === 'day' ? 'time' : 'date'} 
                    stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value.toFixed(2)}`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1E293B' : 'white', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: 'none',
                      color: isDarkMode ? '#E2E8F0' : 'inherit'
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="energy" 
                    stroke={chartColors.stroke}
                    fill={chartColors.fill}
                    strokeWidth={2}
                    name="Energy (kWh)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="power" 
                    stroke={isDarkMode ? "#A78BFA" : "#8B5CF6"}
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2, fill: isDarkMode ? '#1E293B' : 'white' }}
                    name="Power (kW)"
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className={`flex items-center justify-center h-80 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} rounded-xl`}>
            <div className="text-center">
              <Calendar className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-3`} />
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-500'}>No historical data available yet.</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Data will appear after a few updates.</p>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="mt-6 flex justify-between items-center">
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Energy consumption measured in kilowatt-hours (kWh) per 15-minute interval
          </div>
          
          <div className="flex space-x-2">
            <button className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
              isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </button>
            <button className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
              isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </button>
          </div>
        </div>
        
        {/* Energy saving recommendations */}
        <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-blue-800'} mb-2`}>Energy Saving Recommendations</h3>
          <ul className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-blue-700'} space-y-1`}>
            {appliance.category === 'heating' && (
              <>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Consider lowering the temperature by 1-2 degrees to save up to 10% on heating costs.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Schedule heating to turn off automatically when you're away or sleeping.</span>
                </li>
              </>
            )}
            {appliance.category === 'cooling' && (
              <>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Raising the temperature by 1-2 degrees can reduce energy consumption by up to 10%.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Clean filters regularly to improve efficiency and reduce energy usage.</span>
                </li>
              </>
            )}
            {appliance.category === 'kitchen' && (
              <>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Only run this appliance when fully loaded to maximize energy efficiency.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Consider using eco mode to reduce energy consumption by up to 15%.</span>
                </li>
              </>
            )}
            {appliance.category === 'lighting' && (
              <>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Switch to LED bulbs to reduce energy consumption by up to 80%.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-1.5">•</span>
                  <span>Install motion sensors to automatically turn off lights when not in use.</span>
                </li>
              </>
            )}
            <li className="flex items-start">
              <span className="mr-1.5">•</span>
              <span>Consider upgrading to a more energy-efficient model to reduce long-term costs.</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default EnergyChart;