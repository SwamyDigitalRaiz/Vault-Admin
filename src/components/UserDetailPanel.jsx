import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2,
  Shield,
  HardDrive,
  Save
} from 'lucide-react'
import apiService from '../services/api'

const UserDetailPanel = ({ user, onClose, onUserUpdated }) => {
  const [storageLimitInput, setStorageLimitInput] = useState('')
  const [isUpdatingStorage, setIsUpdatingStorage] = useState(false)
  const [showStorageEditor, setShowStorageEditor] = useState(false)
  // Check if user exists
  if (!user) {
    return null
  }

  // Mock data for user details
  const userDetails = {
    ...user,
    notes: 'Active user with regular file uploads and scheduling activities.',
    folders: [
      { name: 'Project Documents', files: 12, lastModified: '2024-01-15' },
      { name: 'Personal Files', files: 8, lastModified: '2024-01-14' },
      { name: 'Shared Resources', files: 5, lastModified: '2024-01-13' }
    ],
    scheduledSends: [
      { recipient: 'john@client.com', file: 'report.pdf', scheduledFor: '2024-01-16 09:00', status: 'pending' },
      { recipient: 'team@company.com', file: 'presentation.pptx', scheduledFor: '2024-01-17 14:30', status: 'pending' }
    ],
    activityLogs: [
      { action: 'File Upload', item: 'document.pdf', timestamp: '2024-01-15 14:30', status: 'success' },
      { action: 'Folder Created', item: 'New Project', timestamp: '2024-01-15 13:45', status: 'success' },
      { action: 'Schedule Created', item: 'report.pdf', timestamp: '2024-01-15 12:20', status: 'success' }
    ]
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
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {userDetails.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userDetails.email}
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
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{userDetails.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{userDetails.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{userDetails.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">Last Active: {userDetails.lastActive}</span>
              </div>
            </div>
            
            {/* Notes */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{userDetails.notes}</p>
            </div>
          </div>

          {/* Storage Information */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Storage Information
              </h3>
              <button
                onClick={() => setShowStorageEditor(!showStorageEditor)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showStorageEditor ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {showStorageEditor ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Storage Limit (GB)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={storageLimitInput}
                      onChange={(e) => setStorageLimitInput(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent w-32"
                      placeholder="1"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      = {formatBytes(parseFloat(storageLimitInput || 0) * 1024 * 1024 * 1024)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Current limit: {formatBytes(user?.storageLimit || 0)}
                  </p>
                </div>
                <button
                  onClick={handleUpdateStorageLimit}
                  disabled={isUpdatingStorage}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isUpdatingStorage ? 'Updating...' : 'Update Storage Limit'}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage Used:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatBytes(user?.storageUsed || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage Limit:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatBytes(user?.storageLimit || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Available:</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatBytes((user?.storageLimit || 0) - (user?.storageUsed || 0))}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, ((user?.storageUsed || 0) / (user?.storageLimit || 1)) * 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.round(((user?.storageUsed || 0) / (user?.storageLimit || 1)) * 100)}% used
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Statistics */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              User Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{userDetails.folders?.length || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Folders</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{userDetails.files || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Files</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userDetails.scheduledSends?.length || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled Sends</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">24</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</div>
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Block User</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete User</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default UserDetailPanel
