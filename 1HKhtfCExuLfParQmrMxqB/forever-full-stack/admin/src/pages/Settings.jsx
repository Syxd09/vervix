import React, { useState, useEffect } from 'react'
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Globe, 
  CreditCard,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info,
  Download,
  FileText,
  TrendingUp,
  Users,
  Package,
  DollarSign
} from 'lucide-react'
import { useToast } from '../components/ModernToaster'
import { useSettings } from '../App'
import axios from 'axios'
import { backendUrl } from '../App'

const Settings = ({ token }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [generatingReport, setGeneratingReport] = useState(false)
  const { success, error, info } = useToast()
  const { settings, updateSettings } = useSettings()
  
  // Form states - now synced with context
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@vervix.com',
    phone: '+91 98765 43210',
    avatar: null
  })
  
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: 30
  })

  // Sync local state with context settings
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      name: settings.storeName || 'Admin User'
    }));
  }, [settings.storeName]);

  const handleSave = (section, data) => {
    // Update context immediately for real-time changes
    updateSettings(data);
    success(`${section} settings saved successfully!`)
  }

  const generateDetailedReport = async () => {
    setGeneratingReport(true);
    try {
      // Fetch all necessary data for the report
      const [ordersResponse, productsResponse, analyticsResponse] = await Promise.all([
        axios.post(backendUrl + '/api/order/list', {}, { headers: { token } }),
        axios.get(backendUrl + '/api/product/list'),
        axios.get(backendUrl + '/api/order/analytics', { headers: { token } })
      ]);

      const orders = ordersResponse.data.success ? ordersResponse.data.orders : [];
      const products = productsResponse.data.success ? productsResponse.data.products : [];
      const analytics = analyticsResponse.data.success ? analyticsResponse.data.analytics : {};

      // Calculate additional metrics
      const totalCustomers = new Set(orders.map(order => order.email)).size;
      const averageOrderValue = analytics.totalRevenue / analytics.totalOrders || 0;
      const topProducts = products
        .sort((a, b) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 10);

      // Create detailed report data
      const reportData = {
        generatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        storeInfo: {
          name: settings.storeName,
          currency: settings.currency,
          timezone: settings.timezone
        },
        summary: {
          totalOrders: analytics.totalOrders || 0,
          totalRevenue: analytics.totalRevenue || 0,
          totalCustomers,
          averageOrderValue,
          pendingOrders: analytics.pendingOrders || 0,
          totalProducts: products.length
        },
        revenueBreakdown: {
          monthly: generateMonthlyRevenue(orders),
          category: generateCategoryRevenue(orders),
          paymentMethods: generatePaymentMethods(orders)
        },
        customerAnalysis: {
          newCustomers: calculateNewCustomers(orders),
          repeatCustomers: calculateRepeatCustomers(orders),
          topCustomers: generateTopCustomers(orders)
        },
        productAnalysis: {
          topProducts,
          lowStockProducts: products.filter(p => (p.stock || 0) < 10),
          categoryDistribution: generateCategoryDistribution(products)
        },
        orderAnalysis: {
          statusDistribution: generateStatusDistribution(orders),
          orderTrends: generateOrderTrends(orders),
          deliveryPerformance: calculateDeliveryPerformance(orders)
        },
        detailedOrders: orders.map(order => ({
          orderId: order._id,
          customerEmail: order.email,
          customerAddress: order.address,
          items: order.items,
          amount: order.amount,
          status: order.status,
          date: new Date(order.date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          paymentMethod: order.paymentMethod || 'Unknown'
        }))
      };

      // Generate and download CSV report
      downloadCSVReport(reportData);
      success('Detailed report generated and downloaded successfully!');
    } catch (err) {
      console.error('Error generating report:', err);
      error('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadCSVReport = (data) => {
    // Create CSV content
    let csvContent = '';

    // Summary section
    csvContent += 'DETAILED BUSINESS REPORT\n';
    csvContent += `Generated: ${data.generatedAt}\n`;
    csvContent += `Store: ${data.storeInfo.name}\n\n`;

    csvContent += 'SUMMARY\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Orders,${data.summary.totalOrders}\n`;
    csvContent += `Total Revenue,₹${data.summary.totalRevenue.toLocaleString()}\n`;
    csvContent += `Total Customers,${data.summary.totalCustomers}\n`;
    csvContent += `Average Order Value,₹${data.summary.averageOrderValue.toFixed(2)}\n`;
    csvContent += `Pending Orders,${data.summary.pendingOrders}\n`;
    csvContent += `Total Products,${data.summary.totalProducts}\n\n`;

    // Revenue breakdown
    csvContent += 'MONTHLY REVENUE\n';
    csvContent += 'Month,Revenue\n';
    Object.entries(data.revenueBreakdown.monthly).forEach(([month, revenue]) => {
      csvContent += `${month},₹${revenue.toLocaleString()}\n`;
    });
    csvContent += '\n';

    // Top customers
    csvContent += 'TOP CUSTOMERS\n';
    csvContent += 'Email,Total Orders,Total Spent\n';
    data.customerAnalysis.topCustomers.slice(0, 10).forEach(customer => {
      csvContent += `${customer.email},${customer.orders},₹${customer.totalSpent.toLocaleString()}\n`;
    });
    csvContent += '\n';

    // Top products
    csvContent += 'TOP PRODUCTS\n';
    csvContent += 'Product Name,Category,Price,Sales\n';
    data.productAnalysis.topProducts.forEach(product => {
      csvContent += `"${product.name}",${product.category},₹${product.price},${product.sales || 0}\n`;
    });
    csvContent += '\n';

    // Detailed orders
    csvContent += 'DETAILED ORDERS\n';
    csvContent += 'Order ID,Customer Email,Items,Amount,Status,Date,Payment Method\n';
    data.detailedOrders.forEach(order => {
      const items = order.items.map(item => `${item.name} (${item.quantity})`).join('; ');
      csvContent += `${order.orderId},"${order.customerEmail}","${items}",₹${order.amount},${order.status},${order.date},${order.paymentMethod}\n`;
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vervix-business-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper functions for report generation
  const generateMonthlyRevenue = (orders) => {
    const monthly = {};
    orders.forEach(order => {
      const month = new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' });
      monthly[month] = (monthly[month] || 0) + order.amount;
    });
    return monthly;
  };

  const generateCategoryRevenue = (orders) => {
    const category = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        category[item.category] = (category[item.category] || 0) + (item.price * item.quantity);
      });
    });
    return category;
  };

  const generatePaymentMethods = (orders) => {
    const methods = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'Unknown';
      methods[method] = (methods[method] || 0) + 1;
    });
    return methods;
  };

  const calculateNewCustomers = (orders) => {
    const customerFirstOrder = {};
    orders.forEach(order => {
      if (!customerFirstOrder[order.email] || new Date(order.date) < new Date(customerFirstOrder[order.email])) {
        customerFirstOrder[order.email] = order.date;
      }
    });
    return Object.keys(customerFirstOrder).length;
  };

  const calculateRepeatCustomers = (orders) => {
    const customerOrderCount = {};
    orders.forEach(order => {
      customerOrderCount[order.email] = (customerOrderCount[order.email] || 0) + 1;
    });
    return Object.values(customerOrderCount).filter(count => count > 1).length;
  };

  const generateTopCustomers = (orders) => {
    const customerStats = {};
    orders.forEach(order => {
      if (!customerStats[order.email]) {
        customerStats[order.email] = { orders: 0, totalSpent: 0 };
      }
      customerStats[order.email].orders += 1;
      customerStats[order.email].totalSpent += order.amount;
    });
    return Object.entries(customerStats)
      .map(([email, stats]) => ({ email, ...stats }))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  };

  const generateCategoryDistribution = (products) => {
    const distribution = {};
    products.forEach(product => {
      distribution[product.category] = (distribution[product.category] || 0) + 1;
    });
    return distribution;
  };

  const generateStatusDistribution = (orders) => {
    const distribution = {};
    orders.forEach(order => {
      distribution[order.status] = (distribution[order.status] || 0) + 1;
    });
    return distribution;
  };

  const generateOrderTrends = (orders) => {
    const trends = {};
    orders.forEach(order => {
      const date = new Date(order.date).toLocaleDateString('en-IN');
      trends[date] = (trends[date] || 0) + 1;
    });
    return trends;
  };

  const calculateDeliveryPerformance = (orders) => {
    const delivered = orders.filter(order => order.status === 'Delivered').length;
    return {
      delivered,
      total: orders.length,
      percentage: orders.length > 0 ? (delivered / orders.length * 100).toFixed(2) : 0
    };
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'store', label: 'Store Settings', icon: Database },
    { id: 'billing', label: 'Billing & Reports', icon: CreditCard }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and application preferences</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-500">Real-time updates enabled</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="dashboard-card">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="dashboard-card">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="input-modern"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="input-modern"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="input-modern"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <button className="btn-secondary">Upload New</button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button onClick={() => handleSave('Profile', profileData)} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                        className="input-modern pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                        className="input-modern pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                      className="input-modern pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={securityData.twoFactorEnabled}
                        onChange={(e) => setSecurityData({...securityData, twoFactorEnabled: e.target.checked})}
                        className="sr-only"
                      />
                      <div className="toggle-slider"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <select
                      value={securityData.sessionTimeout}
                      onChange={(e) => setSecurityData({...securityData, sessionTimeout: e.target.value})}
                      className="input-modern"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button onClick={() => handleSave('Security', securityData)} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Update Security</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-yellow-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(settings).filter(([key]) => key.includes('Notifications') || key.includes('Alerts') || key.includes('Reports') || key.includes('Emails')).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                          {key === 'orderAlerts' && 'Get notified when new orders are placed'}
                          {key === 'lowStockAlerts' && 'Receive alerts when products are running low'}
                          {key === 'weeklyReports' && 'Get weekly performance reports via email'}
                          {key === 'marketingEmails' && 'Receive marketing and promotional emails'}
                        </p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => updateSettings({ [key]: e.target.checked })}
                          className="sr-only"
                        />
                        <div className="toggle-slider"></div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button onClick={() => handleSave('Notification', {})} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Palette className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Appearance & Theme</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select
                      value={settings.theme}
                      onChange={(e) => updateSettings({ theme: e.target.value })}
                      className="input-modern"
                    >
                      <option value="light">Light Theme</option>
                      <option value="dark">Dark Theme</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSettings({ language: e.target.value })}
                      className="input-modern"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Enable Animations</h3>
                      <p className="text-sm text-gray-500">Show smooth animations and transitions</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.animations}
                        onChange={(e) => updateSettings({ animations: e.target.checked })}
                        className="sr-only"
                      />
                      <div className="toggle-slider"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Compact Mode</h3>
                      <p className="text-sm text-gray-500">Reduce spacing for more content on screen</p>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings.compactMode}
                        onChange={(e) => updateSettings({ compactMode: e.target.checked })}
                        className="sr-only"
                      />
                      <div className="toggle-slider"></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button onClick={() => handleSave('Appearance', {})} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Apply Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Store Settings */}
            {activeTab === 'store' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Database className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Store Configuration</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => updateSettings({ storeName: e.target.value })}
                      className="input-modern"
                      placeholder="Enter store name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSettings({ currency: e.target.value })}
                      className="input-modern"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => updateSettings({ timezone: e.target.value })}
                      className="input-modern"
                    >
                      <option value="IST">IST (India)</option>
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSettings({ language: e.target.value })}
                      className="input-modern"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
                  <textarea
                    value={settings.storeDescription}
                    onChange={(e) => updateSettings({ storeDescription: e.target.value })}
                    className="input-modern"
                    rows="4"
                    placeholder="Enter store description"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button onClick={() => handleSave('Store', {})} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Update Store</span>
                  </button>
                </div>
              </div>
            )}

            {/* Billing & Reports Settings */}
            {activeTab === 'billing' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Billing & Reports</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Business Reports</h3>
                        <p className="text-sm text-gray-600">Generate detailed business analytics</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Revenue analysis</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">Customer insights</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-700">Product performance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">Order analytics</span>
                      </div>
                    </div>
                    <button 
                      onClick={generateDetailedReport}
                      disabled={generatingReport}
                      className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {generatingReport ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating Report...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Download Detailed Report</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <CreditCard className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Billing Management</h3>
                        <p className="text-sm text-gray-600">Manage subscriptions & payments</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">Current plan: Premium</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">Next billing: 15 days</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                      Manage Billing
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Report Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>• Complete order history with customer details</div>
                    <div>• Revenue breakdown by month and category</div>
                    <div>• Customer analysis and top customers</div>
                    <div>• Product performance and sales data</div>
                    <div>• Payment method distribution</div>
                    <div>• Delivery performance metrics</div>
                    <div>• Stock level analysis</div>
                    <div>• Exportable CSV format</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 