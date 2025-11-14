import React, { useState, useEffect } from 'react'
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
  Users,
  HardDrive,
  Save,
  CheckCircle,
  XCircle,
  History,
  Play,
  Pause,
  AlertTriangle
} from 'lucide-react'
import apiService from '../services/api'

const UserDetailPage = ({ user, onBack }) => {
  // Check if user exists
  if (!user) {
    return null
  }

  // State for tabs
  const [activeTab, setActiveTab] = useState('files')

  // State for storage limit editing
  const [storageLimitInput, setStorageLimitInput] = useState('')
  const [isUpdatingStorage, setIsUpdatingStorage] = useState(false)
  const [showStorageEditor, setShowStorageEditor] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

  // State for dynamic data
  const [loading, setLoading] = useState(true)
  const [userFiles, setUserFiles] = useState([])
  const [userFolders, setUserFolders] = useState([])
  const [userSchedules, setUserSchedules] = useState([])
  const [userSubscription, setUserSubscription] = useState(null)
  const [userSubscriptions, setUserSubscriptions] = useState([]) // All subscriptions (history)
  const [selectedSchedule, setSelectedSchedule] = useState(null) // For full schedule view
  const [isScheduleDetailOpen, setIsScheduleDetailOpen] = useState(false) // For schedule detail modal
  const [isModalOpen, setIsModalOpen] = useState(false) // Keep for backward compatibility if needed
  const [userRecipients, setUserRecipients] = useState([]) // Recipients list
  const [recipientsLoading, setRecipientsLoading] = useState(false)
  const [recipientsPagination, setRecipientsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [userStats, setUserStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    totalStorage: 0,
    totalSchedules: 0
  })

  // Initialize storage limit input when user changes
  useEffect(() => {
    if (currentUser?.storageLimit) {
      const limitInGB = currentUser.storageLimit / (1024 * 1024 * 1024)
      setStorageLimitInput(limitInGB.toString())
    }
  }, [currentUser])

  // Update currentUser when user prop changes
  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  // Fetch user data when component mounts or user changes
  useEffect(() => {
    if (user?.id || user?._id) {
      fetchUserData()
    }
  }, [user?.id, user?._id])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const userId = user?.id || user?._id

      // Fetch user details, files, folders, schedules, and subscription in parallel
      const [userResponse, filesResponse, foldersResponse, schedulesResponse, subscriptionsResponse] = await Promise.all([
        apiService.getUserById(userId).catch(() => ({ success: false, data: { user: user } })),
        apiService.getAdminFiles({ userId, limit: 1000 }).catch(() => ({ success: false, data: { files: [] } })),
        apiService.getAdminFolders({ userId, limit: 1000 }).catch(() => ({ success: false, data: { folders: [] } })),
        apiService.getScheduleByUserId(userId).catch(() => ({ success: false, data: { schedules: [] } })),
        apiService.getSubscriptions({ limit: 100 }).catch(() => ({ success: false, data: { subscriptions: [] } }))
      ])

      // Update user data if fetched successfully
      if (userResponse.success && userResponse.data?.user) {
        setCurrentUser(userResponse.data.user)
      }

      // Update files
      if (filesResponse.success && filesResponse.data?.files) {
        setUserFiles(filesResponse.data.files)
      }

      // Update folders
      if (foldersResponse.success && foldersResponse.data?.folders) {
        setUserFolders(foldersResponse.data.folders)
      }

      // Update schedules
      if (schedulesResponse.success && schedulesResponse.data?.schedules) {
        setUserSchedules(schedulesResponse.data.schedules)
      }

      // Update subscriptions - get all subscriptions for this user
      if (subscriptionsResponse.success && subscriptionsResponse.data?.subscriptions) {
        const allUserSubscriptions = subscriptionsResponse.data.subscriptions.filter(
          sub => {
            const subUserId = sub.user?.id || sub.user?._id
            const currentUserId = userId?.toString()
            return subUserId?.toString() === currentUserId
          }
        )
        setUserSubscriptions(allUserSubscriptions)
        
        // Set active subscription for header
        const activeSubscription = allUserSubscriptions.find(sub => sub.status === 'active')
        if (activeSubscription) {
          setUserSubscription(activeSubscription)
        } else {
          setUserSubscription(null)
        }
      } else {
        setUserSubscriptions([])
        setUserSubscription(null)
      }

      // Calculate stats
      const totalFiles = filesResponse.success ? (filesResponse.data?.files?.length || 0) : 0
      const totalFolders = foldersResponse.success ? (foldersResponse.data?.folders?.length || 0) : 0
      const totalStorage = filesResponse.success 
        ? (filesResponse.data?.files?.reduce((sum, file) => sum + (file.size || 0), 0) || 0)
        : 0
      const totalSchedules = schedulesResponse.success ? (schedulesResponse.data?.schedules?.length || 0) : 0

      setUserStats({
        totalFiles,
        totalFolders,
        totalStorage,
        totalSchedules
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleUpdateStorageLimit = async () => {
    try {
      setIsUpdatingStorage(true)
      const limitInBytes = parseFloat(storageLimitInput) * 1024 * 1024 * 1024
      
      if (isNaN(limitInBytes) || limitInBytes < 0) {
        alert('Please enter a valid storage limit')
        return
      }

      const response = await apiService.updateUserStorageLimit(currentUser.id, Math.round(limitInBytes))

      if (response.success) {
        // Update local user state
        setCurrentUser({
          ...currentUser,
          storageLimit: Math.round(limitInBytes)
        })
        setShowStorageEditor(false)
        alert('Storage limit updated successfully! The user will see the updated limit when they refresh the app.')
      } else {
        alert(response.message || 'Failed to update storage limit')
      }
    } catch (err) {
      console.error('Error updating storage limit:', err)
      alert('Failed to update storage limit')
    } finally {
      setIsUpdatingStorage(false)
    }
  }

  // Modal functions
  const handleViewClick = (schedule) => {
    setSelectedSchedule(schedule)
    setIsScheduleDetailOpen(true)
  }

  const handleCloseScheduleDetail = () => {
    setIsScheduleDetailOpen(false)
    setSelectedSchedule(null)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
  }

  // Fetch recipients with pagination
  const fetchRecipients = async (page = 1, limit = 10) => {
    try {
      setRecipientsLoading(true)
      const userId = user?.id || user?._id
      
      const response = await apiService.getRecipients({
        owner: userId,
        page,
        limit
      })

      if (response.success && response.recipients) {
        setUserRecipients(response.recipients)
        // If API returns pagination info, use it; otherwise calculate
        if (response.pagination) {
          setRecipientsPagination({
            page: response.pagination.current || page,
            limit: response.pagination.limit || limit,
            total: response.pagination.total || 0,
            totalPages: response.pagination.totalPages || Math.ceil((response.pagination.total || 0) / (response.pagination.limit || limit))
          })
        } else {
          // Fallback: assume we have all recipients if no pagination info
          setRecipientsPagination({
            page,
            limit,
            total: response.recipients.length,
            totalPages: Math.ceil(response.recipients.length / limit)
          })
        }
      } else {
        setUserRecipients([])
        setRecipientsPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        })
      }
    } catch (error) {
      console.error('Error fetching recipients:', error)
      setUserRecipients([])
    } finally {
      setRecipientsLoading(false)
    }
  }

  // Fetch recipients when recipients tab is active
  useEffect(() => {
    if (activeTab === 'recipients' && (user?.id || user?._id)) {
      fetchRecipients(1, 10) // Always start from page 1 when tab is opened
    }
  }, [activeTab, user?.id, user?._id])

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get file extension helper
  const getFileExtension = (filename) => {
    if (!filename) return ''
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : ''
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
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                {/* Left Side - User Info */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-primary-500" />
                </div>

                {/* User Info */}
                <div className="text-center sm:text-left text-white">
                  <h2 className="text-2xl font-bold">
                      {currentUser?.name || user?.name || 'Unknown User'}
                  </h2>
                    <p className="text-primary-100 mt-1">{currentUser?.email || user?.email || 'No email'}</p>
                    <p className="text-primary-200 text-sm mt-1">
                      {currentUser?.createdAt ? `Date of Joining: ${formatDate(currentUser.createdAt)}` : ''}
                    </p>
                  </div>
                </div>

                {/* Right Side - Subscription Plan */}
                <div className="w-full lg:w-auto">
                  {loading ? (
                    <div className="text-center lg:text-right text-white">
                      <p className="text-primary-200 text-sm">Loading subscription...</p>
                    </div>
                  ) : userSubscription ? (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-center lg:text-right">
                        <p className="text-primary-200 text-xs mb-1">Current Plan</p>
                        <p className="text-white font-semibold text-lg">
                          {userSubscription.package?.name || 'N/A'}
                        </p>
                        {userSubscription.package?.price && (
                          <p className="text-primary-100 text-sm mt-1">
                            ₹{userSubscription.package.price.toFixed(2)} / {userSubscription.package.billingCycle || 'N/A'}
                          </p>
                        )}
                        {userSubscription.endDate && (
                          <p className="text-primary-200 text-xs mt-1">
                            Expires: {formatDate(userSubscription.endDate)}
                          </p>
                        )}
                        {!userSubscription.endDate && (
                          <p className="text-primary-200 text-xs mt-1">
                            Lifetime Plan
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="text-center lg:text-right">
                        <p className="text-primary-200 text-xs mb-1">Current Plan</p>
                        <p className="text-white font-semibold text-lg">Free Plan</p>
                        <p className="text-primary-100 text-sm mt-1">No active subscription</p>
                      </div>
                    </div>
                  )}
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
                { id: 'files', label: 'Files & Storage', icon: FolderOpen },
                { id: 'schedule', label: 'Schedules', icon: Clock },
                { id: 'subscriptions', label: 'Subscriptions', icon: Shield },
                { id: 'recipients', label: 'Recipients', icon: Users },
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
                        {loading ? 'Loading...' : `${userStats.totalFiles} files in ${userStats.totalFolders} folders`}
                  </div>
                </div>

                      {/* Storage Overview */}
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Settings className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-right">
                          <div className="text-xl font-bold">{formatBytes(currentUser?.storageUsed || 0)}</div>
                            <div className="text-blue-100 text-sm">Total Storage Used</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                          <div className="text-lg font-bold">{loading ? '...' : userStats.totalFiles}</div>
                            <div className="text-blue-100 text-xs">Files</div>
                        </div>
                          <div className="text-center">
                          <div className="text-lg font-bold">{loading ? '...' : userStats.totalFolders}</div>
                            <div className="text-blue-100 text-xs">Folders</div>
                            </div>
                          <div className="text-center">
                          <div className="text-lg font-bold">{loading ? '...' : userStats.totalSchedules}</div>
                          <div className="text-blue-100 text-xs">Schedules</div>
                        </div>
                      </div>
                    </div>

                      {/* Storage Limit Editor */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                            <HardDrive className="h-4 w-4 mr-2" />
                            Storage Limit
                          </h4>
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
                                Current limit: {formatBytes(currentUser?.storageLimit || 0)}
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
                                {formatBytes(currentUser?.storageUsed || 0)}
                              </span>
                  </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Storage Limit:</span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatBytes(currentUser?.storageLimit || 0)}
                              </span>
                  </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Available:</span>
                              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                {formatBytes((currentUser?.storageLimit || 0) - (currentUser?.storageUsed || 0))}
                              </span>
                        </div>
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(100, ((currentUser?.storageUsed || 0) / (currentUser?.storageLimit || 1)) * 100)}%`
                                  }}
                                />
                      </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {Math.round(((currentUser?.storageUsed || 0) / (currentUser?.storageLimit || 1)) * 100)}% used
                              </p>
                        </div>
                        </div>
                        )}
                </div>
                
                    {/* Folders Grid */}
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Folders</h4>
                      {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading folders...</div>
                      ) : userFolders.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No folders found</div>
                      ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {userFolders.map((folder) => (
                            <div key={folder.id || folder._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <FolderOpen className="h-5 w-5 text-blue-600" />
                </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{folder.name}</h5>
                                  <p className="text-xs text-gray-500">{folder.itemCount || 0} items</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{formatBytes(folder.totalSize || 0)}</span>
                                <span className="text-xs text-gray-500">{formatDate(folder.updatedAt || folder.createdAt)}</span>
                            </div>
                                </div>
                              ))}
                        </div>
                              )}
                    </div>

                    {/* Files List */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Files</h4>
                      {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading files...</div>
                      ) : userFiles.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No files found</div>
                      ) : (
                      <div className="space-y-3">
                          {userFiles.map((file) => (
                            <div key={file.id || file._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-green-600" />
                  </div>
                              <div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{file.name || file.originalName}</span>
                                  <p className="text-xs text-gray-500">{getFileExtension(file.name || file.originalName)} • {formatDate(file.createdAt)}</p>
                  </div>
                  </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{formatBytes(file.size || 0)}</span>
                          </div>
                        ))}
                  </div>
                      )}
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
                  {/* Schedule Overview Statistics */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-600" />
                      Schedule Overview
                    </h3>
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading statistics...</div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {/* Total Schedules */}
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                          <div className="text-2xl font-bold mb-1">{userSchedules.length}</div>
                          <div className="text-blue-100 text-xs">Total Schedules</div>
                        </div>
                        {/* Active Schedules */}
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                          <div className="text-2xl font-bold mb-1">
                            {userSchedules.filter(s => s.status === 'active').length}
                          </div>
                          <div className="text-green-100 text-xs">Active</div>
                        </div>
                        {/* Pending Schedules */}
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
                          <div className="text-2xl font-bold mb-1">
                            {userSchedules.filter(s => s.status === 'pending').length}
                          </div>
                          <div className="text-yellow-100 text-xs">Pending</div>
                        </div>
                        {/* Total Items */}
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                          <div className="text-2xl font-bold mb-1">
                            {userSchedules.reduce((sum, s) => sum + (s.items?.length || 0), 0)}
                          </div>
                          <div className="text-purple-100 text-xs">Total Items</div>
                        </div>
                        {/* Total Recipients */}
                        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white">
                          <div className="text-2xl font-bold mb-1">
                            {[...new Set(
                              userSchedules.flatMap(s => 
                                (s.items || []).flatMap(item => 
                                  item.recipients?.map(r => r.email) || []
                                )
                              )
                            )].length}
                          </div>
                          <div className="text-pink-100 text-xs">Recipients</div>
                        </div>
                        {/* Total Executions */}
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-4 text-white">
                          <div className="text-2xl font-bold mb-1">
                            {userSchedules.reduce((sum, s) => sum + (s.executionHistory?.length || 0), 0)}
                          </div>
                          <div className="text-indigo-100 text-xs">Executions</div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Schedule Management Section */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    All Schedules
                  </h3>
                </div>

                {/* Full Schedule List */}
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading schedules...</div>
                ) : userSchedules.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No schedules found</div>
                ) : (
                <div className="space-y-4">
                    {userSchedules.map((schedule) => {
                      const itemCount = schedule.items?.length || 0
                      const allRecipients = [...new Set(
                        (schedule.items || []).flatMap(item => 
                          item.recipients?.map(r => r.email) || []
                        )
                      )]
                      const recipientCount = allRecipients.length
                      const executionHistory = schedule.executionHistory || []
                      const totalSends = executionHistory.length
                      const successfulSends = executionHistory.filter(e => e.status === 'success').length
                      const failedSends = executionHistory.filter(e => e.status === 'failed').length
                      
                      return (
                        <div key={schedule.id || schedule._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-5 hover:shadow-md transition-shadow">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className={`w-12 h-12 ${schedule.status === 'active' ? 'bg-green-100 dark:bg-green-900/20' : schedule.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-900/20'} rounded-lg flex items-center justify-center`}>
                                <Clock className={`h-6 w-6 ${schedule.status === 'active' ? 'text-green-600' : schedule.status === 'pending' ? 'text-yellow-600' : 'text-gray-600'}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                                    Schedule {schedule.id?.substring(0, 8) || schedule._id?.substring(0, 8) || 'Unknown'}
                                  </h4>
                                  <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                                    schedule.status === 'active' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                                      : schedule.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                  }`}>
                                    {schedule.status?.toUpperCase() || 'UNKNOWN'}
                                  </span>
                                  <span className="px-2.5 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 font-medium capitalize">
                                    {schedule.scheduleType || 'one-time'}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center">
                                    <FileText className="h-4 w-4 mr-1" />
                                    {itemCount} item{itemCount !== 1 ? 's' : ''}
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}
                                  </span>
                                  {schedule.nextExecutionDate && (
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      Next: {formatDate(schedule.nextExecutionDate)}
                                    </span>
                                  )}
                                  {schedule.lastExecutionDate && (
                                    <span className="flex items-center">
                                      <History className="h-4 w-4 mr-1" />
                                      Last: {formatDate(schedule.lastExecutionDate)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewClick(schedule)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                            </motion.button>
                          </div>

                          {/* Schedule Items Preview */}
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Scheduled Items:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {(schedule.items || []).slice(0, 4).map((item, idx) => {
                                const isFolder = item.folder
                                const itemName = isFolder 
                                  ? (item.folder?.name || 'Folder')
                                  : (item.file?.name || item.file?.originalName || 'File')
                                const itemRecipients = item.recipients?.length || 0
                                
                                return (
                                  <div key={item._id || idx} className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                    {isFolder ? (
                                      <FolderOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{itemName}</p>
                                      <p className="text-xs text-gray-500">{itemRecipients} recipient{itemRecipients !== 1 ? 's' : ''}</p>
                                    </div>
                                    {item.isEnabled !== false ? (
                                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    )}
                                  </div>
                                )
                              })}
                              {(schedule.items || []).length > 4 && (
                                <div className="flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                                  <span className="text-xs text-gray-600 dark:text-gray-400">
                                    +{(schedule.items || []).length - 4} more
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Execution Statistics */}
                          {totalSends > 0 && (
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Send className="h-4 w-4 text-gray-500" />
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">{totalSends}</span>
                                  <span className="text-gray-500">total sends</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-green-600 font-medium">{successfulSends}</span>
                                  <span className="text-gray-500">successful</span>
                                </div>
                                {failedSends > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-red-600 font-medium">{failedSends}</span>
                                    <span className="text-gray-500">failed</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Recipients Preview */}
                          {allRecipients.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipients:</h5>
                              <div className="flex flex-wrap gap-2">
                                {allRecipients.slice(0, 5).map((email, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {email}
                                  </span>
                                ))}
                                {allRecipients.length > 5 && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                    +{allRecipients.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
                )}
                </motion.div>
                </motion.div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Current Plan */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-gray-600" />
                      Current Plan
                    </h3>
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading subscription...</div>
                    ) : userSubscription ? (
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-2xl font-bold mb-1">
                              {userSubscription.package?.name || 'N/A'}
                            </h4>
                            <p className="text-blue-100 text-sm">
                              {userSubscription.package?.billingCycle || 'N/A'} Plan
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">
                              ₹{userSubscription.package?.price?.toFixed(2) || '0.00'}
                            </div>
                            <p className="text-blue-100 text-sm">
                              per {userSubscription.package?.billingCycle || 'period'}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
                          <div>
                            <p className="text-blue-100 text-xs mb-1">Start Date</p>
                            <p className="font-semibold">
                              {userSubscription.startDate ? formatDate(userSubscription.startDate) : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-100 text-xs mb-1">
                              {userSubscription.endDate ? 'Expiry Date' : 'Plan Type'}
                            </p>
                            <p className="font-semibold">
                              {userSubscription.endDate 
                                ? formatDate(userSubscription.endDate)
                                : 'Lifetime'}
                            </p>
                          </div>
                        </div>
                        {userSubscription.package?.storageLimit && (
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-blue-100 text-xs mb-1">Storage Limit</p>
                            <p className="font-semibold">
                              {formatBytes(userSubscription.package.storageLimit)}
                            </p>
                          </div>
                        )}
                        <div className="mt-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            userSubscription.status === 'active'
                              ? 'bg-green-500/20 text-white border border-white/30'
                              : userSubscription.status === 'expired'
                              ? 'bg-red-500/20 text-white border border-white/30'
                              : 'bg-gray-500/20 text-white border border-white/30'
                          }`}>
                            {userSubscription.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Free Plan</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">No active subscription</p>
                      </div>
                    )}
                  </motion.div>

                  {/* Subscription History */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                      Subscription History
                    </h3>
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading history...</div>
                    ) : userSubscriptions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No subscription history</div>
                    ) : (
                      <div className="space-y-3">
                        {userSubscriptions.map((subscription) => (
                          <div
                            key={subscription.id || subscription._id}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {subscription.package?.name || 'Unknown Package'}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                      ₹{subscription.amount?.toFixed(2) || '0.00'} / {subscription.billingCycle || 'N/A'}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                      {subscription.startDate ? formatDate(subscription.startDate) : 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                                      {subscription.endDate ? 'End Date' : 'Type'}
                                    </p>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                      {subscription.endDate ? formatDate(subscription.endDate) : 'Lifetime'}
                                    </p>
                                  </div>
                                </div>
                                {subscription.package?.storageLimit && (
                                  <div className="mt-3">
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Storage Limit</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {formatBytes(subscription.package.storageLimit)}
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  subscription.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                    : subscription.status === 'expired'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                                    : subscription.status === 'cancelled'
                                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                                }`}>
                                  {subscription.status?.toUpperCase() || 'UNKNOWN'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Recipients Tab */}
              {activeTab === 'recipients' && (
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Users className="h-5 w-5 mr-2 text-gray-600" />
                        Recipients
                      </h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total: {recipientsPagination.total}
                      </div>
                    </div>

                    {recipientsLoading ? (
                      <div className="text-center py-12 text-gray-500">Loading recipients...</div>
                    ) : userRecipients.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">No recipients found</p>
                      </div>
                    ) : (
                      <>
                        {/* Recipients List */}
                        <div className="space-y-3 mb-6">
                          {userRecipients.map((recipient) => (
                            <div
                              key={recipient.id || recipient._id}
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                                    {(recipient.name || recipient.email || '?').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                                    {recipient.name || 'Unnamed Recipient'}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center">
                                      <Mail className="h-4 w-4 mr-1" />
                                      {recipient.email || 'No email'}
                                    </span>
                                    {recipient.phone && (
                                      <span className="flex items-center">
                                        <Phone className="h-4 w-4 mr-1" />
                                        {recipient.phone}
                                      </span>
                                    )}
                                    {recipient.createdAt && (
                                      <span className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        Added: {formatDate(recipient.createdAt)}
                                      </span>
                                    )}
                                  </div>
                                  {recipient.notes && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                                      {recipient.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {recipientsPagination.totalPages > 1 && (
                          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Showing {((recipientsPagination.page - 1) * recipientsPagination.limit) + 1} to{' '}
                              {Math.min(recipientsPagination.page * recipientsPagination.limit, recipientsPagination.total)} of{' '}
                              {recipientsPagination.total} recipients
                            </div>
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fetchRecipients(recipientsPagination.page - 1, recipientsPagination.limit)}
                                disabled={recipientsPagination.page === 1 || recipientsLoading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  recipientsPagination.page === 1 || recipientsLoading
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                              >
                                Previous
                              </motion.button>
                              
                              <div className="flex items-center space-x-1">
                                {Array.from({ length: Math.min(5, recipientsPagination.totalPages) }, (_, i) => {
                                  let pageNum
                                  if (recipientsPagination.totalPages <= 5) {
                                    pageNum = i + 1
                                  } else if (recipientsPagination.page <= 3) {
                                    pageNum = i + 1
                                  } else if (recipientsPagination.page >= recipientsPagination.totalPages - 2) {
                                    pageNum = recipientsPagination.totalPages - 4 + i
                                  } else {
                                    pageNum = recipientsPagination.page - 2 + i
                                  }
                                  
                                  return (
                                    <motion.button
                                      key={pageNum}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => fetchRecipients(pageNum, recipientsPagination.limit)}
                                      disabled={recipientsLoading}
                                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        recipientsPagination.page === pageNum
                                          ? 'bg-primary-500 text-white'
                                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                      } ${recipientsLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                                    >
                                      {pageNum}
                                    </motion.button>
                                  )
                                })}
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => fetchRecipients(recipientsPagination.page + 1, recipientsPagination.limit)}
                                disabled={recipientsPagination.page === recipientsPagination.totalPages || recipientsLoading}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                  recipientsPagination.page === recipientsPagination.totalPages || recipientsLoading
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                }`}
                              >
                                Next
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
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
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading activity...</div>
                    ) : (
                <div className="space-y-4">
                        {/* Show recent files, folders, and schedules as activity */}
                        {userFiles.slice(0, 5).map((file) => (
                          <div key={file.id || file._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                              <FileText className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">File Upload</p>
                              <p className="text-xs text-gray-500">{file.name || file.originalName} • {formatDate(file.createdAt)}</p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Success
                            </span>
                          </div>
                        ))}
                        {userFolders.slice(0, 3).map((folder) => (
                          <div key={folder.id || folder._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                              <FolderOpen className="h-4 w-4 text-blue-600" />
                    </div>
                          <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Folder Created</p>
                              <p className="text-xs text-gray-500">{folder.name} • {formatDate(folder.createdAt)}</p>
                            </div>
                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Success
                            </span>
                          </div>
                        ))}
                        {userSchedules.slice(0, 3).map((schedule) => (
                          <div key={schedule.id || schedule._id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                              <Send className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule Created</p>
                              <p className="text-xs text-gray-500">Schedule • {formatDate(schedule.createdAt)}</p>
                    </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                              schedule.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                              {schedule.status || 'Pending'}
                          </span>
                  </div>
                      ))}
                        {userFiles.length === 0 && userFolders.length === 0 && userSchedules.length === 0 && (
                          <div className="text-center py-8 text-gray-500">No activity found</div>
                        )}
                    </div>
                    )}
                  </motion.div>
                </motion.div>
              )}




            </div>
          </div>
        </div>

        {/* Schedule Details Modal - Full View */}
        {isScheduleDetailOpen && selectedSchedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Schedule Details
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedSchedule.items?.length || 0} item{(selectedSchedule.items?.length || 0) !== 1 ? 's' : ''} • {
                        [...new Set(
                          (selectedSchedule.items || []).flatMap(item => 
                            item.recipients?.map(r => r.email) || []
                          )
                        )].length
                      } recipient{[...new Set(
                        (selectedSchedule.items || []).flatMap(item => 
                          item.recipients?.map(r => r.email) || []
                        )
                      )].length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseScheduleDetail}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Schedule Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Status</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedSchedule.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : selectedSchedule.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {selectedSchedule.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Schedule Type</p>
                        <p className="text-gray-900 dark:text-white font-medium capitalize">
                          {selectedSchedule.scheduleType || 'one-time'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Next Send</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {selectedSchedule.nextExecutionDate 
                            ? formatDate(selectedSchedule.nextExecutionDate)
                            : 'Not scheduled'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Last Sent</p>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {selectedSchedule.lastExecutionDate 
                            ? formatDate(selectedSchedule.lastExecutionDate)
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Items */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Scheduled Items ({(selectedSchedule.items || []).length})
                    </h4>
                    <div className="space-y-3">
                      {(selectedSchedule.items || []).length === 0 ? (
                        <p className="text-sm text-gray-600 dark:text-gray-400">No items scheduled</p>
                      ) : (
                        (selectedSchedule.items || []).map((item, index) => (
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
                                  {item.folder?.name || item.file?.name || item.file?.originalName || 'Invalid Item'}
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
                                <div className="mt-2">
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

                  {/* Execution History */}
                  {(selectedSchedule.executionHistory || []).length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                        <History className="h-5 w-5 mr-2" />
                        Execution History ({(selectedSchedule.executionHistory || []).length})
                      </h4>
                      <div className="space-y-3">
                        {(selectedSchedule.executionHistory || []).map((exec, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center space-x-3">
                              {exec.status === 'success' ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {exec.executionDate ? formatDate(exec.executionDate) : 'Unknown Date'}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {exec.recipientsCount || 0} recipient{(exec.recipientsCount || 0) !== 1 ? 's' : ''} • {exec.filesCount || 0} file{(exec.filesCount || 0) !== 1 ? 's' : ''} sent
                                </p>
                                {exec.error && (
                                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    Error: {exec.error}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              exec.status === 'success'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {exec.status || 'unknown'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Statistics */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {(selectedSchedule.executionHistory || []).length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Sends</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {(selectedSchedule.executionHistory || []).filter(e => e.status === 'success').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Successful</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {(selectedSchedule.executionHistory || []).filter(e => e.status === 'failed').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseScheduleDetail}
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
