// =============================================================================
// QUICK TEST FOR REGISTRATION ISSUE
// =============================================================================

export const quickTest = () => {
  console.log('🔍 Quick Test for Registration Issue')
  
  // Test 1: Check if we can make a simple API call
  console.log('1. Testing API connectivity...')
  
  fetch('http://localhost:5000/api/auth/register', {
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
  .then(response => {
    console.log('API Response Status:', response.status)
    return response.json()
  })
  .then(data => {
    console.log('API Response Data:', data)
    console.log('✅ API is working')
  })
  .catch(error => {
    console.log('❌ API Error:', error)
    console.log('💡 Make sure backend is running on port 5000')
  })
  
  // Test 2: Check localStorage
  console.log('2. Checking localStorage...')
  console.log('User:', localStorage.getItem('vault_user'))
  console.log('Token:', localStorage.getItem('vault_token'))
  
  // Test 3: Check if we're in the right environment
  console.log('3. Environment check...')
  console.log('Current URL:', window.location.href)
  console.log('Debug mode:', import.meta.env.VITE_DEBUG)
}

// Auto-run in development
if (import.meta.env.VITE_DEBUG === 'true') {
  console.log('🚀 Running quick test...')
  quickTest()
}
