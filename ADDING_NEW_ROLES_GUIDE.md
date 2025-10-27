# Adding New Roles to the RBAC System

## Overview

This guide shows you how to add new roles to the Role-Based Access Control (RBAC) system. We'll use the example of adding a "Moderator" role.

## Step-by-Step Process

### **Step 1: Add Role Definition**

In `src/contexts/RoleContext.jsx`, add your new role to the `ROLES` object:

```javascript
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUPPORT_ADMIN: 'support_admin',
  MODERATOR: 'moderator',        // ← New role added
  VIEWER: 'viewer'
}
```

### **Step 2: Define Role Permissions**

Add the new role to the `ROLE_PERMISSIONS` mapping with appropriate permissions:

```javascript
const ROLE_PERMISSIONS = {
  // ... existing roles ...
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
    PERMISSIONS.VIEW_ANALYTICS
  ],
  // ... other roles ...
}
```

### **Step 3: Add Role Display Name**

Update the `getRoleDisplayName` function:

```javascript
const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.ADMIN]: 'Admin',
    [ROLES.SUPPORT_ADMIN]: 'Support Admin',
    [ROLES.MODERATOR]: 'Moderator',        // ← New role display name
    [ROLES.VIEWER]: 'Viewer'
  }
  return roleNames[role] || role
}
```

### **Step 4: Add Role Color**

Update the `getRoleColor` function with appropriate styling:

```javascript
const getRoleColor = (role) => {
  const roleColors = {
    [ROLES.SUPER_ADMIN]: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    [ROLES.ADMIN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    [ROLES.SUPPORT_ADMIN]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    [ROLES.MODERATOR]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',  // ← New role color
    [ROLES.VIEWER]: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  }
  return roleColors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}
```

### **Step 5: Update AdminRolesTable Component**

In `src/components/AdminRolesTable.jsx`, add the new role to the `getRoleIcon` function:

```javascript
const getRoleIcon = (role) => {
  switch (role) {
    case 'Super Admin':
      return <Shield className="h-4 w-4 text-red-500" />
    case 'Support Admin':
      return <User className="h-4 w-4 text-blue-500" />
    case 'Moderator':                    // ← New role icon
      return <User className="h-4 w-4 text-orange-500" />
    case 'Viewer':
      return <Eye className="h-4 w-4 text-green-500" />
    default:
      return <User className="h-4 w-4 text-gray-500" />
  }
}
```

### **Step 6: Add Role Description**

Update the role management modal to include a description for the new role:

```javascript
<p className="text-sm text-gray-600 dark:text-gray-400">
  {role === ROLES.SUPER_ADMIN && 'Full system access'}
  {role === ROLES.ADMIN && 'Full feature access'}
  {role === ROLES.SUPPORT_ADMIN && 'Limited admin access'}
  {role === ROLES.MODERATOR && 'Content moderation access'}  // ← New role description
  {role === ROLES.VIEWER && 'Read-only access'}
</p>
```

## **Example: Complete Moderator Role Implementation**

Here's what we added for the Moderator role:

### **Role Definition:**
```javascript
MODERATOR: 'moderator'
```

### **Permissions:**
- View Dashboard
- View Users
- View Recipients  
- View Files
- Download Files
- View Schedules
- View Notifications
- Send Notifications
- View Reports
- View Analytics

### **Visual Styling:**
- **Color**: Orange theme (`bg-orange-100 text-orange-800`)
- **Icon**: User icon with orange color
- **Description**: "Content moderation access"

## **Role Permission Guidelines**

### **Permission Categories:**

#### **View-Only Permissions:**
- `VIEW_DASHBOARD`
- `VIEW_USERS`
- `VIEW_RECIPIENTS`
- `VIEW_FILES`
- `VIEW_SCHEDULES`
- `VIEW_NOTIFICATIONS`
- `VIEW_REPORTS`
- `VIEW_ANALYTICS`

#### **Action Permissions:**
- `CREATE_USERS`, `EDIT_USERS`, `DELETE_USERS`
- `UPLOAD_FILES`, `EDIT_FILES`, `DELETE_FILES`
- `CREATE_SCHEDULES`, `EDIT_SCHEDULES`, `DELETE_SCHEDULES`
- `SEND_NOTIFICATIONS`, `MANAGE_NOTIFICATIONS`

#### **Administrative Permissions:**
- `MANAGE_USER_ROLES`
- `MANAGE_ADMIN_ROLES`
- `EDIT_SETTINGS`

### **Role Hierarchy Examples:**

#### **Super Admin:**
- All permissions
- System-wide access
- Can manage other admins

#### **Admin:**
- Most permissions except admin role management
- Full feature access
- Cannot manage admin roles

#### **Support Admin:**
- Limited admin access
- User management and support tasks
- No system settings access

#### **Moderator:**
- Content moderation access
- View and send notifications
- Limited editing capabilities

#### **Viewer:**
- Read-only access
- View permissions only
- No editing capabilities

## **Testing Your New Role**

### **1. Test Role Assignment:**
- Go to Admin Roles page
- Click the Shield icon on any user
- Select your new role
- Verify permissions are applied

### **2. Test Permission Gates:**
- Login as a user with the new role
- Check that only permitted features are visible
- Verify navigation shows appropriate menu items

### **3. Test Role Switching:**
- Switch between different roles
- Verify permission changes take effect immediately
- Check that UI updates reflect new permissions

## **Best Practices**

### **1. Permission Design:**
- Follow principle of least privilege
- Group related permissions logically
- Consider role responsibilities

### **2. Visual Design:**
- Use consistent color schemes
- Choose appropriate icons
- Write clear role descriptions

### **3. Testing:**
- Test all permission combinations
- Verify access denied scenarios
- Check role switching functionality

### **4. Documentation:**
- Document role responsibilities
- Update user guides
- Maintain permission matrix

## **Common Role Examples**

### **Content Manager:**
```javascript
[ROLES.CONTENT_MANAGER]: [
  PERMISSIONS.VIEW_DASHBOARD,
  PERMISSIONS.VIEW_FILES,
  PERMISSIONS.UPLOAD_FILES,
  PERMISSIONS.EDIT_FILES,
  PERMISSIONS.DELETE_FILES,
  PERMISSIONS.VIEW_SCHEDULES,
  PERMISSIONS.CREATE_SCHEDULES,
  PERMISSIONS.VIEW_NOTIFICATIONS,
  PERMISSIONS.SEND_NOTIFICATIONS
]
```

### **Analyst:**
```javascript
[ROLES.ANALYST]: [
  PERMISSIONS.VIEW_DASHBOARD,
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.VIEW_FILES,
  PERMISSIONS.DOWNLOAD_FILES,
  PERMISSIONS.VIEW_SCHEDULES,
  PERMISSIONS.VIEW_REPORTS,
  PERMISSIONS.VIEW_ANALYTICS,
  PERMISSIONS.EXPORT_DATA
]
```

### **Auditor:**
```javascript
[ROLES.AUDITOR]: [
  PERMISSIONS.VIEW_DASHBOARD,
  PERMISSIONS.VIEW_USERS,
  PERMISSIONS.VIEW_RECIPIENTS,
  PERMISSIONS.VIEW_FILES,
  PERMISSIONS.VIEW_SCHEDULES,
  PERMISSIONS.VIEW_NOTIFICATIONS,
  PERMISSIONS.VIEW_REPORTS,
  PERMISSIONS.VIEW_ANALYTICS
]
```

## **Troubleshooting**

### **Common Issues:**

1. **Role Not Appearing:**
   - Check role is added to all required functions
   - Verify role constant is correctly defined
   - Ensure role is included in role management modal

2. **Permissions Not Working:**
   - Verify permissions are correctly mapped
   - Check permission names match exactly
   - Test permission gates are working

3. **Visual Issues:**
   - Check color classes are valid
   - Verify icon imports are correct
   - Test in both light and dark modes

## **Conclusion**

Adding new roles to the RBAC system is straightforward when you follow these steps. The system is designed to be flexible and extensible, making it easy to add new roles as your application grows.

Remember to:
- Test thoroughly
- Document role responsibilities  
- Consider security implications
- Follow consistent naming conventions
