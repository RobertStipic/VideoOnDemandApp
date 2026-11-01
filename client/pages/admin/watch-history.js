import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../api/axios-instance";
import { getServerData } from "../../api/init-axios";
import { formatDate } from "../../common/formatDate";

export default function AdminWatchHistory({ history: initialHistory }) {
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState(initialHistory || {});
  const [tab, setTab] = useState("by-user");
  const [search, setSearch] = useState("");

  // By-movie state
  const [movieId, setMovieId] = useState("");
  const [movieHistory, setMovieHistory] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(false);
  const [movieError, setMovieError] = useState("");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  // By-user filter
  const filteredUsers = useMemo(() => {
    const entries = Object.entries(history);
    if (!search.trim()) return entries;

    const q = search.toLowerCase();
    return entries.filter(([email]) => email.toLowerCase().includes(q));
  }, [history, search]);

  // Stats
  const stats = useMemo(() => {
    const users = Object.keys(history).length;
    const totalWatches = Object.values(history).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    return { users, totalWatches };
  }, [history]);

  // Load by-movie history
  const loadMovieHistory = async () => {
    if (!movieId.trim()) return;

    setLoadingMovie(true);
    setMovieError("");
    setMovieHistory(null);

    try {
      const res = await api.get(`/history/full/${movieId}`);
      setMovieHistory(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setMovieError("Movie not found or no watch history");
      } else {
        setMovieError(err.response?.data || "Error loading history");
      }
    } finally {
      setLoadingMovie(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Watch History</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          ← Back to Admin Panel
        </Link>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "by-user" ? "active" : ""}`}
            onClick={() => setTab("by-user")}
          >
            By User
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "by-movie" ? "active" : ""}`}
            onClick={() => setTab("by-movie")}
          >
            By Movie
          </button>
        </li>
      </ul>

      {/* Tab: By User */}
      {tab === "by-user" && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <h6 className="mb-1">Users with History</h6>
                  <h3 className="mb-0">{stats.users}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <h6 className="mb-1">Total Watches</h6>
                  <h3 className="mb-0">{stats.totalWatches}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control h-100"
                placeholder="Search by user email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Movies Watched</th>
                  <th>Last Watch</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      No watch history found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(([email, items]) => {
                    const last = items[items.length - 1];
                    return (
                      <tr key={email}>
                        <td>{email}</td>
                        <td>{items.length}</td>
                        <td>
                          {last?.watchedAt ? formatDate(last.watchedAt) : "—"}
                        </td>
                        <td>
                          <details>
                            <summary className="btn btn-sm btn-outline-primary">
                              Show all
                            </summary>
                            <ul className="mt-2">
                              {items.map((item, i) => (
                                <li key={i}>
                                  <strong>{item.Title || item.movieId}</strong>{" "}
                                  — {formatDate(item.watchedAt)}
                                </li>
                              ))}
                            </ul>
                          </details>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Tab: By Movie */}
      {tab === "by-movie" && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-md-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter movie imdbID (e.g. tt0111161)"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadMovieHistory()}
              />
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100"
                onClick={loadMovieHistory}
                disabled={loadingMovie || !movieId.trim()}
              >
                {loadingMovie ? "Loading..." : "Search"}
              </button>
            </div>
          </div>

          {movieError && <div className="alert alert-danger">{movieError}</div>}

          {movieHistory && (
            <>
              <h4>{Object.keys(movieHistory)[0] || movieId}</h4>
              <p className="text-muted">
                {Object.values(movieHistory)[0]?.length || 0} users watched
              </p>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>User Email</th>
                      <th>Watched At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(movieHistory)[0]?.map((item, i) => (
                      <tr key={i}>
                        <td>{item.userEmail}</td>
                        <td>{formatDate(item.watchedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const history = await getServerData(context, "/history/complete");
  return { props: { history: history || {} } };
}
