import Link from "next/link";

const MovieCard = ({ movie }) => {
  return (
    <div className="card bg-dark text-white h-100 d-flex flex-column" style={{ borderRadius: "8px", overflow: "hidden" }}>
      
      <div className="position-relative">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="card-img-top"
          style={{ height: "380px", objectFit: "cover" }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h2 className="card-title h3">{movie.Title}</h2>
        <ul className="list-inline text-light small mb-3 fw-bold">
          <li className="list-inline-item">{movie.Year}.</li>
          <li className="list-inline-item">{movie.Runtime}</li>
          <li className="list-inline-item">{movie.Genre}</li>
        </ul>

        <p className="card-text small mb-2" style={{ lineHeight: "1.4" }}>
          {movie.Plot}
        </p>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-info text-dark">
            IMDb {movie.imdbRating}
          </span>
          <span className="text-warning small">{movie.Language}</span>
        </div>

          <p className="card-text text-warning small mt-auto mb-0 p-2">
            <strong>Actors:</strong> {movie.Actors}
          </p>
                

        <Link href={`/watch/${movie.imdbID}`} className="btn btn-danger mt-auto w-100">
          Watch
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;