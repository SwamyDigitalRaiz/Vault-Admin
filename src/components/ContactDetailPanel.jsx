import React from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Calendar, 
  UserPlus, 
  FolderOpen,
  FileText as FileIcon,
  Send,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

const ContactDetailPanel = ({ contact, onClose }) => {
  // Mock data for contact details
  const contactDetails = {
    ...contact,
    sharedFolders: [
      { name: 'Project Documents', files: 12, lastShared: '2024-01-15' },
      { name: 'Client Resources', files: 8, lastShared: '2024-01-14' },
      { name: 'Meeting Notes', files: 5, lastShared: '2024-01-13' }
    ],
    scheduledSends: [
      { 
        file: 'project_proposal.pdf', 
        scheduledFor: '2024-01-16 09:00', 
        status: 'pending',
        recipient: contact.email
      },
      { 
        file: 'quarterly_report.xlsx', 
        scheduledFor: '2024-01-17 14:30', 
        status: 'completed',
        recipient: contact.email
      },
      { 
        file: 'presentation.pptx', 
        scheduledFor: '2024-01-18 10:00', 
        status: 'pending',
        recipient: contact.email
      }
    ],
    activityLog: [
      { action: 'File Shared', item: 'project_document.pdf', timestamp: '2024-01-15 14:30', status: 'success' },
      { action: 'Schedule Created', item: 'report.xlsx', timestamp: '2024-01-15 13:45', status: 'success' },
      { action: 'Email Sent', item: 'meeting_notes.docx', timestamp: '2024-01-15 12:20', status: 'success' }
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
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center relative">
                <User className="h-6 w-6 text-white" />
                {!contact.isValid && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                )}
                {contact.isDuplicate && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {contactDetails.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contactDetails.email}
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
                <span className="text-gray-700 dark:text-gray-300">{contactDetails.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className={`text-gray-700 dark:text-gray-300 ${!contact.isValid ? 'text-red-500' : ''}`}>
                  {contactDetails.email}
                </span>
                {!contact.isValid && (
                  <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded">
                    Invalid
                  </span>
                )}
                {contact.isDuplicate && (
                  <span className="text-xs text-orange-500 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
                    Duplicate
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{contactDetails.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <UserPlus className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  Created by {contactDetails.createdBy}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  Added on {contactDetails.createdAt}
                </span>
              </div>
            </div>
            
            {/* Notes */}
            {contactDetails.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contactDetails.notes}</p>
              </div>
            )}
          </div>

          {/* Shared Folders */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Shared Folders
            </h3>
            <div className="space-y-3">
              {contactDetails.sharedFolders.map((folder, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FolderOpen className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{folder.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {folder.files} files • Last shared {folder.lastShared}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scheduled Sends */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Scheduled Sends
            </h3>
            <div className="space-y-3">
              {contactDetails.scheduledSends.map((send, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Send className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{send.file}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Scheduled for {send.scheduledFor}
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
                </motion.div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {contactDetails.activityLog.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.item} • {activity.timestamp}
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

        </div>
      </motion.div>
    </>
  )
}

export default ContactDetailPanel
