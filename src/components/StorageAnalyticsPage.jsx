import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save } from 'lucide-react'
import apiService from '../services/api'
import StorageAnalyticsCharts from './StorageAnalyticsCharts'
import StorageAnalyticsTable from './StorageAnalyticsTable'

const StorageAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('30days')
  const [viewType, setViewType] = useState('overview')
  const [defaultStorageLimit, setDefaultStorageLimit] = useState(1073741824) // 1GB in bytes
  const [storageLimitInput, setStorageLimitInput] = useState('1') // GB
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    fetchSystemSettings()
  }, [])

  const fetchSystemSettings = async () => {
    try {
      setLoading(true)
      const response = await apiService.getSystemSettings()
      if (response.success && response.data) {
        const limitInGB = response.data.defaultStorageLimit / (1024 * 1024 * 1024)
        setDefaultStorageLimit(response.data.defaultStorageLimit)
        setStorageLimitInput(limitInGB.toString())
      }
    } catch (err) {
      console.error('Error fetching system settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      const limitInBytes = parseFloat(storageLimitInput) * 1024 * 1024 * 1024
      
      if (isNaN(limitInBytes) || limitInBytes < 0) {
        alert('Please enter a valid storage limit')
        return
      }

      const response = await apiService.updateSystemSettings({
        defaultStorageLimit: Math.round(limitInBytes)
      })

      if (response.success) {
        setDefaultStorageLimit(Math.round(limitInBytes))
        setShowSettings(false)
        alert('Default storage limit updated successfully!')
      } else {
        alert(response.message || 'Failed to update settings')
      }
    } catch (err) {
      console.error('Error updating system settings:', err)
      alert('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Storage Settings</span>
                </motion.button>
                
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

          {/* Storage Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                    Default Storage Limit Configuration
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Set the default storage limit for all new users
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Storage Limit (GB)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={storageLimitInput}
                      onChange={(e) => setStorageLimitInput(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                      placeholder="1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      = {formatBytes(parseFloat(storageLimitInput || 0) * 1024 * 1024 * 1024)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Current default: {formatBytes(defaultStorageLimit)}
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveSettings}
                    disabled={saving || loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                  </motion.button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}

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
