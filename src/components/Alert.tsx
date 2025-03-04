import React from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';

interface AlertProps {
  message: string;
  type: 'warning' | 'danger';
  isDarkMode: boolean;
  onDismiss?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, isDarkMode, onDismiss }) => {
  const alertStyles = {
    warning: isDarkMode 
      ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-700 text-yellow-300' 
      : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400 text-yellow-800',
    danger: isDarkMode 
      ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-700 text-red-300' 
      : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-400 text-red-800'
  };

  return (
    <div className={`border-l-4 p-4 mb-6 rounded-lg shadow-sm ${alertStyles[type]} animate-pulse-slow`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === 'warning' ? (
              <AlertTriangle className={`h-5 w-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            ) : (
              <AlertCircle className={`h-5 w-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{message}</p>
            <p className={`text-xs mt-1 opacity-80 ${isDarkMode ? 'text-gray-300' : ''}`}>
              {type === 'warning' 
                ? 'Consider reducing usage of high-consumption appliances.' 
                : 'Turn off non-essential appliances to reduce energy consumption.'}
            </p>
          </div>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className={`p-1.5 rounded-full ${
              type === 'warning' 
                ? isDarkMode ? 'hover:bg-yellow-800/50 text-yellow-300' : 'hover:bg-yellow-100 text-yellow-700' 
                : isDarkMode ? 'hover:bg-red-800/50 text-red-300' : 'hover:bg-red-100 text-red-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="mt-3 flex space-x-2">
        <button className={`px-3 py-1.5 text-xs rounded-lg ${
          type === 'warning' 
            ? isDarkMode ? 'bg-yellow-800/50 text-yellow-300 hover:bg-yellow-800' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
            : isDarkMode ? 'bg-red-800/50 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}>
          View Recommendations
        </button>
        <button className={`px-3 py-1.5 text-xs rounded-lg ${
          type === 'warning' 
            ? isDarkMode ? 'bg-yellow-800/50 text-yellow-300 hover:bg-yellow-800' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
            : isDarkMode ? 'bg-red-800/50 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}>
          Optimize Automatically
        </button>
      </div>
    </div>
  );
};

export default Alert;