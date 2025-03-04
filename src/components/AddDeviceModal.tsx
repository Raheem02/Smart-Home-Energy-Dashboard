import React, { useState } from 'react';
import { X, Plus, Check, Lightbulb, Tv, Fan, Refrigerator, Utensils, Flame, Shirt, Smartphone, Laptop, Cpu, Plug } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddDeviceModalProps {
  onClose: () => void;
  onAddDevice: (device: any) => void;
  isDarkMode: boolean;
}

const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ onClose, onAddDevice, isDarkMode }) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceIcon, setDeviceIcon] = useState('Lightbulb');
  const [deviceCategory, setDeviceCategory] = useState('lighting');
  const [deviceLocation, setDeviceLocation] = useState('Living Room');
  const [isSmartDevice, setIsSmartDevice] = useState(false);
  const [step, setStep] = useState(1);
  
  const deviceIcons = [
    { name: 'Lightbulb', icon: Lightbulb, category: 'lighting' },
    { name: 'Tv', icon: Tv, category: 'entertainment' },
    { name: 'Fan', icon: Fan, category: 'cooling' },
    { name: 'Refrigerator', icon: Refrigerator, category: 'kitchen' },
    { name: 'Utensils', icon: Utensils, category: 'kitchen' },
    { name: 'Flame', icon: Flame, category: 'heating' },
    { name: 'Shirt', icon: Shirt, category: 'laundry' },
    { name: 'Smartphone', icon: Smartphone, category: 'electronics' },
    { name: 'Laptop', icon: Laptop, category: 'electronics' },
    { name: 'Cpu', icon: Cpu, category: 'electronics' },
    { name: 'Plug', icon: Plug, category: 'other' }
  ];
  
  const locations = [
    'Living Room', 'Kitchen', 'Bedroom', 'Bathroom', 
    'Office', 'Dining Room', 'Hallway', 'Garage', 'Basement'
  ];
  
  const categories = [
    { id: 'lighting', name: 'Lighting' },
    { id: 'heating', name: 'Heating' },
    { id: 'cooling', name: 'Cooling' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'other', name: 'Other' }
  ];
  
  const handleSubmit = () => {
    const newDevice = {
      id: Date.now(),
      name: deviceName,
      icon: deviceIcon,
      category: deviceCategory,
      location: deviceLocation,
      isSmartDevice,
      currentPower_kw: Math.random() * 0.5,
      isOn: true,
      history: [],
      dailyUsage: Math.random() * 5,
      monthlyUsage: Math.random() * 150
    };
    
    onAddDevice(newDevice);
    onClose();
  };
  
  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };
  
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };
  
  const isNextDisabled = () => {
    if (step === 1) return !deviceName;
    if (step === 2) return !deviceIcon || !deviceCategory;
    return false;
  };

  return (
    <div className={`fixed inset-0 ${isDarkMode ? 'bg-black' : 'bg-black'} bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm`}>
      <motion.div 
        className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} rounded-2xl shadow-2xl p-6 w-full max-w-md`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-blue-600'} p-2 rounded-lg mr-3`}>
              <Plus className="w-5 h-5 text-white" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New Device</h2>
          </div>
          <button 
            onClick={onClose}
            className={`text-gray-400 hover:${isDarkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors p-2 hover:${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-full`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber 
                      ? isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white' 
                      : isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > stepNumber ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <span className={`text-xs mt-1 ${
                  step >= stepNumber 
                    ? isDarkMode ? 'text-gray-300' : 'text-gray-700' 
                    : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {stepNumber === 1 ? 'Basics' : stepNumber === 2 ? 'Details' : 'Location'}
                </span>
              </div>
              
              {stepNumber < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > stepNumber 
                    ? isDarkMode ? 'bg-blue-700' : 'bg-blue-600' 
                    : isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <label htmlFor="deviceName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Device Name
                </label>
                <input
                  id="deviceName"
                  type="text"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className={`w-full p-3 border ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-gray-300'} 
                            rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                  placeholder="Enter device name (e.g. Living Room Light)"
                />
              </div>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Is this a smart device?
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsSmartDevice(true)}
                    className={`flex-1 p-3 rounded-lg border ${
                      isSmartDevice 
                        ? isDarkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-700' 
                        : isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-300' : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setIsSmartDevice(false)}
                    className={`flex-1 p-3 rounded-lg border ${
                      !isSmartDevice 
                        ? isDarkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-700' 
                        : isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-300' : 'border-gray-300 text-gray-700'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Device Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setDeviceCategory(category.id)}
                      className={`p-3 rounded-lg border ${
                        deviceCategory === category.id 
                          ? isDarkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-700' 
                          : isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-300' : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Device Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {deviceIcons.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => setDeviceIcon(name)}
                      className={`p-3 rounded-lg border ${
                        deviceIcon === name 
                          ? isDarkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-700' 
                          : isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-300' : 'border-gray-300 text-gray-700'
                      } flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-6">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Device Location
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {locations.map(location => (
                    <button
                      key={location}
                      onClick={() => setDeviceLocation(location)}
                      className={`p-3 rounded-lg border ${
                        deviceLocation === location 
                          ? isDarkMode ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-100 border-blue-300 text-blue-700' 
                          : isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-300' : 'border-gray-300 text-gray-700'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'} mb-6`}>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-blue-800'} mb-2`}>Device Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Name:</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{deviceName}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Type:</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {categories.find(c => c.id === deviceCategory)?.name}
                    </p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location:</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{deviceLocation}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Smart Device:</p>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{isSmartDevice ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className={`px-4 py-2 ${isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg transition-colors`}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={nextStep}
            disabled={isNextDisabled()}
            className={`px-4 py-2 ${
              isNextDisabled()
                ? isDarkMode ? 'bg-slate-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isDarkMode ? 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
            } rounded-lg transition-all`}
          >
            {step === 3 ? 'Add Device' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddDeviceModal;