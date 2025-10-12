// Funciones para la autenticación de usuarios
import { httpClient } from './httpClient.js'
import { API_ENDPOINTS } from './constants.js'

// Función para hacer login
export const loginUser = async (credentials) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.LOGIN, credentials)
    
    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  } catch (error) {
    throw new Error('Error al iniciar sesión: ' + error.message)
  }
}

// Función para registrar usuario
export const registerUser = async (userData) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.REGISTER, userData)
    return response
  } catch (error) {
    throw new Error('Error al registrar usuario: ' + error.message)
  }
}

// Función para hacer logout
export const logoutUser = async () => {
  try {
    await httpClient.post(API_ENDPOINTS.LOGOUT)
    
    // Limpiar localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    return true
  } catch (error) {
    // Aún si falla el logout en el server, limpiamos local
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    throw new Error('Error al cerrar sesión: ' + error.message)
  }
}

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken')
  return !!token
}

// Obtener datos del usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}