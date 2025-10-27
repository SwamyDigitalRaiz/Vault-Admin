import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  FolderOpen, 
  FileText, 
  Image,
  Video,
  Archive,
  File,
  User, 
  Calendar, 
  Clock, 
  Share2, 
  Lock, 
  HardDrive,
  Edit, 
  Trash2,
  Download,
  Eye,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'

const FileDetailPanel = ({ file, onClose, onEdit }) => {
  const [activeTab, setActiveTab] = useState('details') // 'details', 'sharing', 'activity'

  // Mock data for file details
  const fileDetails = {
    ...file,
    files: file.type === 'folder' ? [
      {
        id: 1,
        name: 'project_proposal.pdf',
        type: 'document',
        size: '2.1 MB',
        uploadDate: '2024-01-15 14:30',
        uploadedBy: 'John Doe'
      },
      {
        id: 2,
        name: 'meeting_notes.docx',
        type: 'document',
        size: '156 KB',
        uploadDate: '2024-01-15 13:45',
        uploadedBy: 'Sarah Wilson'
      },
      {
        id: 3,
        name: 'team_photo.jpg',
        type: 'image',
        size: '890 KB',
        uploadDate: '2024-01-14 16:30',
        uploadedBy: 'Emily Davis'
      }
    ] : [],
    scheduledSends: [
      {
        id: 1,
        file: file.name,
        recipient: 'client@example.com',
        scheduledFor: '2024-01-16 09:00',
        status: 'pending'
      }
    ],
    activityLog: [
      { action: file.type === 'folder' ? 'Folder Created' : 'File Uploaded', item: file.name, user: file.ownerName, timestamp: file.createdAt, status: 'success' },
      { action: 'Access Granted', item: file.name, user: 'Admin', timestamp: file.lastModified, status: 'success' }
    ]
  }

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-5 w-5 text-blue-500" />
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />
      case 'document':
        return <FileText className="h-5 w-5 text-green-500" />
      case 'archive':
        return <Archive className="h-5 w-5 text-orange-500" />
      default:
        return <File className="h-5 w-5 text-gray-500" />
    }
  }

  const getFileTypeColor = (fileType) => {
    switch (fileType) {
      case 'image':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'video':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'document':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'archive':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
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
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                fileDetails.type === 'folder' 
                  ? 'bg-primary-500' 
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {fileDetails.type === 'folder' ? (
                  <FolderOpen className="h-6 w-6 text-white" />
                ) : (
                  getFileIcon(fileDetails.fileType)
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {fileDetails.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {fileDetails.type === 'folder' 
                    ? `${fileDetails.fileCount || 0} files • ${fileDetails.size}`
                    : `${fileDetails.size} • ${fileDetails.fileType}`
                  }
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
              { id: 'details', label: 'Details', icon: fileDetails.type === 'folder' ? FolderOpen : FileText },
              { id: 'sharing', label: 'Sharing', icon: Share2 },
              { id: 'activity', label: 'Activity', icon: Clock }
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
                  {fileDetails.type === 'folder' ? 'Folder Information' : 'File Information'}
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" /> 
                    <strong>Owner:</strong> {fileDetails.ownerName} ({fileDetails.owner})
                  </p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" /> 
                    <strong>Created:</strong> {fileDetails.createdAt}
                  </p>
                  <p className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" /> 
                    <strong>Last Modified:</strong> {fileDetails.lastModified}
                  </p>
                  <p className="flex items-center">
                    <HardDrive className="h-4 w-4 mr-2 text-gray-500" /> 
                    <strong>Size:</strong> {fileDetails.size}
                  </p>
                  {fileDetails.type === 'file' && (
                    <p className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" /> 
                      <strong>Type:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(fileDetails.fileType)}`}>
                        {fileDetails.fileType}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Folder Contents (for folders) */}
              {fileDetails.type === 'folder' && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Folder Contents ({fileDetails.files.length} files)
                  </h3>
                  {fileDetails.files.length > 0 ? (
                    <div className="space-y-2">
                      {fileDetails.files.map((file, index) => (
                        <motion.div
                          key={file.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.uploadDate}</span>
                                <span>•</span>
                                <span>by {file.uploadedBy}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getFileTypeColor(file.type)}`}>
                              {file.type}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                              title="Preview"
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-gray-500 hover:text-blue-600"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">This folder is empty.</p>
                  )}
                </div>
              )}

              {/* File Actions (for files) */}
              {fileDetails.type === 'file' && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    File Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>Share</span>
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sharing Tab */}
          {activeTab === 'sharing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Sharing Settings
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${fileDetails.isShared ? 'bg-green-500' : 'bg-gray-500'}`}>
                      {fileDetails.isShared ? (
                        <Share2 className="h-5 w-5 text-white" />
                      ) : (
                        <Lock className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {fileDetails.isShared ? 'Shared' : 'Private'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {fileDetails.isShared 
                          ? 'This item is shared with other users' 
                          : 'This item is private to the owner'
                        }
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEdit(file)}
                    className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
                  >
                    Edit Sharing
                  </motion.button>
                </div>
              </div>

              {fileDetails.isShared && fileDetails.sharedWith.length > 0 && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                    Shared with ({fileDetails.sharedWith.length} users)
                  </h4>
                  <div className="space-y-2">
                    {fileDetails.sharedWith.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <span className="text-gray-900 dark:text-white">{email}</span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 text-red-500 hover:text-red-600"
                          title="Remove Access"
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Scheduled Sends
                </h4>
                <div className="space-y-2">
                  {fileDetails.scheduledSends.map((send, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Send className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{send.file}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            To: {send.recipient} • {send.scheduledFor}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        send.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {send.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {fileDetails.activityLog.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {activity.item} • by {activity.user} • {activity.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {activity.status === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {activity.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Owner: {fileDetails.ownerName} • Created: {fileDetails.createdAt}
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEdit(file)}
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

export default FileDetailPanel
