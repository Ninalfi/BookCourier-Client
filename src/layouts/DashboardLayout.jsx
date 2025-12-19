import { NavLink, Outlet } from "react-router-dom";
import useRole from "../hooks/useRole";

export default function DashboardLayout() {
  const role = useRole();

  const sidebarLinks = {
    user: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "My Orders", path: "/dashboard/orders" },
      { name: "My Profile", path: "/dashboard/profile" },
      { name: "Invoices", path: "/dashboard/invoices" },
    ],
    librarian: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "Add Book", path: "/dashboard/add-book" },
      { name: "My Books", path: "/dashboard/my-books" },
      { name: "Orders", path: "/dashboard/librarian-orders" },
    ],
    admin: [
      { name: "Dashboard", path: "/dashboard" },
      { name: "All Users", path: "/dashboard/all-users" },
      { name: "Manage Books", path: "/dashboard/manage-books" },
      { name: "My Profile", path: "/dashboard/profile" },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
   
      <aside className="w-64 bg-[var(--bc-surface)] p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">Dashboard</h2>
        <p className="mb-4 text-gray-500 capitalize">Role: {role}</p>
        <nav className="flex flex-col gap-2">
          {sidebarLinks[role].map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `p-2 rounded hover:bg-[var(--color-primary)] hover:text-white ${
                  isActive ? "bg-[var(--color-primary)] text-white" : "text-gray-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
