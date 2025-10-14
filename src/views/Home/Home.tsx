import { useState, useEffect } from 'react'
import './Home.scss'
import NavBar from '../../components/NavBar'
import { getAllMovies, searchMovies } from '../../utils/moviesApi'

interface Movie {
  id: number
  title: string
  rating: number
  duration: string
  genre: string
  description: string
  poster: string
}

export function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Películas')
  const [loading, setLoading] = useState(false)

  const categories = [
    'Películas',
    'Acción',
    'Drama',
    'Comedia',
    'Thriller',
    'Terror',
    'Ciencia Ficción'
  ]

  useEffect(() => {
    loadMovies()
  }, [])

  const loadMovies = async () => {
    setLoading(true)
    try {
      // Conectar con la API -- Back
      const response = await getAllMovies(1)
      const mockMovies: Movie[] = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Película ${i + 1}`,
        rating: 8.5,
        duration: '2h 14m',
        genre: 'Acción',
        description: 'Una emocionante aventura llena de acción y efectos espectaculares.',
        poster: '/static/img/placeholder.jpg'
      }))
      setMovies(mockMovies)
    } catch (error) {
      console.error('Error loading movies:', error)
      // Datos de Ejemplo
      const mockMovies: Movie[] = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Película ${i + 1}`,
        rating: 8.5,
        duration: '2h 14m',
        genre: 'Acción',
        description: 'Una emocionante aventura llena de acción y efectos espectaculares.',
        poster: '/static/img/placeholder.jpg'
      }))
      setMovies(mockMovies)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadMovies()
      return
    }
    
    setLoading(true)
    try {
      const response = await searchMovies(searchQuery)
      console.log('Search results:', response)
    } catch (error) {
      console.error('Error searching movies:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="Home">
      <NavBar />
      
      <div className="home-container">
        {/* Sección de búsqueda */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Buscar Películas"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-icon" aria-label="Buscar">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
          <button className="user-icon" aria-label="Perfil de usuario">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Sección de catálogo */}
        <div className="catalog-section">
          <div className="catalog-header">
            <h2>Explora Nuestro Catálogo</h2>
            <p>Descubre miles de películas y series en alta definición</p>
          </div>

          {/* Filtros de categoría */}
          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Cuadrícula de películas */}
          <div className="movies-grid">
            {loading ? (
              <p>Cargando películas...</p>
            ) : (
              movies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-poster">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                    <div className="movie-overlay">
                      <span className="movie-duration">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        {movie.duration}
                      </span>
                    </div>
                  </div>
                  <div className="movie-info">
                    <div className="movie-header">
                      <h3>{movie.title}</h3>
                      <div className="movie-rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        </svg>
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
  )
}
