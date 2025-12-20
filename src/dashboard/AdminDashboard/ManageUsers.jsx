import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data.users || []);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const changeRole = (id, role) => {
    axios
      .patch(
        `http://localhost:3000/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role } : u))
        );
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">
        All Registered Users
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-[var(--bc-surface)] rounded-lg shadow-lg">
          <thead className="bg-[var(--color-primary)] text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-b hover:bg-[var(--bc-bg)] transition-colors"
              >
                <td className="py-3 px-6 text-[var(--bc-text)]">{u.name}</td>
                <td className="py-3 px-6 text-[var(--bc-text)]">{u.email}</td>
                <td className="py-3 px-6 capitalize text-[var(--bc-accent)]">{u.role}</td>
                <td className="py-3 px-6 flex gap-2">
                  {u.role !== "librarian" && (
                    <button
                      onClick={() => changeRole(u._id, "librarian")}
                      className="bg-[var(--color-secondary)] text-[var(--color-primary)] px-3 py-1 rounded hover:bg-[var(--bc-accent)] transition-colors text-sm"
                    >
                      Make Librarian
                    </button>
                  )}
                  {u.role !== "admin" && (
                    <button
                      onClick={() => changeRole(u._id, "admin")}
                      className="bg-[var(--color-secondary)] text-[var(--color-primary)] px-3 py-1 rounded hover:bg-[var(--bc-accent)] transition-colors text-sm"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
