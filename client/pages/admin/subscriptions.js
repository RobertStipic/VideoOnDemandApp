import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { getServerData } from "../../api/init-axios";
import { formatDateShort } from "../../common/formatDate";

export default function AdminSubscriptions({ subscriptions: initialSubs }) {
  const { user } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState(initialSubs || []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const filtered = useMemo(() => {
    let result = subscriptions;

    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.userEmail?.toLowerCase().includes(q) ||
          s._id?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [subscriptions, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: subscriptions.length,
      active: subscriptions.filter((s) => s.status === "succeeded").length,
      cancelled: subscriptions.filter((s) => s.status === "cancelled").length,
      expired: subscriptions.filter((s) => s.status === "expired").length,
      paymentExpired: subscriptions.filter((s) => s.status === "paymentExpired")
        .length,
      extended: subscriptions.filter((s) => s.status === "extended").length,
    };
  }, [subscriptions]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Subscriptions</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          ← Back to Admin Panel
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-2">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="mb-1">Total</h6>
              <h3 className="mb-0">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="mb-1">Active</h6>
              <h3 className="mb-0">{stats.active}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <h6 className="mb-1">Cancelled</h6>
              <h3 className="mb-0">{stats.cancelled}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6 className="mb-1">Extended</h6>
              <h3 className="mb-0">{stats.extended}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <h6 className="mb-1">Expired</h6>
              <h3 className="mb-0">{stats.expired}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <h6 className="mb-1">Payment Expired</h6>
              <h3 className="mb-0">{stats.paymentExpired}</h3>
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
            placeholder="Search by email or subscription ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="succeeded">Active (succeeded)</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="extended">Extended</option>
            <option value="paymentExpired">Payment Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>User Email</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Price</th>
              <th>Expires At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No subscriptions match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id || s._id}>
                  <td className="small">{s.id || s._id}</td>
                  <td>{s.userEmail}</td>
                  <td>{s.plan}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.status === "succeeded"
                          ? "bg-success"
                          : s.status === "pending"
                            ? "bg-warning text-dark"
                            : s.status === "cancelled"
                              ? "bg-danger"
                              : s.status === "extended"
                                ? "bg-info"
                                : s.status === "paymentExpired"
                                  ? "bg-dark text-white"
                                  : "bg-secondary"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td>€{s.price}</td>
                  <td>{s.expiresAt ? formatDateShort(s.expiresAt) : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const subscriptions = await getServerData(context, "/subscription/findall");
  return { props: { subscriptions: subscriptions || [] } };
}
