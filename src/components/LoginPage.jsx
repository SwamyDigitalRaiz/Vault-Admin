import React, { useState, useEffect,  } from 'react'
import { flushSync } from 'react-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ErrorDialog from './ErrorDialog'

const LoginPage = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  // Load saved credentials if "Remember Me" was previously enabled
  const [formData, setFormData] = useState(() => {
    const remembered = localStorage.getItem('vault_remember_me')
    if (remembered === 'true') {
      const savedEmail = localStorage.getItem('vault_remembered_email') || ''
      // Don't load password for security - user needs to re-enter it
      return {
        email: savedEmail,
        password: ''
      }
    }
    return {
      email: '',
      password: ''
    }
  })
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('vault_remember_me') === 'true'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [errorDialog, setErrorDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
    confirmText: 'OK',
    showCancelButton: false,
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null
  })

  const { login } = useAuth()

  const handleChange = (e) => {
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
    // Check for specific error types
    if (errorMessage.includes('Invalid credentials')) {
      const newDialogState = {
        isOpen: true,
        title: "Login Failed",
        message: "The email or password you entered is incorrect. Please check your credentials and try again.\n\nIf you've forgotten your password, you can reset it using the 'Forgot password?' link below.",
        type: "error",
        confirmText: "Try Again",
        showCancelButton: true,
        cancelText: "Reset Password",
        onConfirm: () => setErrorDialog(prev => ({ ...prev, isOpen: false })),
        onCancel: () => {
          setErrorDialog(prev => ({ ...prev, isOpen: false }))
          onSwitchToForgotPassword()
        }
      }
      
      flushSync(() => {
        setErrorDialog(newDialogState)
      })
      
    } else if (errorMessage.includes('Account is deactivated')) {
      setErrorDialog({
        isOpen: true,
        title: "Account Deactivated",
        message: "Your account has been deactivated. Please contact your system administrator for assistance.",
        type: "warning",
        confirmText: "Contact Support",
        showCancelButton: false,
        cancelText: "Cancel",
        onConfirm: () => setErrorDialog(prev => ({ ...prev, isOpen: false })),
        onCancel: null
      })
    } else if (errorMessage.includes('Email not verified')) {
      setErrorDialog({
        isOpen: true,
        title: "Email Not Verified",
        message: "Please check your email and click the verification link before logging in. If you didn't receive the email, you can request a new verification email.",
        type: "info",
        confirmText: "Resend Email",
        showCancelButton: true,
        cancelText: "Try Again",
        onConfirm: () => setErrorDialog(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setErrorDialog(prev => ({ ...prev, isOpen: false }))
      })
    } else {
      // Generic error - show in form
      setError(errorMessage)
    }
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
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your Vault Admin account
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          variants={formVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-6">
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
                  placeholder="Enter your password"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Forgot password?
              </button>
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
              type="button"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async (e) => {
                e.preventDefault()
                
                // Basic validation
                if (!formData.email || !formData.password) {
                  flushSync(() => {
                    setErrorDialog({
                      isOpen: true,
                      title: "Missing Information",
                      message: "Please enter both email and password to continue.",
                      type: "warning",
                      confirmText: "OK",
                      showCancelButton: false,
                      cancelText: "Cancel",
                      onConfirm: () => setErrorDialog(prev => ({ ...prev, isOpen: false })),
                      onCancel: null
                    })
                  })
                  return
                }
                
                setIsLoading(true)
                setError('')
                
                try {
                  await login(formData.email, formData.password)
                  
                  // Handle "Remember Me" functionality
                  if (rememberMe) {
                    // Save email for future logins
                    localStorage.setItem('vault_remember_me', 'true')
                    localStorage.setItem('vault_remembered_email', formData.email)
                  } else {
                    // Clear saved credentials if remember me is unchecked
                    localStorage.removeItem('vault_remember_me')
                    localStorage.removeItem('vault_remembered_email')
                  }
                  
                  // Login successful - AuthContext will handle the redirect
                } catch (err) {
                  // Fallback alert if dialog doesn't work
                  alert(`Login Failed: ${err.message || 'Invalid credentials'}`)
                  handleError(err.message || 'Login failed. Please check your credentials.')
                } finally {
                  setIsLoading(false)
                }
              }}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </motion.button>
          </div>

          {/* Switch to Register */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Create one here
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
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog(prev => ({ ...prev, isOpen: false }))}
        title={errorDialog.title}
        message={errorDialog.message}
        type={errorDialog.type}
        confirmText={errorDialog.confirmText}
        showCancelButton={errorDialog.showCancelButton}
        cancelText={errorDialog.cancelText}
        onConfirm={errorDialog.onConfirm}
        onCancel={errorDialog.onCancel}
      />
      
      {/* Debug: Show when dialog should be open */}
      {errorDialog.isOpen && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'red',
          color: 'white',
          padding: '10px',
          zIndex: 9999,
          borderRadius: '5px'
        }}>
          DIALOG SHOULD BE OPEN: {errorDialog.title}
        </div>
      )}
    </div>
  )
}

export default LoginPage
