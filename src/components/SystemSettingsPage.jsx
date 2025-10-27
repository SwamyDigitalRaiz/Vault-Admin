import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SystemSettingsPanel from './SystemSettingsPanel'

const SystemSettingsPage = () => {
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
                  Legal Documents
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Manage Terms & Conditions and Privacy Policy for your platform
                </p>
              </div>
            </div>
          </motion.div>

          {/* System Settings Panel */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SystemSettingsPanel />
          </motion.div>
        </div>
      </main>
    </motion.div>
  )
}

export default SystemSettingsPage
