// =============================================================================
// API CONFIGURATION
// =============================================================================
// Centralized configuration for API endpoints and settings

const config = {
  // API Base URL - can be overridden by environment variables
  API_BASE_URL:  'http://54.237.114.155:3000/api',
  
  // Application settings
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Vault Admin',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Development settings
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || false,
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email'
    },
    USERS: {
      LIST: '/users',
      DETAIL: (id) => `/users/${id}`,
      UPDATE: (id) => `/users/${id}`,
      DELETE: (id) => `/users/${id}`
    },
    FILES: {
      LIST: '/files',
      DETAIL: (id) => `/files/${id}`,
      DELETE: (id) => `/files/${id}`
    },
    ADMIN: {
      DASHBOARD: '/admin/dashboard',
      ANALYTICS: '/admin/analytics'
    }
  },
  
  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000,  // 30 seconds
    DOWNLOAD: 60000 // 60 seconds
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000 // 1 second
  }
}

export default config
