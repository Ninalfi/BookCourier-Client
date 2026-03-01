// src/pages/Dashboard/Admin/Reports.jsx
import React, { useEffect, useMemo, useState } from "react";
import { FaChartBar, FaSyncAlt, FaTruck, FaUsers, FaBookOpen } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/public/about-stats`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to load reports");
      setStats(data);
    } catch (e) {
      setError(e.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deliveryRateLabel = useMemo(() => {
    const v = Number(stats?.deliveryRate ?? 0);
    return `${v.toFixed(1)}%`;
  }, [stats]);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <FaChartBar /> Reports
            </h1>
            <p className="text-base-content/70 mt-2">
              Platform summary for books, users, orders, delivery and ratings.
            </p>
          </div>

          <button
            onClick={fetchStats}
            className="btn btn-outline rounded-xl"
            type="button"
            disabled={loading}
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {error ? <div className="alert alert-error">{error}</div> : null}

        {loading ? (
          <div className="py-10 text-center">
            <span className="loading loading-spinner loading-lg" />
            <p className="mt-3 text-base-content/70">Loading reports...</p>
          </div>
        ) : !stats ? (
          <div className="rounded-3xl border border-base-300 bg-base-100 p-10 text-center text-base-content/70">
            No report data available.
          </div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-base-200">
                    <FaBookOpen className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Total Books</div>
                    <div className="text-2xl font-bold">{stats.totalBooks}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-base-200">
                    <FaUsers className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Total Users</div>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-base-200">
                    <FaTruck className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Total Orders</div>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-base-200">
                    <FaChartBar className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-base-content/60">Avg Rating</div>
                    <div className="text-2xl font-bold">{stats.avgRating}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery + Top categories */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
                <h3 className="text-lg font-semibold">Delivery</h3>
                <p className="text-sm text-base-content/70 mt-1">
                  Delivered orders vs total orders
                </p>

                <div className="mt-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {deliveryRateLabel}
                      </div>
                      <div className="text-sm text-base-content/70">
                        {stats.deliveredOrders} delivered / {stats.totalOrders} total
                      </div>
                    </div>
                  </div>

                  <progress
                    className="progress progress-primary w-full mt-4"
                    value={stats.deliveryRate}
                    max="100"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Top Categories</h3>
                  <span className="text-xs text-base-content/60">
                    showing {stats.topCategories?.length || 0}
                  </span>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Books</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(stats.topCategories || []).map((c, i) => (
                        <tr key={c.name}>
                          <td>{i + 1}</td>
                          <td className="font-semibold">{c.name}</td>
                          <td>
                            <span className="badge badge-outline badge-primary rounded-xl">
                              {c.count}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p className="mt-4 text-xs text-base-content/60">
                    Data source: /api/public/about-stats
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}