import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ErrorDialog from './ErrorDialog'

console.log('=== REGISTRATION PAGE MODULE LOADED ===')

const RegistrationPage = ({ onSwitchToLogin }) => {
  // Simple test to see if component is working
  try {
    console.log('=== REGISTRATION PAGE RENDERED ===')
    // Uncomment the next line to test if component loads
    // alert('Registration page loaded!')
  } catch (error) {
    console.error('Error in RegistrationPage:', error)
  }
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showErrorDialog, setShowErrorDialog] = useState(false)
  const [errorDialogData, setErrorDialogData] = useState({})
  const errorDialogRef = useRef(null)
  
  const { register, isAuthenticated } = useAuth()

  // Handle automatic redirect when user becomes authenticated
  useEffect(() => {
    console.log('RegistrationPage useEffect - isAuthenticated:', isAuthenticated)
    if (isAuthenticated) {
      console.log('User is now authenticated, AuthGuard will handle redirect to dashboard')
    }
  }, [isAuthenticated])

  // Monitor error dialog state changes
  useEffect(() => {
    console.log('=== STATE CHANGE DETECTED ===')
    console.log('showErrorDialog:', showErrorDialog)
    console.log('errorDialogData:', errorDialogData)
    console.log('Current time:', new Date().toISOString())
  }, [showErrorDialog, errorDialogData])

  const handleChange = (e) => {
    console.log('Form field changed:', e.target.name, e.target.value)
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }


  // Handle different types of errors with appropriate dialogs
  const handleError = (errorMessage) => {
    console.log('=== HANDLE ERROR CALLED ===')
    console.log('Error message:', errorMessage)
    console.log('Current showErrorDialog state:', showErrorDialog)
    
    // Check for specific error types
    if (errorMessage.includes('Admin privileges required')) {
      console.log('Detected admin privileges error, showing dialog')
      setErrorDialogData({
        title: "Admin Registration Restricted",
        message: "To create admin accounts, you need to either:\n\n1. Login as an existing admin first, or\n2. Create the first admin account without authentication (if no admins exist yet)\n\nPlease contact your system administrator or try logging in with an existing admin account.",
        type: "warning",
        confirmText: "I Understand"
      })
      setShowErrorDialog(true)
      console.log('Error dialog should now be visible')
    } else if (errorMessage.includes('User already exists')) {
      setErrorDialogData({
        title: "Account Already Exists",
        message: "An account with this email address already exists. Please try logging in instead or use a different email address.",
        type: "info",
        confirmText: "Try Login",
        showCancelButton: true,
        cancelText: "Use Different Email",
        onConfirm: () => {
          setShowErrorDialog(false)
          onSwitchToLogin()
        }
      })
      setShowErrorDialog(true)
    } else if (errorMessage.includes('Invalid credentials')) {
      setErrorDialogData({
        title: "Invalid Credentials",
        message: "The email or password you entered is incorrect. Please check your credentials and try again.",
        type: "error",
        confirmText: "Try Again"
      })
      setShowErrorDialog(true)
    } else {
      // Generic error - show in form
      setError(errorMessage)
    }
  }

  // Force show error dialog function
  const forceShowErrorDialog = (title, message, type = 'error') => {
    console.log('=== FORCE SHOW ERROR DIALOG ===')
    console.log('Title:', title)
    console.log('Message:', message)
    console.log('Type:', type)
    
    // Create a simple alert as fallback
    alert(`${title}\n\n${message}`)
    
    // Also try to set the React state
    setErrorDialogData({
      title,
      message,
      type,
      confirmText: "I Understand"
    })
    setShowErrorDialog(true)
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    return true
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const formVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Registration Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your account has been created successfully. You can now sign in.
            </p>
            <button
              onClick={onSwitchToLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </motion.div>
        
        {/* Error Dialog */}
        <ErrorDialog
          isOpen={showErrorDialog}
          onClose={() => setShowErrorDialog(false)}
          {...errorDialogData}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          variants={formVariants}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join Vault Admin and start managing your system
          </p>
        </motion.div>

        {/* Registration Form */}
        <motion.div
          variants={formVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <form className="space-y-6" noValidate>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="First name"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Last name"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <button type="button" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
              >
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={async (e) => {
                console.log('=== CREATE ACCOUNT BUTTON CLICKED ===')
                
                // Prevent default form submission
                e.preventDefault()
                e.stopPropagation()
                
                // Check if already loading
                if (isLoading) {
                  console.log('Already loading, preventing duplicate submission')
                  return
                }
                
                // Validate form
                if (!validateForm()) {
                  console.log('Form validation failed')
                  return
                }
                
                setIsLoading(true)
                setError('')
                
                try {
                  console.log('Calling register function...')
                  const result = await register({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                  })
                  console.log('Registration successful:', result)
                  
                  // Check if user is automatically authenticated (admin users)
                  if (result && result.id) {
                    console.log('User registered and authenticated, redirecting to dashboard...')
                    return
                  } else {
                    // Regular users need email verification
                    setSuccess(true)
                  }
                } catch (err) {
                  console.error('Registration failed:', err)
                  const errorMessage = err.message || 'Registration failed. Please try again.'
                  
                  // Handle admin privileges error with dialog
                  if (errorMessage.includes('Admin privileges required')) {
                    forceShowErrorDialog(
                      "Admin Registration Restricted",
                      "To create admin accounts, you need to either:\n\n1. Login as an existing admin first, or\n2. Create the first admin account without authentication (if no admins exist yet)\n\nPlease contact your system administrator or try logging in with an existing admin account.",
                      "warning"
                    )
                  } else {
                    // Handle other errors
                    setError(errorMessage)
                  }
                } finally {
                  setIsLoading(false)
                }
              }}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </motion.button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={formVariants}
          className="text-center mt-8"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Vault Admin. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
      
      {/* Error Dialog */}
      <ErrorDialog
        isOpen={showErrorDialog}
        onClose={() => setShowErrorDialog(false)}
        {...errorDialogData}
      />
    </div>
  )
}

export default RegistrationPage
