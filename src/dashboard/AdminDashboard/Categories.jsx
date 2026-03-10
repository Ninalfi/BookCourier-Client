import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaSyncAlt, FaLayerGroup } from "react-icons/fa";

const API = import.meta.env.VITE_API_URL || "https://book-courier-server-iota.vercel.app";

export default function Categories() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/public/categories`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to load categories");
      setCategories(data?.data || []);
    } catch (e) {
      setError(e.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(term));
  }, [categories, q]);

  const totalBooks = useMemo(
    () => categories.reduce((sum, c) => sum + (Number(c.count) || 0), 0),
    [categories]
  );

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <FaLayerGroup /> Categories
            </h1>
            <p className="text-base-content/70 mt-2">
              View top categories and how many books exist in each category.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <label className="input input-bordered flex items-center gap-2 rounded-xl w-full sm:w-80">
              <FaSearch className="opacity-60" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                className="grow"
                placeholder="Search categories..."
              />
            </label>

            <button
              onClick={fetchCategories}
              className="btn btn-outline rounded-xl"
              type="button"
              disabled={loading}
              title="Refresh"
            >
              <FaSyncAlt />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
            <div className="text-sm text-base-content/60">Total categories</div>
            <div className="text-2xl font-bold">{categories.length}</div>
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
            <div className="text-sm text-base-content/60">Total books</div>
            <div className="text-2xl font-bold">{totalBooks}</div>
          </div>
          <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
            <div className="text-sm text-base-content/60">Showing</div>
            <div className="text-2xl font-bold">{filtered.length}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
        {error ? <div className="alert alert-error">{error}</div> : null}

        {loading ? (
          <div className="py-10 text-center">
            <span className="loading loading-spinner loading-lg" />
            <p className="mt-3 text-base-content/70">Loading categories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-base-content/70">
            No categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Books</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr key={c.name}>
                    <td>{idx + 1}</td>
                    <td className="font-semibold">{c.name}</td>
                    <td>
                      <span className="badge badge-primary badge-outline rounded-xl">
                        {c.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="mt-4 text-xs text-base-content/60">
              Data source: /api/public/categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}