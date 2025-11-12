import { useRole } from '../contexts/RoleContext'

// Hook for checking specific permissions
export const usePermission = (permission) => {
  const { hasPermission } = useRole()
  return hasPermission(permission)
}

// Hook for checking multiple permissions (any)
export const useAnyPermission = (permissions) => {
  const { hasAnyPermission } = useRole()
  return hasAnyPermission(permissions)
}

// Hook for checking multiple permissions (all)
export const useAllPermissions = (permissions) => {
  const { hasAllPermissions } = useRole()
  return hasAllPermissions(permissions)
}

// Hook for checking route access
export const useRouteAccess = (route) => {
  const { canAccessRoute } = useRole()
  return canAccessRoute(route)
}

// Hook for checking specific role
export const useRoleCheck = (role) => {
  const { hasRole } = useRole()
  return hasRole(role)
}

// Hook for checking multiple roles (any)
export const useAnyRole = (roles) => {
  const { hasAnyRole } = useRole()
  return hasAnyRole(roles)
}

// Hook for getting current user info
export const useCurrentUser = () => {
  const { currentUser, isLoading } = useRole()
  return { currentUser, isLoading }
}

// Hook for role management
export const useRoleManagement = () => {
  const { 
    updateUserRole, 
    addCustomPermissions, 
    removePermissions,
    getRoleDisplayName,
    getRoleColor,
    ROLES,
    PERMISSIONS
  } = useRole()
  
  return {
    updateUserRole,
    addCustomPermissions,
    removePermissions,
    getRoleDisplayName,
    getRoleColor,
    ROLES,
    PERMISSIONS
  }
}

// Hook for permission-based component rendering
export const usePermissionGate = (permission, fallback = null) => {
  const hasPermission = usePermission(permission)
  return hasPermission ? true : fallback
}

// Hook for role-based component rendering
export const useRoleGate = (role, fallback = null) => {
  const hasRole = useRoleCheck(role)
  return hasRole ? true : fallback
}

// Hook for multiple permission gates
export const usePermissionGates = (permissions, mode = 'any') => {
  const { hasAnyPermission, hasAllPermissions } = useRole()
  
  if (mode === 'any') {
    return hasAnyPermission(permissions)
  } else if (mode === 'all') {
    return hasAllPermissions(permissions)
  }
  
  return false
}

// Hook for route-based access control
export const useRouteGate = (route, fallback = null) => {
  const canAccess = useRouteAccess(route)
  return canAccess ? true : fallback
}

export default {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRouteAccess,
  useRoleCheck,
  useAnyRole,
  useCurrentUser,
  useRoleManagement,
  usePermissionGate,
  useRoleGate,
  usePermissionGates,
  useRouteGate
}
