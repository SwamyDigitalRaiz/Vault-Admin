import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import LoginPage from './LoginPage'
import RegistrationPage from './RegistrationPage'
import ForgotPasswordPage from './ForgotPasswordPage'
import SimpleTest from './SimpleTest'
import MinimalRegistration from './MinimalRegistration'
import DiagnosticPage from './DiagnosticPage'
import BasicTest from './BasicTest'
import EmailVerificationPage from './EmailVerificationPage'

console.log('=== AUTHGUARD MODULE LOADED ===')

const AuthGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', or 'forgot-password'

  // Force re-render when authentication state changes
  useEffect(() => {
    console.log('AuthGuard: Authentication state changed:', { isAuthenticated, isLoading })
    if (isAuthenticated) {
      console.log('AuthGuard: User is now authenticated, showing dashboard')
    }
  }, [isAuthenticated, isLoading])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    )
  }

  // Show email verification page if on verification route (no auth required)
  if (window.location.pathname === '/verify-email') {
    return <EmailVerificationPage />
  }

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <LoginPage 
          onSwitchToRegister={() => setAuthMode('register')} 
          onSwitchToForgotPassword={() => setAuthMode('forgot-password')}
        />
      )
    } else if (authMode === 'register') {
      return <RegistrationPage onSwitchToLogin={() => setAuthMode('login')} />
    } else if (authMode === 'forgot-password') {
      return (
        <ForgotPasswordPage 
          onBackToLogin={() => setAuthMode('login')}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      )
    }
  }

  // Show protected content if authenticated
  return <div key={isAuthenticated ? 'authenticated' : 'not-authenticated'}>{children}</div>
}

export default AuthGuard
