import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthProvider";
import useRole from "../../hooks/useRole";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  const [users, setUsers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setPageLoading(true);
      const res = await axiosSecure.get("/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (loading || roleLoading) return;
    if (!user) return;
    if (role !== "admin") {
      setPageLoading(false);
      return;
    }

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, roleLoading, user, role]);

  const changeRole = async (id, newRole) => {
    try {
      await axiosSecure.patch(`/users/role/${id}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Change role error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };
  if (loading || roleLoading || pageLoading) {
    return (
      <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] rounded-2xl p-6 shadow-sm">
        <p className="text-[var(--bc-text)]">Loading users...</p>
      </div>
    );
  }
  if (role !== "admin") {
    return (
      <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-primary)]">Access denied</h2>
        <p className="text-[var(--bc-text)] mt-1">Admin only.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--color-secondary)] flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-primary)]">
            All Registered Users
          </h2>
          <p className="text-sm text-[color:var(--bc-text)]/70 mt-1">
            Total: {users.length}
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
        > Refresh </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-secondary)] text-[var(--bc-text)]">
            <tr>
              <th className="py-3 px-6 text-left font-semibold">Name</th>
              <th className="py-3 px-6 text-left font-semibold">Email</th>
              <th className="py-3 px-6 text-left font-semibold">Role</th>
              <th className="py-3 px-6 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 px-6 text-center text-[color:var(--bc-text)]/70">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-[var(--color-secondary)] hover:bg-[var(--bc-bg)] transition"
                >
                  <td className="py-3 px-6 text-[var(--bc-text)]">{u.name || "—"}</td>
                  <td className="py-3 px-6 text-[var(--bc-text)]">{u.email || "—"}</td>
                  <td className="py-3 px-6 capitalize font-semibold text-[var(--bc-accent)]">
                    {u.role || "user"}
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex flex-wrap gap-2">
                      {u.role !== "librarian" && (
                        <button
                          onClick={() => changeRole(u._id, "librarian")}
                          className="px-3 py-2 rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--bc-accent)] hover:text-white transition"
                        >Make Librarian
                        </button>
                      )}
                      {u.role !== "admin" && (
                        <button
                          onClick={() => changeRole(u._id, "admin")}
                          className="px-3 py-2 rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold hover:bg-[var(--bc-accent)] hover:text-white transition"
                        > Make Admin
                        </button>
                      )}
                    </div>
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
export default ManageUsers;
