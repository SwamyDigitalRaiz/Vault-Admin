import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Save, 
  Bell, 
  Mail, 
  FileText, 
  Clock, 
  User, 
  AlertTriangle, 
  Settings,
  CheckCircle
} from 'lucide-react'

const NotificationSettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    // Notification Types
    fileUploads: { enabled: true, email: true, inApp: true },
    scheduleExecuted: { enabled: true, email: false, inApp: true },
    scheduleFailed: { enabled: true, email: true, inApp: true },
    userAdded: { enabled: true, email: false, inApp: true },
    userRemoved: { enabled: true, email: false, inApp: true },
    systemErrors: { enabled: true, email: true, inApp: true },
    storageQuota: { enabled: true, email: true, inApp: true },
    securityAlerts: { enabled: true, email: true, inApp: true },
    
    // Global Settings
    emailNotifications: true,
    inAppNotifications: true,
    quietHours: { enabled: false, start: '22:00', end: '08:00' }
  })

  const [isSaving, setIsSaving] = useState(false)

  const notificationTypes = [
    {
      key: 'fileUploads',
      title: 'File Uploads',
      description: 'Get notified when users upload files',
      icon: FileText,
      color: 'text-blue-500'
    },
    {
      key: 'scheduleExecuted',
      title: 'Schedule Executed',
      description: 'Get notified when schedules run successfully',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      key: 'scheduleFailed',
      title: 'Schedule Failed',
      description: 'Get notified when schedules fail to execute',
      icon: AlertTriangle,
      color: 'text-red-500'
    },
    {
      key: 'userAdded',
      title: 'User Added',
      description: 'Get notified when new users are added',
      icon: User,
      color: 'text-green-500'
    },
    {
      key: 'userRemoved',
      title: 'User Removed',
      description: 'Get notified when users are removed',
      icon: User,
      color: 'text-red-500'
    },
    {
      key: 'systemErrors',
      title: 'System Errors',
      description: 'Get notified about system errors and issues',
      icon: AlertTriangle,
      color: 'text-red-500'
    },
    {
      key: 'storageQuota',
      title: 'Storage Quota',
      description: 'Get notified about storage quota warnings',
      icon: Settings,
      color: 'text-yellow-500'
    },
    {
      key: 'securityAlerts',
      title: 'Security Alerts',
      description: 'Get notified about security-related events',
      icon: AlertTriangle,
      color: 'text-red-500'
    }
  ]

  const handleSettingChange = (key, field, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }))
  }

  const handleGlobalSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    console.log('Notification settings saved:', settings)
    onClose()
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
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-6 w-6 text-primary-500" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Notification Settings
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Configure which notifications you want to receive
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
            <div className="p-6 space-y-8">
              {/* Global Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Global Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleGlobalSettingChange('emailNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-primary-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          In-App Notifications
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Show notifications within the application
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.inAppNotifications}
                        onChange={(e) => handleGlobalSettingChange('inAppNotifications', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Types
                </h3>
                <div className="space-y-4">
                  {notificationTypes.map((type) => {
                    const Icon = type.icon
                    const setting = settings[type.key]
                    
                    return (
                      <div key={type.key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Icon className={`h-5 w-5 ${type.color}`} />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {type.title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {type.description}
                              </p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={setting.enabled}
                              onChange={(e) => handleSettingChange(type.key, 'enabled', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                          </label>
                        </div>
                        
                        {setting.enabled && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-blue-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={setting.email}
                                  onChange={(e) => handleSettingChange(type.key, 'email', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Bell className="h-4 w-4 text-primary-500" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">In-App</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={setting.inApp}
                                  onChange={(e) => handleSettingChange(type.key, 'inApp', e.target.checked)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
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
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Settings</span>
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

export default NotificationSettingsModal
