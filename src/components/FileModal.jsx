import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FolderOpen, FileText, User, Share2, Lock, Save, AlertCircle, Upload } from 'lucide-react'

const FileModal = ({ isOpen, onClose, file, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'folder', // 'folder' or 'file'
    fileType: 'document', // for files: 'document', 'image', 'video', 'archive'
    owner: '',
    isShared: false,
    sharedWith: []
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock users for owner selection
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah.wilson@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com' }
  ]

  useEffect(() => {
    if (file) {
      setFormData({
        name: file.name || '',
        type: file.type || 'folder',
        fileType: file.fileType || 'document',
        owner: file.owner || '',
        isShared: file.isShared || false,
        sharedWith: file.sharedWith || []
      })
    } else {
      setFormData({
        name: '',
        type: 'folder',
        fileType: 'document',
        owner: '',
        isShared: false,
        sharedWith: []
      })
    }
    setErrors({})
  }, [file, isOpen])

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Owner validation
    if (!formData.owner) {
      newErrors.owner = 'Please select an owner'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleShareToggle = () => {
    setFormData(prev => ({
      ...prev,
      isShared: !prev.isShared,
      sharedWith: !prev.isShared ? [] : prev.sharedWith
    }))
  }

  const handleSharedUserChange = (userEmail, isChecked) => {
    setFormData(prev => ({
      ...prev,
      sharedWith: isChecked 
        ? [...prev.sharedWith, userEmail]
        : prev.sharedWith.filter(email => email !== userEmail)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const fileData = {
        ...formData,
        id: file?.id || Date.now(),
        ownerName: users.find(u => u.email === formData.owner)?.name || 'Unknown User',
        fileCount: formData.type === 'folder' ? (file?.fileCount || 0) : undefined,
        size: file?.size || '0 KB',
        sizeBytes: file?.sizeBytes || 0,
        createdAt: file?.createdAt || new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0]
      }
      
      onSave(fileData)
    } catch (error) {
      console.error('Error saving file:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-500 rounded-lg">
                  {formData.type === 'folder' ? (
                    <FolderOpen className="h-5 w-5 text-white" />
                  ) : (
                    <FileText className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {file ? `Edit ${formData.type === 'folder' ? 'Folder' : 'File'}` : `Add New ${formData.type === 'folder' ? 'Folder' : 'File'}`}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {file ? `Update ${formData.type} information` : `Create a new ${formData.type}`}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection */}
            {!file && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('type', 'folder')}
                    className={`p-4 rounded-lg border transition-colors ${
                      formData.type === 'folder'
                        ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FolderOpen className={`h-5 w-5 ${formData.type === 'folder' ? 'text-primary-500' : 'text-gray-500'}`} />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">Folder</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Organize files</div>
                      </div>
                    </div>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange('type', 'file')}
                    className={`p-4 rounded-lg border transition-colors ${
                      formData.type === 'file'
                        ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className={`h-5 w-5 ${formData.type === 'file' ? 'text-primary-500' : 'text-gray-500'}`} />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">File</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Upload document</div>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {/* File Type Selection (for files) */}
            {formData.type === 'file' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Type
                </label>
                <select
                  value={formData.fileType}
                  onChange={(e) => handleInputChange('fileType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="archive">Archive</option>
                </select>
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {formData.type === 'folder' ? 'Folder Name' : 'File Name'} *
              </label>
              <div className="relative">
                {formData.type === 'folder' ? (
                  <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                ) : (
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.name 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={`Enter ${formData.type === 'folder' ? 'folder' : 'file'} name`}
                />
              </div>
              {errors.name && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-1 mt-1 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.name}</span>
                </motion.div>
              )}
            </div>

            {/* Owner Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Owner *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.owner 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select an owner</option>
                  {users.map(user => (
                    <option key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              {errors.owner && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-1 mt-1 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.owner}</span>
                </motion.div>
              )}
            </div>

            {/* File Upload (for new files) */}
            {formData.type === 'file' && !file && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload File
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PDF, DOC, XLS, PPT, JPG, PNG, MP4, ZIP
                  </p>
                </div>
              </div>
            )}

            {/* Share Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Share Settings
              </label>
              
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShareToggle}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  formData.isShared
                    ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-800'
                    : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    formData.isShared ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {formData.isShared ? (
                      <Share2 className="h-4 w-4 text-white" />
                    ) : (
                      <Lock className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formData.isShared ? 'Shared' : 'Private'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.isShared 
                        ? 'Other users can access this item' 
                        : 'Only the owner can access this item'
                      }
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  formData.isShared 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {formData.isShared && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </motion.button>

              {/* Shared Users Selection */}
              {formData.isShared && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Share with users:
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {users.filter(user => user.email !== formData.owner).map(user => (
                      <label key={user.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sharedWith.includes(user.email)}
                          onChange={(e) => handleSharedUserChange(user.email, e.target.checked)}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {user.name} ({user.email})
                        </span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6 rounded-b-xl">
            <div className="flex items-center justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>{file ? 'Update' : 'Create'}</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FileModal
