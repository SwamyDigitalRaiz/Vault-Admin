import React from 'react'
import { useRole } from '../contexts/RoleContext'

const PermissionGate = ({ 
  children, 
  permission, 
  permissions = [], 
  mode = 'any', // 'any' or 'all'
  role,
  roles = [],
  fallback = null,
  show = true
}) => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    hasRole, 
    hasAnyRole 
  } = useRole()

  // If show is false, don't render anything
  if (!show) {
    return fallback
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return fallback
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    if (mode === 'any' && !hasAnyPermission(permissions)) {
      return fallback
    }
    if (mode === 'all' && !hasAllPermissions(permissions)) {
      return fallback
    }
  }

  // Check single role
  if (role && !hasRole(role)) {
    return fallback
  }

  // Check multiple roles
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return fallback
  }

  // All checks passed, render children
  return children
}

// Higher-order component for permission-based rendering
export const withPermission = (WrappedComponent, permissionConfig) => {
  return function PermissionWrappedComponent(props) {
    return (
      <PermissionGate {...permissionConfig}>
        <WrappedComponent {...props} />
      </PermissionGate>
    )
  }
}

// Hook-based permission gate for inline use
export const usePermissionGate = (permission, fallback = null) => {
  const { hasPermission } = useRole()
  return hasPermission(permission) ? true : fallback
}

// Hook-based role gate for inline use
export const useRoleGate = (role, fallback = null) => {
  const { hasRole } = useRole()
  return hasRole(role) ? true : fallback
}

export default PermissionGate
