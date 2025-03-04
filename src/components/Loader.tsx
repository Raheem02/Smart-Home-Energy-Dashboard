import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Lightbulb, Home, BarChart2 } from 'lucide-react';

interface LoaderProps {
  isDarkMode?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isDarkMode = false }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-900' : 'bg-white'} opacity-90`}></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated logo */}
        <motion.div 
          className={`w-24 h-24 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-600'} flex items-center justify-center mb-8`}
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0 rgba(59, 130, 246, 0.4)',
              '0 0 20px rgba(59, 130, 246, 0.6)',
              '0 0 0 rgba(59, 130, 246, 0.4)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Home className="w-12 h-12 text-white" />
        </motion.div>
        
        {/* Animated icons */}
        <div className="flex justify-center mb-8">
          <motion.div 
            className={`w-12 h-12 mx-2 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-600'} flex items-center justify-center`}
            animate={{ 
              y: [0, -15, 0],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0
            }}
          >
            <Lightbulb className="w-6 h-6 text-white" />
          </motion.div>
          
          <motion.div 
            className={`w-12 h-12 mx-2 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-600'} flex items-center justify-center`}
            animate={{ 
              y: [0, -15, 0],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.3
            }}
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          
          <motion.div 
            className={`w-12 h-12 mx-2 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-600'} flex items-center justify-center`}
            animate={{ 
              y: [0, -15, 0],
              opacity: [1, 0.8, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.6
            }}
          >
            <BarChart2 className="w-6 h-6 text-white" />
          </motion.div>
        </div>
        
        {/* Loading text */}
        <motion.div 
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Smart Home Energy Dashboard
          </h2>
          
          <div className="flex items-center mb-4">
            <div className="h-1 w-60 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            </div>
            <p className={`ml-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading...
            </p>
          </div>
          
          <motion.p 
            className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Connecting to your smart home devices
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Loader;