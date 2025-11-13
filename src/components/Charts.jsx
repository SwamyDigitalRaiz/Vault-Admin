import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

const Charts = ({ stats, loading }) => {
  // Get chart data from API response
  const monthlyUploads = stats?.charts?.monthlyUploads || []
  const fileTypes = stats?.charts?.fileTypes || []
  const scheduledSends = stats?.charts?.scheduledSends || []

  // Calculate max values for chart scaling
  const maxUploads = monthlyUploads.length > 0 
    ? Math.max(...monthlyUploads.map(m => m.uploads), 1) 
    : 3500
  const maxSends = scheduledSends.length > 0
    ? Math.max(...scheduledSends.map(s => s.sends), 1)
    : 65

  // Default data if loading or no data
  const defaultMonthlyUploads = [
    { month: 'Jan', uploads: 0 },
    { month: 'Feb', uploads: 0 },
    { month: 'Mar', uploads: 0 },
    { month: 'Apr', uploads: 0 },
    { month: 'May', uploads: 0 },
    { month: 'Jun', uploads: 0 },
    { month: 'Jul', uploads: 0 }
  ]

  const defaultFileTypes = [
    { type: 'Images', count: 0, color: 'bg-blue-500' },
    { type: 'Videos', count: 0, color: 'bg-green-500' },
    { type: 'Documents', count: 0, color: 'bg-purple-500' },
    { type: 'Other', count: 0, color: 'bg-orange-500' }
  ]

  const defaultScheduledSends = [
    { day: 'Mon', sends: 0 },
    { day: 'Tue', sends: 0 },
    { day: 'Wed', sends: 0 },
    { day: 'Thu', sends: 0 },
    { day: 'Fri', sends: 0 },
    { day: 'Sat', sends: 0 },
    { day: 'Sun', sends: 0 }
  ]

  // Use real data or defaults
  const displayMonthlyUploads = loading || monthlyUploads.length === 0 ? defaultMonthlyUploads : monthlyUploads
  const displayFileTypes = loading || fileTypes.length === 0 ? defaultFileTypes : fileTypes
  const displayScheduledSends = loading || scheduledSends.length === 0 ? defaultScheduledSends : scheduledSends

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const chartVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
    >
      {/* Monthly Uploads Trend */}
      <motion.div
        variants={chartVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Uploads Trend
            </h3>
          </div>
        </div>
        
        <div className="h-48 flex items-end justify-between space-x-2">
          {displayMonthlyUploads.map((data, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(data.uploads / maxUploads) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg flex-1 min-h-[20px] relative group"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {data.uploads}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
          {displayMonthlyUploads.map((data, index) => (
            <span key={index}>{data.month}</span>
          ))}
        </div>
      </motion.div>

      {/* File Type Distribution */}
      <motion.div
        variants={chartVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-500 rounded-lg">
            <PieChart className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            File Types
          </h3>
        </div>
        
        <div className="space-y-4">
          {displayFileTypes.map((fileType, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${fileType.color}`}></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {fileType.type}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {fileType.count}%
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Scheduled Sends Over Time */}
      <motion.div
        variants={chartVariants}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-500 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scheduled Sends Over Time
          </h3>
        </div>
        
        <div className="h-48 flex items-end justify-between space-x-2">
          {displayScheduledSends.map((data, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(data.sends / maxSends) * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg flex-1 min-h-[20px] relative group"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {data.sends}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
          {displayScheduledSends.map((data, index) => (
            <span key={index}>{data.day}</span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Charts
