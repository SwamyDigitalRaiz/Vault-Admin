import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  Eye,
  ChevronUp, 
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  X,
  Save,
  AlertTriangle
} from 'lucide-react'
import { useRole } from '../contexts/RoleContext'
import PermissionGate from './PermissionGate'

const AdminRolesTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('name')
  const [sortDirection, setSortDirection] = useState('asc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'viewer',
    permissions: []
  })
  
  const [newRole, setNewRole] = useState({
    name: '',
    displayName: '',
    description: '',
    color: 'gray',
    permissions: []
  })
  
  const { 
    ROLES, 
    PERMISSIONS, 
    ROLE_PERMISSIONS, 
    getRoleDisplayName, 
    getRoleColor,
    updateUserRole 
  } = useRole()

  // Mock data
  const admins = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@vault.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2024-01-15 14:30:25',
      createdAt: '2023-06-15',
      permissions: ['all'],
      twoFactorEnabled: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@vault.com',
      role: 'Support Admin',
      status: 'active',
      lastLogin: '2024-01-15 12:15:10',
      createdAt: '2023-08-20',
      permissions: ['users', 'files', 'schedules'],
      twoFactorEnabled: true
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@vault.com',
      role: 'Viewer',
      status: 'active',
      lastLogin: '2024-01-14 16:45:30',
      createdAt: '2023-09-10',
      permissions: ['view'],
      twoFactorEnabled: false
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@vault.com',
      role: 'Support Admin',
      status: 'inactive',
      lastLogin: '2024-01-10 09:20:15',
      createdAt: '2023-07-05',
      permissions: ['users', 'files'],
      twoFactorEnabled: true
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@vault.com',
      role: 'Super Admin',
      status: 'active',
      lastLogin: '2024-01-15 11:30:45',
      createdAt: '2023-05-12',
      permissions: ['all'],
      twoFactorEnabled: true
    }
  ]

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.role.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const sortedAdmins = [...filteredAdmins].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === 'name' || sortField === 'email' || sortField === 'role') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    } else if (sortField === 'lastLogin') {
      aValue = new Date(a.lastLogin)
      bValue = new Date(b.lastLogin)
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />
      case 'inactive':
        return <XCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Super Admin':
        return <Shield className="h-4 w-4 text-red-500" />
      case 'Support Admin':
        return <User className="h-4 w-4 text-blue-500" />
      case 'Moderator':
        return <User className="h-4 w-4 text-orange-500" />
      case 'Viewer':
        return <Eye className="h-4 w-4 text-green-500" />
      default:
        return <User className="h-4 w-4 text-gray-500" />
    }
  }

  const handleEdit = (admin) => {
    setSelectedAdmin(admin)
    setIsEditModalOpen(true)
  }

  const handleDelete = (admin) => {
    if (window.confirm(`Are you sure you want to delete ${admin.name}?`)) {
      console.log('Delete admin:', admin)
    }
  }

  const handleRoleChange = (admin, newRole) => {
    if (window.confirm(`Are you sure you want to change ${admin.name}'s role to ${getRoleDisplayName(newRole)}?`)) {
      updateUserRole(newRole)
      console.log('Role changed:', admin.name, 'to', newRole)
    }
  }

  const handleAddAdmin = () => {
    console.log('Adding new admin:', newAdmin)
    setIsAddModalOpen(false)
    setNewAdmin({
      name: '',
      email: '',
      role: 'viewer',
      permissions: []
    })
  }

  const handleEditAdmin = (admin) => {
    console.log('Editing admin:', admin)
    setIsEditModalOpen(false)
  }

  const handlePermissionToggle = (permission) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  const handleCreateRole = () => {
    console.log('Creating new role:', newRole)
    // Here you would typically send the role data to your backend
    // For now, we'll just log it and close the modal
    setIsCreateRoleModalOpen(false)
    setNewRole({
      name: '',
      displayName: '',
      description: '',
      color: 'gray',
      permissions: []
    })
  }

  const handleRolePermissionToggle = (permission) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }))
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Admin Users & Roles
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage admin users and their role permissions
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
                />
              </div>

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

              {/* Add Admin Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Admin</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {getSortIcon('role')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('lastLogin')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Login</span>
                    {getSortIcon('lastLogin')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedAdmins.map((admin, index) => (
                <motion.tr
                  key={admin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ 
                    backgroundColor: 'rgba(99, 24, 63, 0.05)',
                    transition: { duration: 0.2 }
                  }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {admin.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {admin.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {admin.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {admin.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(admin.role)}
                      <div className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                        {admin.role}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                      {getStatusIcon(admin.status)}
                      <span className="ml-1 capitalize">{admin.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {admin.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <PermissionGate permission="edit_users">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(admin)}
                          className="text-primary-500 hover:text-primary-600"
                          title="Edit Admin"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                      </PermissionGate>
                      <PermissionGate permission="delete_users">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(admin)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete Admin"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </PermissionGate>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedAdmins.length} of {admins.length} admin users
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isAddModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddModalOpen(false)}
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
                  Add New Admin
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option>Select Role</option>
                    <option>Super Admin</option>
                    <option>Support Admin</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  Add Admin
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Admin Modal */}
      {isEditModalOpen && selectedAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsEditModalOpen(false)}
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
                  Edit Admin
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedAdmin.name}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedAdmin.email}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Role
                  </label>
                  <select 
                    defaultValue={selectedAdmin.role}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option>Super Admin</option>
                    <option>Support Admin</option>
                    <option>Viewer</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Role Management Modal */}
      {isRoleModalOpen && selectedAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsRoleModalOpen(false)}
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
                  Manage Role & Permissions
                </h3>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Admin Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {selectedAdmin.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {selectedAdmin.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedAdmin.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Role
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.values(ROLES).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleChange(selectedAdmin, role)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          selectedAdmin.role === role
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Shield className="h-5 w-5 text-primary-500" />
                          <div className="text-left">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {getRoleDisplayName(role)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {role === ROLES.SUPER_ADMIN && 'Full system access'}
                              {role === ROLES.ADMIN && 'Full feature access'}
                              {role === ROLES.SUPPORT_ADMIN && 'Limited admin access'}
                              {role === ROLES.MODERATOR && 'Content moderation access'}
                              {role === ROLES.VIEWER && 'Read-only access'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Custom Permissions
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {Object.entries(PERMISSIONS).map(([key, permission]) => (
                      <label key={permission} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
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
                      Role Change Warning
                    </h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                      Changing roles will immediately affect the user's access permissions. 
                      Make sure to communicate any changes to the user.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
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
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Create Role</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default AdminRolesTable
