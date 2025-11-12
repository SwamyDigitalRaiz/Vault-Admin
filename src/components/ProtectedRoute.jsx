import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, AlertTriangle } from 'lucide-react'
import { useRole } from '../contexts/RoleContext'

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredPermissions = [], 
  requiredRole, 
  requiredRoles = [],
  requiredRoute,
  fallback = null,
  showAccessDenied = true,
  accessDeniedMessage = "You don't have permission to access this page."
}) => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    hasRole, 
    hasAnyRole, 
    canAccessRoute,
    currentUser,
    isLoading 
  } = useRole()

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access this page.
          </p>
        </div>
      </div>
    )
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return showAccessDenied ? (
      <AccessDeniedPage 
        message={accessDeniedMessage}
        icon={Shield}
        title="Permission Denied"
      />
    ) : fallback
  }

  // Check multiple permissions (any)
  if (requiredPermissions.length > 0 && !hasAnyPermission(requiredPermissions)) {
    return showAccessDenied ? (
      <AccessDeniedPage 
        message={accessDeniedMessage}
        icon={Shield}
        title="Permission Denied"
      />
    ) : fallback
  }

  // Check single role
  if (requiredRole && !hasRole(requiredRole)) {
    return showAccessDenied ? (
      <AccessDeniedPage 
        message="This page requires a higher access level."
        icon={AlertTriangle}
        title="Insufficient Role"
      />
    ) : fallback
  }

  // Check multiple roles (any)
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return showAccessDenied ? (
      <AccessDeniedPage 
        message="This page requires a higher access level."
        icon={AlertTriangle}
        title="Insufficient Role"
      />
    ) : fallback
  }

  // Check route access
  if (requiredRoute && !canAccessRoute(requiredRoute)) {
    return showAccessDenied ? (
      <AccessDeniedPage 
        message="You don't have permission to access this section."
        icon={Lock}
        title="Access Denied"
      />
    ) : fallback
  }

  // All checks passed, render children
  return children
}

// Access Denied Page Component
const AccessDeniedPage = ({ message, icon: Icon, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900"
    >
      <div className="text-center max-w-md mx-auto p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <Icon className="h-16 w-16 text-red-500 mx-auto" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        >
          {title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-6"
        >
          {message}
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Go Back
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ProtectedRoute
