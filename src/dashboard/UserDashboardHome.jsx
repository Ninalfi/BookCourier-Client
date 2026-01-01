import { useEffect, useMemo, useState } from "react";
import useRole from "../hooks/useRole";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useAuth } from "../contexts/AuthProvider";
import {FaBook,FaClipboardList, FaUsers, FaTruck, FaCheckCircle,FaClock,FaMoneyBillWave,} from "react-icons/fa";

function StatCard({ title, value, icon, subtitle }) {
  return (
    <div className="rounded-2xl bg-[var(--bc-surface)] shadow-sm border border-[var(--color-secondary)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[color:var(--bc-text)]/70">{title}</p>
          <h3 className="mt-1 text-2xl font-bold text-[var(--bc-text)]">{value}</h3>
          {subtitle ? (
            <p className="mt-1 text-xs text-[color:var(--bc-text)]/70">{subtitle}</p>
          ) : null}
        </div>
        <div className="p-3 rounded-xl bg-[var(--color-secondary)] text-[var(--color-primary)] text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Table({ title, columns, rows, emptyText = "No data found" }) {
  return (
    <div className="rounded-2xl bg-[var(--bc-surface)] shadow-sm border border-[var(--color-secondary)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-secondary)] flex items-center justify-between">
        <h3 className="font-semibold text-[var(--bc-text)]">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-secondary)] text-[var(--bc-text)]">
            <tr>
              {columns.map((c) => (
                <th key={c} className="text-left px-5 py-3 font-semibold">{c}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows?.length ? (
              rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t border-[var(--color-secondary)] hover:bg-[var(--bc-bg)] transition"
                >
                  {row.map((cell, i) => (
                    <td key={i} className="px-5 py-3 text-[color:var(--bc-text)]/90">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-5 py-6 text-[color:var(--bc-text)]/70"
                  colSpan={columns.length}
                >{emptyText}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const common =
    "inline-flex px-2 py-1 rounded-full text-xs font-semibold border";

  if (status === "pending")
    return (
      <span
        className={`${common} bg-(--color-secondary) text-(--color-primary) border-(--color-secondary)`}
      > Pending</span>
    );

  if (status === "shipped")
    return (
      <span
        className={`${common} bg-[var(--bc-bg)] text-[var(--bc-accent)] border-[var(--color-secondary)]`}
      >Shipped </span>
    );

  if (status === "delivered")
    return (
      <span
        className={`${common} bg-[color:var(--bc-accent)]/10 text-[var(--bc-accent)] border-[color:var(--bc-accent)]/20`}
      >Delivered </span>
    );

  if (status === "cancelled")
    return (
      <span
        className={`${common} bg-[color:var(--bc-text)]/5 text-[color:var(--bc-text)]/80 border-[var(--color-secondary)]`}
      >Cancelled</span>
    );

  return (
    <span
      className={`${common} bg-[color:var(--bc-text)]/5 text-[color:var(--bc-text)]/80 border-[var(--color-secondary)]`}
    >{status || "—"}</span>
  );
}

function PaymentBadge({ status }) {
  const common =
    "inline-flex px-2 py-1 rounded-full text-xs font-semibold border";
  if (status === "paid")
    return (
      <span className={`${common} bg-(--bc-accent)/10 text-(--bc-accent) border-(--bc-accent)/20`}
      > Paid</span>
    );
  return (
    <span className={`${common} bg-(--bc-bg) text-(--color-primary) border-(--color-secondary)`}
    > Unpaid </span>
  );
}

const UserDashboardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role, roleLoading } = useRole();

  const [loading, setLoading] = useState(true);
  const [myOrders, setMyOrders] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [librarianOrders, setLibrarianOrders] = useState([]);
  const [librarianBooks, setLibrarianBooks] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminBooks, setAdminBooks] = useState([]);

  useEffect(() => {
    if (roleLoading || !role) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (role === "user") {
          const [ordersRes, paymentsRes] = await Promise.all([
            axiosSecure.get("/orders/my"),
            axiosSecure.get("/payments/my"),
          ]);
         setMyOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setMyPayments(Array.isArray(paymentsRes.data?.payments) ? paymentsRes.data.payments : []);
       }

        if (role === "librarian") {
          const [ordersRes, booksRes] = await Promise.all([
            axiosSecure.get("/librarian/orders"),
            axiosSecure.get("/librarian/books"),
          ]);
          setLibrarianOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setLibrarianBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      }

        if (role === "admin") {
          const [usersRes, booksRes] = await Promise.all([
            axiosSecure.get("/users"),
            axiosSecure.get("/manage-books"),
          ]);
          setAdminUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setAdminBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
     }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role, roleLoading, axiosSecure]);

  const orderStats = useMemo(() => {
    const list = role === "user" ? myOrders : role === "librarian" ? librarianOrders : [];

     const count = (key, value) => list.filter((o) => o?.[key] === value).length;

    return {
      total: list.length,
      pending: count("orderStatus", "pending"),
      shipped: count("orderStatus", "shipped"),
      delivered: count("orderStatus", "delivered"),
      cancelled: count("orderStatus", "cancelled"),
      paid: count("paymentStatus", "paid"),
      unpaid: count("paymentStatus", "unpaid"),
    };
  }, [role, myOrders, librarianOrders]);

  const paymentTotal = useMemo(() => {
    const total = (myPayments || []).reduce(
      (sum, p) => sum + (Number(p?.amount) || 0),
      0
    );
    return total.toFixed(2);
  }, [myPayments]);

  const recentOrdersRows = useMemo(() => {
    const list = role === "user" ? myOrders : role === "librarian" ? librarianOrders : [];

    return (list || []).slice(0, 6).map((o) => [
      o.bookTitle || "—",
      new Date(o.orderDate || o.createdAt || Date.now()).toLocaleDateString(),
      <StatusBadge key={`s-${o?._id}`} status={o?.orderStatus} />,
      <PaymentBadge key={`p-${o?._id}`} status={o?.paymentStatus} />,
    ]);
  }, [role, myOrders, librarianOrders]);

  const recentPaymentsRows = useMemo(() => {
    return (myPayments || []).slice(0, 6).map((p) => [
      p.paymentId || "—",
      `$${Number(p?.amount || 0).toFixed(2)}`,
      new Date(p?.date || p.createdAt || Date.now()).toLocaleDateString(),
    ]);
  }, [myPayments]);

  if (roleLoading || loading) {
    return (
      <div className="py-10">
        <div className="rounded-2xl bg-[var(--bc-surface)] border border-[var(--color-secondary)] shadow-sm p-6">
          <div className="flex items-center gap-3">
            <span className="loading loading-spinner loading-md text-[var(--color-primary)]"></span>
            <p className="text-[color:var(--bc-text)]/80">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 bg-[var(--bc-bg)]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--bc-text)]">
          Welcome{user?.displayName ? `, ${user.displayName}` : ""} 👋
        </h1>
        <p className="mt-1 text-[color:var(--bc-text)]/70">
          Role: <span className="capitalize font-semibold text-[var(--color-primary)]">{role}</span>
        </p>
      </div>

      {role === "user" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Orders" value={orderStats.total} icon={<FaClipboardList />} />
          <StatCard title="Pending Orders" value={orderStats.pending} icon={<FaClock />} />
          <StatCard title="Paid Orders" value={orderStats.paid} icon={<FaCheckCircle />} />
          <StatCard title="Total Paid" value={`$${paymentTotal}`} icon={<FaMoneyBillWave />} />
        </div>
      )}

      {role === "librarian" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="My Books" value={librarianBooks.length} icon={<FaBook />} />
          <StatCard title="Total Orders" value={orderStats.total} icon={<FaClipboardList />} />
          <StatCard title="Pending" value={orderStats.pending} icon={<FaClock />} />
          <StatCard title="Delivered" value={orderStats.delivered} icon={<FaTruck />} />
        </div>
      )}

      {role === "admin" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Users" value={adminUsers.length} icon={<FaUsers />} />
          <StatCard title="Total Books" value={adminBooks.length} icon={<FaBook />} />
          <StatCard
            title="Published"
            value={adminBooks.filter((b) => b.status === "published").length}
            icon={<FaCheckCircle />}
            subtitle="Visible on All Books"
          />
          <StatCard
            title="Unpublished"
            value={adminBooks.filter((b) => b.status === "unpublished").length}
            icon={<FaClock />}
            subtitle="Hidden from users"
          />
        </div>
      )}

      {/* Tables */}
<div className="grid lg:grid-cols-2 gap-6">
  {(role === "user" || role === "librarian") && (
    <div className="lg:col-span-2">
      <Table
        title="Recent Orders"
        columns={["Book", "Date", "Status", "Payment"]}
        rows={recentOrdersRows}
        emptyText="No orders yet."
      />
    </div>
  )}

  {role === "user" && (
    <div className="lg:col-span-2">
      <Table
        title="Recent Payments"
        columns={["Payment ID", "Amount", "Date"]}
        rows={recentPaymentsRows}
        emptyText="No payments yet."
      />
    </div>
  )}

  {role === "admin" && (
    <Table
      title="Latest Users"
      columns={["Name", "Email", "Role"]}
      rows={(adminUsers || []).slice(0, 8).map((u) => [
        u?.name || "—",
        u?.email || "—",
        <span
          key={u?._id}
          className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-[var(--color-secondary)] text-[var(--color-primary)]"
        >
          {u?.role || "user"}
        </span>,
      ])}
      emptyText="No users found."
    />
  )}

  {role === "admin" && (
    <Table
      title="Latest Books"
      columns={["Title", "Author", "Status"]}
      rows={(adminBooks || []).slice(0, 8).map((b) => [
        b?.title || "—",
        b?.author || "—",
        <span
          key={b?._id}
          className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border ${
            b?.status === "published"
              ? "bg-[color:var(--bc-accent)]/10 text-[var(--bc-accent)] border-[color:var(--bc-accent)]/20"
              : "bg-[var(--bc-bg)] text-[var(--color-primary)] border-[var(--color-secondary)]"
          }`}
        >
          {b?.status || "—"}
        </span>,
      ])}
      emptyText="No books found."
    />
  )}
</div>
    </div>
  );
};

export default UserDashboardHome;
