import React, { useState } from 'react';
import { X, Download, Share2, Calendar, TrendingDown, TrendingUp, BarChart4, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

interface EnergyReportModalProps {
  onClose: () => void;
  isDarkMode: boolean;
  monthlyData: {
    month: string;
    usage: number;
    cost: number;
    previousYearUsage: number;
  }[];
  categoryData: {
    name: string;
    value: number;
    color: string;
  }[];
}

const EnergyReportModal: React.FC<EnergyReportModalProps> = ({ 
  onClose, 
  isDarkMode,
  monthlyData,
  categoryData
}) => {
  const [reportType, setReportType] = useState<'monthly' | 'category'>('monthly');
  
  // Calculate total usage and cost
  const totalUsage = monthlyData.reduce((sum, month) => sum + month.usage, 0);
  const totalCost = monthlyData.reduce((sum, month) => sum + month.cost, 0);
  
  // Calculate year-over-year change
  const totalPreviousYearUsage = monthlyData.reduce((sum, month) => sum + month.previousYearUsage, 0);
  const yearOverYearChange = ((totalUsage - totalPreviousYearUsage) / totalPreviousYearUsage) * 100;
  
  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black' : 'bg-black'} bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm`}>
      <motion.div 
        className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-2xl shadow-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-auto`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-lg mr-3`}>
              <Calendar className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Energy Consumption Report
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                April 2025
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onClose}
              className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'} p-4 rounded-xl`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Total Energy Usage</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{totalUsage.toFixed(2)} kWh</p>
            <div className="flex items-center mt-1">
              {yearOverYearChange < 0 ? (
                <>
                  <TrendingDown className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mr-1`} />
                  <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-500'}`}>
                    {Math.abs(yearOverYearChange).toFixed(1)}% vs last year
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-500'} mr-1`} />
                  <span className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                    {yearOverYearChange.toFixed(1)}% vs last year
                  </span>
                </>
              )}
            </div>
          </div>
          <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-green-50'} p-4 rounded-xl`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Total Cost</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>₹{totalCost.toFixed(2)}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Avg. ₹{(totalCost / totalUsage).toFixed(2)}/kWh</p>
          </div>
          <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-purple-50'} p-4 rounded-xl`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Peak Day</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>April 15</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>12.8 kWh consumed</p>
          </div>
          <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-amber-50'} p-4 rounded-xl`}>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Carbon Footprint</p>
            <p className={`text-xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>{(totalUsage * 0.85).toFixed(2)} kg</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>CO₂ equivalent</p>
          </div>
        </div>
        
        {/* Report Type Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setReportType('monthly')}
            className={`flex items-center px-4 py-2 rounded-lg mr-2 ${
              reportType === 'monthly'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BarChart4 className="w-4 h-4 mr-1.5" />
            Monthly Trends
          </button>
          <button
            onClick={() => setReportType('category')}
            className={`flex items-center px-4 py-2 rounded-lg ${
              reportType === 'category'
                ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <PieChart className="w-4 h-4 mr-1.5" />
            Category Breakdown
          </button>
        </div>
        
        {/* Chart */}
        <div className={`h-80 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'} p-4 rounded-xl mb-6`}>
          <ResponsiveContainer width="100%" height="100%">
            {reportType === 'monthly' ? (
              <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#475569' : '#E5E7EB'} />
                <XAxis 
                  dataKey="month" 
                  stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  stroke={isDarkMode ? '#94A3B8' : '#6B7280'}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value} kWh`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1E293B' : 'white', 
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: 'none',
                    color: isDarkMode ? '#E2E8F0' : 'inherit'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'cost') return [`₹${value.toFixed(2)}`, 'Cost'];
                    return [value, name === 'usage' ? 'Current Year' : 'Previous Year'];
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="usage" 
                  name="Current Year" 
                  fill={isDarkMode ? "#60A5FA" : "#3B82F6"} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="previousYearUsage" 
                  name="Previous Year" 
                  fill={isDarkMode ? "#94A3B8" : "#64748B"} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            ) : (
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDarkMode ? '#1E293B' : 'white', 
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: 'none',
                    color: isDarkMode ? '#E2E8F0' : 'inherit'
                  }}
                  formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Usage']}
                />
                <Legend />
              </RechartsPieChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Insights */}
        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'} p-4 rounded-xl mb-6`}>
          <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-blue-800'} mb-2`}>Key Insights</h3>
          <ul className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-blue-700'} space-y-2`}>
            <li className="flex items-start">
              <span className="mr-1.5">•</span>
              <span>Your energy usage has {yearOverYearChange < 0 ? 'decreased' : 'increased'} by {Math.abs(yearOverYearChange).toFixed(1)}% compared to the same period last year.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1.5">•</span>
              <span>Heating and cooling account for approximately 45% of your total energy consumption.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1.5">•</span>
              <span>Your peak usage occurs between 6-8 PM on weekdays.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-1.5">•</span>
              <span>You could save up to ₹2,000 per month by optimizing your appliance usage patterns.</span>
            </li>
          </ul>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
            isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
            <Download className="w-4 h-4 mr-1.5" />
            Export PDF
          </button>
          <button className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
            isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
            <Share2 className="w-4 h-4 mr-1.5" />
            Share
          </button>
          <button className={`px-3 py-1.5 rounded-lg flex items-center text-sm ${
            isDarkMode ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
            <Calendar className="w-4 h-4 mr-1.5" />
            View Savings Tips
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EnergyReportModal;