import React, { useState, useMemo, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './components/Dashboard'
import UsersPage from './components/UsersPage'
import RecipientsPage from './components/RecipientsPage'
import FilesPage from './components/FilesPage'
import SchedulesPage from './components/SchedulesPage'
import ReportsPage from './components/ReportsPage'
import StorageAnalyticsPage from './components/StorageAnalyticsPage'
import NotificationsPage from './components/NotificationsPage'
import SubscriptionPage from './components/SubscriptionPage'
import PackagesPage from './components/PackagesPage'
import TransactionsPage from './components/TransactionsPage'
import SystemSettingsPage from './components/SystemSettingsPage'
import AdminRolesPage from './components/AdminRolesPage'
import ProfileSettingsPage from './components/ProfileSettingsPage'
import UserDetailPage from './components/UserDetailPage'
import EmailVerificationPage from './components/EmailVerificationPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import { ThemeProvider } from './contexts/ThemeContext'
import { RoleProvider } from './contexts/RoleContext'
import { AuthProvider } from './contexts/AuthContext'
import AuthGuard from './components/AuthGuard'

// Import test utilities in development
if (import.meta.env.VITE_DEBUG === 'true') {
  import('./utils/testAuth')
  import('./utils/integrationTest')
  import('./utils/debugRegistration')
  import('./utils/apiConnectivityTest')
  import('./utils/testRegistrationFlow')
  import('./utils/quickTest')
  import('./utils/diagnostic')
}

// Memoized Sidebar to prevent re-renders
const MemoizedSidebar = memo(Sidebar, (prevProps, nextProps) => {
  // Only re-render if the route actually changes
  return prevProps.currentRoute === nextProps.currentRoute
})

// Memoized TopBar to prevent re-renders
const MemoizedTopBar = memo(TopBar)

// Memoized Content Area to prevent unnecessary re-renders
const ContentArea = memo(({ currentRoute, selectedUser, onUserSelect, onBack }) => {
  const ContentComponent = useMemo(() => {
    switch (currentRoute) {
      case '/dashboard':
        return Dashboard
      case '/users':
        return UsersPage
      case '/contacts':
        return RecipientsPage
      case '/folders':
      case '/files':
        return FilesPage
      case '/schedules':
        return SchedulesPage
      case '/reports':
        return ReportsPage
      case '/analytics':
        return StorageAnalyticsPage
      case '/notifications':
        return NotificationsPage
      case '/subscriptions':
        return SubscriptionPage
      case '/packages':
        return PackagesPage
      case '/transactions':
        return TransactionsPage
      case '/system-settings':
        return SystemSettingsPage
      case '/admin-roles':
        return AdminRolesPage
      case '/profile-settings':
        return ProfileSettingsPage
      case '/user-detail':
        return UserDetailPage
      case '/verify-email':
        return EmailVerificationPage
      default:
        return null
    }
  }, [currentRoute])

  const renderContent = () => {
    if (ContentComponent) {
      if (currentRoute === '/users') {
        return <ContentComponent onUserSelect={onUserSelect} />
      } else if (currentRoute === '/contacts') {
        return <ContentComponent onRecipientSelect={onUserSelect} />
      } else if (currentRoute === '/folders' || currentRoute === '/files') {
        return <ContentComponent onFileSelect={onUserSelect} />
      } else if (currentRoute === '/schedules') {
        return <ContentComponent onScheduleSelect={onUserSelect} />
      } else if (currentRoute === '/user-detail') {
        return <ContentComponent user={selectedUser} onBack={onBack} />
      }
      return <ContentComponent />
    }

    // Handle special cases like logout and 404
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {currentRoute === '/logout' ? 'Logout' : 'Page Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {currentRoute === '/logout'
              ? 'You have been logged out successfully.'
              : 'The page you are looking for does not exist.'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      key={currentRoute}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-full"
    >
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </motion.div>
  )
})

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Check if we're on routes that don't require auth
    const pathname = window.location.pathname
    if (pathname === '/verify-email') {
      return '/verify-email'
    }
    if (pathname === '/reset-password') {
      return '/reset-password'
    }
    return '/dashboard'
  })
  const [selectedUser, setSelectedUser] = useState(null)

  // Memoize the route change handler to prevent sidebar re-renders
  const handleRouteChange = useCallback((route) => {
    setCurrentRoute(route)
  }, [])

  // Handle user selection for user detail page
  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user)
    setCurrentRoute('/user-detail')
  }, [])

  // Handle back navigation
  const handleBack = useCallback(() => {
    setCurrentRoute('/users')
    setSelectedUser(null)
  }, [])

  // Handle routes that don't require auth separately
  if (currentRoute === '/verify-email') {
    return (
      <ThemeProvider>
        <EmailVerificationPage />
      </ThemeProvider>
    )
  }

  if (currentRoute === '/reset-password') {
    return (
      <ThemeProvider>
        <AuthProvider>
          <ResetPasswordPage />
        </AuthProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <RoleProvider>
          <AuthGuard>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
              <MemoizedSidebar currentRoute={currentRoute} onRouteChange={handleRouteChange} />
              <div className="flex-1 flex flex-col min-w-0 h-full">
                <MemoizedTopBar onRouteChange={handleRouteChange} />
                <div className="flex-1 overflow-hidden">
                  <ContentArea 
                    currentRoute={currentRoute} 
                    selectedUser={selectedUser}
                    onUserSelect={handleUserSelect}
                    onBack={handleBack}
                  />
                </div>
              </div>
            </div>
          </AuthGuard>
        </RoleProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
