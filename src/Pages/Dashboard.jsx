import React from 'react'

const Dashboard = () => {
  return (
    <>
      <h1>Came to dashboard</h1>

      <button onClick={()=>{localStorage.removeItem("ai_application_token"); window.location.href="/"}}>Logout</button>
    </>
  )
}

export default Dashboard
