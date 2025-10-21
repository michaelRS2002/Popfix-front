// Configuración y constantes de la aplicación PopFix

// URL base del API (cambia por la URL de tu backend)
export const API_BASE_URL = 'http://localhost:5100/api'

// Endpoints del API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  LOGOUT: '/logout',
  
  // Películas
  MOVIES: '/pexels/popular',
  MOVIE_DETAILS: '/pexels/:id',
  SEARCH_MOVIES: '/pexels/search',
  POPULAR_MOVIES: '/pexels/popular',
  TRENDING_MOVIES: '/pexels/trending',
  // Favoritos y ratings
  MOVIES_FAVORITES: '/movies/favorites/:userId',
  MOVIES_INSERT_FAVORITE_RATING: '/movies/insertFavoriteRating/:userId',
  MOVIES_UPDATE: '/movies/update/:userId',
  
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