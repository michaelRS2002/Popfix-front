// Funciones para la autenticación de usuarios
import { httpClient } from './httpClient';
import { API_ENDPOINTS } from './constants';

// Tipos para credenciales y usuario
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface User {
	id: string;
	email: string;
	username?: string;
	[key: string]: any;
}

export interface LoginResponse {
	token: string;
	user: User;
}

// Función para hacer login
export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
	try {
		const response = await httpClient.post(API_ENDPOINTS.LOGIN, credentials);
		// Guardar token y usuario en localStorage
		if (response.token) {
			localStorage.setItem('authToken', response.token);
			localStorage.setItem('user', JSON.stringify(response.user));
		}
		return response;
	} catch (error: any) {
		throw new Error('Error al iniciar sesión: ' + (error.message || ''));
	}
};

// Función para registrar usuario
export const registerUser = async (userData: { name: string; email: string; age: number; password: string }): Promise<any> => {
	try {
		const response = await httpClient.post(API_ENDPOINTS.REGISTER, userData);
		return response;
	} catch (error: any) {
		throw new Error('Error al registrar usuario: ' + (error.message || ''));
	}
};

// Función para hacer logout
export const logoutUser = async (): Promise<boolean> => {
	try {
		await httpClient.post(API_ENDPOINTS.LOGOUT, {});
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		return true;
	} catch (error: any) {
		// Aún si falla el logout en el server, limpiamos local
		localStorage.removeItem('authToken');
		localStorage.removeItem('user');
		throw new Error('Error al cerrar sesión: ' + (error.message || ''));
	}
};

// Verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
	const token = localStorage.getItem('authToken');
	return !!token;
};

// Obtener datos del usuario actual
export const getCurrentUser = (): User | null => {
	const user = localStorage.getItem('user');
	return user ? JSON.parse(user) : null;
};
