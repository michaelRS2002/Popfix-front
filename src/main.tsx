import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// IMPORTS
import './main.scss'

// VIEWS
import Landing from './views/Landing/Landing'
import { Home } from './views/Home/Home'
import MovieScreen from './views/MovieScreen/MovieScreen'
import { ProfileScreen } from './views/ProfileScreen/ProfileScreen'
import Login from './views/Auth/Login/Login'
import Register from './views/Auth/Register/Register'
import ForgotPassword from './views/Auth/Forgot-password/Forgot-password'
import ResetPassword from './views/Auth/Reset-password/Reset-password'
import User from './views/User/User'
import EditUser from './views/User/Edit-user/Edit-user'
import DeleteUser from './views/User/Delete-user/Delete-user'
import ChangePassword from './views/User/Change-password/Change-password'
import SiteMap from './views/SiteMap/SiteMap'
import FavScreen from './views/FavScreen/FavScreen'
import { NotFound } from './views/NotFound'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes - No Login Required */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes - Login Required */}
        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/movie/:id" element={<ProtectedRoute element={<MovieScreen />} />} />
        <Route path="/perfil" element={<ProtectedRoute element={<ProfileScreen />} />} />
        <Route path="/user" element={<ProtectedRoute element={<User />} />} />
        <Route path="/edit-user" element={<ProtectedRoute element={<EditUser />} />} />
        <Route path="/delete-user" element={<ProtectedRoute element={<DeleteUser />} />} />
        <Route path="/change-password" element={<ProtectedRoute element={<ChangePassword />} />} />
        <Route path="/mapa-del-sitio" element={<ProtectedRoute element={<SiteMap />} />} />
        <Route path="/favoritos" element={<ProtectedRoute element={<FavScreen />} />} />
  
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
