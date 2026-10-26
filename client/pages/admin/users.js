import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../api/axios-instance";
import { getServerData } from "../../api/init-axios";

export default function AdminUsers({ users: initialUsers }) {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers || []);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const filteredUsers = useMemo(() => {
    let result = users;

    if (roleFilter === "admin") {
      result = result.filter((u) => u.role === "admin");
    } else if (roleFilter === "user") {
      result = result.filter((u) => u.role === "user");
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.email?.toLowerCase().includes(query) ||
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [users, search, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      active: users.filter((u) => u.isActive).length,
      subscribed: users.filter((u) => u.isSubscribed).length,
    };
  }, [users]);

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;

    setDeleting(id);
    setError("");

    try {
      await api.delete(`/users/admin/${id}`);
      setUsers((prev) => prev.filter((u) => (u.id || u._id) !== id));
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
      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="mb-1">Total Users</h6>
              <h3 className="mb-0">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark">
            <div className="card-body">
              <h6 className="mb-1">Admins</h6>
              <h3 className="mb-0">{stats.admins}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="mb-1">Account actived</h6>
              <h3 className="mb-0">{stats.active}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6 className="mb-1">Subscribed</h6>
              <h3 className="mb-0">{stats.subscribed}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All roles</option>
            <option value="admin">Admins only</option>
            <option value="user">Users only</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-muted py-4">
                  No users match your filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
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
                          isAdmin ? "bg-warning text-dark" : "bg-secondary"
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
                        <span className="badge bg-secondary">No</span>
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
              })
            )}
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
