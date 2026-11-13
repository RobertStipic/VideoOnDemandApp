import Link from "next/link";
import { useState } from "react";

const MovieCardSmall = ({ movie }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="movie-card__poster-container">
        <Link href={`/watch/${movie.movieId}`}>
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="movie-card__poster"
          />
        </Link>
      </div>
      <div
        className={`movie-card__content-container ${
          hovered ? "is-visible" : ""
        }`}
      >
        <div className="movie-card__content">
          <h4 className="movie-card__title">{movie.Title}</h4>
          <p className="movie-card__meta">
            {movie.Year} · {movie.Runtime}
          </p>
          <Link
            href={`/watch/${movie.movieId}`}
            className="movie-card__btn d-block text-decoration-none"
          >
            Watch
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSmall;
