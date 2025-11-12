import React, { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'
import { toast } from '../utils/toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = apiService.getToken()
        if (token) {
          // Verify token with backend
          const response = await apiService.getMe()
          if (response.success) {
            const user = response.data.user
            // Parse user data to match expected format
            const nameParts = user.name ? user.name.split(' ') : ['', '']
            const userData = {
              id: user._id || user.id,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              email: user.email,
              role: user.role === 'admin' ? 'super_admin' : user.role,
              avatar: user.avatar,
              lastLogin: user.lastLogin,
              isEmailVerified: user.isEmailVerified,
              storageUsed: user.storageUsed,
              storageLimit: user.storageLimit
            }
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            // Invalid token, clear storage
            apiService.setToken(null)
            localStorage.removeItem('vault_user')
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        // Clear invalid session
        apiService.setToken(null)
        localStorage.removeItem('vault_user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (email, password) => {
    setIsLoading(true)
    
    try {
      const response = await apiService.login(email, password)
      
      if (response.success) {
        const { user, token } = response.data
        
        // Set token in API service
        apiService.setToken(token)
        
        // Parse user data to match expected format
        const nameParts = user.name ? user.name.split(' ') : ['', '']
        const userData = {
          id: user.id,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email,
          role: user.role === 'admin' ? 'super_admin' : user.role,
          avatar: user.avatar,
          lastLogin: new Date().toISOString(),
          isEmailVerified: user.isEmailVerified,
          storageUsed: user.storageUsed,
          storageLimit: user.storageLimit
        }
        
        // Store in localStorage
        localStorage.setItem('vault_user', JSON.stringify(userData))
        
        // Set authentication state
        setUser(userData)
        setIsAuthenticated(true)
        
        return userData
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      const msg = error?.message || 'Login failed'
      toast.error(msg)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    console.log('AuthContext: Starting registration with data:', userData)
    setIsLoading(true)
    
    try {
      console.log('AuthContext: Calling API service...')
      const response = await apiService.register(userData)
      console.log('AuthContext: API response:', response)
      
      if (response.success) {
        const { user, token } = response.data
        console.log('AuthContext: Registration successful, user:', user, 'token:', token ? 'present' : 'none')
        
        // Set token in API service if provided
        if (token) {
          apiService.setToken(token)
          console.log('AuthContext: Token set in API service')
        }
        
        // Parse user data to match expected format
        const nameParts = user.name ? user.name.split(' ') : ['', '']
        const sessionData = {
          id: user.id,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email,
          role: user.role === 'admin' ? 'super_admin' : user.role,
          avatar: user.avatar,
          lastLogin: new Date().toISOString(),
          isEmailVerified: user.isEmailVerified
        }

        console.log('AuthContext: Parsed session data:', sessionData)

        // Store in localStorage
        localStorage.setItem('vault_user', JSON.stringify(sessionData))
        console.log('AuthContext: User data stored in localStorage')
        
        // Set authentication state if token is provided (admin users are auto-verified)
        if (token) {
          setUser(sessionData)
          setIsAuthenticated(true)
          console.log('AuthContext: User authenticated and logged in')
        } else {
          console.log('AuthContext: No token provided, user needs email verification')
        }
        
        return sessionData
      } else {
        console.error('AuthContext: Registration failed:', response.message)
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('AuthContext: Registration error:', error)
      const msg = error?.message || 'Registration failed'
      toast.error(msg)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if authenticated
      if (isAuthenticated) {
        try {
          await apiService.logout()
        } catch (error) {
          console.error('Logout API call failed:', error)
          // Continue with local logout even if API fails
        }
      }
      
      // Clear token and localStorage
      apiService.setToken(null)
      localStorage.removeItem('vault_user')
      
      // Reset state
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      // Call API to update user profile
      const response = await apiService.updateUser(user.id, updates)
      
      if (response.success) {
        const updatedUser = { ...user, ...response.data.user }
        
        // Update localStorage
        localStorage.setItem('vault_user', JSON.stringify(updatedUser))
        
        setUser(updatedUser)
        
        return updatedUser
      } else {
        throw new Error(response.message || 'Profile update failed')
      }
    } catch (error) {
      const msg = error?.message || 'Profile update failed'
      toast.error(msg)
      throw error
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      // Call API to change password
      const response = await apiService.updateUser(user.id, {
        currentPassword,
        newPassword
      })
      
      if (response.success) {
        return true
      } else {
        throw new Error(response.message || 'Password change failed')
      }
    } catch (error) {
      const msg = error?.message || 'Password change failed'
      toast.error(msg)
      throw error
    }
  }

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await apiService.forgotPassword(email)
      
      if (response.success) {
        return true
      } else {
        throw new Error(response.message || 'Failed to send password reset email')
      }
    } catch (error) {
      const msg = error?.message || 'Failed to send password reset email'
      toast.error(msg)
      throw error
    }
  }

  // Reset password
  const resetPassword = async (token, newPassword) => {
    try {
      const response = await apiService.resetPassword(token, newPassword)
      
      if (response.success) {
        return true
      } else {
        throw new Error(response.message || 'Failed to reset password')
      }
    } catch (error) {
      const msg = error?.message || 'Failed to reset password'
      toast.error(msg)
      throw error
    }
  }

  // Get user permissions based on role
  const getUserPermissions = (userRole) => {
    const rolePermissions = {
      super_admin: ['all'],
      admin: ['view_dashboard', 'view_users', 'create_users', 'edit_users', 'delete_users', 'view_files', 'view_schedules', 'view_notifications', 'view_reports'],
      support_admin: ['view_dashboard', 'view_users', 'edit_users', 'view_files', 'view_schedules', 'view_notifications'],
      moderator: ['view_dashboard', 'view_users', 'view_files', 'view_schedules', 'view_notifications'],
      viewer: ['view_dashboard', 'view_users', 'view_files', 'view_schedules']
    }
    
    return rolePermissions[userRole] || rolePermissions.viewer
  }

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false
    const permissions = getUserPermissions(user.role)
    return permissions.includes('all') || permissions.includes(permission)
  }

  // Get user's full name
  const getFullName = () => {
    if (!user) return ''
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    return `${firstName} ${lastName}`.trim() || 'User'
  }

  // Get user's initials for avatar
  const getInitials = () => {
    if (!user) return 'U'
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    const firstInitial = firstName.charAt(0) || ''
    const lastInitial = lastName.charAt(0) || ''
    const initials = `${firstInitial}${lastInitial}`.toUpperCase()
    return initials || 'U'
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    hasPermission,
    getFullName,
    getInitials,
    getUserPermissions
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export AuthProvider as default (the actual React component)
export default AuthProvider
