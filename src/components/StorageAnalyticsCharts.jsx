import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts'

const StorageAnalyticsCharts = ({ charts }) => {
  const emptyStorageUsage = [
    { month: 'Jan', used: 0, available: 0, total: 0 },
    { month: 'Feb', used: 0, available: 0, total: 0 },
    { month: 'Mar', used: 0, available: 0, total: 0 },
    { month: 'Apr', used: 0, available: 0, total: 0 },
    { month: 'May', used: 0, available: 0, total: 0 },
    { month: 'Jun', used: 0, available: 0, total: 0 }
  ]

  const emptyDistribution = [
    { name: 'Documents', value: 0, color: '#3B82F6' },
    { name: 'Images', value: 0, color: '#10B981' },
    { name: 'Videos', value: 0, color: '#F59E0B' },
    { name: 'Archives', value: 0, color: '#EF4444' },
    { name: 'Other', value: 0, color: '#8B5CF6' }
  ]

  const storageUsage = charts?.storageUsage && charts.storageUsage.length > 0
    ? charts.storageUsage
    : emptyStorageUsage

  const fileTypeStorage = charts?.fileTypeDistribution && charts.fileTypeDistribution.length > 0
    ? charts.fileTypeDistribution
    : emptyDistribution

  const userStorage = charts?.topUsers && charts.topUsers.length > 0
    ? charts.topUsers
    : [
        { user: 'N/A', storage: 0, files: 0 },
        { user: 'N/A', storage: 0, files: 0 },
        { user: 'N/A', storage: 0, files: 0 }
      ]

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Storage Usage Over Time */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Storage Usage Over Time
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monthly storage consumption trends
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={storageUsage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="used" 
                stackId="1"
                stroke="#3C467B" 
                fill="#3C467B"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="available" 
                stackId="1"
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* File Type Storage Distribution */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Storage by File Type
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Breakdown of storage usage by file categories
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fileTypeStorage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {fileTypeStorage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Top Users by Storage */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Top Users by Storage Usage
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Users with highest storage consumption
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userStorage}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="user" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend />
              <Bar 
                dataKey="storage" 
                fill="#3C467B" 
                name="Storage (GB)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="files" 
                fill="#3B82F6" 
                name="Number of Files"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}

export default StorageAnalyticsCharts
