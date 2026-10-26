import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../api/axios-instance";
import { getServerData } from "../../api/init-axios";

export default function AdminUsers({ users: initialUsers }) {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers || []);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;

    setDeleting(id);
    setError("");

    try {
      await api.delete(`/users/admin/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));
    } catch (err) {
      setError(err.response?.data || "Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Users</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          ← Back to Admin Panel
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Active</th>
              <th>Subscribed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const id = u.id || u._id;
              const isSelf = id === user.id;
              const isAdmin = u.role === "admin";

              return (
                <tr key={id}>
                  <td>{u.email}</td>
                  <td>
                    {u.firstName} {u.lastName}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        isAdmin ? "bg-warning text-dark" : "bg-primary"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.isActive ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-danger">No</span>
                    )}
                  </td>
                  <td>
                    {u.isSubscribed ? (
                      <span className="badge bg-success">Yes</span>
                    ) : (
                      <span className="badge bg-dark">No</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(id, u.email)}
                      disabled={deleting === id || isSelf || isAdmin}
                      title={
                        isSelf
                          ? "Cannot delete yourself"
                          : isAdmin
                            ? "Cannot delete another admin"
                            : ""
                      }
                    >
                      {deleting === id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const users = await getServerData(context, "/users/admin/all");
  return { props: { users: users || [] } };
}
