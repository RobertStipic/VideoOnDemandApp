import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { getServerData } from "../../api/init-axios";
import { formatDate } from "../../common/formatDate";

export default function AdminPayments({ payments: initialPayments }) {
  const { user } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState(initialPayments || []);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (user === null) router.push("/user/signin");
    else if (user && user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  const filtered = useMemo(() => {
    let result = payments;

    if (statusFilter !== "all") {
      result = result.filter((p) => p.payment_info?.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.userEmail?.toLowerCase().includes(q) ||
          p.stripeID?.toLowerCase().includes(q) ||
          p.subscriptionId?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [payments, search, statusFilter]);

  const stats = useMemo(() => {
    const total = payments.length;
    const succeeded = payments.filter(
      (p) => p.payment_info?.status === "succeeded",
    ).length;
    const totalRevenue = payments
      .filter((p) => p.payment_info?.status === "succeeded")
      .reduce((sum, p) => sum + (p.payment_info?.amount || 0), 0);

    return {
      total,
      succeeded,
      totalRevenue: totalRevenue.toFixed(2),
    };
  }, [payments]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Manage Payments</h1>
        <Link href="/admin" className="btn btn-outline-secondary">
          ← Back to Admin Panel
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h6 className="mb-1">Total Payments</h6>
              <h3 className="mb-0">{stats.total}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h6 className="mb-1">Succeeded</h6>
              <h3 className="mb-0">{stats.succeeded}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h6 className="mb-1">Total Revenue</h6>
              <h3 className="mb-0">€{stats.totalRevenue}</h3>
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
            placeholder="Search by email, stripe ID or subscription ID..."
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
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Stripe ID</th>
              <th>User Email</th>
              <th>Subscription</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Time</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  No payments match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id || p._id}>
                  <td className="small">{p.stripeID}</td>
                  <td>{p.userEmail}</td>
                  <td className="small">{p.subscriptionId}</td>
                  <td>
                    €{p.payment_info?.amount}{" "}
                    {p.payment_info?.currency?.toUpperCase()}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.payment_info?.status === "succeeded"
                          ? "bg-success"
                          : p.payment_info?.status === "pending"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                      }`}
                    >
                      {p.payment_info?.status}
                    </span>
                  </td>
                  <td className="small">
                    {p.paymentTime ? formatDate(p.paymentTime) : "—"}
                  </td>
                  <td>
                    {p.receipt_info?.receipt_url ? (
                      <a
                        href={p.receipt_info.receipt_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </a>
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
    </div>
  );
}

export async function getServerSideProps(context) {
  const payments = await getServerData(context, "/payment/findall");
  return { props: { payments: payments || [] } };
}
