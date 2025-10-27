import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2,
  Shield,
  Clock,
  FileText,
  FolderOpen,
  Send,
  Settings,
  Eye,
  X,
  Users
} from 'lucide-react'

const UserDetailPage = ({ user, onBack }) => {
  // Check if user exists
  if (!user) {
    return null
  }

  // State for modal
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // State for tabs
  const [activeTab, setActiveTab] = useState('overview')

  // Schedule data with files and recipients
  const scheduleData = {
    'Project Documents': {
      type: 'folder',
      files: [
        { name: 'project_plan.pdf', size: '1.2 MB' },
        { name: 'requirements.docx', size: '0.8 MB' },
        { name: 'mockup.png', size: '2.1 MB' }
      ],
      recipients: [
        { name: 'John Smith', initial: 'J', color: 'bg-blue-500' },
        { name: 'Sarah Johnson', initial: 'S', color: 'bg-green-500' },
        { name: 'Mike Wilson', initial: 'M', color: 'bg-purple-500' }
      ]
    },
    'report.pdf': {
      type: 'file',
      files: [
        { name: 'report.pdf', size: '2.3 MB' }
      ],
      recipients: [
        { name: 'Client 1', initial: 'C1', color: 'bg-orange-500' },
        { name: 'Client 2', initial: 'C2', color: 'bg-pink-500' },
        { name: 'Client 3', initial: 'C3', color: 'bg-indigo-500' },
        { name: 'Client 4', initial: 'C4', color: 'bg-teal-500' }
      ]
    },
    'Personal Files': {
      type: 'folder',
      files: [
        { name: 'personal_notes.txt', size: '0.1 MB' },
        { name: 'family_photo.jpg', size: '3.2 MB' }
      ],
      recipients: [
        { name: 'Alice Brown', initial: 'A', color: 'bg-gray-500' },
        { name: 'Mark Davis', initial: 'M', color: 'bg-red-500' }
      ]
    },
    'presentation.pptx': {
      type: 'file',
      files: [
        { name: 'presentation.pptx', size: '5.7 MB' }
      ],
      recipients: [
        { name: 'Tom Wilson', initial: 'T', color: 'bg-blue-600' },
        { name: 'Sarah Lee', initial: 'S', color: 'bg-emerald-500' }
      ]
    }
  }

  // Modal functions
  const handleViewClick = (scheduleName) => {
    setSelectedSchedule(scheduleData[scheduleName])
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
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

  // User's stored files and folders with detailed storage information
  const userStorageData = {
    totalStorage: '15.2 MB',
    totalFiles: 23,
    totalFolders: 3,
    folders: [
      {
        name: 'Project Documents',
        size: '8.4 MB',
        fileCount: 12,
        files: [
          { name: 'project_plan.pdf', size: '2.1 MB', type: 'PDF', uploadDate: '2024-01-15' },
          { name: 'requirements.docx', size: '1.8 MB', type: 'Word', uploadDate: '2024-01-14' },
          { name: 'mockup.png', size: '3.2 MB', type: 'Image', uploadDate: '2024-01-13' },
          { name: 'budget.xlsx', size: '1.3 MB', type: 'Excel', uploadDate: '2024-01-12' }
        ]
      },
      {
        name: 'Personal Files',
        size: '4.1 MB',
        fileCount: 8,
        files: [
          { name: 'personal_notes.txt', size: '0.1 MB', type: 'Text', uploadDate: '2024-01-10' },
          { name: 'family_photo.jpg', size: '2.8 MB', type: 'Image', uploadDate: '2024-01-09' },
          { name: 'resume.pdf', size: '1.2 MB', type: 'PDF', uploadDate: '2024-01-08' }
        ]
      },
      {
        name: 'Shared Resources',
        size: '2.7 MB',
        fileCount: 5,
        files: [
          { name: 'meeting_notes.docx', size: '0.5 MB', type: 'Word', uploadDate: '2024-01-13' },
          { name: 'presentation.pptx', size: '1.8 MB', type: 'PowerPoint', uploadDate: '2024-01-12' },
          { name: 'data.csv', size: '0.4 MB', type: 'CSV', uploadDate: '2024-01-11' }
        ]
      }
    ],
    individualFiles: [
      { name: 'report.pdf', size: '2.3 MB', type: 'PDF', uploadDate: '2024-01-14' },
      { name: 'presentation.pptx', size: '5.7 MB', type: 'PowerPoint', uploadDate: '2024-01-13' },
      { name: 'data.xlsx', size: '1.2 MB', type: 'Excel', uploadDate: '2024-01-11' }
    ]
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto"
    >
      <div className="p-3 sm:p-6">
        {/* Page Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  User Details
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  View and manage user information
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* User Header Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-primary-500" />
                </div>

                {/* User Info */}
                <div className="text-center sm:text-left text-white">
                  <h2 className="text-2xl font-bold">
                    {userDetails.name}
                  </h2>
                  <p className="text-primary-100">{userDetails.email}</p>
                  <p className="text-primary-200 text-sm">Last Active: {userDetails.lastActive}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
          >
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'files', label: 'Files & Storage', icon: FolderOpen },
                { id: 'schedule', label: 'Schedules', icon: Clock },
                { id: 'activity', label: 'Activity', icon: Calendar }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Full Width Content */}
            <div className="space-y-6">
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Files & Storage Section - Reuse Files & Storage Tab Component */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6"
                  >
              {/* Files & Folders Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Files & Folders
                  </h3>
                  <div className="text-sm text-gray-500">
                    {userStorageData.totalFiles} files in {userStorageData.totalFolders} folders
                  </div>
                </div>

                      {/* Storage Overview */}
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Settings className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">{userStorageData.totalStorage}</div>
                            <div className="text-blue-100 text-sm">Total Storage Used</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-lg font-bold">{userStorageData.totalFiles}</div>
                            <div className="text-blue-100 text-xs">Files</div>
                        </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{userStorageData.totalFolders}</div>
                            <div className="text-blue-100 text-xs">Folders</div>
                            </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{userStorageData.individualFiles.length}</div>
                            <div className="text-blue-100 text-xs">Individual Files</div>
                        </div>
                      </div>
                    </div>

                    {/* Folders Grid */}
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Folders</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userStorageData.folders.map((folder, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{folder.name}</h5>
                                <p className="text-xs text-gray-500">{folder.fileCount} files</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{folder.size}</span>
                              <span className="text-xs text-gray-500">{folder.fileCount} items</span>
                            </div>
                            <div className="space-y-1">
                              {folder.files.slice(0, 2).map((file, fileIndex) => (
                                <div key={fileIndex} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">• {file.name}</span>
                                  <span className="text-gray-500 flex-shrink-0">{file.size}</span>
                                </div>
                              ))}
                              {folder.files.length > 2 && (
                                <div className="text-xs text-gray-500">+ {folder.files.length - 2} more files</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Files */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Individual Files</h4>
                      <div className="space-y-3">
                        {userStorageData.individualFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                                <p className="text-xs text-gray-500">{file.type} • {file.uploadDate}</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{file.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                  {/* Schedule Management Section - Reuse Schedules Tab Component */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Schedule Management
                      </h3>
                    </div>

                    {/* Global Schedule Settings Display */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Settings className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Global Schedule Settings</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">All schedules use the same time and frequency</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ON</span>
                            <span className="text-xs text-gray-500">Overall Status</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Daily at 9:00 AM
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile App Style Schedule List */}
                    <div className="space-y-3">
                      {/* Schedule Item 1 - Folder */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                              <FolderOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Project Documents</h4>
                                <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex -space-x-1">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">J</span>
                                  </div>
                                  <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">S</span>
                                  </div>
                                  <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">M</span>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">3 recipients</span>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewClick('Project Documents')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Schedule Item 2 - File */}
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">report.pdf</h4>
                                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex -space-x-1">
                                  <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">C1</span>
                                  </div>
                                  <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">C2</span>
                                  </div>
                                  <div className="w-6 h-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">C3</span>
                                  </div>
                                  <div className="w-6 h-6 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs text-white font-medium">C4</span>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">4 recipients</span>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewClick('report.pdf')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                  {/* Activity Section - Reuse Activity Tab Component */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                      Recent Activity
                    </h3>
                    <div className="space-y-4">
                      {userDetails.activityLogs.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.item} • {activity.timestamp}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activity.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      ))}
                    </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

              {/* Files & Storage Tab */}
              {activeTab === 'files' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Files & Folders Section */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                        <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                        Files & Folders
                </h3>
                      <div className="text-sm text-gray-500">
                        {userStorageData.totalFiles} files in {userStorageData.totalFolders} folders
                  </div>
                  </div>

                    {/* Storage Overview */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Settings className="h-5 w-5 text-white" />
                  </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{userStorageData.totalStorage}</div>
                          <div className="text-blue-100 text-sm">Total Storage Used</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold">{userStorageData.totalFiles}</div>
                          <div className="text-blue-100 text-xs">Files</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{userStorageData.totalFolders}</div>
                          <div className="text-blue-100 text-xs">Folders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold">{userStorageData.individualFiles.length}</div>
                          <div className="text-blue-100 text-xs">Individual Files</div>
                        </div>
                  </div>
                </div>
                
                    {/* Folders Grid */}
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Folders</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userStorageData.folders.map((folder, index) => (
                          <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{folder.name}</h5>
                                <p className="text-xs text-gray-500">{folder.fileCount} files</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{folder.size}</span>
                              <span className="text-xs text-gray-500">{folder.fileCount} items</span>
                            </div>
                            <div className="space-y-1">
                              {folder.files.slice(0, 2).map((file, fileIndex) => (
                                <div key={fileIndex} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">• {file.name}</span>
                                  <span className="text-gray-500 flex-shrink-0">{file.size}</span>
                                </div>
                              ))}
                              {folder.files.length > 2 && (
                                <div className="text-xs text-gray-500">+ {folder.files.length - 2} more files</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Individual Files */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Individual Files</h4>
                      <div className="space-y-3">
                        {userStorageData.individualFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-green-600" />
                  </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                                <p className="text-xs text-gray-500">{file.type} • {file.uploadDate}</p>
                  </div>
                  </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{file.size}</span>
                          </div>
                        ))}
                  </div>
                </div>
              </motion.div>
                </motion.div>
              )}

              {/* Schedules Tab */}
              {activeTab === 'schedule' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Schedule Management Section */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Schedule Management
                  </h3>
                      
                </div>

                {/* Global Schedule Settings Display */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Settings className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Global Schedule Settings</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">All schedules use the same time and frequency</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ON</span>
                        <span className="text-xs text-gray-500">Overall Status</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Daily at 9:00 AM
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile App Style Schedule List */}
                <div className="space-y-3">
                  {/* Schedule Item 1 - Folder */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Project Documents</h4>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">J</span>
                              </div>
                              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">S</span>
                              </div>
                              <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">M</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">3 recipients</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewClick('Project Documents')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Schedule Item 2 - File */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">report.pdf</h4>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">C1</span>
                              </div>
                              <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">C2</span>
                              </div>
                              <div className="w-6 h-6 bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">C3</span>
                              </div>
                              <div className="w-6 h-6 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">C4</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">4 recipients</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewClick('report.pdf')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Schedule Item 3 - Folder */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <FolderOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Personal Files</h4>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">A</span>
                              </div>
                              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">M</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">2 recipients</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewClick('Personal Files')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Schedule Item 4 - File */}
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">presentation.pptx</h4>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">T</span>
                              </div>
                              <div className="w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-white font-medium">S</span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">2 recipients</span>
                          </div>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleViewClick('presentation.pptx')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </motion.button>
                    </div>
                  </div>
                </div>
                </motion.div>
                </motion.div>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                      Recent Activity
                </h3>
                <div className="space-y-4">
                      {userDetails.activityLogs.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                            <p className="text-xs text-gray-500">{activity.item} • {activity.timestamp}</p>
                    </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            activity.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {activity.status}
                          </span>
                  </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}




            </div>
          </div>
        </div>

        {/* Schedule Details Modal */}
        {isModalOpen && selectedSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${selectedSchedule.type === 'folder' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-green-100 dark:bg-green-900/20'} rounded-lg flex items-center justify-center`}>
                    {selectedSchedule.type === 'folder' ? (
                      <FolderOpen className="h-5 w-5 text-blue-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {Object.keys(scheduleData).find(key => scheduleData[key] === selectedSchedule)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedSchedule.type === 'folder' ? 'Folder' : 'File'} Details
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* Files Section */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    {selectedSchedule.type === 'folder' ? 'Files in Folder' : 'File Details'}
                  </h4>
                  <div className="space-y-2">
                    {selectedSchedule.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{file.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recipients Section */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Recipients ({selectedSchedule.recipients.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSchedule.recipients.map((recipient, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className={`w-8 h-8 ${recipient.color} rounded-full flex items-center justify-center`}>
                          <span className="text-xs text-white font-medium">{recipient.initial}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{recipient.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}

    </div>
    </motion.div>
    ) 
} 

export default UserDetailPage
