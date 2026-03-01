// components/home/HomeExploreSection.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";

const TABS = [
  { key: "trending", label: "Trending", sort: "popular" },
  { key: "new", label: "New Arrivals", sort: "newest" },
  { key: "top", label: "Top Rated", sort: "rating_desc" },
];

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
      <div className="h-40 w-full rounded-lg bg-base-200 animate-pulse" />
      <div className="mt-4 h-4 w-3/4 rounded bg-base-200 animate-pulse" />
      <div className="mt-2 h-3 w-full rounded bg-base-200 animate-pulse" />
      <div className="mt-2 h-3 w-5/6 rounded bg-base-200 animate-pulse" />
      <div className="mt-4 h-9 w-28 rounded bg-base-200 animate-pulse" />
    </div>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-3">
      <div className="text-xs text-base-content/60">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function CategoryPills({ items, onPick }) {
  if (!items?.length) return null;
  return (
    <div className="mt-6">
      <div className="text-sm font-semibold text-base-content/80">
        Popular categories
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onPick(c.name)}
            className="btn btn-sm btn-ghost rounded-xl border border-base-300"
            title={`${c.count} books`}
          >
            {c.name}
            <span className="ml-2 text-xs text-base-content/60">({c.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Tabs({ activeKey, onChange }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t)}
          className={`btn rounded-xl ${
            activeKey === t.key ? "btn-secondary" : "btn-ghost"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function BooksGrid({ loading, books }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : books.map((b) => (
            <div
              key={b._id}
              className="flex h-full flex-col overflow-hidden rounded-xl border border-base-300 bg-base-100"
            >
              <div className="h-40 w-full bg-base-200">
                <img
                  src={b.image || b.cover || b.thumbnail || b?.images?.[0]}
                  alt={b.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-1 text-lg font-semibold">{b.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-base-content/70">
                  {b.description || b.summary || "Open details to read full info."}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  {b.category ? (
                    <span className="badge badge-outline">{b.category}</span>
                  ) : null}
                  {b.author ? (
                    <span className="badge badge-ghost">{b.author}</span>
                  ) : null}
                  {typeof b.price !== "undefined" ? (
                    <span className="badge badge-ghost">৳ {b.price}</span>
                  ) : null}
                  {typeof b.rating !== "undefined" ? (
                    <span className="badge badge-ghost">⭐ {b.rating}</span>
                  ) : null}
                  {typeof b.stock !== "undefined" ? (
                    <span className={`badge ${b.stock > 0 ? "badge-success" : "badge-error"}`}>
                      {b.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link to={`/bookDetails/${b._id}`} className="btn btn-outline btn-sm rounded-xl">
                    View Details
                  </Link>
                  <Link to="/explore" className="btn btn-ghost btn-sm rounded-xl">
                    More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
    </div>
  );
}

export default function Explore() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [active, setActive] = useState(TABS[0]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");

  const booksUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("sort", active.sort);
    params.set("limit", "4");
    return `${API}/books?${params.toString()}`;
  }, [API, active.sort]);

  useEffect(() => {
    fetch(`${API}/api/public/explore-stats`)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));

    fetch(`${API}/api/public/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d?.data || []))
      .catch(() => setCategories([]));
  }, [API]);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    fetch(booksUrl)
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return;
        const list = Array.isArray(data) ? data : (data.data ?? data.books ?? []);
        setBooks(list.slice(0, 4));
      })
      .catch(() => alive && setBooks([]))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [booksUrl]);

  const goExplore = (extra = {}) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("search", q.trim());
    Object.entries(extra).forEach(([k, v]) => v && params.set(k, v));
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <section className="mx-auto max-w-full bg-[var(--bc-bg)] mb-20 px-4 py-12">
      <SectionHeader
        title="Explore Books"
        subtitle="Search by title/author, filter by category/rating/price, then order with courier delivery."
        primaryCta={{ to: "/explore", label: "Explore All" }}
        secondaryCta={{ to: "/about", label: "How it works" }}
      />

      {/* Search + Quick action */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="join w-full sm:max-w-xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input input-bordered join-item w-full rounded-xl"
            placeholder="Search title or author..."
            aria-label="Search books"
          />
          <button
            type="button"
            onClick={() => goExplore()}
            className="btn btn-primary join-item rounded-xl"
            disabled={!q.trim()}
          >
            Search
          </button>
        </div>

        <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-3 text-sm">
          <span className="font-semibold">Delivery flow:</span>{" "}
          <span className="text-base-content/70">pending → shipped → delivered</span>
        </div>
      </div>

      {/* Live stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Books" value={stats ? stats.totalBooks : "—"} />
        <StatTile label="In Stock" value={stats ? stats.inStockBooks : "—"} />
        <StatTile label="Categories" value={stats ? stats.categories : "—"} />
        <StatTile label="Avg Rating" value={stats ? stats.avgRating : "—"} />
      </div>

      <CategoryPills items={categories} onPick={(name) => goExplore({ category: name })} />

      <Tabs activeKey={active.key} onChange={setActive} />

      <BooksGrid loading={loading} books={books} />
    </section>
  );
}