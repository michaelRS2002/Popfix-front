import React, { useState } from 'react';
import './FavScreen.scss';
import { IoArrowBack, IoSearchOutline } from 'react-icons/io5';
import { CiHeart } from "react-icons/ci";
import { MdFilterList, MdCalendarToday, MdDelete } from 'react-icons/md';
import { BiPlay } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  image: string;
  rating: number;
  duration: string;
  genre: string;
  addedDate: string;
  userRating: number;
}

const FavScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [genreFilter, setGenreFilter] = useState('Todos los gen');
    const [dateFilter, setDateFilter] = useState('Fecha añad');
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);

  // Datos de ejemplo - reemplazar con datos reales
    const [movies, setMovies] = useState<Movie[]>([
    {
        id: 1,
        title: 'Película 1',
        image: 'https://via.placeholder.com/300x450',
        rating: 9.5,
        duration: '2h 14m',
        genre: 'Acción',
        addedDate: '15 de Octubre 2024',
        userRating: 5
    },
    {
        id: 2,
        title: 'Película 1',
        image: 'https://via.placeholder.com/300x450',
        rating: 9.5,
        duration: '2h 14m',
        genre: 'Acción',
        addedDate: '15 de Octubre 2024',
        userRating: 5
    },
    {
        id: 3,
        title: 'Película 1',
        image: 'https://via.placeholder.com/300x450',
        rating: 9.5,
        duration: '2h 14m',
        genre: 'Acción',
        addedDate: '15 de Octubre 2024',
        userRating: 5
    }
  ]);

    const handleBack = () => {
        navigate('/');
    };

    const handleRemoveFavorite = async (movieId: number) => {
        try {
            // Update method to use function with Backend
            setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
        
            console.log(`Película ${movieId} eliminada de favoritos`);
        
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
            alert('No se pudo eliminar la película de favoritos');
        }
    };

    const handlePlay = (movieId: number) => {
        // Lógica para reproducir
        console.log('Reproducir película:', movieId);
    };

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'star filled' : 'star'}>
            ★
        </span>
        ));
    };

  return (
    <div className="fav-screen">
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
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Todos los gen'); setIsGenreOpen(false); }}>
                    Todos los géneros
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Acción'); setIsGenreOpen(false); }}>
                    Acción
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Drama'); setIsGenreOpen(false); }}>
                    Drama
                  </div>
                  <div className="dropdown-item" onClick={() => { setGenreFilter('Comedia'); setIsGenreOpen(false); }}>
                    Comedia
                  </div>
                </div>
              )}
            </div>

            <div className="filter-dropdown">
              <button 
                className="filter-button"
                onClick={() => setIsDateOpen(!isDateOpen)}
              >
                <MdCalendarToday className="filter-icon" />
                <span>{dateFilter}</span>
                <span className="arrow">▼</span>
              </button>
              {isDateOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={() => { setDateFilter('Fecha añad'); setIsDateOpen(false); }}>
                    Fecha añadido
                  </div>
                  <div className="dropdown-item" onClick={() => { setDateFilter('Más reciente'); setIsDateOpen(false); }}>
                    Más reciente
                  </div>
                  <div className="dropdown-item" onClick={() => { setDateFilter('Más antiguo'); setIsDateOpen(false); }}>
                    Más antiguo
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-image-container">
                <img src={movie.image} alt={movie.title} className="movie-image" />
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
                  <button className="play-button" onClick={() => handlePlay(movie.id)}>
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
                  <span className="rating-label">Mi valoración:</span>
                  <div className="stars">
                    {renderStars(movie.userRating)}
                  </div>
                </div>
                <div className="movie-date">
                  Añadido: {movie.addedDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FavScreen;
