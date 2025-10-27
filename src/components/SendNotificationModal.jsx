import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Users, 
  User, 
  Mail, 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Settings
} from 'lucide-react'

const SendNotificationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all', // 'all', 'specific', 'multiple'
    specificUsers: [],
    deliveryMethod: 'both', // 'inApp', 'email', 'both'
    priority: 'normal' // 'low', 'normal', 'high', 'urgent'
  })
  const [isSending, setIsSending] = useState(false)

  // Mock users list
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah.wilson@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com' },
    { id: 6, name: 'Lisa Garcia', email: 'lisa.garcia@example.com' }
  ]

  const notificationTypes = [
    { value: 'info', label: 'Information', icon: Info, color: 'text-blue-500' },
    { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-500' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'text-yellow-500' },
    { value: 'error', label: 'Error', icon: XCircle, color: 'text-red-500' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      specificUsers: prev.specificUsers.includes(userId)
        ? prev.specificUsers.filter(id => id !== userId)
        : [...prev.specificUsers, userId]
    }))
  }

  const handleSend = async () => {
    setIsSending(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSending(false)
    console.log('Sending notification:', formData)
    onClose()
    // Reset form
    setFormData({
      title: '',
      message: '',
      type: 'info',
      recipients: 'all',
      specificUsers: [],
      deliveryMethod: 'both',
      priority: 'normal'
    })
  }

  const getTypeIcon = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    if (typeConfig) {
      const Icon = typeConfig.icon
      return <Icon className={`h-5 w-5 ${typeConfig.color}`} />
    }
    return <Info className="h-5 w-5 text-blue-500" />
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
                  <Send className="h-6 w-6 text-primary-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Send Notification
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Send a notification to users
                    </p>
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
              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Notification Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {notificationTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <motion.button
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange('type', type.value)}
                        className={`p-3 border rounded-lg transition-colors ${
                          formData.type === type.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon className={`h-4 w-4 ${type.color}`} />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {type.label}
                          </span>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter notification title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter notification message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Recipients
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="all-users"
                      name="recipients"
                      value="all"
                      checked={formData.recipients === 'all'}
                      onChange={(e) => handleInputChange('recipients', e.target.value)}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="all-users" className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <Users className="h-4 w-4" />
                      <span>All Users</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="specific-users"
                      name="recipients"
                      value="specific"
                      checked={formData.recipients === 'specific'}
                      onChange={(e) => handleInputChange('recipients', e.target.value)}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="specific-users" className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4" />
                      <span>Specific Users</span>
                    </label>
                  </div>
                </div>

                {/* User Selection */}
                {formData.recipients === 'specific' && (
                  <div className="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Select Users
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {users.map((user) => (
                        <label key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.specificUsers.includes(user.id)}
                            onChange={() => handleUserToggle(user.id)}
                            className="text-primary-500 focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Delivery Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('deliveryMethod', 'inApp')}
                    className={`p-3 border rounded-lg transition-colors ${
                      formData.deliveryMethod === 'inApp'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-primary-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        In-App
                      </span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('deliveryMethod', 'email')}
                    className={`p-3 border rounded-lg transition-colors ${
                      formData.deliveryMethod === 'email'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Email
                      </span>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('deliveryMethod', 'both')}
                    className={`p-3 border rounded-lg transition-colors ${
                      formData.deliveryMethod === 'both'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-primary-500" />
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Both
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  disabled={isSending || !formData.title || !formData.message}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Notification</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SendNotificationModal
