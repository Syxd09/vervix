import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { 
  LayoutDashboard, 
  Plus, 
  Package, 
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react'

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar-modern fixed lg:relative z-50 transform transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isOpen ? 'w-64' : 'w-0 lg:w-64'}`}>
        <div className='p-6 h-full flex flex-col'>
          {/* Header with Toggle */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center space-x-3'>
              <div className="relative">
                <img className='w-10 h-10 rounded-xl shadow-lg' src={assets.logo} alt="Logo" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="transition-all duration-300">
                <h1 className='text-xl font-bold text-gray-800'>Vervix Admin</h1>
                <p className="text-xs text-gray-500">Management Panel</p>
              </div>
            </div>
            
            {/* Mobile Close Button */}
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Enhanced Navigation */}
          <nav className='space-y-2 flex-1'>
            <NavLink 
              className={({ isActive }) => 
                `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-105'
                }`
              } 
              to="/"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'isActive' ? 'bg-white bg-opacity-20' : 'bg-blue-50 group-hover:bg-blue-100'
              }`}>
                <LayoutDashboard className='w-5 h-5' />
              </div>
              <span className='font-medium transition-all duration-300'>Dashboard</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                'isActive' ? 'rotate-90' : 'group-hover:translate-x-1'
              }`} />
            </NavLink>

            <NavLink 
              className={({ isActive }) => 
                `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-105'
                }`
              } 
              to="/add"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'isActive' ? 'bg-white bg-opacity-20' : 'bg-green-50 group-hover:bg-green-100'
              }`}>
                <Plus className='w-5 h-5' />
              </div>
              <span className='font-medium transition-all duration-300'>Add Product</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                'isActive' ? 'rotate-90' : 'group-hover:translate-x-1'
              }`} />
            </NavLink>

            <NavLink 
              className={({ isActive }) => 
                `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-105'
                }`
              } 
              to="/list"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'isActive' ? 'bg-white bg-opacity-20' : 'bg-purple-50 group-hover:bg-purple-100'
              }`}>
                <Package className='w-5 h-5' />
              </div>
              <span className='font-medium transition-all duration-300'>Products</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                'isActive' ? 'rotate-90' : 'group-hover:translate-x-1'
              }`} />
            </NavLink>

            <NavLink 
              className={({ isActive }) => 
                `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-105'
                }`
              } 
              to="/orders"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'isActive' ? 'bg-white bg-opacity-20' : 'bg-orange-50 group-hover:bg-orange-100'
              }`}>
                <ShoppingCart className='w-5 h-5' />
              </div>
              <span className='font-medium transition-all duration-300'>Orders</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                'isActive' ? 'rotate-90' : 'group-hover:translate-x-1'
              }`} />
            </NavLink>

            <NavLink 
              className={({ isActive }) => 
                `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:transform hover:scale-105'
                }`
              } 
              to="/settings"
              onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'isActive' ? 'bg-white bg-opacity-20' : 'bg-indigo-50 group-hover:bg-indigo-100'
              }`}>
                <Settings className='w-5 h-5' />
              </div>
              <span className='font-medium transition-all duration-300'>Settings</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                'isActive' ? 'rotate-90' : 'group-hover:translate-x-1'
              }`} />
            </NavLink>
          </nav>

          {/* Enhanced Footer */}
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <button className='group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 w-full'>
              <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-gray-100 flex items-center justify-center transition-all duration-300">
                <Settings className='w-5 h-5' />
              </div>
              <span className='font-medium transition-all duration-300'>Settings</span>
              <ChevronRight className='w-4 h-4 ml-auto transition-transform duration-300 group-hover:translate-x-1' />
            </button>
            
            <button className='group flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 w-full mt-2'>
              <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-all duration-300">
                <LogOut className='w-5 h-5' />
              </div>
              <span className='font-medium transition-all duration-300'>Logout</span>
              <ChevronRight className='w-4 h-4 ml-auto transition-transform duration-300 group-hover:translate-x-1' />
            </button>
          </div>

          {/* Version Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-400">Version 2.0</p>
              <p className="text-xs text-gray-400 mt-1">Modern Admin Panel</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar