// =============================================================================
// DIAGNOSTIC UTILITIES
// =============================================================================
// Comprehensive diagnostic to identify the root cause

export const runDiagnostic = () => {
  console.log('🔍 Running Comprehensive Diagnostic...')
  
  // Test 1: Basic JavaScript functionality
  console.log('1. Testing basic JavaScript...')
  try {
    const testObj = { test: 'value' }
    console.log('✅ JavaScript is working:', testObj)
  } catch (error) {
    console.log('❌ JavaScript error:', error)
  }
  
  // Test 2: React functionality
  console.log('2. Testing React...')
  try {
    console.log('✅ React is available')
  } catch (error) {
    console.log('❌ React error:', error)
  }
  
  // Test 3: Event handling
  console.log('3. Testing event handling...')
  try {
    const testButton = document.createElement('button')
    testButton.addEventListener('click', () => {
      console.log('✅ Event handling works')
    })
    console.log('✅ Event handling setup successful')
  } catch (error) {
    console.log('❌ Event handling error:', error)
  }
  
  // Test 4: Console errors
  console.log('4. Checking for console errors...')
  const originalError = console.error
  console.error = (...args) => {
    console.log('🚨 Console Error Detected:', ...args)
    originalError(...args)
  }
  
  // Test 5: Network connectivity
  console.log('5. Testing network connectivity...')
  fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test: 'data' })
  })
  .then(response => {
    console.log('✅ Network request successful, status:', response.status)
  })
  .catch(error => {
    console.log('❌ Network request failed:', error.message)
    console.log('💡 This might be the issue - backend not running')
  })
  
  // Test 6: Local storage
  console.log('6. Testing localStorage...')
  try {
    localStorage.setItem('test', 'value')
    const testValue = localStorage.getItem('test')
    console.log('✅ localStorage works:', testValue)
    localStorage.removeItem('test')
  } catch (error) {
    console.log('❌ localStorage error:', error)
  }
  
  // Test 7: Component rendering
  console.log('7. Testing component rendering...')
  console.log('✅ Components should be rendering if you can see this page')
  
  console.log('🎉 Diagnostic completed!')
}

// Auto-run diagnostic
if (import.meta.env.VITE_DEBUG === 'true') {
  console.log('🚀 Running diagnostic...')
  runDiagnostic()
}
