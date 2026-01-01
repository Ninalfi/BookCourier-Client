import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";

const StatusBadge = ({ status }) => {
  const common = "inline-flex px-2 py-1 rounded-full text-xs font-semibold border";
  const s = (status || "").toLowerCase();
  if (s === "published")
    return (<span className={`${common} bg-[color:var(--bc-accent)]/10 text-[var(--bc-accent)] border-[color:var(--bc-accent)]/20`}
      >Published</span>
    );
    if (s === "unpublished")
    return (
      <span className={`${common} bg-[var(--bc-bg)] text-[var(--color-primary)] border-[var(--color-secondary)]`}
      >Unpublished</span>
    );
  return (
    <span className={`${common} bg-[color:var(--bc-text)]/5 text-[color:var(--bc-text)]/80 border-[var(--color-secondary)]`}
    >{status || "—"} </span>
  );
};

const MyBooks = () => {

   const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const safeBooks = useMemo(() => (Array.isArray(books) ? books : []), [books]);

  const fetchMyBooks = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      let res = await axiosSecure.get("/librarian/books");
      let list = Array.isArray(res.data) ? res.data : res.data?.books || [];

            if (!Array.isArray(list) || list.length === 0) {
        const res2 = await axiosSecure.get("/books"); // public list
        const all = Array.isArray(res2.data) ? res2.data : [];
        list = all.filter((b) => b.librarianEmail === user.email);
      }
            setBooks(list);
    } catch (err) {
      console.error("Fetch my books error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      fetchMyBooks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

 const toggleStatus = async (id, currentStatus) => {
    const next = (currentStatus || "").toLowerCase() === "published" ? "unpublished" : "published";
    try {
      setBusyId(id);
      await axiosSecure.patch(`/books/${id}`, { status: next });

      setBooks((prev) =>
        (Array.isArray(prev) ? prev : []).map((b) =>
          b._id === id ? { ...b, status: next } : b
        )
      );
            toast.success(`Book ${next}`);
    } catch (err) {
      console.error("Toggle status error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setBusyId(null);
    }
  };

    return (
       <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] p-5 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--bc-text)]">My Books</h2>
          <p className="text-sm text-[color:var(--bc-text)]/70 mt-1"> Total: {safeBooks.length}</p>
        </div>
        <button onClick={fetchMyBooks}
          className="px-4 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
        >Refresh</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-secondary)] text-[var(--bc-text)]">
            <tr>
              <th className="px-5 py-3 text-left font-semibold">Title</th>
              <th className="px-5 py-3 text-left font-semibold">Image</th>
              <th className="px-5 py-3 text-left font-semibold">Status</th>
              <th className="px-5 py-3 text-left font-semibold">Edit</th>
              <th className="px-5 py-3 text-left font-semibold">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-5 py-6 text-[color:var(--bc-text)]/70">
                  Loading books...
                </td>
              </tr>
            ) : safeBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-6 text-[color:var(--bc-text)]/70">
                  No books found.
                </td>
              </tr>
            ) : (
              safeBooks.map((book) => (
                <tr
                  key={book._id}
                  className="border-t border-[var(--color-secondary)] hover:bg-[var(--bc-bg)] transition"
                >
                  <td className="px-5 py-3 text-[var(--bc-text)]">
                    {book.title || "—"}
                  </td>

                  <td className="px-5 py-3">
                    <img
                      src={book.img || book.image || "https://via.placeholder.com/80"}
                      alt={book.title || "Book"}
                      className="h-16 w-12 object-cover rounded-lg border border-[var(--color-secondary)]"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <StatusBadge status={book.status} />
                  </td>

                  <td className="px-5 py-3">
                    <Link
                      to={`/dashboard/edit-book/${book._id}`}
                      className="inline-flex px-3 py-2 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
                    >
                      Edit
                    </Link>
                  </td>

                  <td className="px-5 py-3">
                    <button
                      disabled={busyId === book._id}
                      onClick={() => toggleStatus(book._id, book.status)}
                      className="px-3 py-2 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
                    >
                      {busyId === book._id
                        ? "Updating..."
                        : (book.status || "").toLowerCase() === "published"
                        ? "Unpublish"
                        : "Publish"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyBooks;