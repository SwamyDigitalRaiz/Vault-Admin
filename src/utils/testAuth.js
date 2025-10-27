// =============================================================================
// AUTHENTICATION TEST UTILITIES
// =============================================================================
// Utility functions for testing authentication integration
// This file should be removed in production

import apiService from '../services/api'

/**
 * Test authentication flow
 */
export const testAuthentication = async () => {
  console.log('🧪 Testing Authentication Integration...')
  
  try {
    // Test 1: Check API connectivity
    console.log('1. Testing API connectivity...')
    const response = await fetch(`${apiService.baseURL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      console.log('✅ API is accessible')
    } else {
      console.log('❌ API returned status:', response.status)
    }
    
    // Test 2: Test login endpoint
    console.log('2. Testing login endpoint...')
    try {
      const loginResponse = await apiService.login('test@example.com', 'testpassword')
      console.log('✅ Login endpoint accessible')
    } catch (error) {
      if (error.message.includes('Invalid credentials')) {
        console.log('✅ Login endpoint working (expected failure)')
      } else {
        console.log('❌ Login endpoint error:', error.message)
      }
    }
    
    // Test 3: Test registration endpoint
    console.log('3. Testing registration endpoint...')
    try {
      const registerResponse = await apiService.register({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'testpassword'
      })
      console.log('✅ Registration endpoint accessible')
    } catch (error) {
      if (error.message.includes('already exists') || error.message.includes('validation')) {
        console.log('✅ Registration endpoint working (expected failure)')
      } else {
        console.log('❌ Registration endpoint error:', error.message)
      }
    }
    
    console.log('🎉 Authentication integration test completed!')
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error)
  }
}

/**
 * Test token management
 */
export const testTokenManagement = () => {
  console.log('🔑 Testing Token Management...')
  
  // Test token storage
  const testToken = 'test-token-123'
  apiService.setToken(testToken)
  
  if (apiService.getToken() === testToken) {
    console.log('✅ Token storage working')
  } else {
    console.log('❌ Token storage failed')
  }
  
  // Test token clearing
  apiService.setToken(null)
  
  if (apiService.getToken() === null) {
    console.log('✅ Token clearing working')
  } else {
    console.log('❌ Token clearing failed')
  }
}

/**
 * Test configuration
 */
export const testConfiguration = () => {
  console.log('⚙️ Testing Configuration...')
  
  console.log('API Base URL:', apiService.baseURL)
  console.log('Current Token:', apiService.getToken() ? 'Present' : 'None')
  
  // Test environment variables
  const envVars = {
    'VITE_API_BASE_URL': import.meta.env.VITE_API_BASE_URL,
    'VITE_APP_NAME': import.meta.env.VITE_APP_NAME,
    'VITE_DEBUG': import.meta.env.VITE_DEBUG
  }
  
  console.log('Environment Variables:', envVars)
}

// Auto-run tests in development
if (import.meta.env.VITE_DEBUG === 'true') {
  console.log('🚀 Running authentication tests in development mode...')
  testConfiguration()
  testTokenManagement()
  // testAuthentication() // Uncomment to test API connectivity
}
