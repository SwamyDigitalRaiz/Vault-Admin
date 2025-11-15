import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  X,
  Loader2,
  Save,
  AlertTriangle
} from 'lucide-react'
import { useRole } from '../contexts/RoleContext'
import PermissionGate from './PermissionGate'
import apiService from '../services/api'
import { toast } from '../utils/toast'

const RolesPermissionsTable = () => {
  const { 
    PERMISSIONS
  } = useRole()

  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false)
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const [roles, setRoles] = useState([])
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const [isSavingRole, setIsSavingRole] = useState(false)
  const [isDeletingRole, setIsDeletingRole] = useState(false)
  
  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    color: 'gray',
    permissions: []
  })

  // Fetch roles from API
  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    setIsLoadingRoles(true)
    try {
      const response = await apiService.getRoles()
      if (response.success && response.data) {
        setRoles(response.data.roles || [])
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast.error(error.message || 'Failed to fetch roles')
    } finally {
      setIsLoadingRoles(false)
    }
  }

  const handleCreateRole = async () => {
    // Validate form
    if (!newRole.name || !newRole.displayName) {
      toast.error('Please fill in role name and display name')
      return
    }

    if (newRole.permissions.length === 0) {
      toast.error('Please select at least one permission')
      return
    }

    setIsSavingRole(true)
    try {
      const roleData = {
        name: newRole.name,
        displayName: newRole.displayName,
        description: newRole.description,
        color: newRole.color,
        permissions: newRole.permissions
      }

      const response = await apiService.createRole(roleData)
      if (response.success) {
        toast.success(`Role "${newRole.displayName}" created successfully`)
        setIsCreateRoleModalOpen(false)
        setNewRole({
          name: '',
          displayName: '',
          description: '',
          color: 'gray',
          permissions: []
        })
        await fetchRoles() // Refresh roles list
      } else {
        toast.error(response.message || 'Failed to create role')
      }
    } catch (error) {
      console.error('Error creating role:', error)
      toast.error(error.message || 'Failed to create role')
    } finally {
      setIsSavingRole(false)
    }
  }

  const handleRolePermissionToggle = (permission) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  // Handle edit role
  const handleEditRole = async (roleId) => {
    // Find role from API
    const role = roles.find(r => (r._id || r.id) === roleId)
    if (role) {
      setSelectedRole(role._id || role.id)
      setNewRole({
        name: role.name,
        displayName: role.displayName,
        description: role.description || '',
        color: role.color || 'gray',
        permissions: role.permissions || []
      })
      setIsEditRoleModalOpen(true)
    } else {
      toast.error('Role not found')
    }
  }

  // Handle delete role (with safety check)
  const handleDeleteRole = async (roleId) => {
    // Find the role from API
    const role = roles.find(r => (r._id || r.id) === roleId)
    if (!role) {
      toast.error('Role not found')
      return
    }

    // Check if it's a system role
    if (role.isSystemRole) {
      toast.error(`Cannot delete ${role.displayName}. This is a system role and cannot be removed.`)
      return
    }

    const roleName = role.displayName
    const usageCount = role.usageCount || 0
    
    if (usageCount > 0) {
      toast.error(`Cannot delete ${roleName}. ${usageCount} user(s) are currently assigned to this role. Please reassign users first.`)
      return
    }

    if (!window.confirm(`Are you sure you want to delete the "${roleName}" role? This action cannot be undone.`)) {
      return
    }

    setIsDeletingRole(true)
    try {
      const response = await apiService.deleteRole(roleId)
      if (response.success) {
        toast.success(`Role "${roleName}" deleted successfully`)
        await fetchRoles() // Refresh roles list
      } else {
        toast.error(response.message || 'Failed to delete role')
      }
    } catch (error) {
      console.error('Error deleting role:', error)
      toast.error(error.message || 'Failed to delete role')
    } finally {
      setIsDeletingRole(false)
    }
  }

  // Save edited role
  const handleSaveRole = async () => {
    if (!selectedRole) return

    // Validate form
    if (!newRole.displayName) {
      toast.error('Please fill in display name')
      return
    }

    if (newRole.permissions.length === 0) {
      toast.error('Please select at least one permission')
      return
    }

    setIsSavingRole(true)
    try {
      const roleData = {
        displayName: newRole.displayName,
        description: newRole.description,
        color: newRole.color,
        permissions: newRole.permissions
      }

      const response = await apiService.updateRole(selectedRole, roleData)
      if (response.success) {
        toast.success(`Role "${newRole.displayName}" updated successfully`)
        setIsEditRoleModalOpen(false)
        setSelectedRole(null)
        setNewRole({
          name: '',
          displayName: '',
          description: '',
          color: 'gray',
          permissions: []
        })
        await fetchRoles() // Refresh roles list
      } else {
        toast.error(response.message || 'Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error(error.message || 'Failed to update role')
    } finally {
      setIsSavingRole(false)
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Roles & Permissions
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage roles to define permissions for staff members
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Create Custom Role Button */}
              <PermissionGate permission="manage_admin_roles">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateRoleModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Create Role</span>
                </motion.button>
              </PermissionGate>
            </div>
          </div>
        </div>

        {/* Roles List Content */}
        <div className="p-6">
          {isLoadingRoles ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-3" />
              <span className="text-gray-600 dark:text-gray-400">Loading roles...</span>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Roles Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by creating your first role. You can add admin and staff roles one by one.
              </p>
              <PermissionGate permission="manage_admin_roles">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsCreateRoleModalOpen(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create First Role</span>
                </motion.button>
              </PermissionGate>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Roles from API */}
              {roles.map((role) => {
                const isSystemRole = role.isSystemRole || false
                
                return (
                  <motion.div
                    key={role._id || role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Shield className={`h-5 w-5 ${isSystemRole ? 'text-red-500' : 'text-primary-500'}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {role.displayName}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {role.name}
                          </p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        role.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        role.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                        role.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        role.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        role.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        role.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                        role.color === 'pink' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' :
                        role.color === 'indigo' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {role.displayName}
                      </div>
                    </div>

                    {role.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {role.description}
                      </p>
                    )}

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Users Assigned:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{role.usageCount || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Permissions:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{role.permissions?.length || 0}</span>
                      </div>
                    </div>

                    {isSystemRole && (
                      <div className="mb-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-300">
                        System Role - Cannot be deleted
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <PermissionGate permission="manage_admin_roles">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditRole(role._id || role.id)}
                          disabled={isSystemRole}
                          className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </motion.button>
                        {!isSystemRole && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteRole(role._id || role.id)}
                            disabled={(role.usageCount || 0) > 0 || isDeletingRole}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                          >
                            {isDeletingRole ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            <span>Delete</span>
                          </motion.button>
                        )}
                      </PermissionGate>
                    </div>

                    {/* Permissions Preview */}
                    {role.permissions && role.permissions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Key Permissions:</p>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {permission.replace(/_/g, ' ').substring(0, 15)}
                            </span>
                          ))}
                          {role.permissions.length > 3 && (
                            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                              +{role.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Role Modal */}
      {isEditRoleModalOpen && selectedRole && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditRoleModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Role: {newRole.displayName}
                </h3>
                <button
                  onClick={() => setIsEditRoleModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Role Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-primary-500" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {newRole.displayName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {newRole.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Permissions Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    {Object.entries(PERMISSIONS).map(([key, permission]) => (
                      <label key={permission} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(permission)}
                          onChange={() => handleRolePermissionToggle(permission)}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {key}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800 dark:text-orange-400">
                      Permission Changes Warning
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Changing role permissions will immediately affect all users assigned to this role. 
                      Make sure to communicate any changes to affected users.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditRoleModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRole}
                  disabled={isSavingRole}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingRole && <Loader2 className="h-4 w-4 animate-spin" />}
                  {!isSavingRole && <Save className="h-4 w-4" />}
                  <span>{isSavingRole ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Create Custom Role Modal */}
      {isCreateRoleModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsCreateRoleModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create Custom Role
                </h3>
                <button
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Role Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role Name (ID)
                    </label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., content_manager"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={newRole.displayName}
                      onChange={(e) => setNewRole(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="e.g., Content Manager"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role's responsibilities..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Role Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Role Color
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      { name: 'Red', value: 'red', class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' },
                      { name: 'Orange', value: 'orange', class: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' },
                      { name: 'Yellow', value: 'yellow', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' },
                      { name: 'Green', value: 'green', class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' },
                      { name: 'Blue', value: 'blue', class: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' },
                      { name: 'Purple', value: 'purple', class: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' },
                      { name: 'Pink', value: 'pink', class: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' },
                      { name: 'Indigo', value: 'indigo', class: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' },
                      { name: 'Gray', value: 'gray', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewRole(prev => ({ ...prev, color: color.value }))}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          newRole.color === color.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                        }`}
                      >
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${color.class}`}>
                          {color.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Permissions Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    {Object.entries(PERMISSIONS).map(([key, permission]) => (
                      <label key={permission} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          checked={newRole.permissions.includes(permission)}
                          onChange={() => handleRolePermissionToggle(permission)}
                          className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {key}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Role Preview */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Role Preview</h4>
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      newRole.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      newRole.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                      newRole.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      newRole.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      newRole.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      newRole.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      newRole.color === 'pink' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' :
                      newRole.color === 'indigo' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {newRole.displayName || 'Role Name'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {newRole.permissions.length} permissions selected
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  disabled={isSavingRole}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingRole && <Loader2 className="h-4 w-4 animate-spin" />}
                  {!isSavingRole && <Save className="h-4 w-4" />}
                  <span>{isSavingRole ? 'Creating...' : 'Create Role'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default RolesPermissionsTable

