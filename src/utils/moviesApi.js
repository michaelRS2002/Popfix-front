// Funciones para obtener y manejar películas
import { httpClient } from './httpClient.js'
import { API_ENDPOINTS, APP_CONFIG } from './constants.js'

// Obtener películas populares
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.POPULAR_MOVIES}?page=${page}`)
    return response
  } catch (error) {
    throw new Error('Error al obtener películas populares: ' + error.message)
  }
}

// Obtener películas en tendencia
export const getTrendingMovies = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TRENDING_MOVIES)
    return response
  } catch (error) {
    throw new Error('Error al obtener películas en tendencia: ' + error.message)
  }
}

// Buscar películas por título
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.SEARCH_MOVIES}?q=${encodeURIComponent(query)}&page=${page}`)
    return response
  } catch (error) {
    throw new Error('Error al buscar películas: ' + error.message)
  }
}

// Obtener detalles de una película específica
export const getMovieDetails = async (movieId) => {
  try {
    const endpoint = API_ENDPOINTS.MOVIE_DETAILS.replace(':id', movieId)
    const response = await httpClient.get(endpoint)
    return response
  } catch (error) {
    throw new Error('Error al obtener detalles de la película: ' + error.message)
  }
}

// Obtener todas las películas (con paginación)
export const getAllMovies = async (page = 1) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.MOVIES}?page=${page}&limit=${APP_CONFIG.MOVIES_PER_PAGE}`)
    return response
  } catch (error) {
    throw new Error('Error al obtener películas: ' + error.message)
  }
}

// Agregar película a favoritos
export const addToFavorites = async (movieId) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.USER_FAVORITES, { movieId })
    return response
  } catch (error) {
    throw new Error('Error al agregar a favoritos: ' + error.message)
  }
}

// Obtener películas favoritas del usuario
export const getUserFavorites = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.USER_FAVORITES)
    return response
  } catch (error) {
    throw new Error('Error al obtener favoritos: ' + error.message)
  }
}

// Función helper para construir URL de imagen
export const getImageUrl = (imagePath, size = 'w500') => {
  if (!imagePath) return '/placeholder-movie.jpg'
  return `${APP_CONFIG.IMAGE_BASE_URL.replace('w500', size)}${imagePath}`
}