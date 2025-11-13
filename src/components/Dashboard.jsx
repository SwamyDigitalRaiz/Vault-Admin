import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import apiService from '../services/api'
import SummaryCards from './SummaryCards'
import Charts from './Charts'
import ActivitiesTable from './ActivitiesTable'
import TodaySchedules from './TodaySchedules'

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        const response = await apiService.getDashboardStats()
        
        if (response.success) {
          setDashboardStats(response.data)
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

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
    <div 
      className="h-full bg-gray-50 dark:bg-gray-900"
      style={{ 
        height: '100%', 
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="p-3 sm:p-6"
      >
          {/* Page Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Welcome back! Here's what's happening with your Vault system.
            </p>
          </motion.div>

          {/* Summary Cards */}
          <SummaryCards stats={dashboardStats} loading={loading} />

          {/* Charts Section */}
          <Charts stats={dashboardStats} loading={loading} />

          {/* Today's Schedules */}
          <TodaySchedules stats={dashboardStats} loading={loading} />

          {/* Activities Table */}
          <ActivitiesTable stats={dashboardStats} loading={loading} />
      </motion.div>
    </div>
  )
}

export default Dashboard
