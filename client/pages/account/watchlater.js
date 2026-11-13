import Sidebar from "../../components/sidebar.js";
import { getServerData } from "../../api/init-axios.js";
import MovieCard from "../../components/movieCard.js";
import { useAuth } from "../../context/AuthContext.js";

const WatchLaterPage = ({ watchLater }) => {
  const { user: currentUser } = useAuth();

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <h2>Watch Later</h2>
        {currentUser ? (
          watchLater.length === 0 ? (
            <p className="text-muted">Your watch later list is empty.</p>
          ) : (
            <div className="row g-4">
              {watchLater.map((item) => (
                <div className="col-12 col-md-6 col-lg-4" key={item.movieId}>
                  <MovieCard movie={item} />
                </div>
              ))}
            </div>
          )
        ) : (
          <h3>You are not signed in. Please sign in to continue.</h3>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const watchLater = await getServerData(context, "/history/watch-later").catch(
    () => [],
  );
  return { props: { watchLater: watchLater || [] } };
}

export default WatchLaterPage;
