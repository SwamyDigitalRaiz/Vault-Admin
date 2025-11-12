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
  const [activeTab, setActiveTab] = useState('details') // 'details', 'history', 'items', 'settings'

  // Transform API schedule data to component format
  const scheduleDetails = {
    id: schedule.id || schedule._id,
    _id: schedule._id || schedule.id,
    createdBy: schedule.owner?.email || 'Unknown',
    createdByName: schedule.owner?.name || 'Unknown',
    owner: schedule.owner,
    scheduleType: schedule.scheduleType || 'one-time',
    status: schedule.status || 'pending',
    isEnabled: schedule.isEnabled !== false,
    scheduledDate: schedule.scheduledDate,
    recurringPattern: schedule.recurringPattern || {},
    nextSend: schedule.nextExecutionDate 
      ? new Date(schedule.nextExecutionDate).toLocaleString()
      : 'Not scheduled',
    nextExecutionDate: schedule.nextExecutionDate,
    lastSent: schedule.lastExecutionDate 
      ? new Date(schedule.lastExecutionDate).toLocaleString()
      : null,
    lastExecutionDate: schedule.lastExecutionDate,
    description: schedule.description,
    items: schedule.items || [],
    executionHistory: schedule.executionHistory || [],
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
    // Calculate statistics from execution history
    sendHistory: (schedule.executionHistory || []).map((exec, index) => ({
      id: index + 1,
      date: new Date(exec.executionDate).toLocaleString(),
      status: exec.status === 'success' ? 'success' : 'failed',
      recipients: exec.recipientsCount || 0,
      filesSent: exec.filesCount || 0,
      errorMessage: exec.error || null
    })),
    totalSends: schedule.executionHistory?.length || 0,
    successfulSends: schedule.executionHistory?.filter(e => e.status === 'success').length || 0,
    failedSends: schedule.executionHistory?.filter(e => e.status === 'failed').length || 0,
    // Get all unique recipients from items
    recipients: [...new Set(
      (schedule.items || []).flatMap(item => 
        item.recipients?.map(r => r.email) || []
      )
    )],
    // Settings from recurring pattern
    settings: {
      timezone: schedule.recurringPattern?.timezone || 'UTC',
      dailyTime: schedule.recurringPattern?.dailyTime,
      weeklyDay: schedule.recurringPattern?.weeklyDay,
      weeklyTime: schedule.recurringPattern?.weeklyTime,
      monthlyDay: schedule.recurringPattern?.monthlyDay,
      monthlyTime: schedule.recurringPattern?.monthlyTime,
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
                  Schedule {scheduleDetails.id?.substring(0, 8)}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {scheduleDetails.items.length} item{scheduleDetails.items.length !== 1 ? 's' : ''} • {scheduleDetails.recipients.length} recipient{scheduleDetails.recipients.length !== 1 ? 's' : ''}
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

              {/* Schedule Items */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Scheduled Items ({scheduleDetails.items.length})
                </h3>
                <div className="space-y-3">
                  {scheduleDetails.items.length === 0 ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No items scheduled</p>
                  ) : (
                    scheduleDetails.items.map((item, index) => (
                      <div key={item._id || index} className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-start space-x-3">
                          {item.folder ? (
                            <FolderOpen className="h-5 w-5 text-primary-500 mt-1" />
                          ) : item.file ? (
                            <FileText className="h-5 w-5 text-green-500 mt-1" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.folder?.name || item.file?.name || 'Invalid Item'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {(item.recipients || []).length} recipient{(item.recipients || []).length !== 1 ? 's' : ''}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {(item.recipients || []).map((recipient, idx) => (
                                <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {recipient.email}
                                </span>
                              ))}
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                                item.isEnabled !== false
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400'
                              }`}>
                                {item.isEnabled !== false ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
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
                          {send.recipients} recipient{send.recipients !== 1 ? 's' : ''} • {send.filesSent} file{send.filesSent !== 1 ? 's' : ''} sent
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
                  Schedule Configuration
                </h4>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Schedule Type:</span>
                    <span className="font-medium capitalize">{scheduleDetails.scheduleType || 'one-time'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${scheduleDetails.status === 'active' ? 'text-green-600' : scheduleDetails.status === 'paused' ? 'text-yellow-600' : 'text-gray-600'}`}>
                      {scheduleDetails.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timezone:</span>
                    <span className="font-medium">{scheduleDetails.settings.timezone || 'UTC'}</span>
                  </div>
                  {scheduleDetails.scheduledDate && (
                    <div className="flex justify-between">
                      <span>Scheduled Date:</span>
                      <span className="font-medium">{new Date(scheduleDetails.scheduledDate).toLocaleString()}</span>
                    </div>
                  )}
                  {scheduleDetails.scheduleType === 'daily' && scheduleDetails.settings.dailyTime && (
                    <div className="flex justify-between">
                      <span>Daily Time:</span>
                      <span className="font-medium">{scheduleDetails.settings.dailyTime}</span>
                    </div>
                  )}
                  {scheduleDetails.scheduleType === 'weekly' && (
                    <>
                      {scheduleDetails.settings.weeklyDay !== undefined && (
                        <div className="flex justify-between">
                          <span>Weekly Day:</span>
                          <span className="font-medium">
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][scheduleDetails.settings.weeklyDay]}
                          </span>
                        </div>
                      )}
                      {scheduleDetails.settings.weeklyTime && (
                        <div className="flex justify-between">
                          <span>Weekly Time:</span>
                          <span className="font-medium">{scheduleDetails.settings.weeklyTime}</span>
                        </div>
                      )}
                    </>
                  )}
                  {scheduleDetails.scheduleType === 'monthly' && (
                    <>
                      {scheduleDetails.settings.monthlyDay && (
                        <div className="flex justify-between">
                          <span>Monthly Day:</span>
                          <span className="font-medium">Day {scheduleDetails.settings.monthlyDay}</span>
                        </div>
                      )}
                      {scheduleDetails.settings.monthlyTime && (
                        <div className="flex justify-between">
                          <span>Monthly Time:</span>
                          <span className="font-medium">{scheduleDetails.settings.monthlyTime}</span>
                        </div>
                      )}
                    </>
                  )}
                  {scheduleDetails.description && (
                    <div className="flex flex-col">
                      <span className="mb-1">Description:</span>
                      <span className="font-medium">{scheduleDetails.description}</span>
                    </div>
                  )}
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
              {scheduleDetails.createdAt && (
                <> • Created: {new Date(scheduleDetails.createdAt).toLocaleDateString()}</>
              )}
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
