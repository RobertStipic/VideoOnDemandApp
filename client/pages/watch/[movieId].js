import dynamic from "next/dynamic";
import buildAxios from "../../api/init-axios.js";
import MovieCard from "../../components/movieCard.js";

const MoviePlayer = dynamic(() => import("../../components/moviePlayer.js"), {
  ssr: false,
});

const WatchMoviePage = ({ movie, isSubscribed, error, notAuthorized, recommendations }) => {

  if (error) {
    return (
      <div className="p-3">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  };
  if(notAuthorized){
  return (
    <div className="p-3">
      <h2> You are not signed in </h2>
    </div>
    );
  };
  
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
      ) :(
      <div className="container mt-4">
       <div className="alert alert-warning">
        Please subscribe to watch movies
       </div>
      </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  try{
  const { movieId } = context.query;
  const client = buildAxios(context);
  const { data } = await client.get(`/movies/watch/${movieId}`);
  const recommendationsResponse = await client.get(`/recommendations/${movieId}`)

      return { props: { movie: data , isSubscribed: true, recommendations: recommendationsResponse.data || [] }};
  } catch(error){

    if(error.response.status==403){
      return { props: { movie: null, isSubscribed: false, recommendations: [] }};
    }
    else if(error.response.status===401){
        return {props: {notAuthorized: true}}
    }
    else if(error.response.status===404){
      return {props: {error: error.response.data}}
    }
    else {
        return { props: {error: "Unexpected error"} }
    }
  };
 
}

export default WatchMoviePage;