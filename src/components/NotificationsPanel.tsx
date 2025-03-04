import React, { useState, useEffect } from 'react';
import { Bell, X, AlertTriangle, Info, Check, Clock, ExternalLink, Trash2, Filter, MoreHorizontal, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notification } from '../types';
import { formatRelativeTime } from '../utils/dataUtils';

interface NotificationsPanelProps {
  notifications: Notification[];
  onUpdateNotifications: (notifications: Notification[]) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  notifications, 
  onUpdateNotifications,
  onClose, 
  isDarkMode 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'alerts'>('all');
  const [showActions, setShowActions] = useState<number | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  const alertCount = notifications.filter(notification => 
    (notification.type === 'warning' || notification.type === 'alert') && !notification.isRead
  ).length;

  // Filter notifications based on active tab
  const filteredNotifications = notifications
    .filter(notification => {
      if (activeTab === 'all') return true;
      if (activeTab === 'unread') return !notification.isRead;
      if (activeTab === 'alerts') return notification.type === 'warning' || notification.type === 'alert';
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp.getTime() - a.timestamp.getTime();
      } else {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
    });

  // Update notification times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      onUpdateNotifications(
        notifications.map(notification => ({
          ...notification,
          time: formatRelativeTime(notification.timestamp)
        }))
      );
    }, 60000);
    
    return () => clearInterval(interval);
  }, [notifications, onUpdateNotifications]);

  // Mark notification as read
  const markAsRead = (id: number) => {
    onUpdateNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    onUpdateNotifications(
      notifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    onUpdateNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    onUpdateNotifications([]);
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'warning':
        return <AlertTriangle className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />;
      case 'alert':
        return <AlertTriangle className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} />;
      case 'info':
        return <Info className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />;
      case 'success':
        return <Check className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-500'}`} />;
      default:
        return <Info className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />;
    }
  };

  // Get notification style based on type and read status
  const getNotificationStyle = (type: string, isRead: boolean) => {
    const baseStyle = isRead 
      ? isDarkMode ? 'bg-slate-700' : 'bg-gray-50' 
      : isDarkMode ? 'bg-slate-600' : 'bg-white';
    
    switch(type) {
      case 'warning':
        return `${baseStyle} ${isRead ? '' : isDarkMode ? 'border-l-4 border-yellow-500' : 'border-l-4 border-yellow-400'}`;
      case 'alert':
        return `${baseStyle} ${isRead ? '' : isDarkMode ? 'border-l-4 border-red-500' : 'border-l-4 border-red-400'}`;
      case 'info':
        return `${baseStyle} ${isRead ? '' : isDarkMode ? 'border-l-4 border-blue-500' : 'border-l-4 border-blue-400'}`;
      case 'success':
        return `${baseStyle} ${isRead ? '' : isDarkMode ? 'border-l-4 border-green-500' : 'border-l-4 border-green-400'}`;
      default:
        return baseStyle;
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // Toggle actions menu
    setShowActions(showActions === notification.id ? null : notification.id);
  };

  // Handle action click
  const handleActionClick = (e: React.MouseEvent, actionUrl: string) => {
    e.stopPropagation();
    // In a real app, this would navigate to the action URL
    console.log(`Navigating to: ${actionUrl}`);
    onClose();
  };

  return (
    <motion.div 
      className={`fixed inset-y-0 right-0 w-full sm:max-w-sm md:max-w-md ${isDarkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl z-50 overflow-hidden flex flex-col`}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Bell className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mr-2`} />
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Notifications
            {unreadCount > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                {unreadCount} new
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className={`p-2 rounded-full mr-1 ${isDarkMode ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="Filter notifications"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-slate-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            aria-label="Close notifications"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Filter dropdown menu */}
      <AnimatePresence>
        {isFilterMenuOpen && (
          <motion.div 
            className={`border-b ${isDarkMode ? 'border-gray-700 bg-slate-700' : 'border-gray-200 bg-gray-50'} p-3`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-2">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort by:</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSortOrder('newest')}
                  className={`px-3 py-1.5 text-xs rounded-lg ${
                    sortOrder === 'newest' 
                      ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                      : isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Newest first
                </button>
                <button 
                  onClick={() => setSortOrder('oldest')}
                  className={`px-3 py-1.5 text-xs rounded-lg ${
                    sortOrder === 'oldest' 
                      ? isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700' 
                      : isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Oldest first
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex p-2 border-b border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'all' 
              ? isDarkMode ? 'text-blue-400 border-b-2 border-blue-500' : 'text-blue-600 border-b-2 border-blue-500' 
              : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setActiveTab('unread')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'unread' 
              ? isDarkMode ? 'text-blue-400 border-b-2 border-blue-500' : 'text-blue-600 border-b-2 border-blue-500' 
              : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'alerts' 
              ? isDarkMode ? 'text-blue-400 border-b-2 border-blue-500' : 'text-blue-600 border-b-2 border-blue-500' 
              : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Alerts {alertCount > 0 && `(${alertCount})`}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              className={`${getNotificationStyle(notification.type, notification.isRead)} hover:${isDarkMode ? 'bg-slate-600' : 'bg-gray-50'} transition-colors cursor-pointer relative`}
            >
              <div 
                className="p-4"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{notification.title}</p>
                      {!notification.isRead && (
                        <span className={`inline-block w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{notification.message}</p>
                    <div className="flex items-center mt-2">
                      <Clock className={`w-3 h-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mr-1`} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                {notification.actionUrl && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={(e) => handleActionClick(e, notification.actionUrl!)}
                      className={`px-3 py-1 text-xs rounded-lg flex items-center ${
                        isDarkMode 
                          ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' 
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {notification.actionText || 'View Details'}
                      {notification.actionUrl?.startsWith('http') ? (
                        <ExternalLink className="w-3 h-3 ml-1" />
                      ) : (
                        <ChevronRight className="w-3 h-3 ml-1" />
                      )}
                    </button>
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Expanded actions menu */}
              <AnimatePresence>
                {showActions === notification.id && (
                  <motion.div 
                    className={`p-3 border-t ${isDarkMode ? 'border-gray-700 bg-slate-700' : 'border-gray-200 bg-gray-50'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between">
                      <button
                        onClick={() => {
                          if (notification.isRead) {
                            onUpdateNotifications(
                              notifications.map(n => n.id === notification.id ? { ...n, isRead: false } : n)
                            );
                          } else {
                            markAsRead(notification.id);
                          }
                          setShowActions(null);
                        }}
                        className={`flex items-center text-xs ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                      >
                        {notification.isRead ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Mark as unread
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Mark as read
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          deleteNotification(notification.id);
                          setShowActions(null);
                        }}
                        className={`flex items-center text-xs ${isDarkMode ? 'text-red-300 hover:text-red-200' : 'text-red-600 hover:text-red-700'}`}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <Bell className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'} mb-4`} />
            <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {activeTab === 'all' 
                ? 'No notifications yet' 
                : activeTab === 'unread' 
                ? 'No unread notifications' 
                : 'No alerts at this time'}
            </p>
            {activeTab !== 'all' && (
              <button
                onClick={() => setActiveTab('all')}
                className={`mt-4 px-4 py-2 text-sm rounded-lg ${
                  isDarkMode ? 'bg-slate-700 text-gray-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className={`p-4 border-t border-gray-200 ${isDarkMode ? 'bg-slate-700 border-gray-700' : 'bg-gray-50'}`}>
        <div className="flex justify-between">
          <button 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`py-2 text-sm font-medium ${
              unreadCount === 0
                ? isDarkMode ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
            } flex items-center`}
          >
            <Check className="w-4 h-4 mr-1.5" />
            Mark all as read
          </button>
          <button 
            onClick={clearAllNotifications}
            disabled={filteredNotifications.length === 0}
            className={`py-2 text-sm font-medium ${
              filteredNotifications.length === 0
                ? isDarkMode ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                : isDarkMode ? 'text-red-300 hover:text-red-200' : 'text-red-600 hover:text-red-700'
            } flex items-center`}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear all
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;