import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, ArrowRight, Mail } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import apiService from '../services/api'

const EmailVerificationPage = () => {
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error', 'expired'
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { login } = useAuth()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')

        if (!token) {
          setStatus('error')
          setMessage('No verification token provided')
          setIsLoading(false)
          return
        }

        console.log('Verifying email with token:', token)

        // Call the API to verify the email
        const response = await apiService.verifyEmail(token)
        
        console.log('Email verification response:', response)

        if (response.success) {
          setStatus('success')
          setMessage('Your email has been verified successfully! You can now log in.')
          
          // Auto-login the user if possible
          try {
            // Note: We don't have the user's credentials here, so we can't auto-login
            // The user will need to log in manually
          } catch (loginError) {
            console.log('Could not auto-login user:', loginError)
          }
        } else {
          setStatus('error')
          setMessage(response.message || 'Email verification failed')
        }
      } catch (error) {
        console.error('Email verification error:', error)
        
        if (error.message?.includes('expired') || error.message?.includes('invalid')) {
          setStatus('expired')
          setMessage('This verification link has expired or is invalid. Please request a new verification email.')
        } else {
          setStatus('error')
          setMessage(error.message || 'An error occurred during email verification')
        }
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [])

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

  const cardVariants = {
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

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
      case 'error':
      case 'expired':
        return <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
      default:
        return <Mail className="w-8 h-8 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'verifying':
        return 'bg-blue-100 dark:bg-blue-900'
      case 'success':
        return 'bg-green-100 dark:bg-green-900'
      case 'error':
      case 'expired':
        return 'bg-red-100 dark:bg-red-900'
      default:
        return 'bg-gray-100 dark:bg-gray-900'
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Verifying Email...'
      case 'success':
        return 'Email Verified!'
      case 'error':
        return 'Verification Failed'
      case 'expired':
        return 'Link Expired'
      default:
        return 'Email Verification'
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
        <motion.div
          variants={cardVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 text-center"
        >
          {/* Status Icon */}
          <div className={`w-16 h-16 ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {getStatusIcon()}
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {getStatusTitle()}
          </h1>
          
          {/* Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {message}
          </p>
          
          {/* Actions */}
          <div className="space-y-4">
            {status === 'success' && (
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Go to Login
              </button>
            )}
            
            {(status === 'error' || status === 'expired') && (
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/register'}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Register Again
                </button>
                
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Back to Login
                </button>
              </div>
            )}
            
            {status === 'verifying' && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Please wait while we verify your email...
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default EmailVerificationPage
