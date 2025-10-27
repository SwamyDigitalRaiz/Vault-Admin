import React, { useState } from 'react'

const DiagnosticPage = () => {
  console.log('=== DIAGNOSTIC PAGE RENDERED ===')
  
  const [testState, setTestState] = useState('Initial')
  
  const handleTestClick = () => {
    console.log('=== DIAGNOSTIC BUTTON CLICKED ===')
    setTestState('Button Clicked!')
    alert('Diagnostic button works!')
  }
  
  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('=== DIAGNOSTIC FORM SUBMITTED ===')
    alert('Diagnostic form submitted!')
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Diagnostic Page</h2>
        
        <div className="space-y-4">
          <p>State: {testState}</p>
          
          <button
            onClick={handleTestClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Test Button Click
          </button>
          
          <form onSubmit={handleFormSubmit}>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Test Form Submit
            </button>
          </form>
          
          <div className="text-sm text-gray-600">
            <p>If you see this page, React is working.</p>
            <p>If the buttons work, JavaScript is working.</p>
            <p>If console shows logs, debugging is working.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiagnosticPage
