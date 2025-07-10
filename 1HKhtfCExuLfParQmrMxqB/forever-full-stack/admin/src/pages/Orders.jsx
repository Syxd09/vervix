import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { useToast } from '../components/ModernToaster'
import { useSettings } from '../App'
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  MapPin, 
  Phone, 
  Calendar,
  DollarSign,
  CreditCard,
  Filter
} from 'lucide-react'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const { success, error } = useToast()
  const { settings } = useSettings()

  // Use settings currency or fallback to default
  const currentCurrency = settings.currency === 'INR' ? '₹' : currency

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      setLoading(true)
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        error(response.data.message)
      }
    } catch (error) {
      error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        success('Order status updated successfully')
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Order Placed':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'Packing':
        return <Package className="w-4 h-4 text-blue-500" />
      case 'Shipped':
        return <Truck className="w-4 h-4 text-purple-500" />
      case 'Out for delivery':
        return <Truck className="w-4 h-4 text-orange-500" />
      case 'Delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Placed':
        return 'bg-yellow-100 text-yellow-800'
      case 'Packing':
        return 'bg-blue-100 text-blue-800'
      case 'Shipped':
        return 'bg-purple-100 text-purple-800'
      case 'Out for delivery':
        return 'bg-orange-100 text-orange-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer orders and track delivery status</p>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">{orders.length} orders</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Orders</option>
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for delivery">Out for delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">No orders match your current filter criteria.</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Order #{order._id.slice(-8)}</h3>
                      <p className="text-xs text-gray-500">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{currentCurrency}{order.amount}</p>
                      <p className="text-xs text-gray-500">{order.items.length} items</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Products */}
                  <div className="lg:col-span-2">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{currency}{item.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info & Actions */}
                  <div className="space-y-4">
                    {/* Customer Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Customer Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {order.address.firstName} {order.address.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{order.address.street}</p>
                            <p className="text-xs text-gray-500">
                              {order.address.city}, {order.address.state} {order.address.zipcode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-700">{order.address.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Information</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {order.paymentMethod === 'Razorpay' ? (
                              <CreditCard className="w-4 h-4 text-green-500" />
                            ) : (
                              <DollarSign className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="text-sm text-gray-700">{order.paymentMethod}</span>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.payment ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Update Status</h4>
                      <select 
                        onChange={(event) => statusHandler(event, order._id)} 
                        value={order.status} 
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders