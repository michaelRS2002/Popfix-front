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

// Función para solicitar recuperación de contraseña
export const forgotPassword = async (payload: { email: string }): Promise<any> => {
	try {
		const response = await httpClient.post(API_ENDPOINTS.FORGOT_PASSWORD, payload);
		return response;
	} catch (error: any) {
		throw new Error('Error al solicitar recuperación: ' + (error.message || ''));
	}
};


// Función para restablecer contraseña
export const resetPassword = async (payload: { token: string; newPassword: string }): Promise<any> => {
	try {
		const response = await httpClient.post('/auth/reset-password', payload);
		return response;
	} catch (error: any) {
		throw new Error('Error al restablecer contraseña: ' + (error.message || ''));
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

// Función para obtener usuario por ID desde el backend
export const getUserById = async (userId: string): Promise<User> => {
	try {
		const response = await httpClient.get(`/users/${userId}`);
		// Actualizar localStorage con datos frescos
		if (response) {
			const currentUser = getCurrentUser();
			if (currentUser && currentUser.id === userId) {
				localStorage.setItem('user', JSON.stringify(response));
			}
		}
		return response;
	} catch (error: any) {
		throw new Error('Error al obtener usuario: ' + (error.message || ''));
	}
};

// Función para actualizar usuario por ID
export const updateUserById = async (userId: string, updates: any): Promise<User> => {
	try {
		const response = await httpClient.put(`/users/${userId}`, updates);
		// Actualiza localStorage si es el usuario actual
		const currentUser = getCurrentUser();
		if (currentUser && currentUser.id === userId) {
			localStorage.setItem('user', JSON.stringify(response));
		}
		return response;
	} catch (error: any) {
		throw new Error('Error al actualizar usuario: ' + (error.message || ''));
	}
};

// Función para eliminar usuario por ID
export const deleteUserById = async (userId: string): Promise<void> => {
	try {
		await httpClient.delete(`/users/${userId}`);
		// Limpia localStorage si el usuario eliminado es el actual
		const currentUser = getCurrentUser();
		if (currentUser && currentUser.id === userId) {
			localStorage.removeItem('authToken');
			localStorage.removeItem('user');
		}
	} catch (error: any) {
		throw new Error('Error al eliminar usuario: ' + (error.message || ''));
	}
};
