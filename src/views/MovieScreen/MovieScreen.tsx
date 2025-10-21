/**
 * @file MovieScreen.tsx
 * @description Displays the main movie playback screen with video controls, movie information, user ratings, and a comment section.
 * @module MovieScreen
 */

import React, { useState } from "react";
import "./MovieScreen.scss";
import NavBar from "../../components/NavBar/NavBar";
import HelpButton from "../../components/HelpButton/HelpButton";
import { AiFillStar } from "react-icons/ai";
import {
  FaPlay,
  FaVolumeUp,
  FaCog,
  FaClosedCaptioning,
  FaExpand,
  FaPaperPlane,
  FaComment,
} from "react-icons/fa";

/**
 * Represents a single user comment.
 * @interface Comment
 * @property {number} id - Unique identifier of the comment.
 * @property {string} author - Name of the comment author.
 * @property {string} text - Content of the comment.
 * @property {string} date - Time or date when the comment was posted.
 * @property {string} [avatar] - Optional avatar initials or URL for the user.
 */
interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
  avatar?: string;
}

/**
 * Renders the movie playback screen with movie information, rating system, and comment section.
 *
 * Includes:
 * - Video player with custom overlay controls.
 * - Movie details (title, rating, genre, duration, director, and description).
 * - User rating stars.
 * - Comment submission form and comment list.
 *
 * @function MovieScreen
 * @returns {JSX.Element} Movie screen component.
 */
export function MovieScreen(): JSX.Element {
  /** User-selected rating (1–5 stars). */
  const [rating, setRating] = useState(0);

  /** Current star being hovered by the user (for visual highlight). */
  const [hoverRating, setHoverRating] = useState(0);

  /** Current comment input value. */
  const [comment, setComment] = useState("");

  /** List of existing comments displayed below the video. */
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "María García",
      text: "¡Excelente película! Los efectos visuales son impresionantes.",
      date: "Hace 2 horas",
      avatar: "MG",
    },
  ]);

  /**
   * Example movie data.
   * @constant
   */
  const movie = {
    title: "Aventura Épicamente Épica!",
    year: "2024",
    duration: "2h 14m",
    rating: 8.5,
    genre: "Acción",
    director: "Alex Johnson",
    description:
      "Una emocionante aventura llena de acción y efectos espectaculares que te mantendrá al borde del asiento desde el primer minuto.",
    videoUrl: "",
  };

  /**
   * Handles the event when the user clicks on a star rating.
   * @param {number} rate - The number of stars selected by the user.
   */
  const handleRatingClick = (rate: number): void => {
    setRating(rate);
  };

  /**
   * Handles comment submission. Adds a new comment to the top of the comment list.
   * Clears the input field after posting.
   */
  const handleCommentSubmit = (): void => {
    if (comment.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        author: "Usuario Actual",
        text: comment,
        date: "Justo ahora",
        avatar: "UA",
      };
      setComments([newComment, ...comments]);
      setComment("");
    }
  };

  return (
    <div className="MovieScreen">
      <NavBar />

      <div className="movie-container">
        <div className="movie-content">
          {/* ----------------------- Video Section ----------------------- */}
          <div className="video-section">
            <div className="video-player">
              <video controls>
                <source src={movie.videoUrl} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>

              {/* Overlay Controls */}
              <div className="video-controls-overlay">
                <button className="play-button-overlay" aria-label="Reproducir">
                  <FaPlay size={60} />
                </button>
              </div>

              {/* Custom Control Buttons */}
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

          {/* ----------------------- Movie Info Section ----------------------- */}
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

            {/* ----------------------- User Rating ----------------------- */}
            <div className="user-rating">
              <label>Tu valoración:</label>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star ${
                      star <= (hoverRating || rating) ? "active" : ""
                    }`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Calificar con ${star} estrella${
                      star > 1 ? "s" : ""
                    }`}
                  >
                    <AiFillStar />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------- Comments Section ----------------------- */}
        <div className="comments-section">
          <div className="comments-header">
            <h2>
              <FaComment />
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
          </div>

          <button
            className="comment-submit-btn"
            onClick={handleCommentSubmit}
            disabled={!comment.trim()}
          >
            <FaPaperPlane />
            Comentar
          </button>

          <div className="comment-separator"></div>

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
