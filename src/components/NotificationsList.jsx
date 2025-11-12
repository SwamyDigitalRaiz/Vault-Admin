import React, { useState } from 'react'
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
  Bell
} from 'lucide-react'

const NotificationsList = ({ filterType, filterStatus, dateRange, onNotificationSelect }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'File Uploaded Successfully',
      message: 'User John Doe uploaded "project_proposal.pdf" to the "Project Documents" folder',
      timestamp: '2024-01-15 14:30:25',
      status: 'unread',
      category: 'user',
      relatedItem: { type: 'file', name: 'project_proposal.pdf', id: 123 },
      user: 'John Doe',
      details: 'File size: 2.3MB, Upload time: 2.4s'
    },
    {
      id: 9,
      type: 'info',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance will occur on January 20th from 2:00 AM to 4:00 AM EST. Please save your work.',
      timestamp: '2024-01-15 14:35:10',
      status: 'unread',
      category: 'system',
      relatedItem: { type: 'system', name: 'Maintenance Schedule', id: 606 },
      user: 'Admin',
      details: 'Maintenance window: 2:00 AM - 4:00 AM EST, Duration: 2 hours, Impact: Minimal downtime expected'
    },
    {
      id: 10,
      type: 'warning',
      title: 'Password Expiry Reminder',
      message: 'Your password will expire in 7 days. Please update your password to maintain account security.',
      timestamp: '2024-01-15 14:32:45',
      status: 'unread',
      category: 'user',
      relatedItem: { type: 'user', name: 'Password Security', id: 707 },
      user: 'System',
      details: 'Expiry date: January 22, 2024, Days remaining: 7, Action required: Update password'
    },
    {
      id: 2,
      type: 'error',
      title: 'Schedule Execution Failed',
      message: 'Weekly report schedule failed to send due to email server timeout',
      timestamp: '2024-01-15 14:25:10',
      status: 'unread',
      category: 'schedule',
      relatedItem: { type: 'schedule', name: 'Weekly Report Schedule', id: 456 },
      user: 'System',
      details: 'Error: SMTP timeout after 30 seconds. Retry scheduled for next hour.'
    },
    {
      id: 3,
      type: 'info',
      title: 'New User Registered',
      message: 'Sarah Wilson has registered for a new account and is pending approval',
      timestamp: '2024-01-15 14:20:45',
      status: 'read',
      category: 'user',
      relatedItem: { type: 'user', name: 'Sarah Wilson', id: 789 },
      user: 'Sarah Wilson',
      details: 'Registration source: Email invitation, IP: 192.168.1.100'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Storage Quota Warning',
      message: 'User Mike Johnson has reached 85% of their storage quota (8.5GB / 10GB)',
      timestamp: '2024-01-15 14:15:30',
      status: 'unread',
      category: 'system',
      relatedItem: { type: 'user', name: 'Mike Johnson', id: 101 },
      user: 'Mike Johnson',
      details: 'Current usage: 8.5GB, Quota: 10GB, Files: 245'
    },
    {
      id: 5,
      type: 'success',
      title: 'Schedule Executed Successfully',
      message: 'Daily backup schedule completed successfully - 2.3GB compressed',
      timestamp: '2024-01-15 14:10:15',
      status: 'read',
      category: 'schedule',
      relatedItem: { type: 'schedule', name: 'Daily Backup', id: 202 },
      user: 'System',
      details: 'Backup size: 2.3GB compressed, Duration: 15 minutes, Files: 1,247'
    },
    {
      id: 6,
      type: 'error',
      title: 'System Error Detected',
      message: 'Database connection pool exhausted - performance may be affected',
      timestamp: '2024-01-15 14:05:00',
      status: 'unread',
      category: 'system',
      relatedItem: { type: 'system', name: 'Database', id: 303 },
      user: 'System',
      details: 'Error: Connection pool size exceeded. Active connections: 95/100'
    },
    {
      id: 7,
      type: 'info',
      title: 'Folder Shared',
      message: 'Emily Davis shared the "Client Resources" folder with 3 external recipients',
      timestamp: '2024-01-15 14:00:30',
      status: 'read',
      category: 'user',
      relatedItem: { type: 'folder', name: 'Client Resources', id: 404 },
      user: 'Emily Davis',
      details: 'Recipients: client1@example.com, client2@example.com, client3@example.com'
    },
    {
      id: 8,
      type: 'warning',
      title: 'Suspicious Activity Detected',
      message: 'Multiple failed login attempts detected from IP 203.0.113.42',
      timestamp: '2024-01-15 13:55:20',
      status: 'unread',
      category: 'system',
      relatedItem: { type: 'security', name: 'Login Security', id: 505 },
      user: 'Unknown',
      details: 'IP: 203.0.113.42, Attempts: 5, Target: admin@vault.com, Blocked: Yes'
    },
    {
      id: 11,
      type: 'info',
      title: 'New Feature Available',
      message: 'We have released a new file sharing feature! You can now share files with external users via secure links.',
      timestamp: '2024-01-15 14:40:15',
      status: 'read',
      category: 'system',
      relatedItem: { type: 'system', name: 'Feature Update', id: 808 },
      user: 'Admin',
      details: 'Feature: Secure File Sharing, Release date: January 15, 2024, Documentation: Available in help center'
    },
    {
      id: 12,
      type: 'success',
      title: 'Backup Completed Successfully',
      message: 'Daily backup has been completed successfully. All data is safely stored.',
      timestamp: '2024-01-15 14:45:30',
      status: 'read',
      category: 'system',
      relatedItem: { type: 'system', name: 'Backup System', id: 909 },
      user: 'System',
      details: 'Backup size: 15.2GB, Duration: 25 minutes, Files backed up: 12,847, Status: Complete'
    },
    {
      id: 13,
      type: 'error',
      title: 'Email Service Temporarily Unavailable',
      message: 'Our email service is experiencing temporary issues. Scheduled emails may be delayed.',
      timestamp: '2024-01-15 14:50:00',
      status: 'unread',
      category: 'system',
      relatedItem: { type: 'system', name: 'Email Service', id: 1010 },
      user: 'System',
      details: 'Issue: SMTP server timeout, Affected: Email notifications, ETA: 30 minutes, Status: Investigating'
    }
  ])

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.category === filterType
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus
    
    // Date filtering logic (simplified)
    const notificationDate = new Date(notification.timestamp)
    const now = new Date()
    let matchesDate = true
    
    if (dateRange === '1day') {
      matchesDate = (now - notificationDate) <= 24 * 60 * 60 * 1000
    } else if (dateRange === '7days') {
      matchesDate = (now - notificationDate) <= 7 * 24 * 60 * 60 * 1000
    } else if (dateRange === '30days') {
      matchesDate = (now - notificationDate) <= 30 * 24 * 60 * 60 * 1000
    }
    
    return matchesType && matchesStatus && matchesDate
  })

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, status: 'read' }
          : notification
      )
    )
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

  return (
    <div className="space-y-4">
      {filteredNotifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notifications found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No notifications match your current filters
          </p>
        </div>
      ) : (
        filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ 
              scale: 1.01,
              transition: { duration: 0.2 }
            }}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 ${getTypeColor(notification.type)} border border-gray-200 dark:border-gray-700 overflow-hidden ${
              notification.status === 'unread' ? 'ring-2 ring-primary-200 dark:ring-primary-800' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Type Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      {notification.status === 'unread' && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      )}
                      {notification.user === 'Admin' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {notification.message}
                    </p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{notification.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(notification.category)}
                        <span className="capitalize">{notification.category}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{notification.user}</span>
                      </div>
                      
                      {notification.relatedItem && (
                        <div className="flex items-center space-x-1">
                          {getRelatedItemIcon(notification.relatedItem.type)}
                          <span>{notification.relatedItem.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onNotificationSelect(notification)}
                    className="p-2 text-gray-500 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </motion.button>
                  
                  {notification.status === 'unread' && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Mark as Read"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </motion.button>
                  )}
                  
                </div>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  )
}

export default NotificationsList
