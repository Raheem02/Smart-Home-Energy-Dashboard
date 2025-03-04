import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, CloudSnow, CloudLightning, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherWidgetProps {
  isDarkMode: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ isDarkMode }) => {
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 45,
    windSpeed: 8,
    icon: 'cloud',
    forecast: [
      { day: 'Today', high: 72, low: 58, icon: 'cloud', precipitation: '10%' },
      { day: 'Tomorrow', high: 68, low: 55, icon: 'cloud-rain', precipitation: '60%' },
      { day: 'Wed', high: 65, low: 52, icon: 'cloud-rain', precipitation: '70%' },
      { day: 'Thu', high: 70, low: 56, icon: 'sun', precipitation: '0%' },
      { day: 'Fri', high: 75, low: 60, icon: 'sun', precipitation: '5%' }
    ]
  });

  // Simulate weather changes
  useEffect(() => {
    const interval = setInterval(() => {
      const tempChange = Math.random() > 0.5 ? 1 : -1;
      const humidityChange = Math.random() > 0.5 ? 2 : -2;
      const windChange = Math.random() > 0.5 ? 1 : -1;
      
      setWeather(prev => ({
        ...prev,
        temperature: Math.max(32, Math.min(100, prev.temperature + tempChange)),
        humidity: Math.max(10, Math.min(90, prev.humidity + humidityChange)),
        windSpeed: Math.max(0, Math.min(20, prev.windSpeed + windChange))
      }));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Get weather icon component
  const getWeatherIcon = (icon: string, size: number = 6) => {
    const iconProps = { 
      className: `w-${size} h-${size} ${
        icon === 'sun' 
          ? isDarkMode ? 'text-yellow-300' : 'text-yellow-500' 
          : icon === 'cloud-rain' || icon === 'cloud-lightning'
          ? isDarkMode ? 'text-blue-300' : 'text-blue-500'
          : icon === 'cloud-snow'
          ? isDarkMode ? 'text-blue-200' : 'text-blue-300'
          : isDarkMode ? 'text-gray-300' : 'text-gray-500'
      }` 
    };
    
    switch(icon) {
      case 'sun': return <Sun {...iconProps} />;
      case 'cloud': return <Cloud {...iconProps} />;
      case 'cloud-rain': return <CloudRain {...iconProps} />;
      case 'cloud-snow': return <CloudSnow {...iconProps} />;
      case 'cloud-lightning': return <CloudLightning {...iconProps} />;
      default: return <Sun {...iconProps} />;
    }
  };

  // Calculate energy impact
  const getEnergyImpact = () => {
    // High temperatures increase cooling needs
    if (weather.temperature > 80) {
      return {
        impact: 'High cooling demand expected',
        recommendation: 'Pre-cool your home in the morning to reduce peak usage',
        color: isDarkMode ? 'text-red-300' : 'text-red-600',
        bgColor: isDarkMode ? 'bg-red-900/30' : 'bg-red-50'
      };
    }
    // Low temperatures increase heating needs
    if (weather.temperature < 50) {
      return {
        impact: 'High heating demand expected',
        recommendation: 'Ensure windows are sealed to prevent heat loss',
        color: isDarkMode ? 'text-red-300' : 'text-red-600',
        bgColor: isDarkMode ? 'bg-red-900/30' : 'bg-red-50'
      };
    }
    // Moderate temperatures are optimal
    if (weather.temperature >= 65 && weather.temperature <= 75) {
      return {
        impact: 'Optimal temperature for energy savings',
        recommendation: 'Open windows and turn off HVAC if possible',
        color: isDarkMode ? 'text-green-300' : 'text-green-600',
        bgColor: isDarkMode ? 'bg-green-900/30' : 'bg-green-50'
      };
    }
    // Default case
    return {
      impact: 'Moderate energy demand expected',
      recommendation: 'Use fans instead of AC when possible',
      color: isDarkMode ? 'text-yellow-300' : 'text-yellow-600',
      bgColor: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'
    };
  };

  const energyImpact = getEnergyImpact();

  return (
    <div className={`${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'} rounded-2xl p-6 overflow-hidden relative`}>
      {/* Animated weather background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute ${
              i % 2 === 0 ? 'bg-blue-400' : 'bg-white'
            } rounded-full`}
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
      
      <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4 flex items-center relative z-10`}>
        <Sun className={`w-5 h-5 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-500'} mr-2`} />
        Weather & Energy Impact
      </h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 relative z-10">
        <div className="flex items-center mb-4 md:mb-0">
          <motion.div 
            className={`p-4 rounded-full ${isDarkMode ? 'bg-slate-700/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm shadow-lg'} mr-4`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            {getWeatherIcon(weather.icon, 8)}
          </motion.div>
          <div>
            <div className="flex items-baseline">
              <motion.p 
                className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {weather.temperature}
              </motion.p>
              <motion.span 
                className={`text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} ml-1`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                °F
              </motion.span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{weather.condition}</p>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-slate-700/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm'} p-3 rounded-xl`}>
          <div className="flex items-center mb-2">
            <Droplets className={`w-4 h-4 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'} mr-2`} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Humidity</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weather.humidity}%</span>
              </div>
              <div className={`w-full h-1.5 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full mt-1 overflow-hidden`}>
                <div 
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${weather.humidity}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <Wind className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mr-2`} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Wind</span>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{weather.windSpeed} mph</span>
              </div>
              <div className={`w-full h-1.5 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full mt-1 overflow-hidden`}>
                <div 
                  className="h-full rounded-full bg-gray-400"
                  style={{ width: `${(weather.windSpeed / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Energy impact */}
      <div className={`p-4 rounded-xl ${energyImpact.bgColor} mb-5 relative z-10`}>
        <div className="flex items-start">
          <Thermometer className={`w-5 h-5 ${energyImpact.color} mt-0.5 mr-2 flex-shrink-0`} />
          <div>
            <p className={`text-sm font-medium ${energyImpact.color}`}>{energyImpact.impact}</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-1`}>{energyImpact.recommendation}</p>
          </div>
        </div>
      </div>
      
      {/* 5-day forecast */}
      <div className="relative z-10">
        <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>5-Day Forecast</h3>
        <div className="grid grid-cols-5 gap-2">
          {weather.forecast.map((day, index) => (
            <motion.div 
              key={index} 
              className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-700/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm shadow-sm'} text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>{day.day}</p>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.icon, 5)}
              </div>
              <p className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{day.high}° / {day.low}°</p>
              <div className="flex items-center justify-center mt-1">
                <Umbrella className={`w-3 h-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'} mr-1`} />
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{day.precipitation}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;