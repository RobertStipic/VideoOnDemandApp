import MovieCard from "../../components/movieCard.js";
import buildAxios from "../../api/init-axios.js";

const  MovieList = ({ movies, error }) => {
  return (
    <div className="container py-4">
    <h2 className="mb-4">Movies</h2>
    {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
      <div className="row g-4">
        {movies.map((movie) => (
          <div className="col-12 col-md-6 col-lg-4" key={movie.imdbID}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const client = buildAxios(context);
    const { data } = await client.get("/movies/listmovies");
    return { props: { movies: data } };
  } catch (error) {
    return { props: { error: "Unexpected error" } };
  }
}

export default MovieList;