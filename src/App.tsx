import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import BudgetSettings from './components/BudgetSettings';
import EnergyChart from './components/EnergyChart';
import Loader from './components/Loader';
import AddDeviceModal from './components/AddDeviceModal';
import NotificationsPanel from './components/NotificationsPanel';
import EnergyReportModal from './components/EnergyReportModal';
import AIAssistant from './components/AIAssistant';
import { initialAppliances, initialNotifications } from './data/initialData';
import { Appliance, Notification } from './types';
import { 
  calculateTotalUsage, 
  generateHistoryEntry,
  limitHistoryData
} from './utils/dataUtils';

function App() {
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);
  const [budget, setBudget] = useState<number | null>(null);
  const [selectedApplianceId, setSelectedApplianceId] = useState<number | null>(null);
  const [showBudgetSettings, setShowBudgetSettings] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [energyRate, setEnergyRate] = useState<number>(20); // Changed to ₹20 per kWh
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showEnergyReport, setShowEnergyReport] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

  // Get the selected appliance
  const selectedAppliance = selectedApplianceId 
    ? appliances.find(a => a.id === selectedApplianceId) 
    : null;

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  // Update data every 5 seconds
  useEffect(() => {
    const updateData = () => {
      setAppliances(prev => 
        prev.map(appliance => {
          // Only update if the appliance is on
          if (appliance.isOn) {
            // Generate random power between 50% and 150% of current value to simulate fluctuation
            const currentValue = appliance.currentPower_kw;
            const fluctuationFactor = 0.5 + Math.random();
            const newPower = Math.max(0.05, currentValue * fluctuationFactor);
            
            // Add new history entry
            const newHistoryEntry = generateHistoryEntry(newPower);
            
            // Limit history to last 24 hours
            const updatedHistory = limitHistoryData([
              ...appliance.history,
              newHistoryEntry
            ]);
            
            return { 
              ...appliance, 
              currentPower_kw: newPower, 
              history: updatedHistory,
              dailyUsage: appliance.dailyUsage ? appliance.dailyUsage + (newPower * 0.25 / 24) : Math.random() * 5,
              monthlyUsage: appliance.monthlyUsage ? appliance.monthlyUsage + (newPower * 0.25 / 720) : Math.random() * 150
            };
          }
          return appliance;
        })
      );
    };

    // Initial update
    if (!isLoading) {
      updateData();
      
      // Set interval for updates
      const interval = setInterval(updateData, 5000);
      
      // Clean up interval on unmount
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Calculate total usage
  const totalUsage = calculateTotalUsage(appliances);

  // Check if usage is approaching budget
  useEffect(() => {
    setAlert(budget !== null && totalUsage >= 0.9 * budget);
  }, [totalUsage, budget]);

  // Count unread notifications
  useEffect(() => {
    setUnreadNotificationCount(notifications.filter(n => !n.isRead).length);
  }, [notifications]);

  // Generate new notifications based on system events
  useEffect(() => {
    // Check for budget alerts
    if (budget && totalUsage >= 0.9 * budget && !notifications.some(n => n.title === "Energy Budget Alert" && !n.isRead)) {
      const newNotification: Notification = {
        id: Date.now(),
        title: "Energy Budget Alert",
        message: `You've used ${Math.round((totalUsage / budget) * 100)}% of your daily energy budget.`,
        time: "Just now",
        timestamp: new Date(),
        type: "warning",
        isRead: false,
        actionUrl: "/budget",
        actionText: "View Budget"
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
    
    // Check for high power consumption appliances
    appliances.forEach(appliance => {
      if (appliance.isOn && appliance.currentPower_kw > 1.5 && Math.random() > 0.95) {
        const newNotification: Notification = {
          id: Date.now() + appliance.id,
          title: `${appliance.name} High Power Alert`,
          message: `Your ${appliance.name} is consuming unusually high power (${appliance.currentPower_kw.toFixed(2)} kW).`,
          time: "Just now",
          timestamp: new Date(),
          type: "alert",
          isRead: false,
          actionUrl: `/appliances/${appliance.id}`,
          actionText: "Check Device"
        };
        
        // Only add if there isn't already a similar unread notification
        if (!notifications.some(n => n.title.includes(appliance.name) && !n.isRead)) {
          setNotifications(prev => [newNotification, ...prev]);
        }
      }
    });
  }, [appliances, budget, totalUsage, notifications]);

  // Handle selecting an appliance
  const handleSelectAppliance = (id: number) => {
    setSelectedApplianceId(id);
  };

  // Handle closing the chart
  const handleCloseChart = () => {
    setSelectedApplianceId(null);
  };

  // Handle opening budget settings
  const handleOpenBudgetSettings = () => {
    setShowBudgetSettings(true);
  };

  // Handle closing budget settings
  const handleCloseBudgetSettings = () => {
    setShowBudgetSettings(false);
  };

  // Handle saving budget
  const handleSaveBudget = (newBudget: number) => {
    setBudget(newBudget);
  };

  // Handle toggling dark mode
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Handle opening notifications
  const handleOpenNotifications = () => {
    setShowNotifications(true);
  };

  // Handle closing notifications
  const handleCloseNotifications = () => {
    setShowNotifications(false);
    
    // Mark all notifications as read when panel is closed
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Handle opening energy report
  const handleOpenEnergyReport = () => {
    setShowEnergyReport(true);
  };

  // Handle closing energy report
  const handleCloseEnergyReport = () => {
    setShowEnergyReport(false);
  };

  // Handle toggling appliance state
  const handleToggleApplianceState = (id: number, isOn: boolean) => {
    setAppliances(prev => 
      prev.map(appliance => 
        appliance.id === id ? { ...appliance, isOn } : appliance
      )
    );
    
    // Generate notification for turning off devices
    if (!isOn) {
      const appliance = appliances.find(a => a.id === id);
      if (appliance) {
        const newNotification: Notification = {
          id: Date.now(),
          title: `${appliance.name} Turned Off`,
          message: `You've turned off your ${appliance.name}, saving approximately ${(appliance.currentPower_kw * 24).toFixed(2)} kWh per day.`,
          time: "Just now",
          timestamp: new Date(),
          type: "success",
          isRead: false
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }
  };

  // Handle adding a new device
  const handleAddDevice = (device: Appliance) => {
    setAppliances(prev => [...prev, device]);
    
    // Generate notification for new device
    const newNotification: Notification = {
      id: Date.now(),
      title: "New Device Added",
      message: `${device.name} has been added to your dashboard.`,
      time: "Just now",
      timestamp: new Date(),
      type: "info",
      isRead: false,
      actionUrl: `/appliances/${device.id}`,
      actionText: "View Device"
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Handle updating notifications
  const handleUpdateNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900' : 'bg-gray-100'}`}>
      {isLoading ? (
        <Loader isDarkMode={isDarkMode} />
      ) : (
        <>
          <Dashboard
            appliances={appliances}
            totalUsage={totalUsage}
            budget={budget}
            alert={alert}
            onSelectAppliance={handleSelectAppliance}
            onOpenBudgetSettings={handleOpenBudgetSettings}
            onToggleTheme={handleToggleTheme}
            isDarkMode={isDarkMode}
            onOpenNotifications={handleOpenNotifications}
            onOpenEnergyReport={handleOpenEnergyReport}
            onToggleApplianceState={handleToggleApplianceState}
            onAddDevice={() => setShowAddDeviceModal(true)}
            notificationCount={unreadNotificationCount}
          />
          
          {showBudgetSettings && (
            <BudgetSettings
              currentBudget={budget}
              onSaveBudget={handleSaveBudget}
              onClose={handleCloseBudgetSettings}
              isDarkMode={isDarkMode}
              energyRate={energyRate}
              onUpdateEnergyRate={setEnergyRate}
            />
          )}
          
          {selectedAppliance && (
            <EnergyChart
              appliance={selectedAppliance}
              onClose={handleCloseChart}
              isDarkMode={isDarkMode}
            />
          )}

          {showAddDeviceModal && (
            <AddDeviceModal
              onClose={() => setShowAddDeviceModal(false)}
              onAddDevice={handleAddDevice}
              isDarkMode={isDarkMode}
            />
          )}

          {showNotifications && (
            <NotificationsPanel
              notifications={notifications}
              onUpdateNotifications={handleUpdateNotifications}
              onClose={handleCloseNotifications}
              isDarkMode={isDarkMode}
            />
          )}

          {showEnergyReport && (
            <EnergyReportModal
              onClose={handleCloseEnergyReport}
              isDarkMode={isDarkMode}
              monthlyData={[
                // Sample data - you should replace this with real data
                { month: 'Jan', usage: 450, cost: 9000, previousYearUsage: 480 },
                { month: 'Feb', usage: 420, cost: 8400, previousYearUsage: 460 },
                { month: 'Mar', usage: 480, cost: 9600, previousYearUsage: 450 }
              ]}
              categoryData={[
                { name: 'Heating', value: 35, color: '#EF4444' },
                { name: 'Cooling', value: 25, color: '#3B82F6' },
                { name: 'Lighting', value: 20, color: '#F59E0B' },
                { name: 'Kitchen', value: 15, color: '#10B981' },
                { name: 'Other', value: 5, color: '#6B7280' }
              ]}
            />
          )}
          
          {/* AI Assistant */}
          <AIAssistant
            isDarkMode={isDarkMode}
            appliances={appliances}
            totalUsage={totalUsage}
            budget={budget}
            onToggleApplianceState={handleToggleApplianceState}
          />
        </>
      )}
    </div>
  );
}

export default App;