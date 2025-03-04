import React, { useState } from 'react';
import { Lightbulb, ChevronRight, ChevronDown, Zap, IndianRupee, Leaf } from 'lucide-react';

interface EnergyTipsProps {
  isDarkMode: boolean;
}

const EnergyTips: React.FC<EnergyTipsProps> = ({ isDarkMode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const tips = [
    {
      title: "Optimize Thermostat Settings",
      description: "Set your thermostat to 68°F in winter and 78°F in summer to save up to 10% on heating and cooling costs.",
      icon: "Thermometer",
      category: "heating"
    },
    {
      title: "Use Smart Power Strips",
      description: "Eliminate phantom energy usage by using smart power strips that cut power to devices when they're not in use.",
      icon: "Zap",
      category: "electronics"
    },
    {
      title: "Wash Clothes in Cold Water",
      description: "Using cold water for laundry can save up to 90% of the energy used by your washing machine.",
      icon: "Droplets",
      category: "appliances"
    },
    {
      title: "Replace Air Filters Regularly",
      description: "Clean or replace HVAC filters every 1-3 months to improve efficiency and reduce energy consumption.",
      icon: "Wind",
      category: "heating"
    },
    {
      title: "Use LED Light Bulbs",
      description: "LED bulbs use up to 80% less energy than traditional incandescent bulbs and last up to 25 times longer.",
      icon: "Lightbulb",
      category: "lighting"
    }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-2xl shadow-xl p-6 overflow-hidden`}>
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-600'} mr-3`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Energy Saving Tips
          </h2>
        </div>
        <button className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
          {isExpanded ? (
            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          ) : (
            <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-50 hover:bg-gray-100'} transition-colors cursor-pointer`}
            >
              <div className="flex items-start">
                <div className={`p-2 rounded-lg ${
                  tip.category === 'heating' 
                    ? isDarkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-600'
                    : tip.category === 'lighting'
                    ? isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-600'
                    : tip.category === 'electronics'
                    ? isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'
                    : isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'
                } mr-3 mt-1`}>
                  {tip.icon === 'Thermometer' && <Zap className="w-4 h-4" />}
                  {tip.icon === 'Zap' && <Zap className="w-4 h-4" />}
                  {tip.icon === 'Droplets' && <Zap className="w-4 h-4" />}
                  {tip.icon === 'Wind' && <Zap className="w-4 h-4" />}
                  {tip.icon === 'Lightbulb' && <Lightbulb className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>{tip.title}</h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{tip.description}</p>
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center">
                  <Leaf className={`w-3 h-3 ${isDarkMode ? 'text-green-400' : 'text-green-500'} mr-1`} />
                  <span className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Eco-friendly</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className={`w-3 h-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} mr-1`} />
                  <span className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Cost-effective</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnergyTips;