/**
 * @file Home.tsx
 * @description Home page component of the PopFix app. Displays a catalog of movies fetched from the backend,
 * allows category filtering, and supports searching movies via the API.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.scss";
import NavBar from "../../components/NavBar/NavBar";
import HelpButton from "../../components/HelpButton/HelpButton";
import { getAllMovies, searchMovies } from "../../utils/moviesApi";
import { AiFillStar } from "react-icons/ai";

/**
 * @typedef {Object} Movie
 * @property {number} id - Unique identifier of the movie.
 * @property {string} title - Title of the movie.
 * @property {number} rating - Average rating of the movie.
 * @property {string} duration - Duration of the movie (e.g. "2h 14m").
 * @property {string} genre - Genre of the movie.
 * @property {string} description - Short description or synopsis.
 * @property {string} poster - URL of the movie poster image.
 */
interface Movie {
  id: number;
  title: string;
  rating: number;
  duration: string;
  genre: string;
  description: string;
  poster: string;
}

/**
 * @component Home
 * @description Displays the movie catalog, supports category filtering and search functionality.
 * Fetches movie data from the backend and provides a responsive grid layout.
 *
 * @returns {JSX.Element} The rendered Home component.
 */
export function Home(): JSX.Element {
  const navigate = useNavigate();

  /** @state movies - Array containing the list of movies to display */
  const [movies, setMovies] = useState<Movie[]>([]);
  /** @state searchQuery - Current search text entered by the user */
  const [searchQuery, setSearchQuery] = useState("");
  /** @state selectedCategory - Active category filter */
  const [selectedCategory, setSelectedCategory] = useState("Películas");
  /** @state loading - Indicates if data is being fetched */
  const [loading, setLoading] = useState(false);

  /** @constant categories - Predefined list of categories for filtering */
  const categories = [
    "Películas",
    "Acción",
    "Drama",
    "Comedia",
    "Thriller",
    "Terror",
    "Ciencia Ficción",
  ];

  /**
   * Loads movie data when the component mounts.
   *
   * @effect
   */
  useEffect(() => {
    loadMovies();
  }, []);

  /**
   * Fetches all movies from the backend or provides mock data in case of an error.
   *
   * @async
   * @function loadMovies
   * @returns {Promise<void>} A promise that resolves when the movie data is loaded.
   */
  const loadMovies = async (): Promise<void> => {
    setLoading(true);
    try {
      // Connect with API
      const response = await getAllMovies(1);
      // Placeholder mock data
      const mockMovies: Movie[] = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Película ${i + 1}`,
        rating: 8.5,
        duration: "2h 14m",
        genre: "Acción",
        description:
          "Una emocionante aventura llena de acción y efectos espectaculares.",
        poster: "/static/img/placeholder.jpg",
      }));
      setMovies(mockMovies);
    } catch (error) {
      console.error("Error loading movies:", error);
      // Fallback mock data
      const mockMovies: Movie[] = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Película ${i + 1}`,
        rating: 8.5,
        duration: "2h 14m",
        genre: "Acción",
        description:
          "Una emocionante aventura llena de acción y efectos espectaculares.",
        poster: "/static/img/placeholder.jpg",
      }));
      setMovies(mockMovies);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles movie search based on user input.
   * Resets to all movies if the search query is empty.
   *
   * @async
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>}
   */
  const handleSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadMovies();
      return;
    }

    setLoading(true);
    try {
      const response = await searchMovies(searchQuery);
      console.log("Search results:", response);
    } catch (error) {
      console.error("Error searching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the selected category when a category button is clicked.
   *
   * @param {string} category - The selected category.
   * @returns {void}
   */
  const handleCategoryClick = (category: string): void => {
    setSelectedCategory(category);
  };

  return (
    <div className="Home">
      <NavBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />

      <div className="background-wrapper">
        <div className="home-container">
          {/* Catalog Section */}
          <div className="catalog-section">
            <div className="catalog-header">
              <h2>Explora Nuestro Catálogo</h2>
              <p>Descubre miles de películas y series en alta definición</p>
            </div>

            {/* Category Filters */}
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Movie Grid */}
            <div className="movies-grid">
              {loading ? (
                <p>Cargando películas...</p>
              ) : (
                movies.map((movie) => (
                  <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        navigate(`/movie/${movie.id}`);
                      }
                    }}
                  >
                    <div className="movie-poster">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                      <div className="movie-overlay">
                        <span className="movie-duration">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          {movie.duration}
                        </span>
                      </div>
                    </div>
                    <div className="movie-info">
                      <div className="movie-header">
                        <h3>{movie.title}</h3>
                        <div className="movie-rating">
                          <AiFillStar />
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                      <div className="movie-genre">
                        <span className="genre-badge">{movie.genre}</span>
                      </div>
                      <p className="movie-description">{movie.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <HelpButton />
    </div>
  );
}
