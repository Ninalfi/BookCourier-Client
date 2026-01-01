import { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border";
  if (status === "published") {
    return (
      <span className={`${base} bg-(--bc-accent)/10 text-(--bc-accent) border-(--bc-accent)/20`}>Published</span>
    );
  }
  if (status === "unpublished") {
    return (
      <span className={`${base} bg-(--bc-bg) text-(--color-primary) border-(--color-secondary)`}>Unpublished</span>
    );
  }
  return (
    <span className={`${base} bg-(--bc-text)/5 text-(--bc-text)/80 border-(--color-secondary)`}>
      {status || "—"}</span>
  );
}

const ManageBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axiosSecure.get("/manage-books");

      const data = res.data;
      const list = Array.isArray(data) ? data : data?.books || [];
      setBooks(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("ManageBooks fetch error:", err.response?.data || err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roleLoading) return;
    if (role !== "admin") {
      setLoading(false);
      return;
    }
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, roleLoading]);

  const filteredSorted = useMemo(() => {
    let list = Array.isArray(books) ? [...books] : [];

    const needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter((b) => {
        const title = String(b.title || "").toLowerCase();
        const author = String(b.author || "").toLowerCase();
        const postedBy = String(b.postedBy || b.librarianEmail || "").toLowerCase();
        return title.includes(needle) || author.includes(needle) || postedBy.includes(needle);
      });
    }
    if (statusFilter !== "all") {
      list = list.filter((b) => (b.status || "published") === statusFilter);
    }
    const getPrice = (b) => {
      const raw = b.price;
      if (typeof raw === "number") return raw;
      if (typeof raw === "string") return Number(raw.replace(/[^0-9.]/g, "")) || 0;
      return 0;
    };

    const getDate = (b) => {
      const d = b.createdAt || b.date || b.postedAt;
      const t = d ? new Date(d).getTime() : 0;
      return Number.isFinite(t) ? t : 0;
    };

    if (sort === "newest") list.sort((a, b) => getDate(b) - getDate(a));
    if (sort === "oldest") list.sort((a, b) => getDate(a) - getDate(b));
    if (sort === "priceAsc") list.sort((a, b) => getPrice(a) - getPrice(b));
    if (sort === "priceDesc") list.sort((a, b) => getPrice(b) - getPrice(a));
    if (sort === "titleAsc") list.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));

    return list;
  }, [books, q, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page]);

  useEffect(() => {
    setPage(1);
  }, [q, statusFilter, sort]);

  const toggleStatus = async (book) => {
    const nextStatus = (book.status || "published") === "published" ? "unpublished" : "published";

    try {
      await axiosSecure.patch(`/books/${book._id}`, { status: nextStatus });

      setBooks((prev) =>
        (Array.isArray(prev) ? prev : []).map((b) =>
          b._id === book._id ? { ...b, status: nextStatus } : b
        )
      );
    } catch (err) {
      console.error("Update status error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const deleteBook = async (book) => {
    const ok = window.confirm(`Delete "${book.title || "this book"}"? This cannot be undone.`);
    if (!ok) return;

    try {
      await axiosSecure.delete(`/books/${book._id}`);
      setBooks((prev) => (Array.isArray(prev) ? prev : []).filter((b) => b._id !== book._id));
    } catch (err) {
      console.error("Delete book error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to delete book");
    }
  };

  const stats = useMemo(() => {
    const list = Array.isArray(books) ? books : [];
    const total = list.length;
    const published = list.filter((b) => (b.status || "published") === "published").length;
    const unpublished = list.filter((b) => (b.status || "published") === "unpublished").length;
    return { total, published, unpublished };
  }, [books]);

  if (roleLoading || loading) {
    return (
      <div className="py-10">
        <div className="rounded-2xl bg-(--bc-surface) border border-(--color-secondary) shadow-sm p-6">
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-md text-(--color-primary)"></span>
            <p className="text-(--bc-text)/80">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm p-6">
        <h2 className="text-xl font-bold text-[var(--color-primary)]">Access denied</h2>
        <p className="text-[color:var(--bc-text)]/70 mt-1">Admin only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[var(--bc-text)]">Manage Books</h2>
          <p className="text-[color:var(--bc-text)]/70 mt-1">Review, publish/unpublish, and remove books from the catalog.</p>
        </div>
        <button onClick={fetchBooks} className="px-4 py-2 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
        >Refresh</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm p-5">
          <p className="text-sm text-[color:var(--bc-text)]/70">Total books</p>
          <p className="text-2xl font-bold text-[var(--bc-text)] mt-1">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm p-5">
          <p className="text-sm text-[color:var(--bc-text)]/70">Published</p>
          <p className="text-2xl font-bold text-[var(--bc-text)] mt-1">{stats.published}</p>
        </div>
        <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm p-5">
          <p className="text-sm text-[color:var(--bc-text)]/70">Unpublished</p>
          <p className="text-2xl font-bold text-[var(--bc-text)] mt-1">{stats.unpublished}</p>
        </div>
      </div>
      <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm p-4 mb-6">
        <div className="grid md:grid-cols-3 gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, author, postedBy…"
            className="w-full px-4 py-2 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] text-[var(--bc-text)] outline-none focus:border-[var(--color-primary)]"
          />

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] text-[var(--bc-text)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] text-[var(--bc-text)] outline-none focus:border-[var(--color-primary)]"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="priceAsc">Sort: Price (Low → High)</option>
            <option value="priceDesc">Sort: Price (High → Low)</option>
            <option value="titleAsc">Sort: Title (A → Z)</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-secondary)] flex items-center justify-between">
          <p className="text-sm text-[color:var(--bc-text)]/70"> Showing <span className="font-semibold text-[var(--bc-text)]">{paged.length}</span> of{" "} <span className="font-semibold text-[var(--bc-text)]">{filteredSorted.length}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--color-primary)] font-semibold disabled:opacity-50"
            > Prev</button>
            <span className="text-sm text-[color:var(--bc-text)]/80"> Page <span className="font-semibold text-[var(--bc-text)]">{page}</span> / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--color-primary)] font-semibold disabled:opacity-50"
            >Next</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[var(--color-secondary)] text-[var(--bc-text)]">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Book</th>
                <th className="text-left px-5 py-3 font-semibold">Author</th>
                <th className="text-left px-5 py-3 font-semibold">Price</th>
                <th className="text-left px-5 py-3 font-semibold">Posted By</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
                <th className="text-right px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-8 text-center text-[color:var(--bc-text)]/70">No books found.</td>
                </tr>
              ) : (
                paged.map((b) => {
                  const rawPrice = b.price;
                  const price =
                    typeof rawPrice === "number"
                      ? rawPrice
                      : typeof rawPrice === "string"
                      ? Number(rawPrice.replace(/[^0-9.]/g, "")) || 0
                      : 0;

                  return (
                    <tr key={b._id} className="border-t border-[var(--color-secondary)] hover:bg-[var(--bc-bg)] transition">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {b.img || b.image ? (
                            <img src={b.img || b.image} alt={b.title || "Book"} className="h-12 w-10 rounded object-cover border border-[var(--color-secondary)]"/>
                          ) : (
                            <div className="h-12 w-10 rounded bg-[var(--bc-bg)] border border-[var(--color-secondary)]" />
                          )}

                          <div>
                            <p className="font-semibold text-[var(--bc-text)]">{b.title || "—"}</p>
                            <p className="text-xs text-[color:var(--bc-text)]/70">{b.category ? `Category: ${b.category}` : "—"} </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[color:var(--bc-text)]/90">{b.author || "—"}</td>
                      <td className="px-5 py-3 text-[color:var(--bc-text)]/90">${price.toFixed(2)}</td>
                      <td className="px-5 py-3 text-[color:var(--bc-text)]/90">{b.postedBy || b.librarianEmail || "—"} </td>

                      <td className="px-5 py-3"><StatusBadge status={b.status || "published"} /> </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => toggleStatus(b)} className="px-3 py-2 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition">
                            Toggle </button>
                          <button onClick={() => deleteBook(b)} className="px-3 py-2 rounded-xl bg-[var(--bc-accent)] text-white font-semibold hover:opacity-90 transition">Delete </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
