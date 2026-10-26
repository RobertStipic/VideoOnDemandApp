import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../api/axios-instance";
import { getServerData } from "../../api/init-axios";

export default function AdminMovies({ movies: initialMovies }) {
  const { user } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState(initialMovies || []);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const handleDelete = async (imdbID) => {
    if (!window.confirm(`Delete movie ${imdbID}? This cannot be undone.`))
      return;

    setDeleting(imdbID);
    setError("");

    try {
      await api.delete(`/movies-admin/delete/${imdbID}`);
      setMovies((prev) => prev.filter((m) => m.imdbID !== imdbID));
    } catch (err) {
      setError(err.response?.data || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Movies</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          ← Back to Admin Panel
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>imdbID</th>
              <th>Title</th>
              <th>Year</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.imdbID}>
                <td>{movie.imdbID}</td>
                <td>{movie.Title}</td>
                <td>{movie.Year}</td>
                <td>{movie.Genre}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(movie.imdbID)}
                    disabled={deleting === movie.imdbID}
                  >
                    {deleting === movie.imdbID ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const movies = await getServerData(context, "/movies/listmovies");
  return { props: { movies: movies || [] } };
}
