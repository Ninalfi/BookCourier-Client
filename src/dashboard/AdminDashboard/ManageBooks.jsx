import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/manage-books", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setBooks(res.data.books || []))
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = (id, status) => {
    axios
      .patch(
        `http://localhost:3000/manage-books/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setBooks((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status } : b))
        );
      });
  };

  const deleteBook = (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    axios
      .delete(`http://localhost:3000/manage-books/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => setBooks((prev) => prev.filter((b) => b._id !== id)));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)] text-center">
        📚 Manage Books
      </h2>

      <div className="overflow-x-auto bg-[var(--bc-surface)] rounded-lg shadow-lg">
        <table className="min-w-full border border-[var(--bc-bg)]">
          <thead className="bg-[var(--color-primary)] text-white">
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Author</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((b, index) => (
                <tr
                  key={b._id}
                  className="hover:bg-[var(--bc-bg)] transition-colors"
                >
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6 font-medium text-[var(--bc-text)]">
                    {b.title}
                  </td>
                  <td className="py-3 px-6 text-[var(--bc-text)]">{b.author}</td>

                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        b.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="py-3 px-6 text-center flex justify-center gap-2">
                    <button
                      onClick={() =>
                        updateStatus(
                          b._id,
                          b.status === "published" ? "unpublished" : "published"
                        )
                      }
                      className={`px-3 py-1 rounded text-white text-sm ${
                        b.status === "published"
                          ? "bg-[var(--color-primary)] hover:bg-[var(--bc-accent)]"
                          : "bg-[var(--bc-accent)] hover:bg-[var(--color-primary)]"
                      }`}
                    >
                      {b.status === "published" ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      onClick={() => deleteBook(b._id)}
                      className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                      Delete
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

export default ManageBooks;
