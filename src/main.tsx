import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// IMPORTS
import './main.scss'

// VIEWS
import { Home } from './views/Home/Home'
import Login from './views/Auth/Login/Login'
import Register from './views/Auth/Register/Register'
import ForgotPassword from './views/Auth/Forgot-password/Forgot-password'
import ResetPassword from './views/Auth/Reset-password/Reset-password'
import User from './views/User/User'
import EditUser from './views/User/Edit-user/Edit-user'
import DeleteUser from './views/User/Delete-user/Delete-user'
import ChangePassword from './views/User/Change-password/Change-password'
import SiteMap from './views/SiteMap/SiteMap'
import { NotFound } from './views/NotFound'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* User Routes */}
        <Route path="/user" element={<User />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/delete-user" element={<DeleteUser />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
        {/* Other Routes */}
        <Route path="/mapa-del-sitio" element={<SiteMap />} />
  
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
