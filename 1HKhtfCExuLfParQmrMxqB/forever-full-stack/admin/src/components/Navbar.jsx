import React from 'react'
import { assets } from '../assets/assets'
import { Bell, User, LogOut, Menu, Search } from 'lucide-react'

const Navbar = ({setToken, toggleSidebar}) => {
  return (
    <div className='navbar-modern px-6 py-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleSidebar}
            className='lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <Menu className='w-6 h-6 text-gray-600' />
          </button>
          
          <img className='w-8 h-8' src={assets.logo} alt="Logo" />
          <h2 className='text-lg font-semibold text-gray-800 hidden sm:block'>Vervix Admin</h2>
        </div>
        
        <div className='flex items-center space-x-4'>
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
              />
            </div>
          </div>
          
          <button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative'>
            <Bell className='w-5 h-5' />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <User className='w-4 h-4 text-white' />
            </div>
            <div className="hidden sm:block">
              <span className='text-sm font-medium text-gray-700'>Admin</span>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <button 
            onClick={() => setToken('')} 
            className='flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors'
          >
            <LogOut className='w-4 h-4' />
            <span className='text-sm font-medium hidden sm:inline'>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar