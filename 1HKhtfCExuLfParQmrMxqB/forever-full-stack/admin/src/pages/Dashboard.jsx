import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { useToast } from '../components/ModernToaster'
import { useSettings } from '../App'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap
} from 'lucide-react'

const Dashboard = ({ token }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const { error } = useToast()
  const { settings } = useSettings()

  // Use settings currency or fallback to default
  const currentCurrency = settings.currency === 'INR' ? '₹' : currency

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/order/analytics', {
        headers: { token }
      })
      if (response.data.success) {
        setAnalytics(response.data.analytics)
      } else {
        error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [token])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 loading-dots">Loading dashboard data</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
        <p className="text-gray-500">Start adding products and orders to see analytics</p>
      </div>
    )
  }

  // Calculate growth percentages (mock data for demo)
  const growthData = {
    orders: 12.5,
    revenue: 8.3,
    products: 5.7,
    customers: 15.2
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-modern w-auto"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            <button 
              onClick={fetchAnalytics}
              className="btn-primary flex items-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card group hover:card-shadow-hover">
          <div className="dashboard-card-header">
            <div>
              <p className="dashboard-card-title">Total Orders</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm font-medium ${growthData.orders > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthData.orders > 0 ? '+' : ''}{growthData.orders}%
                </span>
                {growthData.orders > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="dashboard-card-icon bg-gradient-to-r from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <p className="dashboard-card-value">{analytics.totalOrders.toLocaleString()}</p>
        </div>

        <div className="dashboard-card group hover:card-shadow-hover">
          <div className="dashboard-card-header">
            <div>
              <p className="dashboard-card-title">Total Revenue</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm font-medium ${growthData.revenue > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthData.revenue > 0 ? '+' : ''}{growthData.revenue}%
                </span>
                {growthData.revenue > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="dashboard-card-icon bg-gradient-to-r from-green-500 to-green-600 text-white group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="dashboard-card-value">{currentCurrency}{analytics.totalRevenue.toLocaleString()}</p>
        </div>

        <div className="dashboard-card group hover:card-shadow-hover">
          <div className="dashboard-card-header">
            <div>
              <p className="dashboard-card-title">Pending Orders</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium text-yellow-600">
                  {analytics.pendingOrders} orders
                </span>
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="dashboard-card-icon bg-gradient-to-r from-yellow-500 to-yellow-600 text-white group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="dashboard-card-value">{analytics.pendingOrders}</p>
        </div>

        <div className="dashboard-card group hover:card-shadow-hover">
          <div className="dashboard-card-header">
            <div>
              <p className="dashboard-card-title">Total Products</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-sm font-medium ${growthData.products > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {growthData.products > 0 ? '+' : ''}{growthData.products}%
                </span>
                {growthData.products > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm text-gray-500">vs last period</span>
              </div>
            </div>
            <div className="dashboard-card-icon bg-gradient-to-r from-purple-500 to-purple-600 text-white group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="dashboard-card-value">{analytics.totalProducts.toLocaleString()}</p>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Monthly Revenue Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.monthlyRevenue}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="_id" 
                tickFormatter={(value) => `${value.month}/${value.year}`}
                stroke="#9CA3AF"
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                formatter={(value) => [`${currentCurrency}${value}`, 'Revenue']}
                labelFormatter={(value) => `Month: ${value.month}/${value.year}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fill="url(#colorRevenue)"
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Category Sales Chart */}
        <div className="chart-container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Sales by Category</h3>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Distribution</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categorySales}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
              >
                {analytics.categorySales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${currentCurrency}${value}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Top Products Table */}
      <div className="chart-container">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Top Selling Products</h3>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Performance</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td>
                    <div className="flex items-center">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        #{index + 1}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">{product._id}</span>
                    </div>
                  </td>
                  <td>
                    <span className="font-medium text-gray-900">{product.totalSold}</span>
                    <span className="text-sm text-gray-500 ml-1">units</span>
                  </td>
                  <td>
                    <span className="font-bold text-gray-900">{currentCurrency}{product.revenue.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min((product.totalSold / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.min((product.totalSold / 100) * 100, 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="chart-container">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-300 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Add New Product</h4>
            <p className="text-sm text-gray-500">Create and manage your product catalog</p>
          </button>
          
          <button className="group p-6 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all duration-300 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">View Orders</h4>
            <p className="text-sm text-gray-500">Track and manage customer orders</p>
          </button>
          
          <button className="group p-6 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-300 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">View Analytics</h4>
            <p className="text-sm text-gray-500">Detailed insights and reports</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 