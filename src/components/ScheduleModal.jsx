import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, User, FolderOpen, FileText, Mail, Calendar, Save, AlertCircle, Plus, Trash2 } from 'lucide-react'

const ScheduleModal = ({ isOpen, onClose, schedule, onSave }) => {
  const [formData, setFormData] = useState({
    targetType: 'folder', // 'folder' or 'file'
    targetFolder: '',
    targetFile: '',
    recipients: [],
    scheduleType: 'Weekly',
    startDate: '',
    startTime: '',
    customFrequency: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newRecipient, setNewRecipient] = useState('')

  // Mock data
  const folders = [
    { id: 1, name: 'Project Documents' },
    { id: 2, name: 'Client Resources' },
    { id: 3, name: 'Meeting Notes' },
    { id: 4, name: 'Shared Resources' }
  ]

  const files = [
    { id: 1, name: 'project_proposal.pdf' },
    { id: 2, name: 'meeting_notes.docx' },
    { id: 3, name: 'presentation.pptx' },
    { id: 4, name: 'report.xlsx' }
  ]

  const contacts = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah.wilson@example.com' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com' }
  ]

  useEffect(() => {
    if (schedule) {
      setFormData({
        targetType: schedule.targetFolder ? 'folder' : 'file',
        targetFolder: schedule.targetFolder || '',
        targetFile: schedule.targetFile || '',
        recipients: schedule.recipients || [],
        scheduleType: schedule.scheduleType || 'Weekly',
        startDate: schedule.nextSend ? schedule.nextSend.split(' ')[0] : '',
        startTime: schedule.nextSend ? schedule.nextSend.split(' ')[1] : '',
        customFrequency: '',
        isActive: schedule.status === 'Active'
      })
    } else {
      setFormData({
        targetType: 'folder',
        targetFolder: '',
        targetFile: '',
        recipients: [],
        scheduleType: 'Weekly',
        startDate: '',
        startTime: '',
        customFrequency: '',
        isActive: true
      })
    }
    setErrors({})
    setNewRecipient('')
  }, [schedule, isOpen])

  const validateForm = () => {
    const newErrors = {}

    // Target validation
    if (formData.targetType === 'folder' && !formData.targetFolder) {
      newErrors.targetFolder = 'Please select a folder'
    }
    if (formData.targetType === 'file' && !formData.targetFile) {
      newErrors.targetFile = 'Please select a file'
    }

    // Recipients validation
    if (formData.recipients.length === 0) {
      newErrors.recipients = 'Please add at least one recipient'
    }

    // Date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
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

  const handleAddRecipient = () => {
    if (newRecipient.trim() && !formData.recipients.includes(newRecipient.trim())) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, newRecipient.trim()]
      }))
      setNewRecipient('')
      
      // Clear recipients error
      if (errors.recipients) {
        setErrors(prev => ({
          ...prev,
          recipients: ''
        }))
      }
    }
  }

  const handleRemoveRecipient = (email) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(recipient => recipient !== email)
    }))
  }

  const handleAddContact = (contact) => {
    if (!formData.recipients.includes(contact.email)) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, contact.email]
      }))
      
      // Clear recipients error
      if (errors.recipients) {
        setErrors(prev => ({
          ...prev,
          recipients: ''
        }))
      }
    }
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
      
      const scheduleData = {
        ...formData,
        id: schedule?.id || `SCH-${Date.now()}`,
        createdBy: 'admin@vault.com',
        createdByName: 'Admin',
        nextSend: `${formData.startDate} ${formData.startTime}`,
        status: formData.isActive ? 'Active' : 'Paused',
        lastSent: null,
        totalSends: 0,
        successfulSends: 0,
        failedSends: 0
      }
      
      onSave(scheduleData)
    } catch (error) {
      console.error('Error saving schedule:', error)
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {schedule ? 'Edit Schedule' : 'Add New Schedule'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {schedule ? 'Update schedule settings' : 'Create a new automated schedule'}
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
            {/* Target Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Target *
              </label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('targetType', 'folder')}
                  className={`p-4 rounded-lg border transition-colors ${
                    formData.targetType === 'folder'
                      ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen className={`h-5 w-5 ${formData.targetType === 'folder' ? 'text-primary-500' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">Folder</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Share entire folder</div>
                    </div>
                  </div>
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange('targetType', 'file')}
                  className={`p-4 rounded-lg border transition-colors ${
                    formData.targetType === 'file'
                      ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800'
                      : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className={`h-5 w-5 ${formData.targetType === 'file' ? 'text-primary-500' : 'text-gray-500'}`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">File</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Share specific file</div>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Target Selection Dropdown */}
              <div className="relative">
                {formData.targetType === 'folder' ? (
                  <>
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={formData.targetFolder}
                      onChange={(e) => handleInputChange('targetFolder', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.targetFolder 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select a folder</option>
                      {folders.map(folder => (
                        <option key={folder.id} value={folder.name}>{folder.name}</option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      value={formData.targetFile}
                      onChange={(e) => handleInputChange('targetFile', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        errors.targetFile 
                          ? 'border-red-300 dark:border-red-600' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <option value="">Select a file</option>
                      {files.map(file => (
                        <option key={file.id} value={file.name}>{file.name}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              {(errors.targetFolder || errors.targetFile) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-1 mt-1 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.targetFolder || errors.targetFile}</span>
                </motion.div>
              )}
            </div>

            {/* Recipients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Recipients *
              </label>
              
              {/* Add Recipient Input */}
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRecipient())}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddRecipient}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </motion.button>
              </div>

              {/* Quick Add from Contacts */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick add from contacts:</p>
                <div className="flex flex-wrap gap-2">
                  {contacts.map(contact => (
                    <motion.button
                      key={contact.id}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddContact(contact)}
                      disabled={formData.recipients.includes(contact.email)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {contact.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Recipients List */}
              <div className="space-y-2">
                {formData.recipients.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveRecipient(email)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                ))}
              </div>
              
              {errors.recipients && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-1 mt-1 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.recipients}</span>
                </motion.div>
              )}
            </div>

            {/* Schedule Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency *
                </label>
                <select
                  value={formData.scheduleType}
                  onChange={(e) => handleInputChange('scheduleType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.startDate 
                      ? 'border-red-300 dark:border-red-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.startDate && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-1 mt-1 text-red-600 text-sm"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.startDate}</span>
                  </motion.div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.startTime 
                    ? 'border-red-300 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.startTime && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-1 mt-1 text-red-600 text-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.startTime}</span>
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
                    <span>{schedule ? 'Update Schedule' : 'Create Schedule'}</span>
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

export default ScheduleModal
