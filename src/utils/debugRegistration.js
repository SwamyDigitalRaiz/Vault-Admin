// =============================================================================
// REGISTRATION DEBUG UTILITIES
// =============================================================================
// Debug utilities to help identify registration issues

import apiService from '../services/api'

/**
 * Test registration flow step by step
 */
export const debugRegistrationFlow = async () => {
  console.log('🔍 Starting Registration Debug Flow...')
  
  try {
    // Step 1: Check API configuration
    console.log('1. API Configuration:')
    console.log('   Base URL:', apiService.baseURL)
    console.log('   Token:', apiService.getToken() ? 'Present' : 'None')
    
    // Step 2: Test API connectivity
    console.log('2. Testing API connectivity...')
    try {
      const testResponse = await fetch(`${apiService.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'TestPassword123',
          role: 'admin'
        })
      })
      
      console.log('   API Response Status:', testResponse.status)
      console.log('   API Response Headers:', Object.fromEntries(testResponse.headers.entries()))
      
      if (testResponse.ok) {
        console.log('   ✅ API is accessible')
      } else {
        console.log('   ❌ API returned error status:', testResponse.status)
      }
    } catch (error) {
      console.log('   ❌ API connectivity failed:', error.message)
    }
    
    // Step 3: Test form data format
    console.log('3. Testing form data format...')
    const testFormData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'TestPassword123'
    }
    
    const expectedApiData = {
      name: `${testFormData.firstName} ${testFormData.lastName}`,
      email: testFormData.email,
      password: testFormData.password,
      role: 'admin'
    }
    
    console.log('   Form Data:', testFormData)
    console.log('   Expected API Data:', expectedApiData)
    
    // Step 4: Test API service register method
    console.log('4. Testing API service register method...')
    try {
      const response = await apiService.register(testFormData)
      console.log('   ✅ API service register working')
      console.log('   Response:', response)
    } catch (error) {
      console.log('   ❌ API service register failed:', error.message)
    }
    
    console.log('🎉 Registration debug flow completed!')
    
  } catch (error) {
    console.error('❌ Registration debug flow failed:', error)
  }
}

/**
 * Check browser console for errors
 */
export const checkConsoleErrors = () => {
  console.log('🔍 Checking for console errors...')
  
  // Override console.error to catch errors
  const originalError = console.error
  console.error = (...args) => {
    console.log('🚨 Console Error Detected:', ...args)
    originalError(...args)
  }
  
  // Override console.warn to catch warnings
  const originalWarn = console.warn
  console.warn = (...args) => {
    console.log('⚠️ Console Warning Detected:', ...args)
    originalWarn(...args)
  }
}

/**
 * Test form submission
 */
export const testFormSubmission = () => {
  console.log('🔍 Testing form submission...')
  
  // Check if form elements exist
  const form = document.querySelector('form')
  const submitButton = document.querySelector('button[type="submit"]')
  
  console.log('Form element:', form ? 'Found' : 'Not found')
  console.log('Submit button:', submitButton ? 'Found' : 'Not found')
  
  if (form) {
    console.log('Form action:', form.action)
    console.log('Form method:', form.method)
  }
  
  if (submitButton) {
    console.log('Submit button type:', submitButton.type)
    console.log('Submit button disabled:', submitButton.disabled)
  }
}

// Auto-run debug checks in development
if (import.meta.env.VITE_DEBUG === 'true') {
  console.log('🚀 Running registration debug checks...')
  checkConsoleErrors()
  testFormSubmission()
  // Uncomment to test API connectivity
  // debugRegistrationFlow()
}
