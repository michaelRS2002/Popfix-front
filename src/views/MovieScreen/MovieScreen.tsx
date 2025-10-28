import React, { useEffect, useMemo, useRef, useState } from "react";
import "./MovieScreen.scss";
import NavBar from "../../components/NavBar/NavBar";
import HelpButton from "../../components/HelpButton/HelpButton";
import { AiFillStar, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaPaperPlane, FaComment, FaClosedCaptioning } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import {
  insertFavoriteOrRating,
  getFavorites,
  deleteFavorite,
  addUserMovieComment,
  addFavorite,
  setRating as apiSetRating,
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
  const [displayRating, setDisplayRating] = useState<number>(0);
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
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

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
        favs.map((fav: any) => {
          const id = fav.movies ? fav.movies.id : fav.movie_id;
          // Normalizar a string para comparación consistente
          return String(id);
        })
      );
      setFavoriteIds(favoriteIdSet);
      console.log("Favoritos cargados:", Array.from(favoriteIdSet));
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

  const toggleSubtitles = () => {
    setSubtitlesEnabled(!subtitlesEnabled);
    const video = videoRef.current;
    if (video && video.textTracks.length > 0) {
      const track = video.textTracks[0];
      track.mode = !subtitlesEnabled ? "showing" : "hidden";
    }
    showToast(
      !subtitlesEnabled ? "Subtítulos activados" : "Subtítulos desactivados",
      "success"
    );
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
    setDisplayRating(movie.rating || 0);
    if (videoRef.current && movie.videoUrl) {
      const v = videoRef.current;
      v.muted = true;
      v.play().catch(() => {});
    }
  }, [movie]);

  const handleRatingClick = async (rate: number): Promise<void> => {
    setRating(rate);
    // Send rating to backend (upsert). If user not logged, keep local only.
    if (!userId) {
      showToast("Inicia sesión para guardar tu valoración", "error");
      return;
    }
    try {
      const resp = await apiSetRating(userId, {
        movieId: String(movie.id),
        rating: rate,
      });
      // If backend returns suggestedRating, update display
      const suggested = resp?.suggestedRating ?? resp?.suggestedRating === 0 ? resp.suggestedRating : undefined;
      if (typeof suggested === "number") setDisplayRating(suggested);
      else setDisplayRating(rate);
      // Notify other views (Home) that this movie's rating changed
      try {
        const detail = { movieId: String(movie.id), rating: typeof suggested === "number" ? suggested : rate };
        window.dispatchEvent(new CustomEvent("movie:rating-updated", { detail } as any));
      } catch (e) {
        // ignore
      }
      showToast("Valoración guardada", "success");
    } catch (err) {
      console.error("Error guardando valoración:", err);
      showToast("No se pudo guardar la valoración", "error");
    }
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

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    if (!userId) {
      showToast("Inicia sesión para comentar", "error");
      return;
    }

    try {
      const resp = await addUserMovieComment(userId, {
        movieId: String(movie.id),
        text: comment.trim(),
      });
      // Backend returns comment with author_name, author_surname and avatar
      const created = resp?.comment ?? null;
      const authorName = created?.author_name || "Usuario";
      const authorSurname = created?.author_surname || "";
      const authorFull = `${authorName} ${authorSurname}`.trim();
      const avatar = created?.avatar || (authorFull ? authorFull.substring(0,2).toUpperCase() : "UA");

      const newComment: Comment = {
        id: created?.id || comments.length + 1,
        author: authorFull || "Usuario Actual",
        text: created?.content || comment.trim(),
        date: "Justo ahora",
        avatar: avatar,
      };

      setComments([newComment, ...comments]);
      setComment("");
      showToast("Comentario publicado", "success");
    } catch (err) {
      console.error("Error publicando comentario:", err);
      showToast("No se pudo publicar el comentario", "error");
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

    // Normalizar movie.id a string para comparación consistente
    const movieIdStr = String(movie.id);
    const isCurrentlyFavorite = favoriteIds.has(movieIdStr);

    console.log("Movie ID:", movieIdStr, "Is favorite:", isCurrentlyFavorite);
    console.log("Favorites set:", Array.from(favoriteIds));

    // Actualización optimista del UI
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyFavorite) {
        newSet.delete(movieIdStr);
      } else {
        newSet.add(movieIdStr);
      }
      return newSet;
    });

    try {
      if (isCurrentlyFavorite) {
        // Use DELETE favorites endpoint
        await deleteFavorite(userId, String(movie.id));
        showToast(`"${movie.title}" eliminada de favoritos`, "success");
        try { window.dispatchEvent(new CustomEvent('movie:favorite-changed', { detail: { movieId: String(movie.id), isFavorite: false } } as any)); } catch(e){}
      } else {
        await addFavorite(userId, {
          movieId: String(movie.id),
          favorite: true,
          title: movie.title,
          thumbnail_url: movie.poster,
          genre: movie.genre,
          source: movie.source,
          duration_seconds: 300,
        });
        showToast(`"${movie.title}" añadida a favoritos`, "success");
        try { window.dispatchEvent(new CustomEvent('movie:favorite-changed', { detail: { movieId: String(movie.id), isFavorite: true } } as any)); } catch(e){}
      }
    } catch (error) {
      console.error("Error modificando favoritos:", error);

      // Revertir cambio optimista en caso de error
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyFavorite) {
          newSet.add(movieIdStr);
        } else {
          newSet.delete(movieIdStr);
        }
        return newSet;
      });

      showToast("No se pudo modificar favoritos", "error");
    }
  };

  return (
    <div className="MovieScreen">
      <NavBar />

      {toast && (
        <div className={`toast toast-${toast.type}`} role="alert" aria-live="polite">{toast.message}</div>
      )}

      <div className="movie-container">
        <div className="movie-content">
          {/* ----------------------- Video ----------------------- */}
          <div className="video-section">
            <div className="video-player">
              <video ref={videoRef} controls playsInline aria-label={`Reproduciendo ${movie.title}`}>
                {movie.videoUrl && (
                  <source src={movie.videoUrl} type="video/mp4" />
                )}
                Tu navegador no soporta el video.
              </video>
              
              {/* Botón de subtítulos */}
              <div className="subtitle-control">
                <button
                  className={`subtitle-btn ${subtitlesEnabled ? "active" : ""}`}
                  onClick={toggleSubtitles}
                  aria-label={subtitlesEnabled ? "Desactivar subtítulos" : "Activar subtítulos"}
                  aria-pressed={subtitlesEnabled ? "true" : "false"}
                >
                  <FaClosedCaptioning />
                </button>
              </div>
            </div>
          </div>

          {/* ----------------------- Movie Info ----------------------- */}
          <div className="movie-info-section">
            <div className="movie-header">
              <h1>{movie.title}</h1>
              <div className="movie-actions">
                <button
                  className={`favorite-button ${
                    favoriteIds.has(String(movie.id)) ? "is-favorite" : ""
                  }`}
                  onClick={handleAddToFavorites}
                  aria-label={
                    favoriteIds.has(String(movie.id))
                      ? `Eliminar ${movie.title} de favoritos`
                      : `Añadir ${movie.title} a favoritos`
                  }
                  aria-pressed={favoriteIds.has(String(movie.id)) ? "true" : "false"}
                >
                  {favoriteIds.has(String(movie.id)) ? (
                    <AiFillHeart color="red" aria-hidden="true" />
                  ) : (
                    <AiOutlineHeart color="gray" aria-hidden="true" />
                  )}
                </button>
                <div className="movie-rating-badge" aria-label={`Calificación de la película: ${displayRating} estrellas`}>
                  <AiFillStar aria-hidden="true" />
                  <span>{displayRating}</span>
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
              <div className="rating-stars" role="group" aria-label="Calificar película">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star ${
                      star <= (hoverRating || rating) ? "active" : ""
                    }`}
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Calificar con ${star} estrella${star > 1 ? 's' : ''}`}
                    aria-pressed={star <= rating ? "true" : "false"}
                  >
                    <AiFillStar aria-hidden="true" />
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
              <FaComment aria-hidden="true" /> Comentarios
            </h2>
          </div>

          <div className="comment-input-box">
            <textarea
              placeholder="Escribe tu comentario..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              aria-label="Escribe tu comentario sobre la película"
            />
          </div>

          <button
            className="comment-submit-btn"
            onClick={handleCommentSubmit}
            disabled={!comment.trim()}
            aria-label="Publicar comentario"
          >
            <FaPaperPlane aria-hidden="true" />
            Comentar
          </button>

          <div className="comment-separator"></div>

          <div className="comments-list" role="list" aria-label="Lista de comentarios">
            {comments.map((comm) => (
              <div key={comm.id} className="comment-item" role="listitem">
                <div className="comment-avatar" aria-hidden="true">
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
