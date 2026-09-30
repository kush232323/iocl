import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import EarthPitTest from './components/electrical/EarthPitTest';
import ThermalOverloadRelayTesting from './components/electrical/ThermalOverloadRelayTesting';
import MotorMeggerTest from './components/electrical/MotorMeggerTest';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTopMenu, setActiveTopMenu] = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState('dashboard-main');
  const [openSubMenus, setOpenSubMenus] = useState({
    dashboard: false,
    electrical: false
  });

  const toggleSubMenu = (menu) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Top Menus - Dashboard and Electrical
  const topMenus = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'electrical', label: 'Electrical', icon: '⚡' }
  ];

  // Menu Data with sub-menus
  const menuData = {
    dashboard: [
      { id: 'dashboard-main', label: 'Main Dashboard', icon: '📊' },
      { id: 'dashboard-analytics', label: 'Analytics', icon: '📈' },
      { id: 'dashboard-reports', label: 'Reports', icon: '📋' },
      {
        id: 'dashboard-settings',
        label: '⚙️ Settings',
        icon: '⚙️',
        isGroup: true,
        subItems: [
          { id: 'general-settings', label: 'General Settings', icon: '🔧' },
          { id: 'profile-settings', label: 'Profile Settings', icon: '👤' },
          { id: 'security-settings', label: 'Security Settings', icon: '🔒' }
        ]
      }
    ],
    electrical: [
      { id: 'earth-pit-test', label: 'Earth Pit Test', icon: '🌍' },
      { id: 'thermal-overload-relay', label: 'Thermal Overload Relay', icon: '🔥' },
      { id: 'motor-megger-test', label: 'Motor Megger Test', icon: '🔋' },
      { id: 'cable-testing', label: 'Cable Testing', icon: '🔌' },
      { id: 'transformer-test', label: 'Transformer Test', icon: '⚡' },
      {
        id: 'electrical-settings',
        label: '⚙️ Settings',
        icon: '⚙️',
        isGroup: true,
        subItems: [
          { id: 'test-parameters', label: 'Test Parameters', icon: '📊' },
          { id: 'equipment-list', label: 'Equipment List', icon: '🔧' },
          { id: 'safety-check', label: 'Safety Check', icon: '🛡️' }
        ]
      }
    ]
  };

  const renderContent = () => {
    // Earth Pit Test
    if (activeSubMenu === 'earth-pit-test') {
      return <EarthPitTest />;
    }

    // Thermal Overload Relay Testing
    if (activeSubMenu === 'thermal-overload-relay') {
      return <ThermalOverloadRelayTesting />;
    }

    // Motor Megger Test
    if (activeSubMenu === 'motor-megger-test') {
      return <MotorMeggerTest />;
    }

    // Default content for other menus
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <h1 className="text-6xl md:text-8xl font-bold text-blue-600 animate-pulse">
            Hello World!
          </h1>
          <p className="text-lg text-gray-500 mt-4">
            Selected: {activeSubMenu}
          </p>
        </div>
      </div>
    );
  };

  // Sidebar render function with sub-menus
  const renderSidebarItems = () => {
    const items = menuData[activeTopMenu] || [];
    
    return items.map((item) => {
      if (item.isGroup) {
        const isOpen = openSubMenus[item.id];
        return (
          <div key={item.id} className="mb-1">
            <button
              onClick={() => toggleSubMenu(item.id)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-gray-300 hover:bg-gray-800 rounded-lg transition-all text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className="text-gray-500">{isOpen ? '▼' : '▶'}</span>
            </button>
            {isOpen && (
              <div className="ml-4 border-l-2 border-gray-700 pl-2">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => setActiveSubMenu(subItem.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${
                      activeSubMenu === subItem.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-sm">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }
      
      return (
        <button
          key={item.id}
          onClick={() => setActiveSubMenu(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
            activeSubMenu === item.id
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <span className="text-base">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      );
    });
  };

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 text-white transition-all duration-300 flex flex-col flex-shrink-0`}>
          {/* Logo */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            {sidebarOpen ? (
              <span className="font-bold text-lg">School ERP</span>
            ) : (
              <span className="font-bold text-lg">📚</span>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {/* Sidebar Menu */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            {sidebarOpen ? (
              renderSidebarItems()
            ) : (
              <div className="flex flex-col items-center gap-3">
                {(menuData[activeTopMenu] || []).map((item) => {
                  if (item.isGroup) {
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleSubMenu(item.id)}
                        className="w-10 h-10 flex items-center justify-center text-gray-300 hover:bg-gray-800 rounded-lg transition-all text-xl relative"
                        title={item.label}
                      >
                        {item.icon}
                      </button>
                    );
                  }
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSubMenu(item.id)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all text-xl ${
                        activeSubMenu === item.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                      title={item.label}
                    >
                      {item.icon}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            {sidebarOpen ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">👤</div>
                  <div>
                    <p className="text-sm font-semibold">Admin</p>
                    <p className="text-xs text-gray-400">Super Admin</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">🚪</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">👤</div>
                <button className="text-gray-400 hover:text-white">🚪</button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-gray-600 text-2xl"
                >
                  ☰
                </button>
                <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
                  {topMenus.find(m => m.id === activeTopMenu)?.label || 'Dashboard'} / {activeSubMenu}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden md:block">👋 Welcome, Admin</span>
                <button className="text-gray-600 hover:text-gray-800">🔔</button>
              </div>
            </div>

            {/* Top Menu Tabs */}
            <div className="px-6 border-t border-gray-100 overflow-x-auto">
              <div className="flex gap-1">
                {topMenus.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => {
                      setActiveTopMenu(menu.id);
                      const firstItem = menuData[menu.id]?.[0];
                      if (firstItem) {
                        setActiveSubMenu(firstItem.id);
                      }
                    }}
                    className={`px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTopMenu === menu.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800 hover:border-b-2 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{menu.icon}</span>
                    {menu.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content - Routes */}
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={renderContent()} />
              <Route path="/earth-pit-test" element={<EarthPitTest />} />
              <Route path="/thermal-overload-relay" element={<ThermalOverloadRelayTesting />} />
              <Route path="/motor-megger-test" element={<MotorMeggerTest />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;