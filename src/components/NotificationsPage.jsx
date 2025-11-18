import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationsList from './NotificationsList'
import NotificationDetailPanel from './NotificationDetailPanel'
import SendNotificationModal from './SendNotificationModal'

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [refreshKey, setRefreshKey] = useState(0)

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const handleNotificationSelect = (notification) => {
    setSelectedNotification(notification)
    setIsDetailPanelOpen(true)
  }

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false)
    setSelectedNotification(null)
  }

  const handleNotificationSent = () => {
    setRefreshKey(prev => prev + 1) // Trigger refresh
  }


  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Top Bar */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Notification
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                      Manage and track all push notifications sent to users
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSendModalOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Send Notification</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 font-medium"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Notification History */}
          <motion.div
            key={refreshKey}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NotificationsList
              filterType={filterType}
              filterStatus={filterStatus}
              dateRange={dateRange}
              onNotificationSelect={handleNotificationSelect}
              showAdminSent={true}
            />
          </motion.div>
        </div>

        {/* Notification Detail Panel */}
        <AnimatePresence>
          {isDetailPanelOpen && selectedNotification && (
            <NotificationDetailPanel
              key={selectedNotification.id}
              notification={selectedNotification}
              onClose={handleCloseDetailPanel}
            />
          )}
        </AnimatePresence>

        {/* Send Notification Modal */}
        {isSendModalOpen && (
          <SendNotificationModal
            isOpen={isSendModalOpen}
            onClose={() => setIsSendModalOpen(false)}
            onSuccess={handleNotificationSent}
          />
        )}

      </main>
    </motion.div>
  )
}

export default NotificationsPage
