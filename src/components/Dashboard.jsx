import React from 'react'
import { motion } from 'framer-motion'
import SummaryCards from './SummaryCards'
import Charts from './Charts'
import ActivitiesTable from './ActivitiesTable'

const Dashboard = () => {
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
          <SummaryCards />

          {/* Charts Section */}
          <Charts />

          {/* Activities Table */}
          <ActivitiesTable />
      </motion.div>
    </div>
  )
}

export default Dashboard
