import React from 'react'

console.log('=== BASIC TEST MODULE LOADED ===')

const BasicTest = () => {
  console.log('=== BASIC TEST COMPONENT RENDERED ===')
  
  const handleClick = () => {
    console.log('=== BASIC TEST BUTTON CLICKED ===')
    alert('Basic test works!')
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', margin: '20px' }}>
      <h1>Basic Test Page</h1>
      <p>If you can see this, React is working.</p>
      <button onClick={handleClick} style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
        Click Me - Basic Test
      </button>
    </div>
  )
}

export default BasicTest
