import React, { createContext, useContext, useState, useEffect } from 'react'

const RoleContext = createContext()

// Role definitions with permissions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUPPORT_ADMIN: 'support_admin',
  MODERATOR: 'moderator',
  VIEWER: 'viewer'
}

// Permission definitions
export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  MANAGE_USER_ROLES: 'manage_user_roles',
  
  // Recipients Management
  VIEW_RECIPIENTS: 'view_recipients',
  CREATE_RECIPIENTS: 'create_recipients',
  EDIT_RECIPIENTS: 'edit_recipients',
  DELETE_RECIPIENTS: 'delete_recipients',
  
  // File Management
  VIEW_FILES: 'view_files',
  UPLOAD_FILES: 'upload_files',
  EDIT_FILES: 'edit_files',
  DELETE_FILES: 'delete_files',
  DOWNLOAD_FILES: 'download_files',
  
  // Schedule Management
  VIEW_SCHEDULES: 'view_schedules',
  CREATE_SCHEDULES: 'create_schedules',
  EDIT_SCHEDULES: 'edit_schedules',
  DELETE_SCHEDULES: 'delete_schedules',
  PAUSE_SCHEDULES: 'pause_schedules',
  
  // Notifications
  VIEW_NOTIFICATIONS: 'view_notifications',
  SEND_NOTIFICATIONS: 'send_notifications',
  MANAGE_NOTIFICATIONS: 'manage_notifications',
  
  // Reports & Analytics
  VIEW_REPORTS: 'view_reports',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  
  // System Settings
  VIEW_SETTINGS: 'view_settings',
  EDIT_SETTINGS: 'edit_settings',
  MANAGE_ADMIN_ROLES: 'manage_admin_roles',
  
  // Subscription Management
  VIEW_SUBSCRIPTIONS: 'view_subscriptions',
  CREATE_SUBSCRIPTIONS: 'create_subscriptions',
  EDIT_SUBSCRIPTIONS: 'edit_subscriptions',
  DELETE_SUBSCRIPTIONS: 'delete_subscriptions',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  
  // Package Management
  VIEW_PACKAGES: 'view_packages',
  CREATE_PACKAGES: 'create_packages',
  EDIT_PACKAGES: 'edit_packages',
  DELETE_PACKAGES: 'delete_packages',
  MANAGE_PACKAGES: 'manage_packages',
  
  // Transaction Management
  VIEW_TRANSACTIONS: 'view_transactions',
  CREATE_TRANSACTIONS: 'create_transactions',
  EDIT_TRANSACTIONS: 'edit_transactions',
  DELETE_TRANSACTIONS: 'delete_transactions',
  MANAGE_TRANSACTIONS: 'manage_transactions',
  
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard'
}

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(PERMISSIONS)
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.VIEW_RECIPIENTS,
    PERMISSIONS.CREATE_RECIPIENTS,
    PERMISSIONS.EDIT_RECIPIENTS,
    PERMISSIONS.DELETE_RECIPIENTS,
    PERMISSIONS.VIEW_FILES,
    PERMISSIONS.UPLOAD_FILES,
    PERMISSIONS.EDIT_FILES,
    PERMISSIONS.DELETE_FILES,
    PERMISSIONS.DOWNLOAD_FILES,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.CREATE_SCHEDULES,
    PERMISSIONS.EDIT_SCHEDULES,
    PERMISSIONS.DELETE_SCHEDULES,
    PERMISSIONS.PAUSE_SCHEDULES,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.MANAGE_NOTIFICATIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
    PERMISSIONS.VIEW_SUBSCRIPTIONS,
    PERMISSIONS.CREATE_SUBSCRIPTIONS,
    PERMISSIONS.EDIT_SUBSCRIPTIONS,
    PERMISSIONS.DELETE_SUBSCRIPTIONS,
    PERMISSIONS.VIEW_PACKAGES,
    PERMISSIONS.CREATE_PACKAGES,
    PERMISSIONS.EDIT_PACKAGES,
    PERMISSIONS.DELETE_PACKAGES,
    PERMISSIONS.VIEW_TRANSACTIONS,
    PERMISSIONS.CREATE_TRANSACTIONS,
    PERMISSIONS.EDIT_TRANSACTIONS
  ],
  [ROLES.SUPPORT_ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VIEW_RECIPIENTS,
    PERMISSIONS.CREATE_RECIPIENTS,
    PERMISSIONS.EDIT_RECIPIENTS,
    PERMISSIONS.VIEW_FILES,
    PERMISSIONS.DOWNLOAD_FILES,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.CREATE_SCHEDULES,
    PERMISSIONS.EDIT_SCHEDULES,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_DATA,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.VIEW_SUBSCRIPTIONS,
    PERMISSIONS.EDIT_SUBSCRIPTIONS,
    PERMISSIONS.VIEW_PACKAGES,
    PERMISSIONS.VIEW_TRANSACTIONS
  ],
  [ROLES.MODERATOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_RECIPIENTS,
    PERMISSIONS.VIEW_FILES,
    PERMISSIONS.DOWNLOAD_FILES,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.SEND_NOTIFICATIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SUBSCRIPTIONS,
    PERMISSIONS.VIEW_PACKAGES,
    PERMISSIONS.VIEW_TRANSACTIONS
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_RECIPIENTS,
    PERMISSIONS.VIEW_FILES,
    PERMISSIONS.DOWNLOAD_FILES,
    PERMISSIONS.VIEW_SCHEDULES,
    PERMISSIONS.VIEW_NOTIFICATIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SUBSCRIPTIONS,
    PERMISSIONS.VIEW_PACKAGES,
    PERMISSIONS.VIEW_TRANSACTIONS
  ]
}

// Route-based permissions mapping
const ROUTE_PERMISSIONS = {
  '/dashboard': [PERMISSIONS.VIEW_DASHBOARD],
  '/users': [PERMISSIONS.VIEW_USERS],
  '/contacts': [PERMISSIONS.VIEW_RECIPIENTS],
  '/files': [PERMISSIONS.VIEW_FILES],
  '/schedules': [PERMISSIONS.VIEW_SCHEDULES],
  '/notifications': [PERMISSIONS.VIEW_NOTIFICATIONS],
  '/subscriptions': [PERMISSIONS.VIEW_SUBSCRIPTIONS],
  '/packages': [PERMISSIONS.VIEW_PACKAGES],
  '/transactions': [PERMISSIONS.VIEW_TRANSACTIONS],
  '/reports': [PERMISSIONS.VIEW_REPORTS],
  '/analytics': [PERMISSIONS.VIEW_ANALYTICS],
  '/system-settings': [PERMISSIONS.VIEW_SETTINGS],
  '/admin-roles': [PERMISSIONS.MANAGE_ADMIN_ROLES]
}

export const RoleProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with a default user (in real app, this would come from authentication)
  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      const user = {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@vault.com',
        role: ROLES.SUPER_ADMIN, // Default to super admin for demo
        permissions: ROLE_PERMISSIONS[ROLES.SUPER_ADMIN],
        avatar: null,
        lastLogin: new Date().toISOString()
      }
      setCurrentUser(user)
      setIsLoading(false)
    }
    
    loadUser()
  }, [])

  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!currentUser) return false
    return currentUser.permissions.includes(permission)
  }

  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    if (!currentUser) return false
    return permissions.some(permission => currentUser.permissions.includes(permission))
  }

  // Check if user has all of the specified permissions
  const hasAllPermissions = (permissions) => {
    if (!currentUser) return false
    return permissions.every(permission => currentUser.permissions.includes(permission))
  }

  // Check if user can access a specific route
  const canAccessRoute = (route) => {
    if (!currentUser) return false
    const requiredPermissions = ROUTE_PERMISSIONS[route]
    if (!requiredPermissions) return true // Route doesn't require specific permissions
    return hasAnyPermission(requiredPermissions)
  }

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!currentUser) return false
    return currentUser.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!currentUser) return false
    return roles.includes(currentUser.role)
  }

  // Update user role and permissions
  const updateUserRole = (newRole) => {
    if (!currentUser) return
    
    const newPermissions = ROLE_PERMISSIONS[newRole] || []
    setCurrentUser(prev => ({
      ...prev,
      role: newRole,
      permissions: newPermissions
    }))
  }

  // Add custom permissions to user
  const addCustomPermissions = (permissions) => {
    if (!currentUser) return
    
    setCurrentUser(prev => ({
      ...prev,
      permissions: [...new Set([...prev.permissions, ...permissions])]
    }))
  }

  // Remove permissions from user
  const removePermissions = (permissions) => {
    if (!currentUser) return
    
    setCurrentUser(prev => ({
      ...prev,
      permissions: prev.permissions.filter(permission => !permissions.includes(permission))
    }))
  }

  // Get user's role display name
  const getRoleDisplayName = (role) => {
    const roleNames = {
      [ROLES.SUPER_ADMIN]: 'Super Admin',
      [ROLES.ADMIN]: 'Admin',
      [ROLES.SUPPORT_ADMIN]: 'Support Admin',
      [ROLES.MODERATOR]: 'Moderator',
      [ROLES.VIEWER]: 'Viewer'
    }
    return roleNames[role] || role
  }

  // Get role color for UI display
  const getRoleColor = (role) => {
    const roleColors = {
      [ROLES.SUPER_ADMIN]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      [ROLES.ADMIN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      [ROLES.SUPPORT_ADMIN]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      [ROLES.MODERATOR]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      [ROLES.VIEWER]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    }
    return roleColors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }

  const value = {
    currentUser,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    hasRole,
    hasAnyRole,
    updateUserRole,
    addCustomPermissions,
    removePermissions,
    getRoleDisplayName,
    getRoleColor,
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    ROUTE_PERMISSIONS
  }

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}

export default RoleContext
