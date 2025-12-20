import React, { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("TOKEN 👉", token);

    axios
      .get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("ADMIN USERS RESPONSE 👉", res.data);
        setUsers(res.data.users || []);
      })
      .catch((err) => console.error("ADMIN USERS ERROR 👉", err));
  }, []);

  const changeRole = (id, role) => {
    axios
      .patch(
        `http://localhost:3000/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-yellow-500">All the users who logged-in/registered in this website</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-secondary border rounded-lg shadow-md">
          <thead className="bg-purple-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-primary">
                <td className="py-3 px-6">{u.name}</td>
                <td className="py-3 px-6">{u.email}</td>
                <td className="py-3 px-6 capitalize">{u.role}</td>
                <td className="py-3 px-6 flex gap-2">
                  {u.role !== "librarian" && (
                    <button
                      onClick={() => changeRole(u._id, "librarian")}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors text-sm"
                    >
                      Make Librarian
                    </button>
                  )}
                  {u.role !== "admin" && (
                    <button
                      onClick={() => changeRole(u._id, "admin")}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors text-sm"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
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

export default AllUsers;