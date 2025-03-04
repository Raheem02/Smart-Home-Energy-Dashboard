# Smart Home Energy Dashboard

![Smart Home Energy Dashboard](https://img.shields.io/badge/Smart%20Home-Energy%20Dashboard-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

A modern, responsive dashboard for monitoring and optimizing home energy consumption with real-time data visualization and AI-powered recommendations.

## 🌟 Features

- **Real-time Energy Monitoring**: Track energy usage across all connected appliances
- **Interactive Dashboard**: Visualize energy consumption with beautiful charts and graphs
- **Budget Management**: Set and monitor daily energy budgets
- **AI Assistant**: Get personalized energy-saving recommendations
- **Device Control**: Turn devices on/off directly from the dashboard
- **Weather Integration**: See how weather affects your energy consumption
- **Dark/Light Mode**: Choose your preferred theme
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📊 Screenshots
![Dark-Mode](https://github.com/user-attachments/assets/718f1117-23aa-4a28-b6fe-27ce62ea3101)

![Light-Mode](https://github.com/user-attachments/assets/802e6487-72b1-4da5-bc74-54e450f56178)





## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/smart-home-energy-dashboard.git
   cd smart-home-energy-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🗄️ Database Setup

This project uses Supabase for the database. The migration files are located in the `supabase/migrations` directory.

To set up the database:

1. Connect to Supabase by clicking the "Connect to Supabase" button in the top right corner
2. The migrations will automatically create the necessary tables and sample data

## 🏗️ Project Structure

```
smart-home-energy-dashboard/
├── src/
│   ├── components/                 # UI components
│   │   ├── AIAssistant.tsx        # Smart AI energy assistant
│   │   ├── AddDeviceModal.tsx     # Add new device modal
│   │   ├── Alert.tsx              # Alert notifications
│   │   ├── ApplianceCard.tsx      # Individual appliance display
│   │   ├── BudgetSettings.tsx     # Energy budget configuration
│   │   ├── Dashboard.tsx          # Main dashboard view
│   │   ├── EnergyChart.tsx        # Energy usage visualization
│   │   ├── EnergyReportModal.tsx  # Detailed energy reports
│   │   ├── EnergyTips.tsx         # Energy saving tips
│   │   ├── Loader.tsx             # Loading animations
│   │   ├── NotificationsPanel.tsx # User notifications
│   │   └── WeatherWidget.tsx      # Weather information
│   │
│   ├── data/                      # Initial data and constants
│   │   └── initialData.ts         # Default application data
│   │
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts              # Shared type definitions
│   │
│   ├── utils/                     # Utility functions
│   │   └── dataUtils.ts          # Data processing utilities
│   │
│   ├── App.tsx                    # Main application component
│   ├── index.css                  # Global styles
│   ├── main.tsx                   # Application entry point
│   └── vite-env.d.ts             # Vite environment types
│
├── supabase/                      # Database configuration
│   └── migrations/                # Database migrations
│       ├── 20250302143656_foggy_butterfly.sql  # Initial schema
│       └── 20250303060520_soft_glade.sql       # Data seeding
│
├── public/                        # Static assets
│   ├── images/                    # Image assets
│   └── icons/                     # Icon assets
│
├── .gitignore                    # Git ignore rules
├── index.html                    # HTML entry point
├── package.json                  # Project dependencies
├── README.md                     # Project documentation
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

### Key Directories

- **components/**: React components for the UI, each focusing on a specific feature
- **data/**: Initial data and constants used throughout the application
- **types/**: TypeScript interfaces and type definitions
- **utils/**: Helper functions and utilities for data processing
- **supabase/**: Database schema and migration files
- **public/**: Static assets like images and icons

### Main Components

1. **Dashboard (Dashboard.tsx)**
   - Main interface showing energy usage summary
   - Coordinates display of all other components

2. **AI Assistant (AIAssistant.tsx)**
   - Natural language processing for user queries
   - Energy usage recommendations
   - Device control interface

3. **Energy Visualization (EnergyChart.tsx)**
   - Real-time energy usage graphs
   - Historical data visualization
   - Usage pattern analysis

4. **Device Management (ApplianceCard.tsx, AddDeviceModal.tsx)**
   - Individual appliance monitoring
   - Device control interface
   - Add/remove device functionality

5. **Budget Tools (BudgetSettings.tsx)**
   - Energy budget configuration
   - Usage tracking and alerts
   - Cost analysis features

6. **Weather Integration (WeatherWidget.tsx)**
   - Real-time weather data
   - Energy usage correlation
   - Temperature-based recommendations

7. **Notifications (NotificationsPanel.tsx, Alert.tsx)**
   - User alerts and notifications
   - System status updates
   - Energy usage warnings

8. **Energy Reports (EnergyReportModal.tsx, EnergyTips.tsx)**
   - Detailed usage analysis
   - Energy-saving recommendations
   - Efficiency reports

## 🧩 Key Components

- **Dashboard**: Main interface showing energy usage summary and appliance cards
- **ApplianceCard**: Displays individual appliance energy consumption
- **EnergyChart**: Visualizes energy usage over time
- **BudgetSettings**: Allows users to set and manage energy budgets
- **AIAssistant**: Provides personalized energy-saving recommendations
- **WeatherWidget**: Shows current weather and its impact on energy usage

## 🔌 Backend Integration

The frontend connects to a Java backend (not included in this repository) that provides:

- RESTful API endpoints for energy data
- Authentication and user management
- Device control and automation
- Historical data storage and analysis

## 🛠️ Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Lucide React (icons)

### Backend
- Java EE
- JAX-RS (Jersey)
- Hibernate ORM
- PostgreSQL

## 🧠 AI Assistant Features

The WattGuardian AI assistant provides intelligent interactions in the following categories:

1. **Basic Interactions**
   - Greet the assistant with "Hi", "Hello", "Hey", or "Greetings"
   - Get help with "What can you do?", "Help me", or "Show features"
   - End conversations with "Thank you", "Thanks", or "Bye"

2. **Energy Usage Monitoring**
   - Real-time usage: "What's my current energy consumption?"
   - Daily summary: "What's my total energy usage today?"
   - Device-specific: "Show me energy usage by device"
   - Category breakdown: "Show my energy usage by category"
   - Visual data: "Show me a chart of my electricity usage"
   - Historical data: "Show my energy usage history"

3. **Budget Management**
   - Check budget: "What's my energy budget?"
   - Usage tracking: "How much of my budget have I used?"
   - Budget status: "Am I within my energy limit?"
   - Set budget: "Help me set an energy budget"
   - Cost analysis: "What's my projected energy cost?"

4. **Device Management**
   - Status check: "Which devices are currently active?"
   - List devices: "Show me all connected devices"
   - Device details: "Tell me about my appliances"
   - Power status: "What appliances are running?"
   - Specific queries: "What's the status of my [device name]?"

5. **Device Control**
   - Power on: "Turn on [device name]"
   - Power off: "Turn off [device name]"
   - Schedule: "Set a timer for [device name]"
   - Multiple devices: "Turn off all devices in [room]"
   - Smart control: "Optimize device settings"

6. **Energy Efficiency**
   - Usage analysis: "What's using the most energy?"
   - Peak times: "Show me peak usage hours"
   - Efficiency tips: "Give me energy saving tips"
   - Cost reduction: "How can I reduce my energy bill?"
   - Smart suggestions: "Suggest energy-efficient settings"

7. **Comparative Analysis**
   - Daily comparison: "Compare today vs yesterday's usage"
   - Weekly trends: "Show my energy trends this week"
   - Monthly analysis: "Compare this month to last month"
   - Year-over-year: "How does this year compare to last year?"
   - Device comparison: "Which device is most efficient?"

8. **Weather Integration**
   - Weather impact: "How's the weather affecting my energy usage?"
   - Temperature correlation: "Show temperature vs energy usage"
   - Forecast adaptation: "Adjust settings for tomorrow's weather"
   - Seasonal tips: "Winter energy saving tips"
   - Climate control: "Optimize HVAC for current weather"

9. **Smart Scheduling**
   - Create schedule: "Set up an energy-efficient schedule"
   - Peak avoidance: "Schedule devices around peak hours"
   - Smart timing: "When is the best time to run [device]?"
   - Routine optimization: "Optimize my daily routine"
   - Automated control: "Set up smart automation rules"

10. **System Settings**
    - HVAC control: "Adjust HVAC settings"
    - Lighting control: "Manage lighting schedule"
    - Device thresholds: "Set power thresholds"
    - Night mode: "Configure night mode settings"
    - Alert settings: "Manage energy alerts"

11. **Reports and Analytics**
    - Usage patterns: "Analyze my usage patterns"
    - Cost breakdown: "Show my energy cost breakdown"
    - Efficiency report: "Generate an efficiency report"
    - Carbon footprint: "Calculate my carbon footprint"
    - Savings analysis: "Show my energy savings"

12. **Fun and Education**
    - Energy facts: "Tell me an energy fun fact"
    - Green tips: "Share eco-friendly tips"
    - Energy jokes: "Tell me a joke about energy"
    - Learning: "Teach me about energy efficiency"
    - Gamification: "Show my energy saving achievements"

### Quick Commands Reference

- 💡 **Instant Status**: "Status update"
- 📊 **Quick Report**: "Daily summary"
- 🔌 **Device Check**: "Device status"
- 💰 **Budget Check**: "Budget status"
- 🌡️ **Weather Impact**: "Weather check"
- ⏰ **Peak Hours**: "Peak times"
- 🔧 **Settings**: "Quick settings"
- 📱 **Controls**: "Quick controls"
- 📅 **Schedule**: "Today's schedule"
- 💪 **Optimization**: "Quick optimize"

### Tips for Best Results

1. Be specific with device names when controlling appliances
2. Use natural language for questions and commands
3. Specify time periods for usage queries (today, this week, this month)
4. Include location/room names for targeted controls
5. Use follow-up questions for more detailed information

## 🌐 Deployment

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Supabase](https://supabase.io/)
