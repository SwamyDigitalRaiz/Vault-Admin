import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'
import UsersTable from './UsersTable'
import CreateAdminModal from './CreateAdminModal'

const UsersPage = ({ onUserSelect }) => {
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAdminCreated = (newAdmin) => {
    console.log('New admin created:', newAdmin)
    // Trigger refresh of users table
    setRefreshTrigger(prev => prev + 1)
    setShowCreateAdminModal(false)
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
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Users Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Manage user accounts, permissions, and activity
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateAdminModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create Admin</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export CSV</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <UsersTable onUserSelect={onUserSelect} refreshTrigger={refreshTrigger} />
          </motion.div>
        </div>
      </main>

      {/* Create Admin Modal */}
      <CreateAdminModal
        isOpen={showCreateAdminModal}
        onClose={() => setShowCreateAdminModal(false)}
        onSuccess={handleAdminCreated}
      />
    </motion.div>
  )
}

export default UsersPage
