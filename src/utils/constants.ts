// PopFix application configuration and constants

/**
 * Base URL for the API.
 * Replace this value with your backend URL if needed.
 * @constant {string}
 */
export const API_BASE_URL = "https://popfix-back.onrender.com/api";

/**
 * API endpoint definitions for different functionalities.
 * @constant
 * @type {Object}
 * @property {string} LOGIN - Endpoint for user login.
 * @property {string} REGISTER - Endpoint for user registration.
 * @property {string} FORGOT_PASSWORD - Endpoint for password recovery.
 * @property {string} LOGOUT - Endpoint for logging out the user.
 * @property {string} MOVIES - Endpoint for listing or managing movies.
 * @property {string} MOVIE_DETAILS - Endpoint for fetching movie details by ID.
 * @property {string} SEARCH_MOVIES - Endpoint for searching movies.
 * @property {string} POPULAR_MOVIES - Endpoint for fetching popular movies.
 * @property {string} TRENDING_MOVIES - Endpoint for fetching trending movies.
 * @property {string} USER_PROFILE - Endpoint for getting user profile information.
 * @property {string} USER_FAVORITES - Endpoint for getting user's favorite movies.
 */
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/users/login",
  REGISTER: "/users/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  LOGOUT: "/logout",

  // Movies
  MOVIES: "/movies",
  MOVIE_DETAILS: "/movies/:id",
  SEARCH_MOVIES: "/movies/search",
  POPULAR_MOVIES: "/movies/popular",
  TRENDING_MOVIES: "/movies/trending",

  // User
  USER_PROFILE: "/user/profile",
  USER_FAVORITES: "/user/favorites",
};

/**
 * General application configuration constants.
 * @constant
 * @type {Object}
 * @property {string} APP_NAME - Name of the application.
 * @property {string} DEFAULT_LANGUAGE - Default language of the app (ISO code).
 * @property {number} MOVIES_PER_PAGE - Number of movies to display per page.
 * @property {string} IMAGE_BASE_URL - Base URL for movie poster images.
 */
export const APP_CONFIG = {
  APP_NAME: "PopFix",
  DEFAULT_LANGUAGE: "es",
  MOVIES_PER_PAGE: 20,
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500", // For movie images
};
