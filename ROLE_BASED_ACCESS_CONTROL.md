# Role-Based Access Control (RBAC) System

## Overview

This document describes the comprehensive Role-Based Access Control (RBAC) system implemented in the Vault Admin application. The system provides fine-grained permission management for different user roles and ensures secure access to various features and pages.

## System Architecture

### 1. Role Context (`src/contexts/RoleContext.jsx`)

The central context that manages user roles, permissions, and access control throughout the application.

#### Key Features:
- **Role Management**: Defines and manages different user roles
- **Permission System**: Granular permission-based access control
- **Route Protection**: Automatic route-based access control
- **User State Management**: Current user information and permissions

#### Available Roles:
- **Super Admin**: Full system access with all permissions
- **Admin**: Full feature access (no admin role management)
- **Support Admin**: Limited admin access for support tasks
- **Viewer**: Read-only access to most features

### 2. Permission System

#### Permission Categories:
- **User Management**: `view_users`, `create_users`, `edit_users`, `delete_users`, `manage_user_roles`
- **Recipients Management**: `view_recipients`, `create_recipients`, `edit_recipients`, `delete_recipients`
- **File Management**: `view_files`, `upload_files`, `edit_files`, `delete_files`, `download_files`
- **Schedule Management**: `view_schedules`, `create_schedules`, `edit_schedules`, `delete_schedules`, `pause_schedules`
- **Notifications**: `view_notifications`, `send_notifications`, `manage_notifications`
- **Reports & Analytics**: `view_reports`, `view_analytics`, `export_data`
- **System Settings**: `view_settings`, `edit_settings`, `manage_admin_roles`
- **Dashboard**: `view_dashboard`

### 3. Access Control Components

#### ProtectedRoute Component (`src/components/ProtectedRoute.jsx`)
- **Purpose**: Protects entire pages/routes based on permissions
- **Features**: 
  - Permission-based access control
  - Role-based access control
  - Custom access denied pages
  - Loading states

#### PermissionGate Component (`src/components/PermissionGate.jsx`)
- **Purpose**: Conditionally renders components based on permissions
- **Features**:
  - Single permission checking
  - Multiple permission checking (any/all modes)
  - Role-based rendering
  - Fallback content for denied access

### 4. Navigation Control

#### Sidebar Integration (`src/components/Sidebar.jsx`)
- **Dynamic Navigation**: Only shows menu items user has permission to access
- **Section Filtering**: Hides entire sections if no items are accessible
- **Permission-Based Rendering**: Each menu item checks for required permissions

### 5. Role Management Interface

#### AdminRolesTable Component (`src/components/AdminRolesTable.jsx`)
- **Role Management Modal**: Comprehensive role and permission management
- **Permission-Based Actions**: Action buttons only visible with proper permissions
- **Role Assignment**: Easy role switching with confirmation
- **Custom Permissions**: Granular permission management

## Usage Examples

### 1. Protecting a Route

```jsx
import ProtectedRoute from './components/ProtectedRoute'

function AdminPage() {
  return (
    <ProtectedRoute 
      requiredPermission="manage_admin_roles"
      accessDeniedMessage="You need admin role management permissions to access this page."
    >
      <AdminContent />
    </ProtectedRoute>
  )
}
```

### 2. Conditional Component Rendering

```jsx
import PermissionGate from './components/PermissionGate'

function UserActions() {
  return (
    <div>
      <PermissionGate permission="edit_users">
        <EditButton />
      </PermissionGate>
      
      <PermissionGate permission="delete_users">
        <DeleteButton />
      </PermissionGate>
    </div>
  )
}
```

### 3. Using Role Hooks

```jsx
import { usePermission, useRoleCheck } from './hooks/useRoleAccess'

function MyComponent() {
  const canEditUsers = usePermission('edit_users')
  const isAdmin = useRoleCheck('admin')
  
  return (
    <div>
      {canEditUsers && <EditButton />}
      {isAdmin && <AdminPanel />}
    </div>
  )
}
```

### 4. Multiple Permission Checking

```jsx
import PermissionGate from './components/PermissionGate'

function AdminPanel() {
  return (
    <PermissionGate 
      permissions={['edit_users', 'delete_users']} 
      mode="any"
    >
      <AdminActions />
    </PermissionGate>
  )
}
```

## Role Hierarchy

### Super Admin
- **Access**: All system features
- **Permissions**: All available permissions
- **Restrictions**: None
- **Use Case**: System administrators, IT managers

### Admin
- **Access**: All features except admin role management
- **Permissions**: Most permissions except `manage_admin_roles`
- **Restrictions**: Cannot manage other admin roles
- **Use Case**: Department managers, senior staff

### Support Admin
- **Access**: Limited admin features
- **Permissions**: User management, file access, scheduling, notifications
- **Restrictions**: No system settings, limited user management
- **Use Case**: Support staff, customer service

### Viewer
- **Access**: Read-only access
- **Permissions**: View permissions only
- **Restrictions**: No editing, creating, or deleting
- **Use Case**: Auditors, read-only users

## Implementation Details

### 1. Context Provider Setup

```jsx
// App.jsx
import { RoleProvider } from './contexts/RoleContext'

function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        {/* Your app components */}
      </RoleProvider>
    </ThemeProvider>
  )
}
```

### 2. Route Protection

Routes are automatically protected based on the `ROUTE_PERMISSIONS` mapping in the RoleContext. Each route has associated permissions that are checked when navigating.

### 3. Permission Checking

The system provides multiple ways to check permissions:

```jsx
// Direct permission checking
const { hasPermission, hasAnyPermission, hasAllPermissions } = useRole()

// Hook-based checking
const canEdit = usePermission('edit_users')
const canManage = useAnyPermission(['edit_users', 'delete_users'])

// Component-based checking
<PermissionGate permission="edit_users">
  <EditButton />
</PermissionGate>
```

### 4. Role Management

Admins can manage user roles through the AdminRolesTable component:

- **Role Assignment**: Change user roles with confirmation
- **Permission Management**: Custom permission assignment
- **Role Validation**: Prevents invalid role assignments
- **Audit Trail**: Logs role changes for security

## Security Considerations

### 1. Permission Validation
- All permissions are validated on both client and server side
- Permission checks are performed at component and route levels
- No sensitive data is exposed to unauthorized users

### 2. Role Hierarchy
- Super Admins cannot be demoted by other admins
- Role changes require confirmation
- Audit trail for all role modifications

### 3. Access Control
- Routes are protected at the application level
- Components are conditionally rendered based on permissions
- Navigation is filtered based on user permissions

## Best Practices

### 1. Permission Naming
- Use descriptive permission names
- Follow consistent naming conventions
- Group related permissions logically

### 2. Component Design
- Always provide fallback content for denied access
- Use PermissionGate for conditional rendering
- Implement proper loading states

### 3. Role Management
- Regularly audit user permissions
- Use principle of least privilege
- Document role responsibilities

### 4. Testing
- Test all permission combinations
- Verify access denied scenarios
- Test role switching functionality

## Troubleshooting

### Common Issues

1. **Permission Not Working**
   - Check if user has the required permission
   - Verify permission is correctly defined
   - Ensure component is wrapped with PermissionGate

2. **Route Access Denied**
   - Check ROUTE_PERMISSIONS mapping
   - Verify user role and permissions
   - Ensure ProtectedRoute is properly configured

3. **Navigation Items Missing**
   - Check if user has permission for the route
   - Verify navigation configuration
   - Check role-based filtering logic

### Debug Tools

```jsx
// Check current user permissions
const { currentUser, hasPermission } = useRole()
console.log('User permissions:', currentUser?.permissions)
console.log('Can edit users:', hasPermission('edit_users'))

// Check route access
const { canAccessRoute } = useRole()
console.log('Can access admin roles:', canAccessRoute('/admin-roles'))
```

## Future Enhancements

1. **Dynamic Permissions**: Runtime permission assignment
2. **Permission Groups**: Group related permissions for easier management
3. **Time-based Access**: Temporary permission grants
4. **Audit Logging**: Comprehensive access logging
5. **API Integration**: Server-side permission validation
6. **Multi-tenant Support**: Organization-based role management

## Conclusion

The RBAC system provides a robust, scalable solution for managing user access in the Vault Admin application. It ensures security while maintaining usability and provides administrators with fine-grained control over user permissions and system access.
