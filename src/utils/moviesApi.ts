// Funciones para obtener y manejar películas
import { httpClient } from './httpClient.js'
import { API_ENDPOINTS, APP_CONFIG } from './constants.js'

// Tipos comunes
export type MovieSummary = {
  id: string
  title: string
  thumbnail_url?: string
  genre?: string
  source?: string
}

// Obtener películas populares
export const getPopularMovies = async (page: number = 1) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.POPULAR_MOVIES}?page=${page}`)
    return response
  } catch (error: any) {
    throw new Error('Error al obtener películas populares: ' + (error?.message || ''))
  }
}

// Obtener películas en tendencia
export const getTrendingMovies = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TRENDING_MOVIES)
    return response
  } catch (error: any) {
    throw new Error('Error al obtener películas en tendencia: ' + (error?.message || ''))
  }
}

// Buscar películas por título
export const searchMovies = async (query: string, page: number = 1) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.SEARCH_MOVIES}?q=${encodeURIComponent(query)}&page=${page}`)
    return response
  } catch (error: any) {
    throw new Error('Error al buscar películas: ' + (error?.message || ''))
  }
}

// Obtener detalles de una película específica
export const getMovieDetails = async (movieId: string) => {
  try {
    const endpoint = API_ENDPOINTS.MOVIE_DETAILS.replace(':id', encodeURIComponent(movieId))
    const response = await httpClient.get(endpoint)
    return response
  } catch (error: any) {
    throw new Error('Error al obtener detalles de la película: ' + (error?.message || ''))
  }
}

// Obtener todas las películas (con paginación)
export const getAllMovies = async (page: number = 1) => {
  try {
    const response = await httpClient.get(`${API_ENDPOINTS.MOVIES}?page=${page}&limit=${APP_CONFIG.MOVIES_PER_PAGE}`)
    return response
  } catch (error: any) {
    throw new Error('Error al obtener películas: ' + (error?.message || ''))
  }
}

// ===================== FAVORITOS Y RATINGS (BACK /api/movies) =====================
export type InsertFavoriteOrRatingPayload = {
  movieId: string
  favorite?: boolean | null
  rating?: number | null
  title?: string
  thumbnail_url?: string
  genre?: string
  source?: string
}

export type UpdateUserMoviePayload = {
  movieId: string
  is_favorite?: boolean | null
  rating?: number | null
}

// Validar rating en cliente (1..5)
const validateRating = (rating?: number) => {
  if (rating == null) return
  const n = Number(rating)
  if (Number.isNaN(n) || n < 1 || n > 5) {
    throw new Error('El rating debe estar entre 1 y 5')
  }
}

// GET /api/movies/favorites/:userId
export const getFavorites = async (userId: string) => {
  if (!userId) throw new Error('userId es requerido')
  try {
    const endpoint = API_ENDPOINTS.MOVIES_FAVORITES.replace(':userId', encodeURIComponent(userId))
    const response = await httpClient.get(endpoint)
    return response as Array<{ movie_id: string; movies: MovieSummary }>
  } catch (error: any) {
    throw new Error(error?.message || 'Error al obtener favoritos')
  }
}

// POST /api/movies/insertFavoriteRating/:userId
export const insertFavoriteOrRating = async (userId: string, payload: InsertFavoriteOrRatingPayload) => {
  if (!userId) throw new Error('userId es requerido')
  if (!payload || !payload.movieId) throw new Error('movieId es requerido')
  validateRating(payload.rating ?? undefined)
  try {
    const endpoint = API_ENDPOINTS.MOVIES_INSERT_FAVORITE_RATING.replace(':userId', encodeURIComponent(userId))
    const response = await httpClient.post(endpoint, payload)
    return response // { message, data: UserMovie[] }
  } catch (error: any) {
    throw new Error(error?.message || 'Error al insertar favorito/rating')
  }
}

// PUT /api/movies/update/:userId
export const updateUserMovie = async (userId: string, payload: UpdateUserMoviePayload) => {
  if (!userId) throw new Error('userId es requerido')
  if (!payload || !payload.movieId) throw new Error('movieId es requerido')
  validateRating(payload.rating ?? undefined)
  try {
    const endpoint = API_ENDPOINTS.MOVIES_UPDATE.replace(':userId', encodeURIComponent(userId))
    const response = await httpClient.put(endpoint, payload)
    return response // { message, data: UserMovie }
  } catch (error: any) {
    throw new Error(error?.message || 'Error al actualizar favorito/rating')
  }
}

// Función helper para construir URL de imagen
export const getImageUrl = (imagePath: string | null | undefined, size: string = 'w500'): string => {
  if (!imagePath) return '/placeholder-movie.jpg'
  return `${APP_CONFIG.IMAGE_BASE_URL.replace('w500', size)}${imagePath}`
}

// ===================== Adaptadores PEXELS -> Home =====================
// Tipos mínimos de Pexels (lo que solemos usar)
type PexelsVideoFile = {
  id?: number
  quality?: string
  link?: string
  width?: number
  height?: number
}

type PexelsUser = {
  name?: string
}

type PexelsVideo = {
  id: number
  image?: string
  duration?: number
  url?: string
  user?: PexelsUser
  video_files?: PexelsVideoFile[]
}

type PexelsResponse = {
  page?: number
  per_page?: number
  total_results?: number
  videos?: PexelsVideo[]
} | PexelsVideo[]

// Tipo esperado por Home
export type HomeMovie = {
  id: number
  title: string
  rating: number
  duration: string
  genre: string
  description: string
  poster: string
  isFavorite?: boolean
  source?: string
}

const secondsToHhMm = (seconds?: number): string => {
  if (seconds == null || Number.isNaN(seconds)) return ''
  const s = Math.max(0, Math.floor(seconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m`
  return `${sec}s`
}

const mapPexelsToHomeMovies = (data: PexelsResponse): HomeMovie[] => {
  const list: PexelsVideo[] = Array.isArray(data) ? data : (data?.videos || [])
  const pickBestSource = (files?: PexelsVideoFile[]): string | undefined => {
    if (!files || files.length === 0) return undefined
    // Prefer highest width; fallback to first
    const sorted = [...files].sort((a, b) => (b.width || 0) - (a.width || 0))
    return sorted[0]?.link
  }
  return list.map((v) => ({
    id: v.id,
    title: v.user?.name ? `Video ${v.id} by ${v.user.name}` : `Video ${v.id}`,
    rating: 0, // Usa 0 para no romper el UI que espera número
    duration: secondsToHhMm(v.duration),
    genre: 'Video', // Se puede sobreescribir por el llamador
    description: v.url || 'Video de Pexels',
    poster: v.image || '/static/img/placeholder.jpg',
    source: pickBestSource(v.video_files),
  }))
}

// Devuelve películas para Home usando endpoints /pexels
export const getPexelsPopularForHome = async (page: number = 1): Promise<HomeMovie[]> => {
  const res = await httpClient.get(`${API_ENDPOINTS.POPULAR_MOVIES}?page=${page}`)
  return mapPexelsToHomeMovies(res as PexelsResponse).map(m => ({ ...m, genre: 'Popular' }))
}

export const searchPexelsForHome = async (query: string, page: number = 1): Promise<HomeMovie[]> => {
  const res = await httpClient.get(`${API_ENDPOINTS.SEARCH_MOVIES}?q=${encodeURIComponent(query)}&page=${page}`)
  return mapPexelsToHomeMovies(res as PexelsResponse)
}
