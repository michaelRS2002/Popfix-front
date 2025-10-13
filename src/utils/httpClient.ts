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
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
          let backendMessage = '';
          let data: any = undefined;
          try {
            if (contentType.includes('application/json')) {
              data = await response.json();
              backendMessage =
                (data && (data.message || data.error || (Array.isArray(data.errors) ? data.errors[0]?.msg : ''))) || '';
            } else {
              backendMessage = await response.text();
            }
          } catch (_) {
            // ignore parse errors
          }
          const err: any = new Error(backendMessage || `HTTP Error: ${response.status}`);
          err.status = response.status;
          if (data !== undefined) err.data = data;
          throw err;
        }

        // 204 No Content
        if (response.status === 204) {
          return null;
        }

        if (contentType.includes('application/json')) {
          return await response.json();
        }
        return await response.text();
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