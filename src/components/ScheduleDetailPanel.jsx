import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Clock, 
  User, 
  FolderOpen, 
  FileText, 
  Mail, 
  Calendar, 
  Play, 
  Pause, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Send,
  History,
  Settings
} from 'lucide-react'

const ScheduleDetailPanel = ({ schedule, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('details') // 'details', 'history', 'settings'

  // Mock data for schedule details
  const scheduleDetails = {
    ...schedule,
    sendHistory: [
      {
        id: 1,
        date: '2024-01-15 09:00',
        status: 'success',
        recipients: ['client@example.com', 'team@company.com'],
        filesSent: 3,
        errorMessage: null
      },
      {
        id: 2,
        date: '2024-01-08 09:00',
        status: 'success',
        recipients: ['client@example.com', 'team@company.com'],
        filesSent: 3,
        errorMessage: null
      },
      {
        id: 3,
        date: '2024-01-01 09:00',
        status: 'failed',
        recipients: ['client@example.com', 'team@company.com'],
        filesSent: 0,
        errorMessage: 'Email server timeout'
      }
    ],
    settings: {
      timezone: 'UTC-5',
      retryAttempts: 3,
      retryDelay: '5 minutes',
      emailTemplate: 'default',
      includeAttachments: true,
      sendNotifications: true
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Play className="h-4 w-4" />
      case 'paused':
        return <Pause className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getHistoryStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const panelVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    },
    exit: {
      x: '100%',
      transition: {
        duration: 0.3
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
      />

      {/* Panel */}
      <motion.div
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {scheduleDetails.id}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {scheduleDetails.targetFolder || scheduleDetails.targetFile}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {[
              { id: 'details', label: 'Details', icon: Clock },
              { id: 'history', label: 'History', icon: History },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Schedule Information
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" /> 
                    <strong>Created By:</strong> {scheduleDetails.createdByName} ({scheduleDetails.createdBy})
                  </p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" /> 
                    <strong>Next Send:</strong> {scheduleDetails.nextSend}
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" /> 
                    <strong>Frequency:</strong> {scheduleDetails.scheduleType}
                  </p>
                  <p className="flex items-center">
                    <strong>Status:</strong> 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scheduleDetails.status)}`}>
                      {getStatusIcon(scheduleDetails.status)}
                      <span className="ml-1">{scheduleDetails.status}</span>
                    </span>
                  </p>
                </div>
              </div>

              {/* Target Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Target Content
                </h3>
                <div className="flex items-center space-x-3">
                  {scheduleDetails.targetFolder ? (
                    <>
                      <FolderOpen className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Folder</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{scheduleDetails.targetFolder}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">File</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{scheduleDetails.targetFile}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Recipients */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Recipients ({scheduleDetails.recipients.length})
                </h3>
                <div className="space-y-2">
                  {scheduleDetails.recipients.map((email, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{scheduleDetails.totalSends}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Sends</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{scheduleDetails.successfulSends}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{scheduleDetails.failedSends}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Send History
              </h3>
              <div className="space-y-3">
                {scheduleDetails.sendHistory.map((send, index) => (
                  <motion.div
                    key={send.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getHistoryStatusIcon(send.status)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{send.date}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {send.recipients.length} recipients • {send.filesSent} files sent
                        </p>
                        {send.errorMessage && (
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                            Error: {send.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      send.status === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {send.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Schedule Settings
              </h3>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  General Settings
                </h4>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Timezone:</span>
                    <span className="font-medium">{scheduleDetails.settings.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retry Attempts:</span>
                    <span className="font-medium">{scheduleDetails.settings.retryAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retry Delay:</span>
                    <span className="font-medium">{scheduleDetails.settings.retryDelay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Template:</span>
                    <span className="font-medium">{scheduleDetails.settings.emailTemplate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Email Settings
                </h4>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Include Attachments:</span>
                    <span className={`font-medium ${scheduleDetails.settings.includeAttachments ? 'text-green-600' : 'text-red-600'}`}>
                      {scheduleDetails.settings.includeAttachments ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Send Notifications:</span>
                    <span className={`font-medium ${scheduleDetails.settings.sendNotifications ? 'text-green-600' : 'text-red-600'}`}>
                      {scheduleDetails.settings.sendNotifications ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Created: {scheduleDetails.createdBy} • Last Sent: {scheduleDetails.lastSent || 'Never'}
            </div>
            <div className="flex items-center space-x-3">
              {scheduleDetails.status === 'Active' ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </motion.button>
              ) : scheduleDetails.status === 'Paused' ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  <span>Resume</span>
                </motion.button>
              ) : null}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit(schedule)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default ScheduleDetailPanel
