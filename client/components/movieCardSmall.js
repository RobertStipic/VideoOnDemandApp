import Link from "next/link";
import { useState } from "react";
import styles from "../styles/movieCardSmall.module.css";

const MovieCardSmall = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={styles.movieCard}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.posterContainer}>
        <Link href={`/watch/${movie.movieId}`}>
          <img src={movie.Poster} alt={movie.Title} className={styles.poster} />
        </Link>
      </div>
      <div
        className={`${styles.contentContainer} ${hovered ? styles.isVisible : ""}`}
      >
        <div className={styles.content}>
          <h4 className={styles.title}>{movie.Title}</h4>
          {movie.averageRating > 0 && (
            <div
              className="text-warning small mb-1"
              style={{ fontSize: "0.8rem" }}
            >
              {"★".repeat(Math.round(movie.averageRating))}
              {"☆".repeat(5 - Math.round(movie.averageRating))}
              <span className="text-muted ms-1">({movie.reviewCount})</span>
            </div>
          )}
          <p className={styles.meta}>
            {movie.Year} · {movie.Runtime}
          </p>
          <Link
            href={`/watch/${movie.movieId}`}
            className={`${styles.btn} d-block text-decoration-none`}
          >
            Watch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSmall;
