// =============================================================================
// API CONNECTIVITY TEST
// =============================================================================
// Simple test to check if the backend API is accessible

export const testApiConnectivity = async () => {
  console.log('🔍 Testing API Connectivity...')
  
  const apiUrl = 'http://localhost:5000/api'
  
  try {
    // Test 1: Basic connectivity
    console.log('1. Testing basic connectivity to:', apiUrl)
    const response = await fetch(`${apiUrl}/auth/register`, {
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
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API is accessible and responding')
      console.log('Response data:', data)
    } else {
      console.log('❌ API returned error status:', response.status)
      const errorText = await response.text()
      console.log('Error response:', errorText)
    }
    
  } catch (error) {
    console.log('❌ API connectivity failed:', error.message)
    console.log('Error details:', error)
    
    if (error.message.includes('Failed to fetch')) {
      console.log('💡 This usually means:')
      console.log('   - Backend server is not running')
      console.log('   - Wrong API URL')
      console.log('   - CORS issues')
    }
  }
}

// Auto-run test in development
if (import.meta.env.VITE_DEBUG === 'true') {
  console.log('🚀 Running API connectivity test...')
  testApiConnectivity()
}
