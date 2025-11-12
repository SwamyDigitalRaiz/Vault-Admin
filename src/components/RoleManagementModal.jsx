import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Edit, Eye, User, Save, AlertTriangle } from 'lucide-react'

const RoleManagementModal = ({ isOpen, onClose, user, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'viewer')
  const [permissions, setPermissions] = useState({
    canView: true,
    canEdit: user?.role === 'editor' || user?.role === 'admin',
    canDelete: user?.role === 'admin',
    canManageUsers: user?.role === 'admin',
    canSchedule: user?.role === 'editor' || user?.role === 'admin'
  })

  const roles = [
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Can view files and folders only',
      icon: Eye,
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Can view, edit, and schedule files',
      icon: Edit,
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full access to all features',
      icon: Shield,
      color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
  ]

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId)
    
    // Auto-set permissions based on role
    switch (roleId) {
      case 'viewer':
        setPermissions({
          canView: true,
          canEdit: false,
          canDelete: false,
          canManageUsers: false,
          canSchedule: false
        })
        break
      case 'editor':
        setPermissions({
          canView: true,
          canEdit: true,
          canDelete: false,
          canManageUsers: false,
          canSchedule: true
        })
        break
      case 'admin':
        setPermissions({
          canView: true,
          canEdit: true,
          canDelete: true,
          canManageUsers: true,
          canSchedule: true
        })
        break
    }
  }

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }))
  }

  const handleSave = () => {
    onSave({
      ...user,
      role: selectedRole,
      permissions
    })
    onClose()
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
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Role & Permissions
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage role and permissions for {user?.name}
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
            {/* Role Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Select Role
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon
                  const isSelected = selectedRole === role.id
                  
                  return (
                    <motion.div
                      key={role.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleChange(role.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${role.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {role.name}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {role.description}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Custom Permissions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Custom Permissions
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'canView', label: 'View Files & Folders', description: 'Can browse and view files' },
                  { key: 'canEdit', label: 'Edit Files', description: 'Can modify and upload files' },
                  { key: 'canDelete', label: 'Delete Files', description: 'Can delete files and folders' },
                  { key: 'canSchedule', label: 'Schedule Sends', description: 'Can create scheduled file deliveries' },
                  { key: 'canManageUsers', label: 'Manage Users', description: 'Can add, edit, and remove users' }
                ].map((permission) => (
                  <motion.div
                    key={permission.key}
                    whileHover={{ backgroundColor: 'rgba(99, 24, 63, 0.05)' }}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={permissions[permission.key]}
                        onChange={() => handlePermissionChange(permission.key)}
                        className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {permission.label}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Warning for Admin Changes */}
            {selectedRole === 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
              >
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-400">
                    Admin Access Warning
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    Admin users have full access to all system features including user management and system settings.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-6 rounded-b-xl">
            <div className="flex items-center justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RoleManagementModal
