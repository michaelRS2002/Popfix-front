import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// IMPORTS
import './main.scss'

// VIEWS
import { Home } from './views/Home'
import Login from './views/Auth/Login/Login'
import { NotFound } from './views/NotFound'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      

        {/* Routes Public */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
