import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Send, 
  Users, 
  User, 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Settings,
  Search
} from 'lucide-react'
import apiService from '../services/api'

const SendNotificationModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    recipientType: 'all', // 'all', 'user'
    recipientId: null,
    recipientIds: []
  })
  const [isSending, setIsSending] = useState(false)
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState('')

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen && formData.recipientType === 'user') {
      fetchUsers()
    } else if (!isOpen) {
      // Reset search when modal closes
      setUserSearchQuery('')
    }
  }, [isOpen, formData.recipientType])

  // Reset search when switching recipient types
  useEffect(() => {
    if (formData.recipientType !== 'user') {
      setUserSearchQuery('')
    }
  }, [formData.recipientType])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      // Fetch all users (increase limit if needed)
      const response = await apiService.getUsers({ limit: 1000 })
      if (response.success) {
        // Filter out admin users
        const nonAdminUsers = (response.data.users || []).filter(
          user => user.role !== 'admin' && user.role !== 'staff'
        )
        setUsers(nonAdminUsers)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery.trim()) {
      return users
    }
    const query = userSearchQuery.toLowerCase()
    return users.filter(user => 
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  }, [users, userSearchQuery])

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
      recipientIds: prev.recipientIds.includes(userId)
        ? prev.recipientIds.filter(id => id !== userId)
        : [...prev.recipientIds, userId]
    }))
  }

  const handleSend = async () => {
    if (!formData.title || !formData.message) {
      setError('Title and message are required')
      return
    }

    try {
      setIsSending(true)
      setError(null)
      setSuccess(false)

      // Prepare notification data
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        category: 'general', // Default category
        recipientType: formData.recipientType,
        priority: 'medium', // Default priority
        sendEmail: false // Email sending disabled
      }

      // Add recipient IDs if specific users selected
      if (formData.recipientType === 'user') {
        if (formData.recipientIds.length > 0) {
          notificationData.recipientIds = formData.recipientIds
        } else if (formData.recipientId) {
          notificationData.recipientId = formData.recipientId
        }
      }

      const response = await apiService.createNotification(notificationData)

      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          if (onSuccess) onSuccess()
          // Reset form
          setFormData({
            title: '',
            message: '',
            type: 'info',
            recipientType: 'all',
            recipientId: null,
            recipientIds: []
          })
          setSuccess(false)
        }, 1500)
      }
    } catch (err) {
      console.error('Error sending notification:', err)
      setError(err.message || 'Failed to send notification')
    } finally {
      setIsSending(false)
    }
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
              {/* Success/Error Messages */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-400">
                    Notification sent successfully!
                  </span>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center space-x-2"
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </span>
                </motion.div>
              )}

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
                      name="recipientType"
                      value="all"
                      checked={formData.recipientType === 'all'}
                      onChange={(e) => handleInputChange('recipientType', e.target.value)}
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
                      name="recipientType"
                      value="user"
                      checked={formData.recipientType === 'user'}
                      onChange={(e) => handleInputChange('recipientType', e.target.value)}
                      className="text-primary-500 focus:ring-primary-500"
                    />
                    <label htmlFor="specific-users" className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4" />
                      <span>Specific Users</span>
                    </label>
                  </div>
                </div>

                {/* User Selection */}
                {formData.recipientType === 'user' && (
                  <div className="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Users {formData.recipientIds.length > 0 && `(${formData.recipientIds.length} selected)`}
                      </h4>
                    </div>
                    
                    {/* Search Input - Always visible */}
                    <div className="mb-3 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Search users by name or email..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    {loadingUsers ? (
                      <div className="text-center text-gray-500 py-4">Loading users...</div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        {userSearchQuery ? 'No users found matching your search' : 'No users available'}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <label key={user.id || user._id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={formData.recipientIds.includes(user.id || user._id)}
                              onChange={() => handleUserToggle(user.id || user._id)}
                              className="text-primary-500 focus:ring-primary-500"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
