import { useEffect, useState } from "react";

const Invoices = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // MOCK DATA – replace with API
    const mockPayments = [
      {
        _id: "pay_001",
        bookTitle: "Clean Code",
        amount: 499,
        date: "2025-02-10",
      },
      {
        _id: "pay_002",
        bookTitle: "Atomic Habits",
        amount: 399,
        date: "2025-02-01",
      },
    ];

    setPayments(mockPayments);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Invoices</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Payment ID</th>
              <th>Book Name</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>
                <td className="font-mono">{payment._id}</td>
                <td>{payment.bookTitle}</td>
                <td>৳{payment.amount}</td>
                <td>{payment.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {payments.length === 0 && (
        <p className="text-center mt-6">No invoices found.</p>
      )}
    </div>
  );
};

export default Invoices;
