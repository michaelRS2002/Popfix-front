// Functions to fetch and handle movie-related data
import { httpClient } from "./httpClient.js";
import { API_ENDPOINTS, APP_CONFIG } from "./constants.js";

/**
 * Fetches a list of popular movies from the backend API.
 *
 * @async
 * @function getPopularMovies
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<any>} The API response containing a list of popular movies.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await httpClient.get(
      `${API_ENDPOINTS.POPULAR_MOVIES}?page=${page}`
    );
    return response;
  } catch (error) {
    throw new Error("Error fetching popular movies: " + error.message);
  }
};

/**
 * Fetches trending movies from the backend API.
 *
 * @async
 * @function getTrendingMovies
 * @returns {Promise<any>} The API response containing trending movies.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const getTrendingMovies = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.TRENDING_MOVIES);
    return response;
  } catch (error) {
    throw new Error("Error fetching trending movies: " + error.message);
  }
};

/**
 * Searches for movies by title.
 *
 * @async
 * @function searchMovies
 * @param {string} query - The search query or movie title.
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<any>} The API response containing the search results.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await httpClient.get(
      `${API_ENDPOINTS.SEARCH_MOVIES}?q=${encodeURIComponent(
        query
      )}&page=${page}`
    );
    return response;
  } catch (error) {
    throw new Error("Error searching for movies: " + error.message);
  }
};

/**
 * Fetches detailed information for a specific movie by its ID.
 *
 * @async
 * @function getMovieDetails
 * @param {string|number} movieId - The ID of the movie to fetch details for.
 * @returns {Promise<any>} The API response containing movie details.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const getMovieDetails = async (movieId) => {
  try {
    const endpoint = API_ENDPOINTS.MOVIE_DETAILS.replace(":id", movieId);
    const response = await httpClient.get(endpoint);
    return response;
  } catch (error) {
    throw new Error("Error fetching movie details: " + error.message);
  }
};

/**
 * Fetches all movies from the backend with pagination support.
 *
 * @async
 * @function getAllMovies
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<any>} The API response containing the list of movies.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const getAllMovies = async (page = 1) => {
  try {
    const response = await httpClient.get(
      `${API_ENDPOINTS.MOVIES}?page=${page}&limit=${APP_CONFIG.MOVIES_PER_PAGE}`
    );
    return response;
  } catch (error) {
    throw new Error("Error fetching movies: " + error.message);
  }
};

/**
 * Adds a movie to the user's list of favorites.
 *
 * @async
 * @function addToFavorites
 * @param {string|number} movieId - The ID of the movie to add to favorites.
 * @returns {Promise<any>} The API response confirming the addition.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const addToFavorites = async (movieId) => {
  try {
    const response = await httpClient.post(API_ENDPOINTS.USER_FAVORITES, {
      movieId,
    });
    return response;
  } catch (error) {
    throw new Error("Error adding to favorites: " + error.message);
  }
};

/**
 * Fetches the current user's favorite movies.
 *
 * @async
 * @function getUserFavorites
 * @returns {Promise<any>} The API response containing the user's favorite movies.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const getUserFavorites = async () => {
  try {
    const response = await httpClient.get(API_ENDPOINTS.USER_FAVORITES);
    return response;
  } catch (error) {
    throw new Error("Error fetching favorites: " + error.message);
  }
};

/**
 * Helper function to construct a full movie image URL.
 * Returns a placeholder if the image path is missing.
 *
 * @function getImageUrl
 * @param {string} imagePath - The image path provided by the API.
 * @param {string} [size='w500'] - The desired image size (e.g., 'w200', 'w500', 'original').
 * @returns {string} The complete image URL or a placeholder path.
 */
export const getImageUrl = (imagePath, size = "w500") => {
  if (!imagePath) return "/placeholder-movie.jpg";
  return `${APP_CONFIG.IMAGE_BASE_URL.replace("w500", size)}${imagePath}`;
};
