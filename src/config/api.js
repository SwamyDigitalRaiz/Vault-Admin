// =============================================================================
// API CONFIGURATION
// =============================================================================
// Centralized configuration for API endpoints and settings

const config = {
  // API Base URL - dynamically set based on environment
  // In development/debug mode: uses local debug server (192.168.0.179:6010)
  // In production: uses VITE_API_BASE_URL if set, otherwise uses production URL
  API_BASE_URL: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true' 
    ? 'http://localhost:6060/api'  // Debug mode: local development server
    : (import.meta.env.VITE_API_BASE_URL || 'https://vaultchain.app/api/api/'),  // Production: use domain with HTTPS
  
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
