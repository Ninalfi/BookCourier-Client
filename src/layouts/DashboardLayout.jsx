import { NavLink, Outlet } from "react-router-dom";
import useRole from "../hooks/useRole";

export default function DashboardLayout() {
  const role = useRole();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        {role === "user" && (
          <>
            <NavLink to="orders">My Orders</NavLink><br />
            <NavLink to="wishlist">Wishlist</NavLink><br />
            <NavLink to="profile">My Profile</NavLink>
          </>
        )}

        {role === "librarian" && (
          <>
            <NavLink to="add-book">Add Book</NavLink><br />
            <NavLink to="my-books">My Books</NavLink><br />
            <NavLink to="librarian-orders">Orders</NavLink>
          </>
        )}

        {role === "admin" && (
          <>
            <NavLink to="users">All Users</NavLink><br />
            <NavLink to="manage-books">Manage Books</NavLink><br />
            <NavLink to="profile">My Profile</NavLink>
          </>
        )}
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
