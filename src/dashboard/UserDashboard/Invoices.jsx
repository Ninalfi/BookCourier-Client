import { useEffect, useMemo, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthProvider";

const Invoices = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const safePayments = useMemo(
    () => (Array.isArray(payments) ? payments : []),
    [payments]
  );

  const load = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      const res = await axiosSecure.get("/payments/my");
      const list = res.data?.payments || [];
      setPayments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error(
        "Invoices fetch error:",
        err?.response?.status,
        err?.response?.data
      );
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) {     
      setPayments([]);
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.email]);

  return (
    <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] p-5 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-[var(--bc-text)]">Invoices</h2>
          <p className="text-sm text-[color:var(--bc-text)]/70 mt-1">
            Your completed payments and invoice history.
          </p>
        </div>
        <button onClick={load}  className="px-4 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
        >Refresh </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-[var(--color-secondary)] text-[var(--bc-text)]">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">#</th>
              <th className="px-4 py-3 text-left font-semibold">Payment ID</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Order ID</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-[color:var(--bc-text)]/70">
                  Loading invoices...
                </td>
              </tr>
            ) : safePayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-[color:var(--bc-text)]/70">
                  No invoices found.
                </td>
              </tr>
            ) : (
              safePayments.map((payment, index) => (
                <tr
                  key={payment._id || payment.paymentId || index}
                  className="border-t border-[var(--color-secondary)] hover:bg-[var(--bc-bg)] transition"
                >
                  <td className="px-4 py-3 text-[color:var(--bc-text)]/85">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-[var(--color-primary)]">
                      {payment.paymentId || payment._id || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-[var(--bc-text)] font-semibold">
                    {Number(payment.amount || 0).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-[color:var(--bc-text)]/85">
                    {payment.date ? new Date(payment.date).toLocaleDateString() : "—"}
                  </td>

                  <td className="px-4 py-3 text-[color:var(--bc-text)]/75">
                    <span className="font-mono break-all">
                      {payment.orderId || "—"}
                    </span>
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

export default Invoices;
