// components/home/HomeAboutSection.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Star } from "lucide-react";

function FeatureCard({ Icon, title, desc, to, btnText = "Learn More" }) {
  return (
    <div className="h-full rounded-3xl bg-base-200/60 p-8 shadow-lg shadow-base-300/40 ring-1 ring-base-300/60">
      <div className="flex h-full flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-base-100 ring-1 ring-base-300/60">
          <Icon className="h-8 w-8 text-primary" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-base-content">{title}</h3>

        {/* Description */}
        <p className="mt-3 max-w-xs text-sm leading-6 text-base-content/70">
          {desc}
        </p>

        {/* Button pinned at bottom */}
        <div className="mt-auto pt-8">
          <Link to={to} className="btn btn-primary rounded-xl px-7">
            {btnText}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-4">
      <div className="text-xs text-base-content/60">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

export default function HomeAboutSection() {
  const API = import.meta.env.VITE_API_URL;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/public/about-stats`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [API]);

  return (
    <section className="bg-base-100/40">
      <div className="mx-auto max-w-full px-4 py-14 ">
        {/* Centered heading like your screenshot */}
        <h2 className="text-center text-3xl font-bold text-primary md:text-4xl">
          About BookCourier
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center  text-base-content/70">
          A courier-first platform for discovering books, ordering quickly, and tracking delivery transparently.
        </p>

        {/* 3 feature cards (screenshot style) */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 rounded-3xl p-6 bg-[var(--bc-bg)]">
          <FeatureCard
            Icon={ShieldCheck}
            title="Verified Listings"
            desc="Books are managed with role-based control (User / Librarian / Admin) to keep listings reliable."
            to="/about"
            className="bg-orange-200"
          />
          <FeatureCard
            Icon={Truck}
            title="Trackable Delivery"
            desc="Order lifecycle is clear and measurable with real-time updates: pending → shipped → delivered."
            to="/about"
          />
          <FeatureCard
            Icon={Star}
            title="Real Reviews"
            desc="Users can rate and review books to help others choose confidently."
            to="/about"
          />
        </div>

        {/* Dynamic info block (keeps it informative + real data) */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Stats */}
          <div className="lg:col-span-2 rounded-3xl border border-base-300 bg-base-100 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">Platform snapshot</h3>
                <p className="mt-1 text-sm text-base-content/70">
                  These numbers update automatically from your database.
                </p>
              </div>

              <div className="flex gap-2">
                <Link to="/books" className="btn btn-outline btn-sm rounded-xl">
                  Explore
                </Link>
                <Link to="/contact" className="btn btn-primary btn-sm rounded-xl">
                  Contact
                </Link>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatMini label="Books" value={data ? data.totalBooks : "—"} />
              <StatMini label="Users" value={data ? data.totalUsers : "—"} />
              <StatMini label="Orders" value={data ? data.totalOrders : "—"} />
              <StatMini
                label="Delivery Rate"
                value={data ? `${data.deliveryRate}%` : "—"}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-3xl border border-base-300 bg-base-100 p-6">
            <h3 className="text-lg font-semibold">Popular categories</h3>
            <p className="mt-1 text-sm text-base-content/70">
              Browse what readers explore most.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {data?.topCategories?.length ? (
                data.topCategories.map((c) => (
                  <span
                    key={c.name}
                    className="badge badge-outline rounded-xl px-3 py-3"
                    title={`${c.count} books`}
                  >
                    {c.name} • {c.count}
                  </span>
                ))
              ) : (
                <span className="text-sm text-base-content/60">—</span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/books" className="btn btn-primary btn-sm rounded-xl">
                Explore Books
              </Link>
              <Link to="/dashboard" className="btn btn-outline btn-sm rounded-xl">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}