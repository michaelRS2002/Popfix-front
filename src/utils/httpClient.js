// Cliente HTTP para realizar peticiones al backend
import { API_BASE_URL } from './constants.js'

class HttpClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Método genérico para realizar peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error en petición HTTP:', error)
      throw error
    }
  }

  // Métodos específicos
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }
}

export const httpClient = new HttpClient()