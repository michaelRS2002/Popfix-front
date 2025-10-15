import React, { useState } from 'react';
import './MovieScreen.scss';
import NavBar from '../../components/NavBar/NavBar';
import HelpButton from '../../components/HelpButton/HelpButton';
import { AiFillStar } from 'react-icons/ai';
import { 
  FaPlay, 
  FaVolumeUp, 
  FaCog, 
  FaClosedCaptioning, 
  FaExpand,
  FaPaperPlane 
} from 'react-icons/fa';

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
  avatar?: string;
}

export function MovieScreen() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'María García',
      text: '¡Excelente película! Los efectos visuales son impresionantes.',
      date: 'Hace 2 horas',
      avatar: 'MG'
    }
  ]);

  // Datos de ejemplo de la película
  const movie = {
    title: 'Aventura Épica',
    year: '2024',
    duration: '2h 14m',
    rating: 8.5,
    genre: 'Acción',
    director: 'Alex Johnson',
    description: 'Una emocionante aventura llena de acción y efectos espectaculares que te mantendrá al borde del asiento desde el primer minuto.',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  };

  const handleRatingClick = (rate: number) => {
    setRating(rate);
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        author: 'Usuario Actual',
        text: comment,
        date: 'Justo ahora',
        avatar: 'UA'
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };

  return (
    <div className="MovieScreen">
      <NavBar />
      
      <div className="movie-container">
        <div className="movie-content">
          {/* Video Player */}
          <div className="video-section">
            <div className="video-player">
              <video controls>
                <source src={movie.videoUrl} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
              
              {/* Controles personalizados overlay */}
              <div className="video-controls-overlay">
                <button className="play-button-overlay" aria-label="Reproducir">
                  <FaPlay size={60} />
                </button>
              </div>
              
              {/* Controles inferiores */}
              <div className="video-controls">
                <button className="control-btn" aria-label="Volumen">
                  <FaVolumeUp />
                </button>
                <button className="control-btn" aria-label="Configuración">
                  <FaCog />
                </button>
                <button className="control-btn" aria-label="Subtítulos">
                  <FaClosedCaptioning />
                </button>
                <button className="control-btn" aria-label="Pantalla completa">
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="movie-info-section">
            <div className="movie-header">
              <h1>{movie.title}</h1>
              <div className="movie-rating-badge">
                <AiFillStar />
                <span>{movie.rating}</span>
              </div>
            </div>

            <div className="movie-meta">
              <span className="year">{movie.year}</span>
              <span className="duration">{movie.duration}</span>
            </div>

            <div className="movie-genre">
              <span className="genre-badge">{movie.genre}</span>
            </div>

            <div className="movie-director">
              <span>Director: {movie.director}</span>
            </div>

            <p className="movie-description">{movie.description}</p>

            {/* User Rating */}
            <div className="user-rating">
              <label>Tu valoración:</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
                  >
                    <AiFillStar />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <div className="comments-header">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              Comentarios
            </h2>
          </div>

          <div className="comment-input-box">
            <textarea
              placeholder="Escribe tu comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button 
              className="comment-submit-btn"
              onClick={handleCommentSubmit}
              disabled={!comment.trim()}
            >
              <FaPaperPlane />
              Comentar
            </button>
          </div>

          <div className="comments-list">
            {comments.map((comm) => (
              <div key={comm.id} className="comment-item">
                <div className="comment-avatar">
                  {comm.avatar || comm.author.substring(0, 2).toUpperCase()}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-author">{comm.author}</span>
                    <span className="comment-date">{comm.date}</span>
                  </div>
                  <p className="comment-text">{comm.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HelpButton />
    </div>
  );
}

export default MovieScreen;
