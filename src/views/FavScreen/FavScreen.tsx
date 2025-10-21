import React, { useState, useEffect } from 'react';
import './FavScreen.scss';
import { IoArrowBack, IoSearchOutline } from 'react-icons/io5';
import { CiHeart } from "react-icons/ci";
import { MdFilterList, MdCalendarToday, MdDelete } from 'react-icons/md';
import { BiPlay } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { getFavorites, updateUserMovie } from '../../utils/moviesApi';
import NavBar from '../../components/NavBar/NavBar';
import HelpButton from '../../components/HelpButton/HelpButton';

interface Movie {
  id: string | number;
  title: string;
  poster: string;
  rating: number;
  duration: string;
  genre: string;
  addedDate?: string;
  userRating?: number;
  source?: string;
}

const FavScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [genreFilter, setGenreFilter] = useState('Todos los gen');
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
      // Obtener userId del localStorage - viene dentro del objeto 'user'
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          if (user.id) {
            setUserId(user.id)
            loadFavorites(user.id)
          } else {
            alert('Por favor inicia sesión para ver tus favoritos')
            navigate('/login')
          }
        } catch (e) {
          console.error('Error parsing user:', e)
          navigate('/login')
        }
      } else {
        alert('Por favor inicia sesión para ver tus favoritos')
        navigate('/login')
      }
    }, [navigate]);

    // Función para formatear segundos a "Xm Ys"
    const formatDurationFromSeconds = (durationValue: any): string => {
      // Si ya está formateado (string con m/h/s), devolverlo
      if (typeof durationValue === 'string' && /^\d+[mhs]/.test(durationValue)) {
        return durationValue;
      }
      
      // Si es número (segundos), formatear
      const seconds = Number(durationValue) || 0;
      if (seconds === 0) return '5m';
      
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (minutes === 0) {
        return `${remainingSeconds}s`;
      } else if (remainingSeconds === 0) {
        return `${minutes}m`;
      } else {
        return `${minutes}m ${remainingSeconds}s`;
      }
    };

    const loadFavorites = async (userId: string) => {
      setLoading(true);
      try {
        const favs = await getFavorites(userId);
        console.log('Favoritos recibidos del backend (estructura completa):', favs); // Debug
        
        // Recuperar duraciones guardadas en localStorage
        const favoriteDurations = JSON.parse(localStorage.getItem('favoriteDurations') || '{}');
        
        // Aplanar la respuesta y buscar rating en todos los posibles niveles
        const flatMovies = favs.map((fav: any) => {
          // Estructura esperada: { movie_id, movies: {..., rating?}, rating?, duration? }
          const movieData = fav.movies || fav;
          
          // Buscar rating en múltiples lugares
          let movieRating = 0;
          if (fav.rating !== undefined && fav.rating !== null) {
            movieRating = fav.rating; // Rating a nivel user_movie
          } else if (movieData.rating !== undefined && movieData.rating !== null) {
            movieRating = movieData.rating; // Rating a nivel movies
          }
          
          // Usar duration: primero intenta backend, luego localStorage, luego default
          // Formatear si viene en segundos
          const duration = formatDurationFromSeconds(
            fav.duration || 
            favoriteDurations[String(movieData.id)] || 
            movieData.duration
          );
          
          console.log(`📺 Película: "${movieData.title}"`, {
            id: movieData.id,
            userMovieRating: fav.rating,
            movieTableRating: movieData.rating,
            finalRating: movieRating,
            source: movieData.source,
            duration: duration,
            rawDuration: fav.duration,
            hasBackendDuration: !!fav.duration,
            hasLocalStorageDuration: !!favoriteDurations[String(movieData.id)],
            allKeys: Object.keys(fav)
          });
          
          return {
            id: movieData.id,
            title: movieData.title || 'Sin título',
            poster: movieData.thumbnail_url || movieData.poster || 'https://via.placeholder.com/300x450',
            rating: Number(movieRating) || 0,
            duration: duration || '5m',
            genre: movieData.genre || 'Video',
            addedDate: new Date().toLocaleDateString('es-ES'),
            userRating: 0,
            source: movieData.source || movieData.video_url || movieData.url || ''
          };
        });
        
        console.log('✅ Películas mapeadas finales:', flatMovies);
        setMovies(flatMovies);
      } catch (error) {
        console.error('Error loading favorites:', error);
        showToast('Error al cargar favoritos', 'error');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    };

    // Filtrado: por búsqueda y por género
    const filteredMovies = movies.filter(m => {
      const matchesSearch = !searchQuery.trim() || 
        m.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesGenre = genreFilter === 'Todos los gen' || 
        m.genre.toLowerCase() === genreFilter.toLowerCase();
      return matchesSearch && matchesGenre;
    });

    const handleBack = () => {
        navigate('/');
    };

    const handleRemoveFavorite = async (movieId: string | number) => {
        if (!userId) return;
        
        const movie = movies.find(m => m.id === movieId);
        
        try {
            // Remover del estado local primero para mejor UX
            setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
        
            // Llamar al backend para eliminar
            await updateUserMovie(userId, {
              movieId: String(movieId),
              is_favorite: false
            });
            
            showToast(`"${movie?.title}" eliminada de favoritos`, 'success');
        
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
            showToast('No se pudo eliminar la película de favoritos', 'error');
            // Recargar favoritos si falla
            loadFavorites(userId);
        }
    };

    const handlePlay = (movie: Movie) => {
        // Navegar a MovieScreen con los datos de la película
        console.log('Reproduciendo película:', movie); // Debug
        if (!movie.source) {
            showToast('La película no tiene una fuente disponible', 'error');
            return;
        }
        navigate(`/movie/${movie.id}`, { state: movie });
    };

    const handleRatingChange = async (movieId: string | number, newRating: number) => {
        if (!userId) return;
        
        try {
            // Actualizar localmente primero para mejor UX
            setMovies(prevMovies => 
                prevMovies.map(m => 
                    m.id === movieId ? { ...m, rating: newRating } : m
                )
            );
            
            // Enviar al backend
            await updateUserMovie(userId, {
                movieId: String(movieId),
                rating: newRating
            });
            
            showToast(`Calificación actualizada a ${newRating} ⭐`, 'success');
        } catch (error) {
            console.error('Error al actualizar rating:', error);
            showToast('No se pudo actualizar la calificación', 'error');
            // Recargar favoritos si falla
            loadFavorites(userId);
        }
    };

    const renderStars = (rating: number, movieId?: string | number, isClickable: boolean = false) => {
        return [...Array(5)].map((_, index) => (
            <span 
                key={index} 
                className={`star ${index < rating ? 'filled' : ''} ${isClickable ? 'clickable' : ''}`}
                onClick={() => isClickable && movieId !== undefined && handleRatingChange(movieId, index + 1)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
                ★
            </span>
        ));
    };

  return (
    <div className="fav-screen">
      <NavBar searchQuery="" onSearchChange={() => {}} />
      
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
      
      {/* Header */}
      <header className="fav-header">
        <button className="back-button" onClick={handleBack}>
          <IoArrowBack />
          <span>Volver al Catálogo</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="fav-content">
        {/* Title Section */}
        <div className="title-section">
          <div className="title-group">
            <h1 className="main-title">Mis Películas Favoritas</h1>
            <p className="subtitle">Gestiona tu colección personal de películas favoritas</p>
          </div>
          <div className="favorites-count">
            <CiHeart className="heart-icon" />
            <span>{movies.length} películas favoritas</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-container">
          <div className="search-box">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              placeholder="Buscar en favoritos"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-dropdown">
              <button 
                className="filter-button"
                onClick={() => setIsGenreOpen(!isGenreOpen)}
              >
                <MdFilterList className="filter-icon" />
                <span>{genreFilter}</span>
                <span className="arrow">▼</span>
              </button>
              {isGenreOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Todos los generos'); setIsGenreOpen(false); }}>
                    Todos los géneros
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Accion'); setIsGenreOpen(false); }}>
                    Acción
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Drama'); setIsGenreOpen(false); }}>
                    Drama
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Comedia'); setIsGenreOpen(false); }}>
                    Comedia
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Terror'); setIsGenreOpen(false); }}>
                    Terror
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Thriller'); setIsGenreOpen(false); }}>
                    Thriller
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Ciencia Ficcion'); setIsGenreOpen(false); }}>
                    Ciencia Ficción
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="movies-grid">
          {loading ? (
            <p>Cargando favoritos...</p>
          ) : filteredMovies.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              <p>No tienes películas favoritas aún</p>
            </div>
          ) : (
            filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image-container">
                <img src={movie.poster} alt={movie.title} className="movie-image" />
                <div className="movie-rating">
                  <span>⭐</span>
                  <span>{movie.rating}</span>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => handleRemoveFavorite(movie.id)}
                  title="Eliminar de favoritos"
                  aria-label="Eliminar de favoritos"
                >
                  <MdDelete />
                </button>
                <div className="movie-overlay">
                  <button className="play-button" onClick={() => handlePlay(movie)}>
                    <BiPlay className="play-icon" />
                    <span>Reproducir</span>
                  </button>
                </div>
              </div>
              <div className="movie-info">
                <div className="movie-header">
                  <h3 className="movie-title">{movie.title}</h3>
                  <span className="movie-duration">🕒 {movie.duration}</span>
                </div>
                <div className="movie-genre">
                  <span className="genre-tag">{movie.genre}</span>
                </div>
                <div className="movie-rating-section">
                  <span className="rating-label">Puntuación:</span>
                  <div className="stars">
                    {renderStars(Math.round(movie.rating || 0), movie.id, true)}
                  </div>
                  <span className="rating-value">{movie.rating?.toFixed(1) || '0'}</span>
                </div>
                <div className="movie-date">
                  Añadido: {movie.addedDate}
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      <HelpButton />
    </div>
  );
};

export default FavScreen;
