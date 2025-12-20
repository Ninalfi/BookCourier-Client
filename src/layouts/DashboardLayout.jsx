import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaBook,
  FaUser,
  FaFileInvoiceDollar,
  FaUsers,
  FaClipboardList,
} from "react-icons/fa";
import useRole from "../hooks/useRole";
import Navbar from "../components/Shared/Navbar";
import { MdPayment } from "react-icons/md";

export default function DashboardLayout() {
  const { role, roleLoading } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarLinks = {
    user: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "My Orders", path: "/dashboard/my-orders", icon: <FaBook /> },
      { name: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
      { name: "Payments", path: "/dashboard/payments", icon: <MdPayment /> },
      { name: "Invoices", path: "/dashboard/invoices", icon: <FaFileInvoiceDollar /> },
    ],
    librarian: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Add Book", path: "/dashboard/add-book", icon: <FaBook /> },
      { name: "My Books", path: "/dashboard/my-books", icon: <FaClipboardList /> },
      { name: "Orders", path: "/dashboard/librarian-orders", icon: <FaBook /> },
    ],
    admin: [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "All Users", path: "/dashboard/all-users", icon: <FaUsers /> },
      { name: "Manage Books", path: "/dashboard/manage-books", icon: <FaBook /> },
      { name: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
    ],
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen bg-[var(--bc-bg)] flex items-center justify-center">
        <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm p-6 flex items-center gap-3">
          <span className="loading loading-spinner loading-md text-[var(--color-primary)]"></span>
          <p className="text-[color:var(--bc-text)]/80">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const links = sidebarLinks[role] || sidebarLinks.user;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-2.5 rounded-xl transition ${
      isActive
        ? "bg-[var(--color-primary)] text-white shadow-sm"
        : "text-[color:var(--bc-text)]/85 hover:bg-[var(--color-secondary)] hover:text-[var(--bc-text)]"
    }`;

  return (
    <div className="flex min-h-screen bg-[var(--bc-bg)]">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-[var(--bc-surface)] border-r border-[var(--color-secondary)] p-6 shadow-sm transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-primary)] leading-tight">
                Dashboard
              </h2>
              <p className="text-xs mt-1 text-[color:var(--bc-text)]/70">
                BookCourier Panel
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-[var(--color-secondary)] text-[var(--bc-text)]"
            aria-label="Toggle sidebar"
          >
            <FaBars />
          </button>
        </div>

        {!collapsed && (
          <div className="mb-5 rounded-xl bg-[var(--bc-bg)] border border-[var(--color-secondary)] p-3">
            <p className="text-xs text-[color:var(--bc-text)]/70">Signed in as</p>
            <p className="text-sm font-semibold text-[var(--bc-text)] capitalize">{role}</p>
          </div>
        )}

        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink key={link.name} to={link.path} className={linkClass}>
              <span className="text-lg">{link.icon}</span>
              {!collapsed && <span className="font-medium">{link.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom small hint */}
        {!collapsed && (
          <div className="mt-auto pt-6">
            <div className="rounded-xl bg-[color:var(--bc-accent)]/10 border border-[color:var(--bc-accent)]/20 p-3">
              <p className="text-xs font-semibold text-[var(--bc-accent)]">
                Tip
              </p>
              <p className="text-xs text-[color:var(--bc-text)]/75 mt-1">
                Keep your profile updated for smoother deliveries and tracking.
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="bg-black/40 w-full h-full"
          onClick={() => setMobileOpen(false)}
        ></div>

        <aside className="absolute left-0 top-0 w-72 h-full bg-[var(--bc-surface)] border-r border-[var(--color-secondary)] shadow-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                Dashboard
              </h2>
              <p className="text-xs text-[color:var(--bc-text)]/70 mt-1 capitalize">
                Role: {role}
              </p>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl hover:bg-[var(--color-secondary)]"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <span className="text-lg">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        {/* Mobile hamburger */}
        <button
          className="md:hidden mb-4 px-3 py-2 rounded-xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] text-[var(--bc-text)]"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <FaBars />
        </button>

        {/* Top Navbar */}
        <Navbar className="w-full" />

        {/* Content */}
        <div className="mt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
