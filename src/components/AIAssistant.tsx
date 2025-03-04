import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, X, Zap, Lightbulb, Cpu, Maximize2, Minimize2, 
  BarChart2, Calendar, Clock, Sun, Moon, Flame, Wind, Droplets, 
  Sparkles, RefreshCw, Sliders, HelpCircle, Settings, PieChart, Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Appliance } from '../types';

interface AIAssistantProps {
  isDarkMode: boolean;
  appliances: Appliance[];
  totalUsage: number;
  budget: number | null;
  onToggleApplianceState: (id: number, isOn: boolean) => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'chart' | 'suggestion' | 'error' | 'success';
  chartData?: any;
  suggestions?: string[];
}

interface ConversationContext {
  messages: Message[];
  lastContext?: string;
}

interface ResponseType {
  text: string;
  type?: 'text' | 'chart' | 'suggestion' | 'error' | 'success';
  chartData?: any;
}

// Define themes for the chatbot
const themes = {
  neon: {
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-blue-600 to-purple-600',
    accent: 'from-pink-600 to-orange-600',
    text: 'text-white',
    border: 'border-purple-500',
    shadow: 'shadow-purple-500/20',
    glow: 'animate-pulse-glow'
  },
  ocean: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-cyan-600 to-teal-600',
    accent: 'from-teal-600 to-blue-600',
    text: 'text-white',
    border: 'border-blue-500',
    shadow: 'shadow-blue-500/20',
    glow: 'animate-pulse-slow'
  },
  sunset: {
    primary: 'from-orange-600 to-red-600',
    secondary: 'from-yellow-600 to-orange-600',
    accent: 'from-red-600 to-pink-600',
    text: 'text-white',
    border: 'border-orange-500',
    shadow: 'shadow-orange-500/20',
    glow: 'animate-pulse-slow'
  },
  forest: {
    primary: 'from-green-600 to-emerald-600',
    secondary: 'from-emerald-600 to-teal-600',
    accent: 'from-teal-600 to-green-600',
    text: 'text-white',
    border: 'border-green-500',
    shadow: 'shadow-green-500/20',
    glow: 'animate-pulse-slow'
  }
};

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  isDarkMode, 
  appliances, 
  totalUsage, 
  budget,
  onToggleApplianceState
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm WattGuardian, your smart home energy assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      suggestions: [
        "What's my energy usage?",
        "Energy saving tips",
        "Which devices are on?"
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [theme, setTheme] = useState<keyof typeof themes>('neon');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    messages: [],
    lastContext: undefined
  });

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = generateResponse(input.trim(), appliances, totalUsage, budget, onToggleApplianceState, conversationContext);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type || 'text',
        chartData: response.chartData,
        suggestions: Math.random() > 0.3 ? generateSuggestions(input) : undefined
      };
      
      setMessages(prev => [...prev, botMessage]);
      setConversationContext(prev => ({
        messages: [...prev.messages, userMessage, botMessage],
        lastContext: prev.lastContext
      }));
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
    
    // Focus the input when opening
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    // Auto-send after a short delay
    setTimeout(() => {
      handleSendMessage();
    }, 300);
  };

  const toggleThemeSelector = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowThemeSelector(!showThemeSelector);
  };

  const changeTheme = (newTheme: keyof typeof themes) => {
    setTheme(newTheme);
    setShowThemeSelector(false);
  };

  const clearChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages([
      {
        id: Date.now().toString(),
        text: "Chat history cleared. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        type: 'text',
        suggestions: [
          "What's my energy usage?",
          "Energy saving tips",
          "Which devices are on?"
        ]
      }
    ]);
  };

  // Generate dynamic suggestions based on user input
  const generateSuggestions = (userInput: string): string[] => {
    const input = userInput.toLowerCase();
    
    if (input.includes('energy') || input.includes('power') || input.includes('usage')) {
      return [
        "Show me energy usage by device",
        "How can I reduce my energy usage?",
        "What's my energy forecast for tomorrow?"
      ];
    }
    
    if (input.includes('tip') || input.includes('save') || input.includes('reduce')) {
      return [
        "More energy saving tips",
        "How much can I save?",
        "Schedule energy optimization"
      ];
    }
    
    if (input.includes('device') || input.includes('appliance')) {
      return [
        "Which device uses most energy?",
        "Turn off all devices",
        "Schedule device usage"
      ];
    }
    
    // Default suggestions
    return [
      "Show my energy summary",
      "Compare today vs. yesterday",
      "Energy saving recommendations"
    ];
  };

  // Get current theme
  const currentTheme = themes[theme];

  return (
    <>
      {/* Chatbot button with animated glow effect */}
      <motion.button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-40 
                   bg-gradient-to-r ${currentTheme.primary} ${currentTheme.text} 
                   hover:shadow-xl transition-all duration-300 transform hover:scale-105
                   ${currentTheme.glow} ${currentTheme.shadow}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-6 h-6" />
      </motion.button>
      
      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : isExpanded ? '90vh' : '500px',
              width: isExpanded ? '90vw' : 'auto',
              maxWidth: isExpanded ? '800px' : '380px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`fixed ${isExpanded ? 'inset-x-0 mx-auto bottom-10' : 'bottom-20 right-6'} 
                       w-full sm:w-96 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} 
                       rounded-2xl shadow-2xl overflow-hidden z-40 flex flex-col
                       backdrop-blur-lg bg-opacity-95 ${currentTheme.border} border`}
            style={{
              boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.2), 
                          0 10px 10px -5px rgba(0, 0, 0, 0.1), 
                          0 0 15px 2px rgba(${isDarkMode ? '255, 255, 255, 0.1' : '0, 0, 0, 0.1'})`
            }}
          >
            {/* Header with gradient background */}
            <div className={`p-4 bg-gradient-to-r ${currentTheme.primary} flex justify-between items-center`}>
              <div className="flex items-center">
                <div className={`p-2 rounded-full bg-white/20 backdrop-blur-md mr-3 ${currentTheme.glow}`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">WattGuardian</h3>
                  <p className="text-xs text-white opacity-80">Energy Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleThemeSelector}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Change theme"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button 
                  onClick={clearChat}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Clear chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={toggleExpand}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                  title={isExpanded ? "Shrink" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={toggleMinimize}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={toggleChatbot}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Theme selector dropdown */}
            <AnimatePresence>
              {showThemeSelector && (
                <motion.div 
                  className={`absolute top-16 right-4 ${isDarkMode ? 'bg-slate-700' : 'bg-white'} 
                             rounded-lg shadow-lg z-50 p-2 border ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => changeTheme('neon')}
                      className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium"
                    >
                      Neon
                    </button>
                    <button 
                      onClick={() => changeTheme('ocean')}
                      className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-medium"
                    >
                      Ocean
                    </button>
                    <button 
                      onClick={() => changeTheme('sunset')}
                      className="p-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 text-white text-xs font-medium"
                    >
                      Sunset
                    </button>
                    <button 
                      onClick={() => changeTheme('forest')}
                      className="p-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-medium"
                    >
                      Forest
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages */}
            {!isMinimized && (
              <div 
                className={`flex-1 p-4 overflow-y-auto ${
                  isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
                } scrollbar-thin scrollbar-thumb-rounded-full ${
                  isDarkMode ? 'scrollbar-thumb-slate-600' : 'scrollbar-thumb-gray-300'
                }`}
                style={{
                  backgroundImage: isDarkMode 
                    ? 'radial-gradient(circle at center, rgba(30, 41, 59, 0.5) 0%, rgba(15, 23, 42, 0.5) 100%)' 
                    : 'radial-gradient(circle at center, rgba(249, 250, 251, 0.5) 0%, rgba(243, 244, 246, 0.5) 100%)',
                  backgroundSize: '100% 100%'
                }}
              >
                {messages.map((message, index) => (
                  <div 
                    key={message.id} 
                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Bot avatar for bot messages */}
                    {message.sender === 'bot' && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTheme.primary} 
                                      flex items-center justify-center mr-2 flex-shrink-0 mt-1`}>
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div className={`max-w-[80%] rounded-2xl p-3 ${
                      message.sender === 'user'
                        ? `bg-gradient-to-r ${currentTheme.secondary} text-white` 
                        : isDarkMode 
                          ? 'bg-slate-700 text-white' 
                          : 'bg-white text-gray-800 border border-gray-200'
                    } ${message.type === 'error' ? 'bg-red-500 text-white' : ''} 
                      ${message.type === 'success' ? 'bg-green-500 text-white' : ''}`}
                    >
                      {/* Message text */}
                      <p className={`text-sm whitespace-pre-line ${isDarkMode ? 'text-white' : 'text-[#1F2937]'}`}>{message.text}</p>
                      
                      {/* Chart visualization if available */}
                      {message.type === 'chart' && message.chartData && (
                        <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Energy Usage Chart
                            </span>
                            <BarChart2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </div>
                          
                          {/* Simple bar chart visualization */}
                          <div className="space-y-2">
                            {Object.entries(message.chartData).map(([key, value]: [string, any]) => (
                              <div key={key}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{key}</span>
                                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{value.toFixed(2)} kWh</span>
                                </div>
                                <div className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                                  <div 
                                    className={`h-full rounded-full bg-gradient-to-r ${currentTheme.accent}`}
                                    style={{ width: `${Math.min((value / 10) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-blue-200'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      
                      {/* Feedback buttons for bot messages */}
                      {message.sender === 'bot' && index === messages.length - 1 && message.type !== 'error' && (
                        <div className="flex mt-2 space-x-2">
                          <button className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'} 
                                           transition-colors`}>
                            <Bookmark className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* User avatar for user messages */}
                    {message.sender === 'user' && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTheme.accent} 
                                      flex items-center justify-center ml-2 flex-shrink-0 mt-1`}>
                        <span className="text-xs font-bold text-white">You</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Suggestions */}
                {messages.length > 0 && messages[messages.length - 1].suggestions && (
                  <div className="mb-4">
                    <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`px-3 py-1.5 rounded-full text-xs ${
                            isDarkMode 
                              ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          } transition-colors border ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${currentTheme.primary} 
                                    flex items-center justify-center mr-2 flex-shrink-0 mt-1`}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className={`rounded-2xl p-3 ${
                      isDarkMode 
                        ? 'bg-slate-700 text-white' 
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {/* Input */}
            {!isMinimized && (
              <div className={`p-4 border-t ${
                isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'
              }`}>
                {/* Quick actions */}
                <div className="flex mb-3 space-x-2 overflow-x-auto pb-2 scrollbar-none">
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("What's my energy usage today?")}
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Energy Usage</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Give me energy saving tips")}
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Saving Tips</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Which devices are on?")}
                  >
                    <Cpu className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Device Status</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("What's my energy budget?")}
                  >
                    <PieChart className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Budget</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("How's the weather affecting my energy usage?")}
                  >
                    <Sun className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Weather Impact</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("What's my peak usage time?")}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Peak Hours</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Show me HVAC settings")}
                  >
                    <Wind className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">HVAC</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Configure energy settings")}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Settings</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Show heating system status")}
                  >
                    <Flame className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Heating</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Check water heater efficiency")}
                  >
                    <Droplets className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Water</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Adjust device thresholds")}
                  >
                    <Sliders className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Thresholds</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Switch to night mode settings")}
                  >
                    <Moon className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Night Mode</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Show smart optimization suggestions")}
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Smart Tips</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Update energy data")}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Refresh</span>
                  </button>
                  <button 
                    className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleSuggestionClick("Show my energy schedule")}
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-xs whitespace-nowrap">Schedule</span>
                  </button>
                </div>
                
                {/* Input field with buttons */}
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your energy usage..."
                      className={`w-full p-3 pl-4 pr-10 rounded-l-lg border-y border-l ${
                        isDarkMode 
                          ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-${theme === 'neon' ? 'purple' : theme === 'ocean' ? 'blue' : theme === 'sunset' ? 'orange' : 'green'}-500`}
                    />
                  </div>
                  
                  <button
                    onClick={handleSendMessage}
                    className={`p-3 rounded-r-lg bg-gradient-to-r ${currentTheme.primary} text-white`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                
                <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex justify-between items-center`}>
                  <span>Try asking about your energy usage, tips to save energy, or control your devices</span>
                  <div className="flex items-center">
                    <HelpCircle className="w-3 h-3 mr-1" />
                    <span>AI Assistant</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Enhanced response generation with support for charts and different message types
const generateResponse = (
  input: string, 
  appliances: Appliance[], 
  totalUsage: number, 
  budget: number | null,
  onToggleApplianceState: (id: number, isOn: boolean) => void,
  context: ConversationContext
): ResponseType => {
  // Check for greetings
  if (input.match(/^(hi|hello|hey|greetings)/i)) {
    return {
      text: "Hello! I'm WattGuardian, your smart home energy assistant. How can I help you today?",
      type: 'text'
    };
  }
  
  // Check for energy usage questions
  if (input.match(/(energy|power|electricity) (usage|consumption|used)/i)) {
    const response = `Your total energy usage today is ${totalUsage.toFixed(2)} kWh. ${
      budget 
        ? `That's ${((totalUsage / budget) * 100).toFixed(1)}% of your daily budget of ${budget.toFixed(2)} kWh.` 
        : "You haven't set a daily budget yet. Would you like to set one?"
    }`;
    
    // If the user asks for a chart or visualization
    if (input.match(/(chart|graph|visual|show me)/i)) {
      // Create sample data for visualization
      const chartData: Record<string, number> = {};
      
      // Group appliances by category
      const categories = appliances.reduce((acc, app) => {
        const category = app.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(app);
        return acc;
      }, {} as Record<string, Appliance[]>);
      
      // Format for chart
      Object.entries(categories).forEach(([category, usage]) => {
        chartData[category.charAt(0).toUpperCase() + category.slice(1)] = usage.reduce((sum, app) => sum + (app.dailyUsage || 0), 0);
      });
      
      return {
        text: response + "\n\nHere's a breakdown of your energy usage by category:",
        type: 'chart',
        chartData
      };
    }
    
    return {
      text: response,
      type: 'text'
    };
  }
  
  // Check for budget questions
  if (input.match(/(budget|limit|cap)/i)) {
    return {
      text: budget 
        ? `Your current daily energy budget is set to ${budget.toFixed(2)} kWh. You've used ${((totalUsage / budget) * 100).toFixed(1)}% of it today.`
        : "You haven't set a daily energy budget yet. Would you like me to help you set one?",
      type: 'text'
    };
  }
  
  // Check for appliance status
  if (input.match(/(which|what|show|list|tell me about)?\s*(devices?|appliances?)\s*(is|are)?\s*(on|off|running|active|turned on|turned off)/i) || 
      input.match(/(device|appliance)\s*(status|state)/i) ||
      input.match(/list\s*(active|running)?\s*(devices?|appliances?)/i) ||
      input.match(/tell me about\s*(my)?\s*(devices?|appliances?)/i)) {
    const onAppliances = appliances.filter(a => a.isOn).map(a => a.name);
    const offAppliances = appliances.filter(a => !a.isOn).map(a => a.name);
    
    if (onAppliances.length === 0) {
      return {
        text: "All your appliances are currently turned off.",
        type: 'text'
      };
    }
    
    return {
      text: `Currently, you have ${onAppliances.length} appliances turned on: ${onAppliances.join(', ')}. ${
        offAppliances.length > 0 
          ? `The following appliances are turned off: ${offAppliances.join(', ')}.` 
          : ""
      }`,
      type: 'text'
    };
  }
  
  // Check for highest energy consumer
  if (input.match(/(highest|most|top) (energy|power|electricity)/i)) {
    const sortedAppliances = [...appliances].sort((a, b) => b.currentPower_kw - a.currentPower_kw);
    const highest = sortedAppliances[0];
    
    return {
      text: `Your ${highest.name} is currently using the most energy at ${highest.currentPower_kw.toFixed(2)} kW. ${
        highest.isOn 
          ? "It's currently turned on." 
          : "It's currently turned off."
      }`,
      type: 'text'
    };
  }
  
  // Check for energy saving tips
  if (input.match(/(save|reduce|lower|cut) (energy|power|electricity|bill|cost)/i) || 
      input.match(/(energy|power) (saving|efficiency) (tips|advice|help)/i)) {
    const tips = [
      "Adjust your thermostat by 1-2 degrees to save up to 10% on heating and cooling costs.",
      "Replace traditional light bulbs with LED bulbs to use up to 80% less energy.",
      "Unplug electronics when not in use to eliminate phantom energy usage.",
      "Use smart power strips that cut power to devices when they're not in use.",
      "Wash clothes in cold water to save up to 90% of the energy used by your washing machine.",
      "Clean or replace HVAC filters every 1-3 months to improve efficiency.",
      "Use ceiling fans to circulate air and reduce the need for air conditioning.",
      "Seal air leaks around windows and doors to prevent energy waste.",
      "Set your refrigerator temperature between 35-38°F (1.7-3.3°C) for optimal efficiency.",
      "Use natural light during the day instead of artificial lighting.",
      "Run dishwashers and washing machines only when full to maximize efficiency.",
      "Install a programmable thermostat to automatically adjust temperatures when you're away or sleeping."
    ];
    
    // Select 2-3 random tips
    const numTips = Math.floor(Math.random() * 2) + 2; // 2 or 3 tips
    const selectedTips: string[] = [];
    
    for (let i = 0; i < numTips; i++) {
      const randomIndex = Math.floor(Math.random() * tips.length);
      selectedTips.push(tips[randomIndex]);
      tips.splice(randomIndex, 1); // Remove the selected tip to avoid duplicates
    }
    
    return {
      text: `Here are some energy saving tips for you:\n\n${selectedTips.map((tip, index) => `${index + 1}. ${tip}`).join('\n\n')}`,
      type: 'success'
    };
  }
  
  // Check for specific appliance questions
  for (const appliance of appliances) {
    if (input.includes(appliance.name.toLowerCase())) {
      return {
        text: `Your ${appliance.name} is currently ${appliance.isOn ? 'on' : 'off'} and consuming ${appliance.currentPower_kw.toFixed(2)} kW of power. ${
          appliance.dailyUsage 
            ? `Today it has used approximately ${appliance.dailyUsage.toFixed(2)} kWh of energy.` 
            : ""
        }`,
        type: 'text'
      };
    }
  }
  
  // Check for turn on/off commands
  const turnOnMatch = input.match(/turn on (the |my )?(.+)/i);
  const turnOffMatch = input.match(/turn off (the |my )?(.+)/i);
  
  if (turnOnMatch || turnOffMatch) {
    const deviceName = (turnOnMatch ? turnOnMatch[2] : turnOffMatch![2]).toLowerCase();
    const turnOn = !!turnOnMatch;
    
    const matchedAppliance = appliances.find(a => 
      a.name.toLowerCase().includes(deviceName) || 
      deviceName.includes(a.name.toLowerCase())
    );
    
    if (matchedAppliance) {
      // Actually toggle the appliance state
      onToggleApplianceState(matchedAppliance.id, turnOn);
      
      return {
        text: `I've turned ${turnOn ? 'on' : 'off'} your ${matchedAppliance.name}.`,
        type: 'success'
      };
    } else {
      return {
        text: `I couldn't find a device called "${deviceName}" in your home. Can you try again with a different name?`,
        type: 'error'
      };
    }
  }
  
  // Check for energy comparison
  if (input.match(/(compare|comparison|versus|vs)/i) && 
      (input.includes('today') || input.includes('yesterday') || input.includes('week'))) {
    
    // Generate sample comparison data
    const todayUsage = totalUsage;
    const yesterdayUsage = totalUsage * (0.8 + Math.random() * 0.4); // 80-120% of today
    
    const chartData = {
      'Today': todayUsage,
      'Yesterday': yesterdayUsage
    };
    
    const percentChange = ((todayUsage - yesterdayUsage) / yesterdayUsage) * 100;
    const changeText = percentChange >= 0 
      ? `That's a ${percentChange.toFixed(1)}% increase compared to yesterday.` 
      : `That's a ${Math.abs(percentChange).toFixed(1)}% decrease compared to yesterday.`;
    
    return {
      text: `Today you've used ${todayUsage.toFixed(2)} kWh of energy, while yesterday you used ${yesterdayUsage.toFixed(2)} kWh. ${changeText}`,
      type: 'chart',
      chartData
    };
  }
  
  // Check for weather-related energy questions
  if (input.match(/(weather|temperature|forecast)/i) && 
      input.match(/(energy|power|electricity|consumption|usage)/i)) {
    
    return {
      text: "Based on the weather forecast, I predict your energy usage will be higher tomorrow due to expected lower temperatures. Consider pre-heating your home in the morning to avoid peak energy rates.",
      type: 'text'
    };
  }
  
  // Check for scheduling
  if (input.match(/(schedule|set up|automate)/i)) {
    return {
      text: "I can help you schedule your appliances for optimal energy usage. Would you like me to create an energy-efficient schedule for your home?",
      type: 'text'
    };
  }
  
  // Check for help
  if (input.match(/(help|assist|support|what can you do)/i)) {
    return {
      text: "I can help you with various energy-related tasks. You can ask me about:\n\n• Your energy usage and budget\n• Status of your appliances\n• Energy saving tips\n• Controlling your devices\n• Comparing energy usage over time\n• Weather impact on energy consumption\n• Scheduling appliances for efficiency\n\nTry asking something like 'What's my energy usage today?' or 'Turn off the living room lights.'",
      type: 'text'
    };
  }
  
  // Check for thanks
  if (input.match(/(thanks|thank you|thx)/i)) {
    return {
      text: "You're welcome! Is there anything else I can help you with?",
      type: 'text'
    };
  }
  
  // Check for jokes or fun
  if (input.match(/(joke|funny|fun fact)/i)) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything, including your electricity bill!",
      "I was going to tell a joke about electricity, but I was afraid you wouldn't be amped up about it.",
      "What did the light bulb say to its sweetheart? I watt you!",
      "Why did the lights go out? Because they liked each other!",
      "How many software developers does it take to change a light bulb? None, that's a hardware problem!"
    ];
    
    return {
      text: jokes[Math.floor(Math.random() * jokes.length)],
      type: 'text'
    };
  }
  
  // Check for affirmative responses in scheduling context
  const lastMessage = context.messages[context.messages.length - 1];
  if (lastMessage && 
      lastMessage.text.includes("create an energy-efficient schedule") && 
      input.match(/^(yes|yeah|sure|okay|ok|yep|y)$/i)) {
    
    const schedule = createEnergyEfficientSchedule(appliances);
    
    return {
      text: `Based on your current appliance usage, here's an energy-efficient schedule I recommend:\n\n${schedule}`,
      type: 'success'
    };
  }
  
  // Default response
  return {
    text: "I'm not sure I understand. You can ask me about your energy usage, appliance status, energy saving tips, or controlling your devices. How can I help you today?",
    type: 'text'
  };
};

// Helper function to create an energy-efficient schedule
const createEnergyEfficientSchedule = (appliances: Appliance[]): string => {
  const schedule = [];
  const peakHours = '2 PM - 6 PM';
  const offPeakHours = '10 PM - 6 AM';

  // Group appliances by category
  const categories = appliances.reduce((acc, app) => {
    const category = app.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(app);
    return acc;
  }, {} as Record<string, Appliance[]>);

  // Create schedule recommendations
  schedule.push("🌅 Morning (6 AM - 10 AM):");
  schedule.push("- Run dishwasher and washing machine for morning loads");
  schedule.push("- Use natural light instead of artificial lighting when possible\n");

  schedule.push(`🏢 Peak Hours (${peakHours}) - Minimize Usage:`);
  schedule.push("- Adjust thermostat by 2-3 degrees to reduce HVAC load");
  schedule.push("- Avoid running major appliances during these hours\n");

  schedule.push(`🌙 Evening Off-Peak (${offPeakHours}):`);
  schedule.push("- Schedule high-energy appliances like:");
  Object.entries(categories).forEach(([category, apps]) => {
    if (apps.some(a => a.currentPower_kw > 1)) {
      schedule.push(`  • ${category}: ${apps.map(a => a.name).join(', ')}`);
    }
  });

  return schedule.join('\n');
};

export default AIAssistant;