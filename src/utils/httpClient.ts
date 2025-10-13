// Cliente HTTP para realizar peticiones al backend
import { API_BASE_URL } from './constants'


  class HttpClient {
    baseURL: string;
  
    constructor() {
      this.baseURL = API_BASE_URL;
    }
  
    public async request(endpoint: string, options: RequestInit = {}): Promise<any> {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      };
  
      // Agregar token de autenticación si existe
      const token = localStorage.getItem('authToken');
      if (token && config.headers && typeof config.headers === 'object') {
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
  
      try {
        const response = await fetch(url, config);
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error en petición HTTP:', error);
        throw error;
      }
    }
  
    public get(endpoint: string): Promise<any> {
      return this.request(endpoint, { method: 'GET' });
    }
  
    public post(endpoint: string, data: any): Promise<any> {
      return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
      });
    }
  
    public put(endpoint: string, data: any): Promise<any> {
      return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  
    public delete(endpoint: string): Promise<any> {
      return this.request(endpoint, { method: 'DELETE' });
    }
  }

export const httpClient = new HttpClient()