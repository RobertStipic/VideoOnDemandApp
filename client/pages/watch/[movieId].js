import dynamic from "next/dynamic";
import { getServerData } from "../../api/init-axios.js";
import MovieCard from "../../components/movieCard.js";

const MoviePlayer = dynamic(() => import("../../components/moviePlayer.js"), {
  ssr: false,
});

const WatchMoviePage = ({
  movie,
  isSubscribed,
  notAuthorized,
  recommendations,
}) => {
  if (notAuthorized) {
    return (
      <div className="p-3">
        <h2> You are not signed in </h2>
      </div>
    );
  }

  return (
    <div>
      {isSubscribed ? (
        <>
          <MoviePlayer key={movie.imdbID} movie={movie} />
          {recommendations.length > 0 && (
            <div className="container mt-4">
              <h3 className="mb-4"> You may also like </h3>
              <div className="row g-4">
                {recommendations.map((rec) => (
                  <div className="col-12 col-md-4" key={rec.imdbID}>
                    <MovieCard movie={rec} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container mt-4">
          <div className="alert alert-warning">
            Please subscribe to watch movies
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { movieId } = context.query;

  const movie = await getServerData(context, `/movies/watch/${movieId}`);

  if (!movie) {
    return { props: { notAuthorized: true } };
  }

  const recommendations = await getServerData(
    context,
    `/recommendations/${movieId}`,
  );

  return {
    props: {
      movie,
      isSubscribed: true,
      recommendations: recommendations || [],
    },
  };
}

export default WatchMoviePage;
