import { Navigate, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import { useEffect, useState } from 'react'
import Pagenotfound from './Pages/Pagenotfound'

function App() {
  const token = localStorage.getItem("ai_application_token");
  const role = localStorage.getItem("ai_application_role");

  return (
      <Routes>
         <Route path='/' element={ token ? <Navigate to={"/dashboard"} replace/> : <Register/> } />
         <Route path='/dashboard' element={token ? <Dashboard/> : <Navigate to={"/"} replace/>} />
         <Route path='*'  element={<Pagenotfound/>} />
      </Routes>
  )
}

export default App