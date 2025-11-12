import React from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'

const ReportsCharts = ({ dateRange, reportType }) => {
  // Mock data for charts
  const getChartData = (range, type) => {
    const monthlyUploads = [
      { month: 'Jan', uploads: 1200, downloads: 800 },
      { month: 'Feb', uploads: 1500, downloads: 950 },
      { month: 'Mar', uploads: 1800, downloads: 1100 },
      { month: 'Apr', uploads: 1600, downloads: 1000 },
      { month: 'May', uploads: 2000, downloads: 1200 },
      { month: 'Jun', uploads: 2200, downloads: 1400 }
    ]

    const fileTypeDistribution = [
      { name: 'Documents', value: 45, color: '#3B82F6' },
      { name: 'Images', value: 25, color: '#10B981' },
      { name: 'Videos', value: 15, color: '#F59E0B' },
      { name: 'Archives', value: 10, color: '#EF4444' },
      { name: 'Other', value: 5, color: '#8B5CF6' }
    ]

    const schedulePerformance = [
      { date: 'Week 1', successful: 45, failed: 3 },
      { date: 'Week 2', successful: 52, failed: 2 },
      { date: 'Week 3', successful: 48, failed: 4 },
      { date: 'Week 4', successful: 55, failed: 1 }
    ]

    return { monthlyUploads, fileTypeDistribution, schedulePerformance }
  }

  const { monthlyUploads, fileTypeDistribution, schedulePerformance } = getChartData(dateRange, reportType)

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
      {/* Monthly Uploads Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Monthly Uploads & Downloads
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            File activity over the last 6 months
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyUploads}>
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
              <Legend />
              <Bar 
                dataKey="uploads" 
                fill="#3C467B" 
                name="Uploads"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="downloads" 
                fill="#3B82F6" 
                name="Downloads"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* File Type Distribution Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            File Type Distribution
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Breakdown of file types in the system
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fileTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {fileTypeDistribution.map((entry, index) => (
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

      {/* Schedule Performance Chart */}
      <motion.div
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Schedule Performance
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Success vs failure rates for scheduled sends
          </p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={schedulePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
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
              <Line 
                type="monotone" 
                dataKey="successful" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Successful Sends"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="failed" 
                stroke="#EF4444" 
                strokeWidth={3}
                name="Failed Sends"
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  )
}

export default ReportsCharts
