import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  X,
  Loader2,
  Users,
  Shield,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react'
import apiService from '../services/api'
import { toast } from '../utils/toast'

const StaffTable = () => {
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false)
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState(false)
  const [isCreatingStaff, setIsCreatingStaff] = useState(false)
  const [isUpdatingStaff, setIsUpdatingStaff] = useState(false)
  const [isDeletingStaff, setIsDeletingStaff] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [staff, setStaff] = useState([])
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [roles, setRoles] = useState([])
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    roleId: null
  })
  const [editStaff, setEditStaff] = useState({
    name: '',
    email: '',
    password: '',
    roleId: null
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)

  // Fetch staff and roles from API
  useEffect(() => {
    fetchRoles().then(() => {
      // Fetch staff after roles are loaded so we can match roleIds
      fetchStaff()
    })
  }, [])

  const fetchStaff = async () => {
    setIsLoadingStaff(true)
    try {
      // Fetch staff from dedicated staff endpoint
      const response = await apiService.getStaff()
      if (response.success && response.data) {
        // The backend populates roleId with role details
        const staffMembers = response.data.staff.map(member => {
          // Handle roleId - it should be populated by backend
          let assignedRole = null
          if (member.roleId) {
            if (typeof member.roleId === 'object' && member.roleId._id) {
              // Populated role object
              assignedRole = {
                _id: member.roleId._id,
                name: member.roleId.name,
                displayName: member.roleId.displayName,
                description: member.roleId.description,
                color: member.roleId.color,
                permissions: member.roleId.permissions || []
              }
            } else if (typeof member.roleId === 'string') {
              // Just an ID - find it in roles array
              const role = roles.find(r => (r._id || r.id) === member.roleId)
              if (role) {
                assignedRole = {
                  _id: role._id || role.id,
                  name: role.name,
                  displayName: role.displayName,
                  description: role.description,
                  color: role.color,
                  permissions: role.permissions || []
                }
              }
            }
          }
          
          return {
            ...member,
            id: member.id || member._id,
            assignedRole
          }
        })
        setStaff(staffMembers)
      }
    } catch (error) {
      console.error('Error fetching staff:', error)
      toast.error(error.message || 'Failed to fetch staff members')
    } finally {
      setIsLoadingStaff(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await apiService.getRoles()
      if (response.success && response.data) {
        setRoles(response.data.roles || [])
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const handleAddStaff = async () => {
    // Validate form
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newStaff.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Validate password length
    if (newStaff.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    // Validate roleId if provided
    if (!newStaff.roleId) {
      toast.error('Please select a role for this staff member')
      return
    }

    setIsCreatingStaff(true)
    try {
      // Create staff using dedicated staff endpoint
      const response = await apiService.createStaff({
        name: newStaff.name.trim(),
        email: newStaff.email.trim(),
        password: newStaff.password,
        roleId: newStaff.roleId // Link to Role model
      })

      if (response.success) {
        toast.success('Staff member created successfully')
        setIsAddStaffModalOpen(false)
        setNewStaff({
          name: '',
          email: '',
          password: '',
          roleId: null
        })
        await fetchStaff() // Refresh staff list
      } else {
        toast.error(response.message || 'Failed to create staff member')
      }
    } catch (error) {
      console.error('Error creating staff:', error)
      toast.error(error.message || 'Failed to create staff member')
    } finally {
      setIsCreatingStaff(false)
    }
  }

  const handleEditStaff = (member) => {
    setSelectedStaff(member)
    setEditStaff({
      name: member.name || '',
      email: member.email || '',
      password: '', // Password field is optional for editing
      roleId: member.assignedRole?._id || member.roleId || null
    })
    setShowEditPassword(false)
    setIsEditStaffModalOpen(true)
  }

  const handleUpdateStaff = async () => {
    if (!selectedStaff) return

    // Validate form
    if (!editStaff.name || !editStaff.email) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editStaff.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Validate roleId if provided
    if (!editStaff.roleId) {
      toast.error('Please select a role for this staff member')
      return
    }

    // Validate password if provided (optional for editing)
    if (editStaff.password && editStaff.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsUpdatingStaff(true)
    try {
      // Build update data
      const updateData = {
        name: editStaff.name.trim(),
        email: editStaff.email.trim(),
        roleId: editStaff.roleId
      }

      // Only include password if it was provided
      if (editStaff.password && editStaff.password.trim()) {
        updateData.password = editStaff.password.trim()
      }

      // Update staff using dedicated staff endpoint
      const response = await apiService.updateStaff(selectedStaff.id || selectedStaff._id, updateData)

      if (response.success) {
        toast.success('Staff member updated successfully')
        setIsEditStaffModalOpen(false)
        setSelectedStaff(null)
        setEditStaff({
          name: '',
          email: '',
          password: '',
          roleId: null
        })
        setShowEditPassword(false)
        await fetchStaff() // Refresh staff list
      } else {
        toast.error(response.message || 'Failed to update staff member')
      }
    } catch (error) {
      console.error('Error updating staff:', error)
      toast.error(error.message || 'Failed to update staff member')
    } finally {
      setIsUpdatingStaff(false)
    }
  }

  const handleDeleteStaff = async (member) => {
    if (!window.confirm(`Are you sure you want to delete "${member.name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeletingStaff(true)
    try {
      const response = await apiService.deleteStaff(member.id || member._id)
      if (response.success) {
        toast.success('Staff member deleted successfully')
        await fetchStaff() // Refresh staff list
      } else {
        toast.error(response.message || 'Failed to delete staff member')
      }
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast.error(error.message || 'Failed to delete staff member')
    } finally {
      setIsDeletingStaff(false)
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
                Staff List
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage staff members and their assigned roles
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Add Staff Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddStaffModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Staff</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Staff List Content */}
        <div className="p-6">
          {isLoadingStaff ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500 mx-auto mb-3" />
              <span className="text-gray-600 dark:text-gray-400">Loading staff...</span>
            </div>
          ) : staff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Staff Members Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by adding your first staff member.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddStaffModalOpen(true)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Add First Staff</span>
              </motion.button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assigned Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {staff.map((member, index) => (
                    <motion.tr
                      key={member.id || member._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {(member.name || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.assignedRole ? (
                          <div className="flex items-center space-x-2">
                            <Shield className={`h-4 w-4 ${
                              member.assignedRole.color === 'red' ? 'text-red-500' :
                              member.assignedRole.color === 'orange' ? 'text-orange-500' :
                              member.assignedRole.color === 'yellow' ? 'text-yellow-500' :
                              member.assignedRole.color === 'green' ? 'text-green-500' :
                              member.assignedRole.color === 'blue' ? 'text-blue-500' :
                              member.assignedRole.color === 'purple' ? 'text-purple-500' :
                              member.assignedRole.color === 'pink' ? 'text-pink-500' :
                              member.assignedRole.color === 'indigo' ? 'text-indigo-500' :
                              'text-gray-500'
                            }`} />
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.assignedRole.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              member.assignedRole.color === 'orange' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                              member.assignedRole.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              member.assignedRole.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              member.assignedRole.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                              member.assignedRole.color === 'purple' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                              member.assignedRole.color === 'pink' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400' :
                              member.assignedRole.color === 'indigo' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {member.assignedRole.displayName || 'No role'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">No role assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditStaff(member)}
                            className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="Edit Staff"
                          >
                            <Edit className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteStaff(member)}
                            disabled={isDeletingStaff}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Staff"
                          >
                            {isDeletingStaff ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Modal */}
      {isAddStaffModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddStaffModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Add New Staff
                </h3>
                <button
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full name"
                    disabled={isCreatingStaff}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={isCreatingStaff}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newStaff.password}
                      onChange={(e) => setNewStaff(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter password (min 8 characters)"
                      disabled={isCreatingStaff}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      disabled={isCreatingStaff}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assign Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newStaff.roleId || ''}
                    onChange={(e) => setNewStaff(prev => ({ ...prev, roleId: e.target.value || null }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isCreatingStaff || roles.length === 0}
                    required
                  >
                    <option value="">Select a role...</option>
                    {roles.map((role) => (
                      <option key={role._id || role.id} value={role._id || role.id}>
                        {role.displayName} - {role.description || 'No description'}
                      </option>
                    ))}
                  </select>
                  {roles.length === 0 ? (
                    <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                      No roles available. Please create a role first in Roles & Permissions.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Select a role from the roles list to define what this staff member can do
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddStaffModalOpen(false)}
                  disabled={isCreatingStaff}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  disabled={isCreatingStaff}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isCreatingStaff && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isCreatingStaff ? 'Creating...' : 'Add Staff'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Staff Modal */}
      {isEditStaffModalOpen && selectedStaff && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditStaffModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Staff Member
                </h3>
                <button
                  onClick={() => setIsEditStaffModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editStaff.name}
                    onChange={(e) => setEditStaff(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full name"
                    disabled={isUpdatingStaff}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editStaff.email}
                    onChange={(e) => setEditStaff(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={isUpdatingStaff}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password <span className="text-gray-500 text-xs">(Optional - leave blank to keep current password)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editStaff.password}
                      onChange={(e) => setEditStaff(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter new password (min 8 characters) or leave blank"
                      disabled={isUpdatingStaff}
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      disabled={isUpdatingStaff}
                    >
                      {showEditPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Leave blank to keep current password. If provided, must be at least 8 characters long.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Assign Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editStaff.roleId || ''}
                    onChange={(e) => setEditStaff(prev => ({ ...prev, roleId: e.target.value || null }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    disabled={isUpdatingStaff || roles.length === 0}
                    required
                  >
                    <option value="">Select a role...</option>
                    {roles.map((role) => (
                      <option key={role._id || role.id} value={role._id || role.id}>
                        {role.displayName} - {role.description || 'No description'}
                      </option>
                    ))}
                  </select>
                  {roles.length === 0 ? (
                    <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
                      No roles available. Please create a role first in Roles & Permissions.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Select a role from the roles list to define what this staff member can do
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditStaffModalOpen(false)}
                  disabled={isUpdatingStaff}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStaff}
                  disabled={isUpdatingStaff}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUpdatingStaff && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isUpdatingStaff ? 'Updating...' : 'Update Staff'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default StaffTable

