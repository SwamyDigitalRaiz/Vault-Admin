import React, { useState, useMemo, useCallback, memo, useEffect } from 'react'
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
import ReferralPage from './components/ReferralPage'
import SystemSettingsPage from './components/SystemSettingsPage'
import AdminRolesPage from './components/AdminRolesPage'
import StaffPage from './components/StaffPage'
import RolesPermissionsPage from './components/RolesPermissionsPage'
import SupportPage from './components/SupportPage'
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
      case '/referrals':
        return ReferralPage
      case '/system-settings':
        return SystemSettingsPage
      case '/admin-roles':
        return AdminRolesPage
      case '/staff':
        return StaffPage
      case '/roles-permissions':
        return RolesPermissionsPage
      case '/support':
        return SupportPage
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
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="h-full"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoute}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
})

// Helper function to get initial route from URL
const getInitialRoute = () => {
  const pathname = window.location.pathname
  // Check if we're on routes that don't require auth
  if (pathname === '/verify-email') {
    return '/verify-email'
  }
  if (pathname === '/reset-password') {
    return '/reset-password'
  }
  // Map URL pathname to route, or default to dashboard
  const validRoutes = [
    '/dashboard', '/users', '/contacts', '/folders', '/files', 
    '/schedules', '/reports', '/analytics', '/notifications', 
    '/subscriptions', '/packages', '/transactions', '/referrals', '/system-settings', 
    '/admin-roles', '/staff', '/roles-permissions', '/support', '/profile-settings', '/user-detail'
  ]
  // If pathname is root or not a valid route, default to dashboard
  if (pathname === '/' || pathname === '') {
    return '/dashboard'
  }
  // If pathname is a valid route, use it; otherwise default to dashboard
  return validRoutes.includes(pathname) ? pathname : '/dashboard'
}

function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const initialRoute = getInitialRoute()
    // Update URL if it's root or empty to show /dashboard
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState({ route: initialRoute }, '', initialRoute)
    }
    return initialRoute
  })
  const [selectedUser, setSelectedUser] = useState(null)

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute()
      setCurrentRoute(route)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Memoize the route change handler to prevent sidebar re-renders
  const handleRouteChange = useCallback((route) => {
    setCurrentRoute(route)
    // Update browser URL without page reload
    if (window.location.pathname !== route) {
      window.history.pushState({ route }, '', route)
    }
  }, [])

  // Handle user selection for user detail page
  const handleUserSelect = useCallback((user) => {
    setSelectedUser(user)
    const route = '/user-detail'
    setCurrentRoute(route)
    window.history.pushState({ route }, '', route)
  }, [])

  // Handle back navigation
  const handleBack = useCallback(() => {
    const route = '/users'
    setCurrentRoute(route)
    setSelectedUser(null)
    window.history.pushState({ route }, '', route)
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
                <div className="flex-1 overflow-y-auto">
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
