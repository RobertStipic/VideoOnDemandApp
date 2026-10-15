import Sidebar from "../../components/sidebar.js";
import { getServerData } from "../../api/init-axios.js";
import { useState, Fragment } from "react";
import { formatDate } from "../../common/formatDate.js";
import { useAuth } from "../../context/AuthContext.js";

const WatchHistory = ({ watchHistory }) => {
  const { user: currentUser } = useAuth();
  const [rowData, setRowData] = useState(new Set());

  const showRows = (movieId) => {
    setRowData((previous) => {
      const newSet = new Set(previous);
      if (newSet.has(movieId)) {
        newSet.delete(movieId);
      } else {
        newSet.add(movieId);
      }
      return newSet;
    });
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <h2>Movie Watch History</h2>
        {currentUser ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Times Watched</th>
                  <th>Last Watch time</th>
                </tr>
              </thead>
              <tbody>
                {watchHistory.map((data) => (
                  <Fragment key={data.movieId}>
                    <tr
                      onClick={() => showRows(data.movieId)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{data.title}</td>
                      <td>{data.watchedAt.length}</td>
                      <td>
                        {formatDate(data.watchedAt[data.watchedAt.length - 1])}
                      </td>
                    </tr>

                    {rowData.has(data.movieId) && (
                      <tr>
                        <td colSpan={3}>
                          <div className="p-3 bg-white text-dark rounded">
                            <strong>Watch history:</strong>
                            <ul className="mb-0 mt-2">
                              {data.watchedAt.map((date, index) => (
                                <li key={index}>{formatDate(date)}</li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3> You are not signed in. Please sign in to continue. </h3>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const watchHistory = await getServerData(context, "/history/user");
  return { props: { watchHistory: watchHistory || [] } };
}

export default WatchHistory;
