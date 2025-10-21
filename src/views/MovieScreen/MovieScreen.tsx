import React, { useEffect, useMemo, useRef, useState } from "react";
import "./MovieScreen.scss";
import NavBar from "../../components/NavBar/NavBar";
import HelpButton from "../../components/HelpButton/HelpButton";
import { AiFillStar, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaPaperPlane, FaComment } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import {
  insertFavoriteOrRating,
  updateUserMovie,
  getFavorites,
} from "../../utils/moviesApi";

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

export function MovieScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedMovie = (location?.state as any) || null;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "María García",
      text: "¡Excelente película! Los efectos visuales son impresionantes.",
      date: "Hace 2 horas",
      avatar: "MG",
    },
  ]);

  const [userId, setUserId] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string | number>>(
    new Set()
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // -------- Load user and favorites --------
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.id) {
          setUserId(user.id);
          loadUserFavorites(user.id);
        }
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }, []);

  const loadUserFavorites = async (userId: string) => {
    try {
      const favs = await getFavorites(userId);
      const favoriteIdSet = new Set(
        favs.map((fav: any) => (fav.movies ? fav.movies.id : fav.movie_id))
      );
      setFavoriteIds(favoriteIdSet);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // -------- Movie data --------
  const movie = useMemo(() => {
    if (passedMovie) {
      const movieObj = {
        id: passedMovie.id || Date.now(),
        title: passedMovie.title || "Video",
        year: new Date().getFullYear().toString(),
        duration: passedMovie.duration || "",
        rating:
          typeof passedMovie.rating === "number"
            ? passedMovie.rating
            : parseFloat(passedMovie.rating) || 0,
        genre: passedMovie.genre || "Video",
        director: passedMovie.director || "Desconocido",
        description: passedMovie.description || "",
        videoUrl: passedMovie.source || "",
        poster: passedMovie.poster || "",
        source: passedMovie.source || "",
      };
      return movieObj;
    }
    return {
      id: Date.now(),
      title: "Video",
      year: new Date().getFullYear().toString(),
      duration: "",
      rating: 0,
      genre: "Video",
      director: "Desconocido",
      description: "",
      videoUrl: "",
      poster: "",
      source: "",
    };
  }, [passedMovie]);

  useEffect(() => {
    if (videoRef.current && movie.videoUrl) {
      const v = videoRef.current;
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [movie.videoUrl]);

  const handleRatingClick = (rate: number): void => {
    setRating(rate);
  };

  const getGenreDescription = (genre: string): string => {
    const descriptions: { [key: string]: string } = {
      Accion: "Una emocionante película de acción llena de adrenalina.",
      Drama: "Un conmovedor drama lleno de emociones.",
      Comedia: "Una comedia divertida que te hará reír a carcajadas.",
      Thriller: "Un thriller intenso con giros inesperados.",
      Terror: "Una película de terror llena de suspenso.",
      "Ciencia Ficcion": "Una historia futurista de ciencia ficción.",
      Popular: "Un video popular que no puedes perderte.",
      Video: "Un interesante video que debes ver.",
    };
    return descriptions[genre] || `Una fascinante película de ${genre}.`;
  };

  const handleCommentSubmit = () => {
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

  // -------- FAVORITES HANDLER --------
  const handleAddToFavorites = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!userId) {
      showToast("Inicia sesión para añadir favoritos", "error");
      navigate("/login");
      return;
    }

    const isCurrentlyFavorite = favoriteIds.has(movie.id);

    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyFavorite) newSet.delete(movie.id);
      else newSet.add(movie.id);
      return newSet;
    });

    try {
      if (isCurrentlyFavorite) {
        await updateUserMovie(userId, {
          movieId: String(movie.id),
          is_favorite: false,
        });
        showToast(`"${movie.title}" eliminada de favoritos`, "success");
      } else {
        await insertFavoriteOrRating(userId, {
          movieId: String(movie.id),
          favorite: true,
          title: movie.title,
          thumbnail_url: movie.poster,
          genre: movie.genre,
          source: movie.source,
          duration_seconds: 300,
        });
        showToast(`"${movie.title}" añadida a favoritos`, "success");
      }
    } catch (error) {
      console.error("Error modificando favoritos:", error);

      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyFavorite) newSet.add(movie.id);
        else newSet.delete(movie.id);
        return newSet;
      });

      showToast("No se pudo modificar favoritos", "error");
    }
  };

  return (
    <div className="MovieScreen">
      <NavBar />

      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}

      <div className="movie-container">
        <div className="movie-content">
          {/* ----------------------- Video ----------------------- */}
          <div className="video-section">
            <div className="video-player">
              <video ref={videoRef} controls playsInline>
                {movie.videoUrl && (
                  <source src={movie.videoUrl} type="video/mp4" />
                )}
                Tu navegador no soporta el video.
              </video>
            </div>
          </div>

          {/* ----------------------- Movie Info ----------------------- */}
          <div className="movie-info-section">
            <div className="movie-header">
              <h1>{movie.title}</h1>
              <div className="movie-actions">
                <button
                  className={`favorite-button ${
                    favoriteIds.has(movie.id) ? "is-favorite" : ""
                  }`}
                  onClick={handleAddToFavorites}
                  aria-label={
                    favoriteIds.has(movie.id)
                      ? "Eliminar de favoritos"
                      : "Añadir a favoritos"
                  }
                  title={
                    favoriteIds.has(movie.id)
                      ? "Eliminar de favoritos"
                      : "Añadir a favoritos"
                  }
                >
                  {favoriteIds.has(movie.id) ? (
                    <AiFillHeart color="red" />
                  ) : (
                    <AiOutlineHeart color="white" />
                  )}
                </button>
                <div className="movie-rating-badge">
                  <AiFillStar />
                  <span>{movie.rating}</span>
                </div>
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

            <p className="movie-description">
              {getGenreDescription(movie.genre)}
            </p>

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
                  >
                    <AiFillStar />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------- Comments ----------------------- */}
        <div className="comments-section">
          <div className="comments-header">
            <h2>
              <FaComment /> Comentarios
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
