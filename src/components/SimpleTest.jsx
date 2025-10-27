import React, { useState } from 'react'

const SimpleTest = () => {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleClick = () => {
    console.log('Button clicked!')
    setCount(count + 1)
    setMessage(`Button clicked ${count + 1} times`)
    alert('Button works!')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Simple Test</h2>
        
        <div className="space-y-4">
          <p>Count: {count}</p>
          <p>Message: {message}</p>
          
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Test Button
          </button>
          
          <div className="text-sm text-gray-600">
            If this button works, the issue is with the registration form specifically.
            If this button doesn't work, there's a deeper JavaScript issue.
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleTest
