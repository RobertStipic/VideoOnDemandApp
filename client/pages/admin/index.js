import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

export default () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/user/signin");
    } else if (user && user.role !== "admin") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Upload Movie</h5>
              <p className="card-text">
                Upload new movies and queue them for transcoding.
              </p>
              <Link href="/admin/upload" className="btn btn-primary">
                Go to Upload
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Movies</h5>
              <p className="card-text">
                View, edit, delete movies from the catalog.
              </p>
              <Link href="/admin/movies" className="btn btn-primary">
                Manage Movies
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Users</h5>
              <p className="card-text">
                View users, promote to admin, delete accounts.
              </p>
              <Link href="/admin/users" className="btn btn-primary">
                Manage Users
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Manage Subscriptions</h5>
              <p className="card-text">
                View all subscriptions, cancel, extend.
              </p>
              <Link href="/admin/subscriptions" className="btn btn-primary">
                Manage Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
