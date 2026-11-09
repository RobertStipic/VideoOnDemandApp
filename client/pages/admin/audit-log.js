import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { getServerData } from "../../api/init-axios";
import { formatDate } from "../../common/formatDate";

export default function AdminAuditLog({
  subscriptionActions: initialSubscriptionActions,
  movieActions: initialMovieActions,
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("subscription");

  const [subscriptionActions] = useState(initialSubscriptionActions || []);
  const [movieActions] = useState(initialMovieActions || []);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  useEffect(() => {
    setSearch("");
    setActionFilter("all");
  }, [tab]);

  if (!user || user.role !== "admin") return null;

  const currentActions =
    tab === "subscription" ? subscriptionActions : movieActions;

  const filtered = useMemo(() => {
    let result = currentActions;

    if (actionFilter !== "all") {
      result = result.filter((log) => log.action === actionFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (log) =>
          log.adminEmail?.toLowerCase().includes(q) ||
          log.targetEmail?.toLowerCase().includes(q) ||
          log.targetId?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [currentActions, search, actionFilter]);

  const formatDetails = (details) => {
    if (!details) return "—";

    const formatted = { ...details };

    ["oldExpiresAt", "newExpiresAt", "expiresAt"].forEach((key) => {
      if (formatted[key]) {
        formatted[key] = formatDate(formatted[key]);
      }
    });

    if (formatted.plan) {
      const planNames = { 1: "Monthly", 2: "6 Months", 3: "Yearly" };
      formatted.plan = `${formatted.plan} (${planNames[formatted.plan]})`;
    }

    if (formatted.price === 0) {
      formatted.price = "0 (admin-created, free)";
    }

    return JSON.stringify(formatted, null, 2);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Audit Log</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          ← Back to Admin Panel
        </Link>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "subscription" ? "active" : ""}`}
            onClick={() => setTab("subscription")}
          >
            Subscriptions
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "movies" ? "active" : ""}`}
            onClick={() => setTab("movies")}
          >
            Movies
          </button>
        </li>
      </ul>

      {/* Filters */}
      <div className="row g-3 mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search by admin email, target email or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="all">All actions</option>
            {tab === "subscription" && (
              <>
                <option value="subscription:cancel">Subscription Cancel</option>
                <option value="subscription:extend">Subscription Extend</option>
                <option value="subscription:create">Subscription Create</option>
              </>
            )}
            {tab === "movies" && (
              <>
                <option value="movie:upload">Movie Upload</option>
                <option value="movie:delete">Movie Delete</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Time</th>
              <th>Admin</th>
              <th>Action</th>
              <th>Target</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted py-4">
                  No actions match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id}>
                  <td className="small">{formatDate(log.timestamp)}</td>
                  <td>{log.adminEmail}</td>
                  <td>
                    <span
                      className={`badge ${
                        log.action.includes("cancel") ||
                        log.action.includes("delete")
                          ? "bg-danger"
                          : log.action.includes("create") ||
                              log.action.includes("upload")
                            ? "bg-success"
                            : "bg-info"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td>
                    {log.targetEmail && <div>{log.targetEmail}</div>}
                    <div className="small text-muted">{log.targetId}</div>
                  </td>
                  <td>
                    <details>
                      <summary className="btn btn-outline-primary btn-sm py-0">
                        Details
                      </summary>
                      <code className="small d-block mt-2">
                        {formatDetails(log.details)}
                      </code>
                    </details>
                  </td>
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
  const [subscriptionData, moviesData] = await Promise.all([
    getServerData(context, "/audit/logs?service=subscription").catch(
      () => null,
    ),
    getServerData(context, "/audit/logs?service=movies-admin").catch(
      () => null,
    ),
  ]);

  return {
    props: {
      subscriptionActions: subscriptionData?.data || [],
      movieActions: moviesData?.data || [],
    },
  };
}
