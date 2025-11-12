import React, { useState } from 'react'
import { motion } from 'framer-motion'
import NotificationsList from './NotificationsList'
import NotificationDetailPanel from './NotificationDetailPanel'
import SendNotificationModal from './SendNotificationModal'

const NotificationsPage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false)
  const [isSendModalOpen, setIsSendModalOpen] = useState(false)

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

  const handleNotificationSelect = (notification) => {
    setSelectedNotification(notification)
    setIsDetailPanelOpen(true)
  }

  const handleCloseDetailPanel = () => {
    setIsDetailPanelOpen(false)
    setSelectedNotification(null)
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
                  Push Notifications
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Send push notifications to users and view notification history
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSendModalOpen(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Push Notification</span>
                </motion.button>
              </div>
            </div>
          </motion.div>


          {/* Notification History */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NotificationsList
              onNotificationSelect={handleNotificationSelect}
            />
          </motion.div>
        </div>

        {/* Notification Detail Panel */}
        {isDetailPanelOpen && selectedNotification && (
          <NotificationDetailPanel
            notification={selectedNotification}
            onClose={handleCloseDetailPanel}
          />
        )}

        {/* Send Notification Modal */}
        {isSendModalOpen && (
          <SendNotificationModal
            isOpen={isSendModalOpen}
            onClose={() => setIsSendModalOpen(false)}
          />
        )}

      </main>
    </motion.div>
  )
}

export default NotificationsPage
