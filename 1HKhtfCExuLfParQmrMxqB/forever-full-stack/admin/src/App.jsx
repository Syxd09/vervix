import React, { useEffect, useState, createContext, useContext } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Login from './components/Login'
import { ToastProvider } from './components/ModernToaster'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

// Settings Context for real-time updates
const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Settings state for real-time updates
  const [settings, setSettings] = useState({
    storeName: 'Vervix Store',
    storeDescription: 'Premium fashion store',
    currency: 'INR',
    timezone: 'IST',
    language: 'English',
    theme: 'light',
    sidebarCollapsed: false,
    animations: true,
    compactMode: false,
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // Save to localStorage for persistence
    localStorage.setItem('adminSettings', JSON.stringify({ ...settings, ...newSettings }));
  };

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  // Load settings from localStorage on app start
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      <ToastProvider>
        <div className='bg-gray-50 min-h-screen'>
          {token === ""
            ? <Login setToken={setToken} />
            : <>
              <Navbar setToken={setToken} toggleSidebar={toggleSidebar} />
              <div className='flex w-full'>
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <div className='flex-1 p-6 transition-all duration-300'>
                  <Routes>
                    <Route path='/' element={<Dashboard token={token} />} />
                    <Route path='/add' element={<Add token={token} />} />
                    <Route path='/list' element={<List token={token} />} />
                    <Route path='/orders' element={<Orders token={token} />} />
                    <Route path='/settings' element={<Settings token={token} />} />
                  </Routes>
                </div>
              </div>
            </>
          }
        </div>
      </ToastProvider>
    </SettingsContext.Provider>
  )
}

export default App