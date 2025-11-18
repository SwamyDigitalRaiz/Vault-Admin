import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, LogOut, UserCircle, ChevronDown } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/api'

// Notification Bell Component
const NotificationBell = ({ onRouteChange }) => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const bellRef = useRef(null)

  useEffect(() => {
    fetchUnreadCount()
    // Poll for unread count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await apiService.getUnreadCount()
      if (response.success) {
        setUnreadCount(response.data.unreadCount || 0)
      }
    } catch (err) {
      console.error('Error fetching unread count:', err)
    }
  }

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await apiService.getNotifications({ limit: 5, status: 'unread' })
      if (response.success) {
        setNotifications(response.data.notifications || [])
      }
    } catch (err) {
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleMarkAsRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  return (
    <div className="relative" ref={bellRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await apiService.markAllNotificationsAsRead()
                        setNotifications([])
                        setUnreadCount(0)
                      } catch (err) {
                        console.error('Error marking all as read:', err)
                      }
                    }}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
            <div className="p-2">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No new notifications</div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  if (onRouteChange) {
                    onRouteChange('/notifications')
                  }
                  setIsOpen(false)
                }}
                className="block w-full text-center text-sm text-primary-500 hover:text-primary-600 py-2"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TopBar = ({ onRouteChange }) => {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout, getFullName, getInitials } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen)
  }

  const handleLogout = async () => {
    try {
      await logout()
      setIsProfileOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleProfileSettings = () => {
    onRouteChange('/profile-settings')
    setIsProfileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 sm:px-6 py-3 sm:py-4"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users, files, or activities..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
          {/* Notifications */}
          <NotificationBell onRouteChange={onRouteChange} />

          {/* Admin Profile with Dropdown */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileClick}
              className="flex items-center space-x-2 sm:space-x-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{getFullName()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-xs sm:text-sm font-medium text-white">{getInitials()}</span>
              </div>
              <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                >
                  {/* Profile Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">{getInitials()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getFullName()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleProfileSettings}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <UserCircle className="h-4 w-4 mr-3" />
                      Profile Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default TopBar
