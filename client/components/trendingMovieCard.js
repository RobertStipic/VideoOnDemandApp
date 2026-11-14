import Link from "next/link";

const TrendingMovieCard = ({ movie, rank }) => {
  return (
    <Link href={`/watch/${movie.movieId}`} className="text-decoration-none">
      <div className="card bg-dark text-white h-100 position-relative">
        <span
          className="badge bg-danger position-absolute top-0 start-0 m-1"
          style={{ zIndex: 10 }}
        >
          #{rank}
        </span>
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="card-img-top"
          style={{ height: "220px", objectFit: "cover" }}
        />
        <div className="card-body p-2">
          <p
            className="card-text small mb-1 fw-bold"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {movie.Title}
          </p>
          <p className="card-text small text-muted mb-0">
            {movie.count} {movie.count === 1 ? "watch" : "watches"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default TrendingMovieCard;
