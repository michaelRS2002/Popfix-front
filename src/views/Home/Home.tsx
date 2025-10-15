import { useState, useEffect } from 'react'
import './Home.scss'
import NavBar from '../../components/NavBar/NavBar'
import HelpButton from '../../components/HelpButton/HelpButton'
import { getAllMovies, searchMovies } from '../../utils/moviesApi'
import { AiFillStar } from 'react-icons/ai'

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
      // Connect with API -- Back
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
      // Example Data
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
      <NavBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearch}
      />
      
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
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
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
      
      {/* Help Button */}
      <HelpButton />
    </div>
  )
}
