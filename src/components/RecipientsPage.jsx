import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RecipientsTable from './RecipientsTable'
import ContactDetailPanel from './ContactDetailPanel'

const RecipientsPage = ({ onRecipientSelect }) => {
  const [selectedRecipient, setSelectedRecipient] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient)
    setIsDetailPanelOpen(true)
  }

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false)
    setSelectedRecipient(null)
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Recipients Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Manage email recipients for file sharing and scheduling
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
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

          {/* Recipients Table */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RecipientsTable 
              onRecipientSelect={handleRecipientSelect}
            />
          </motion.div>
        </div>

        {/* Recipient Detail Panel */}
        <AnimatePresence>
          {isDetailPanelOpen && selectedRecipient && (
            <ContactDetailPanel
              contact={selectedRecipient}
              onClose={handleCloseDetailPanel}
            />
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  )
}

export default RecipientsPage
