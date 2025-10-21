import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileScreen.scss'
import { 
  AiFillClockCircle,
  AiFillTrophy,
  AiFillVideoCamera,
  AiFillSetting
} from 'react-icons/ai'
import { CiHeart, CiStar } from 'react-icons/ci'
import { IoArrowBack } from 'react-icons/io5'
import { LuUser } from 'react-icons/lu'

interface Movie {
  id: number
  title: string
  rating: number
  genre: string
  poster: string
  duration: string
  addedDate: string
}

export function ProfileScreen() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'favoritos' | 'historial' | 'valoraciones' | 'logros'>('favoritos')

  // Mock user data - Delete when connected to User - Backend
  const userData = {
    name: 'Juanito Alcachofa',
    bio: 'Amante del cine y las series de televisión. Miembro desde Septiembre 2024',
    stats: {
      moviesWatched: 47,
      hoursWatched: '98h',
      averageRating: 4.2,
      favoriteGenre: 'Thriller'
    }
  }

  // Mock favorite movies - Delete when connected to Backend
  const favoriteMovies: Movie[] = [
    {
      id: 1,
      title: 'Película 1',
      rating: 5,
      genre: 'Acción',
      poster: '/static/img/placeholder.jpg',
      duration: '2h 14m',
      addedDate: '16 de Octubre 2024'
    },
    {
      id: 2,
      title: 'Película 2',
      rating: 4.5,
      genre: 'Drama',
      poster: '/static/img/placeholder.jpg',
      duration: '1h 58m',
      addedDate: '12 de Octubre 2024'
    },
    {
      id: 3,
      title: 'Película 3',
      rating: 5,
      genre: 'Thriller',
      poster: '/static/img/placeholder.jpg',
      duration: '2h 05m',
      addedDate: '08 de Octubre 2024'
    },
    {
      id: 4,
      title: 'Película 4',
      rating: 4,
      genre: 'Ciencia Ficción',
      poster: '/static/img/placeholder.jpg',
      duration: '2h 30m',
      addedDate: '03 de Octubre 2024'
    }
  ]

  const handleEditProfile = () => {
    navigate('/edit-user')
  }

  const handleBackToCatalog = () => {
    navigate('/')
  }

  return (
    <div className="ProfileScreen">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <button className="back-button" onClick={handleBackToCatalog}>
            <IoArrowBack />
            <span>Volver al Catálogo</span>
          </button>
          <button className="edit-button" onClick={handleEditProfile}>
            <AiFillSetting />
            <span>Editar Perfil</span>
          </button>
        </div>

        {/* Main Content - Horizontal Layout */}
        <div className="profile-main-content">
          {/* Profile Info Card */}
          <div className="profile-info-card">
            <div className="profile-avatar">
              <LuUser />
            </div>
            
            <div className="profile-details">
              <h1>{userData.name}</h1>
              <p className="profile-bio">{userData.bio}</p>

              {/* Stats - Horizontal Row */}
              <div className="profile-stats">
                <div className="stat-item">
                  <AiFillVideoCamera />
                  <div className="stat-content">
                    <span className="stat-number">{userData.stats.moviesWatched}</span>
                    <span className="stat-label">Películas vistas</span>
                  </div>
                </div>

                <div className="stat-item">
                  <AiFillClockCircle />
                  <div className="stat-content">
                    <span className="stat-number">{userData.stats.hoursWatched}</span>
                    <span className="stat-label">Horas vistas</span>
                  </div>
                </div>

                <div className="stat-item stat-rating">
                  <CiStar />
                  <div className="stat-content">
                    <span className="stat-number">{userData.stats.averageRating}</span>
                    <span className="stat-label">Rating promedio</span>
                  </div>
                </div>

                <div className="stat-item stat-favorites">
                  <CiHeart />
                  <div className="stat-content">
                    <span className="stat-number">{favoriteMovies.length}</span>
                    <span className="stat-label">Favoritos</span>
                  </div>
                </div>

                <div className="stat-item favorite-genre">
                  <AiFillTrophy />
                  <div className="stat-content">
                    <span className="stat-number">{userData.stats.favoriteGenre}</span>
                    <span className="stat-label">Género Favorito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs and Content */}
          <div className="profile-content-wrapper">
            {/* Tabs */}
            <div className="profile-tabs">
              <button 
                className={`tab-button ${activeTab === 'favoritos' ? 'active' : ''}`}
                onClick={() => setActiveTab('favoritos')}
              >
                Favoritos
              </button>
              <button 
                className={`tab-button ${activeTab === 'historial' ? 'active' : ''}`}
                onClick={() => setActiveTab('historial')}
              >
                Historial
              </button>
              <button 
                className={`tab-button ${activeTab === 'valoraciones' ? 'active' : ''}`}
                onClick={() => setActiveTab('valoraciones')}
              >
                Valoraciones
              </button>
              <button 
                className={`tab-button ${activeTab === 'logros' ? 'active' : ''}`}
                onClick={() => setActiveTab('logros')}
              >
                Logros
              </button>
            </div>

            {/* Content Section */}
            <div className="profile-content">
          {activeTab === 'favoritos' && (
            <div className="favorites-section">
              <div className="section-header">
                <CiHeart className="section-icon" />
                <div>
                  <h2>Mis Películas Favoritas</h2>
                  <p>Películas que has marcado como favoritas</p>
                </div>
              </div>

              <div className="movies-grid">
                {favoriteMovies.map((movie) => (
                  <div 
                    key={movie.id}
                    className="movie-card"
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <div className="movie-poster">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      <div className="movie-rating-badge">
                        {[...Array(5)].map((_, i) => (
                          <CiStar 
                            key={i}
                            className={i < movie.rating ? 'filled' : 'empty'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="movie-info">
                      <h3>{movie.title}</h3>
                      <span className="movie-genre">{movie.genre}</span>
                      <div className="movie-meta">
                        <span className="movie-duration">
                          <AiFillClockCircle />
                          {movie.duration}
                        </span>
                      </div>
                      <p className="movie-added">Añadida: {movie.addedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'historial' && (
            <div className="empty-state">
              <AiFillClockCircle />
              <h3>Historial de Visualización</h3>
              <p>Aquí aparecerán las películas que hayas visto recientemente</p>
            </div>
          )}

          {activeTab === 'valoraciones' && (
            <div className="empty-state">
              <CiStar />
              <h3>Tus Valoraciones</h3>
              <p>Aquí aparecerán todas las películas que hayas valorado</p>
            </div>
          )}

          {activeTab === 'logros' && (
            <div className="empty-state">
              <AiFillTrophy />
              <h3>Logros Desbloqueados</h3>
              <p>Completa desafíos y obtén logros por tu actividad en la plataforma</p>
            </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}
