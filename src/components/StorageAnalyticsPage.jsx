import React, { useState } from 'react'
import { motion } from 'framer-motion'
import StorageAnalyticsCharts from './StorageAnalyticsCharts'
import StorageAnalyticsTable from './StorageAnalyticsTable'

const StorageAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30days')
  const [viewType, setViewType] = useState('overview')

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

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900"
    >
      {/* Top Bar */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-3 sm:p-6">
          {/* Page Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Storage Analytics
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Monitor storage usage, file distribution, and storage trends
                </p>
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="1year">Last year</option>
                </select>
                
                <select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="overview">Overview</option>
                  <option value="users">By Users</option>
                  <option value="files">By File Types</option>
                  <option value="folders">By Folders</option>
                </select>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export Data</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Storage Analytics Charts */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <StorageAnalyticsCharts dateRange={dateRange} viewType={viewType} />
          </motion.div>

          {/* Storage Analytics Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StorageAnalyticsTable dateRange={dateRange} viewType={viewType} />
          </motion.div>
        </div>
      </main>
    </motion.div>
  )
}

export default StorageAnalyticsPage
