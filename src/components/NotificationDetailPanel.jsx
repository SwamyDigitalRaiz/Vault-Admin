import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  User, 
  FileText, 
  FolderOpen, 
  Mail, 
  Settings,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

const NotificationDetailPanel = ({ notification, onClose }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Info className="h-6 w-6 text-gray-500" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRelatedItemIcon = (type) => {
    switch (type) {
      case 'file':
        return <FileText className="h-5 w-5 text-blue-500" />
      case 'folder':
        return <FolderOpen className="h-5 w-5 text-primary-500" />
      case 'user':
        return <User className="h-5 w-5 text-green-500" />
      case 'schedule':
        return <Clock className="h-5 w-5 text-purple-500" />
      default:
        return <Settings className="h-5 w-5 text-gray-500" />
    }
  }

  const handleGoToItem = () => {
    // In a real app, this would navigate to the related item
    console.log('Navigate to:', notification.relatedItem)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getTypeIcon(notification.type)}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {notification.category}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Main Message */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </h3>
              <p className="text-gray-900 dark:text-white">
                {notification.message}
              </p>
            </div>

            {/* Details */}
            {notification.details && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  {notification.details}
                </p>
              </div>
            )}

            {/* Related Item */}
            {notification.relatedItem && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Related Item
                </h3>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {getRelatedItemIcon(notification.relatedItem.type)}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notification.relatedItem.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {notification.relatedItem.type}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoToItem}
                    className="flex items-center space-x-2 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <span>Go to Item</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timestamp
                </h3>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{notification.timestamp}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User
                </h3>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4" />
                  <span>{notification.user}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  notification.status === 'unread' 
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </h3>
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {notification.category}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
              {notification.relatedItem && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoToItem}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Go to Item</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationDetailPanel
