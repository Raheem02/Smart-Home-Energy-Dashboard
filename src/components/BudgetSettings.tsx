import React, { useState } from 'react';
import { Bolt, X, Check, AlertTriangle, Info, Zap, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface BudgetSettingsProps {
  currentBudget: number | null;
  onSaveBudget: (budget: number) => void;
  onClose: () => void;
  isDarkMode: boolean;
  energyRate: number;
  onUpdateEnergyRate: (rate: number) => void;
}

const BudgetSettings: React.FC<BudgetSettingsProps> = ({ 
  currentBudget, 
  onSaveBudget, 
  onClose,
  isDarkMode,
  energyRate,
  onUpdateEnergyRate
}) => {
  const [inputValue, setInputValue] = useState<string>(
    currentBudget ? currentBudget.toString() : ''
  );
  const [rateValue, setRateValue] = useState<string>(
    energyRate.toString()
  );
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'energy' | 'cost'>('energy');
  
  // Calculate cost budget based on energy budget
  const costBudget = currentBudget ? (currentBudget * energyRate).toFixed(2) : '0.00';

  const handleSave = () => {
    const budget = parseFloat(inputValue);
    const newRate = parseFloat(rateValue);
    
    if (isNaN(budget) || budget <= 0) {
      setError('Please enter a valid positive number');
      return;
    }
    
    onSaveBudget(budget);
    onUpdateEnergyRate(newRate);
    onClose();
  };

  // Suggested budget values
  const suggestedValues = [10, 15, 20, 25, 30];
  
  // Suggested rate values
  const suggestedRates = [15, 20, 25, 30, 35];

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black' : 'bg-black'} bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm`}>
      <motion.div 
        className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-2xl shadow-2xl p-6 w-full max-w-md`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'} p-2 rounded-lg mr-3`}>
              <Bolt className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Energy Budget Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className={`text-gray-400 hover:${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors p-2 hover:${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-full`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} mb-6`}>
          <button
            onClick={() => setActiveTab('energy')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center ${
              activeTab === 'energy' 
                ? isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-gray-800 shadow-sm' 
                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <Zap className="w-4 h-4 mr-1.5" />
            Energy Budget
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center ${
              activeTab === 'cost' 
                ? isDarkMode ? 'bg-slate-600 text-white' : 'bg-white text-gray-800 shadow-sm' 
                : isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <Bolt className="w-4 h-4 mr-1.5" />
            Cost Settings
          </button>
        </div>
        
        {activeTab === 'energy' ? (
          <>
            <div className="mb-6">
              <label htmlFor="budget" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Daily Energy Budget (kWh)
              </label>
              <div className="relative">
                <input
                  id="budget"
                  type="number"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError('');
                  }}
                  className={`w-full p-3 border ${error ? 'border-red-300 bg-red-50' : isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-gray-300'} 
                            rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your daily energy budget"
                  min="0"
                  step="0.1"
                />
                {error && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {error && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertTriangle className="h-4 w-4 mr-1" />{error}</p>}
            </div>
            
            <div className="mb-6">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Suggested values:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedValues.map(value => (
                  <button
                    key={value}
                    onClick={() => {
                      setInputValue(value.toString());
                      setError('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      parseFloat(inputValue) === value 
                        ? isDarkMode ? 'bg-blue-900 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 border border-transparent' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    {value} kWh
                  </button>
                ))}
              </div>
            </div>
            
            <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'} p-4 rounded-lg mb-6`}>
              <div className="flex">
                <Info className={`h-5 w-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-2 flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Energy Budget Tips</p>
                  <p className={`text-xs ${isDarkMode ? 'text-blue-200' : 'text-blue-600'} mt-1`}>
                    The average household uses 20-30 kWh per day. Setting a budget helps you track and reduce your energy consumption.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Cost equivalent */}
            <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-green-50'} p-4 rounded-lg mb-6`}>
              <div className="flex">
                <Bolt className={`h-5 w-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mr-2 flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>Cost Equivalent</p>
                  <p className={`text-xs ${isDarkMode ? 'text-green-200' : 'text-green-600'} mt-1`}>
                    At your current rate of ₹{energyRate.toFixed(2)}/kWh, your daily budget is approximately <span className="font-bold">₹{costBudget}</span>.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="rate" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Energy Rate (₹ per kWh)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
                </div>
                <input
                  id="rate"
                  type="number"
                  value={rateValue}
                  onChange={(e) => setRateValue(e.target.value)}
                  className={`w-full p-3 pl-10 border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-gray-300'} 
                            rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter your energy rate"
                  min="0.01"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>Common rates:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedRates.map(rate => (
                  <button
                    key={rate}
                    onClick={() => setRateValue(rate.toString())}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      parseFloat(rateValue) === rate 
                        ? isDarkMode ? 'bg-blue-900 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600 border border-transparent' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                    }`}
                  >
                    ₹{rate.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-amber-50'} p-4 rounded-lg mb-6`}>
              <div className="flex">
                <TrendingDown className={`h-5 w-5 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'} mr-2 flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>Cost Saving Potential</p>
                  <p className={`text-xs ${isDarkMode ? 'text-amber-200' : 'text-amber-600'} mt-1`}>
                    Reducing your daily energy usage by just 5 kWh could save you approximately ₹{(5 * parseFloat(rateValue) * 30).toFixed(2)} per month.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Budget visualization */}
            <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-indigo-50'} p-4 rounded-lg mb-6`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>Monthly Cost Estimate</p>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                  ₹{currentBudget ? (currentBudget * parseFloat(rateValue) * 30).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-indigo-200'} rounded-full overflow-hidden`}>
                <div 
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: currentBudget ? `${Math.min((currentBudget / 30) * 100, 100)}%` : '0%' }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>₹0</span>
                <span className={`text-xs ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>₹3000</span>
                <span className={`text-xs ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>₹6000</span>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2 ${isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-4 py-2 ${isDarkMode ? 'bg-gradient-to-r from-blue-700 to-indigo-700' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white rounded-lg hover:shadow-md transition-all flex items-center`}
          >
            <Check className="w-4 h-4 mr-1.5" />
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default BudgetSettings;