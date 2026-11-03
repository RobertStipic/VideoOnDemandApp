import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import api from "../../api/axios-instance";
import { getServerData } from "../../api/init-axios";
import { formatDateShort } from "../../common/formatDate";

export default function AdminSubscriptions({ subscriptions: initialSubs }) {
  const { user } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState(initialSubs || []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cancelling, setCancelling] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [createEmail, setCreateEmail] = useState("");
  const [createPlan, setCreatePlan] = useState(1);
  const [extending, setExtending] = useState(null);
  const [extendModal, setExtendModal] = useState(null); // { id, userEmail, currentExpiresAt }
  const [extendDays, setExtendDays] = useState(30);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const filtered = useMemo(() => {
    let result = subscriptions;

    if (statusFilter !== "all") {
      result = result.filter(
        (subscriptions) => subscriptions.status === statusFilter,
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (subscriptions) =>
          subscriptions.userEmail?.toLowerCase().includes(q) ||
          subscriptions._id?.toLowerCase().includes(q),
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

  const handleCreate = async () => {
    setCreating(true);
    setError("");

    try {
      const res = await api.post("/subscription/admin/create", {
        email: createEmail,
        plan: parseInt(createPlan),
      });

      setSubscriptions((prev) => [res.data.subscription, ...prev]);
      setCreateModal(false);
      setCreateEmail("");
      setCreatePlan(1);
    } catch (err) {
      setError(err.response?.data || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const openExtendModal = (id, userEmail, currentExpiresAt) => {
    setExtendModal({ id, userEmail, currentExpiresAt });
    setExtendDays(30);
  };

  const closeExtendModal = () => {
    setExtendModal(null);
    setExtendDays(30);
  };

  const handleExtend = async () => {
    if (!extendModal) return;

    setExtending(extendModal.id);
    setError("");

    try {
      const res = await api.patch(
        `/subscription/admin/extend/${extendModal.id}`,
        { days: parseInt(extendDays) },
      );

      setSubscriptions((prev) =>
        prev.map((subscriptions) =>
          subscriptions.id === extendModal.id ||
          subscriptions._id === extendModal.id
            ? { ...subscriptions, expiresAt: res.data.newExpiresAt }
            : subscriptions,
        ),
      );

      closeExtendModal();
    } catch (err) {
      setError(err.response?.data || "Extend failed");
    } finally {
      setExtending(null);
    }
  };

  const handleCancel = async (id, userEmail) => {
    if (
      !window.confirm(
        `Cancel subscription for ${userEmail}? The user will lose access immediately.`,
      )
    ) {
      return;
    }

    setCancelling(id);
    setError("");

    try {
      await api.delete(`/subscription/admin/remove/${id}`);
      setSubscriptions((prev) =>
        prev.map((subscriptions) =>
          subscriptions.id === id || subscriptions._id === id
            ? { ...subscriptions, status: "cancelled" }
            : subscriptions,
        ),
      );
    } catch (err) {
      setError(err.response?.data || "Cancel failed");
    } finally {
      setCancelling(null);
    }
  };

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-success"
          onClick={() => setCreateModal(true)}
        >
          + New Subscription
        </button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
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
              <th>Actions</th>
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
              filtered.map((subscriptions) => (
                <tr key={subscriptions.id || subscriptions._id}>
                  <td className="small">
                    {subscriptions.id || subscriptions._id}
                  </td>
                  <td>{subscriptions.userEmail}</td>
                  <td>{subscriptions.plan}</td>
                  <td>
                    <span
                      className={`badge ${
                        subscriptions.status === "succeeded"
                          ? "bg-success"
                          : subscriptions.status === "pending"
                            ? "bg-warning text-dark"
                            : subscriptions.status === "cancelled"
                              ? "bg-danger"
                              : subscriptions.status === "extended"
                                ? "bg-info"
                                : subscriptions.status === "paymentExpired"
                                  ? "bg-dark text-white"
                                  : "bg-secondary"
                      }`}
                    >
                      {subscriptions.status}
                    </span>
                  </td>
                  <td>€{subscriptions.price}</td>
                  <td>
                    {subscriptions.expiresAt
                      ? formatDateShort(subscriptions.expiresAt)
                      : "—"}
                  </td>
                  <td>
                    {subscriptions.status === "succeeded" ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            openExtendModal(
                              subscriptions.id || subscriptions._id,
                              subscriptions.userEmail,
                              subscriptions.expiresAt,
                            )
                          }
                          disabled={
                            extending ===
                            (subscriptions.id || subscriptions._id)
                          }
                        >
                          Extend
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleCancel(
                              subscriptions.id || subscriptions._id,
                              subscriptions.userEmail,
                            )
                          }
                          disabled={
                            cancelling ===
                            (subscriptions.id || subscriptions._id)
                          }
                        >
                          {cancelling ===
                          (subscriptions.id || subscriptions._id)
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {createModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={() => setCreateModal(false)}
          ></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create Subscription</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setCreateModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>User Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="form-group mt-3">
                    <label>Plan</label>
                    <select
                      className="form-select"
                      value={createPlan}
                      onChange={(e) => setCreatePlan(e.target.value)}
                    >
                      <option value="1">Monthly (€12)</option>
                      <option value="2">6 Months (€55)</option>
                      <option value="3">Yearly (€100)</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleCreate}
                    disabled={creating || !createEmail}
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {extendModal && (
        <>
          <div
            className="modal-backdrop fade show"
            onClick={closeExtendModal}
          ></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Extend Subscription</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeExtendModal}
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="small text-muted mb-1">
                    <strong>User:</strong> {extendModal.userEmail}
                  </p>
                  <p className="small text-muted mb-3">
                    <strong>Current expiry:</strong>{" "}
                    {formatDateShort(extendModal.currentExpiresAt)}
                  </p>

                  <label htmlFor="extendDays" className="form-label">
                    Days to add:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="extendDays"
                    min="1"
                    max="365"
                    value={extendDays}
                    onChange={(e) => setExtendDays(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeExtendModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleExtend}
                    disabled={extending === extendModal.id || extendDays < 1}
                  >
                    {extending === extendModal.id ? "Extending..." : "Extend"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const subscriptions = await getServerData(context, "/subscription/findall");
  return { props: { subscriptions: subscriptions || [] } };
}
