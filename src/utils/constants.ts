// Configuración y constantes de la aplicación PopFix

// URL base del API (cambia por la URL de tu backend)
export const API_BASE_URL = 'https://popfix-back-axaj.onrender.com/api'

// Endpoints del API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  LOGOUT: '/logout',
  
  // Películas
  MOVIES: '/movies',
  MOVIE_DETAILS: '/movies/:id',
  SEARCH_MOVIES: '/movies/search',
  POPULAR_MOVIES: '/movies/popular',
  TRENDING_MOVIES: '/movies/trending',
  
  // Usuario
  USER_PROFILE: '/user/profile',
  USER_FAVORITES: '/user/favorites'
}

// Configuración de la aplicación
export const APP_CONFIG = {
  APP_NAME: 'PopFix',
  DEFAULT_LANGUAGE: 'es',
  MOVIES_PER_PAGE: 20,
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500' // Para imágenes de películas
}