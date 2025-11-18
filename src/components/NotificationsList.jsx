import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Clock,
  User,
  FileText,
  FolderOpen,
  Mail,
  Settings,
  Bell,
  Trash2,
  Trash
} from 'lucide-react'
import apiService from '../services/api'

const NotificationsList = ({ filterType, filterStatus, dateRange, onNotificationSelect, showAdminSent = false }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 })
  const [deleting, setDeleting] = useState(false)

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          type: filterType === 'all' ? undefined : filterType,
          dateRange: dateRange === 'all' ? undefined : dateRange
        }

        // Remove undefined params
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

        let response;
        if (showAdminSent) {
          // Fetch admin sent notifications
          response = await apiService.getAdminSentNotifications(params)
        } else {
          // Fetch user notifications
          params.status = filterStatus === 'all' ? undefined : filterStatus
          Object.keys(params).forEach(key => params[key] === undefined && delete params[key])
          response = await apiService.getNotifications(params)
        }
        
        if (response.success) {
          let formattedNotifications;
          
          if (showAdminSent) {
            // Format admin sent notifications
            formattedNotifications = response.data.notifications.map(notif => ({
              id: notif.id,
              type: notif.type,
              title: notif.title,
              message: notif.message,
              timestamp: new Date(notif.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }),
              category: notif.category,
              recipientCount: notif.recipientCount,
              readCount: notif.readCount,
              unreadCount: notif.unreadCount,
              recipients: notif.recipients || [],
              notificationIds: notif.notificationIds || [notif.id] // Include notificationIds for deletion
            }))
          } else {
            // Format user notifications
            formattedNotifications = response.data.notifications.map(notif => ({
              id: notif.id,
              type: notif.type,
              title: notif.title,
              message: notif.message,
              timestamp: new Date(notif.timestamp).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }),
              status: notif.status,
              isRead: notif.isRead,
              category: notif.category,
              relatedItem: notif.relatedItem,
              details: notif.details,
              user: notif.sender?.name || 'System',
              sender: notif.sender
            }))
          }
          
          setNotifications(formattedNotifications)
          setPagination(response.data.pagination)
        }
      } catch (err) {
        console.error('Error fetching notifications:', err)
        setError(err.message || 'Failed to load notifications')
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [filterType, filterStatus, dateRange, pagination.page, pagination.limit, showAdminSent])

  // Filtering is now done on the backend, but we can add client-side filtering if needed
  const filteredNotifications = notifications

  const handleMarkAsRead = async (id) => {
    try {
      await apiService.markNotificationAsRead(id)
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, status: 'read', isRead: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead()
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, status: 'read', isRead: true }))
      )
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification? This will delete all instances sent to recipients.')) {
      return
    }
    
    try {
      setDeleting(true)
      if (showAdminSent) {
        // For admin sent notifications, use the notificationIds array if available
        const notification = notifications.find(n => n.id === id)
        const idsToDelete = notification?.notificationIds || [id]
        await apiService.deleteAllAdminSentNotifications(idsToDelete)
      } else {
        await apiService.deleteNotification(id)
      }
      // Remove from local state
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    } catch (err) {
      console.error('Error deleting notification:', err)
      setError(err.message || 'Failed to delete notification')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm('Are you sure you want to delete all sent notifications? This action cannot be undone.')) {
      return
    }
    
    try {
      setDeleting(true)
      await apiService.deleteAllAdminSentNotifications()
      // Clear all notifications
      setNotifications([])
      setPagination(prev => ({ ...prev, total: 0 }))
    } catch (err) {
      console.error('Error deleting all notifications:', err)
      setError(err.message || 'Failed to delete all notifications')
    } finally {
      setDeleting(false)
    }
  }


  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/10'
      case 'info':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/10'
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/10'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'user':
        return <User className="h-4 w-4 text-blue-500" />
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />
      case 'schedule':
        return <Clock className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getRelatedItemIcon = (type) => {
    switch (type) {
      case 'file':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'folder':
        return <FolderOpen className="h-4 w-4 text-primary-500" />
      case 'user':
        return <User className="h-4 w-4 text-green-500" />
      case 'schedule':
        return <Clock className="h-4 w-4 text-purple-500" />
      default:
        return <Settings className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-200 dark:border-red-900/20 p-12 text-center">
        <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Error loading notifications
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Delete All Button (only for admin sent notifications) */}
      {showAdminSent && notifications.length > 0 && (
        <div className="flex justify-end mb-6">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDeleteAll}
            disabled={deleting}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
          >
            <Trash className="h-4 w-4" />
            <span>{deleting ? 'Deleting...' : 'Delete All Notifications'}</span>
          </motion.button>
        </div>
      )}
      
      {filteredNotifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-16 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 mb-6">
            <Bell className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No notifications found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {loading ? 'Loading notifications...' : 'No notifications match your current filters. Try adjusting your search criteria.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                y: -2,
                transition: { duration: 0.2 }
              }}
              className={`group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border-l-4 ${getTypeColor(notification.type)} border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${
                notification.status === 'unread' ? 'ring-1 ring-primary-200 dark:ring-primary-800' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {/* Type Icon */}
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                        notification.type === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
                        notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        'bg-blue-100 dark:bg-blue-900/20'
                      }`}>
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center flex-wrap gap-2 mb-1.5">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {notification.title}
                            </h3>
                            {notification.status === 'unread' && !showAdminSent && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                                New
                              </span>
                            )}
                            {notification.user === 'Admin' && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                Admin
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 leading-snug">
                            {notification.message}
                          </p>
                        </div>
                      </div>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{notification.timestamp}</span>
                        </div>
                        
                        {showAdminSent ? (
                          <>
                            <div className="flex items-center space-x-1.5 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                              <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                {notification.recipientCount} {notification.recipientCount === 1 ? 'user' : 'users'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
                              <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-xs font-medium text-green-700 dark:text-green-400">
                                {notification.readCount} read
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-2 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                              <Bell className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                                {notification.unreadCount} unread
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                              <User className="h-3 w-3" />
                              <span>{notification.user}</span>
                            </div>
                            
                            {notification.relatedItem && (
                              <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                                {getRelatedItemIcon(notification.relatedItem.type)}
                                <span>{notification.relatedItem.name}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {onNotificationSelect && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onNotificationSelect(notification)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                    )}
                    
                    {!showAdminSent && notification.status === 'unread' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                        title="Mark as Read"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </motion.button>
                    )}
                    
                    {/* Delete button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(notification.id)}
                      disabled={deleting}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsList
