// src/pages/Blog/BlogDetails.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {Calendar,Clock,User,Tag,Link2, Facebook,Twitter, Linkedin,ThumbsUp,Bookmark,CheckCircle2,
} from "lucide-react";

const blogPost = {
  title: "How BookCourier Simplifies Book Delivery in 2026",
  coverImage:
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80",
  excerpt:
    "A structured look at how BookCourier streamlines discovery, secure ordering, and transparent delivery tracking — built for scale and trust.",
  author: "BookCourier Team",
  authorBio:
    "We publish practical guides, platform updates, and delivery insights for readers, librarians, and admins.",
  createdAt: "2026-02-28",
  tags: ["Delivery", "Technology", "Platform"],
  sections: [
    {
      id: "overview",
      title: "Overview",
      content:
        "BookCourier was built to reduce friction in book ordering and delivery. Instead of scattered communication and unclear delivery steps, the platform provides a clean workflow: discover → order → track → receive.",
    },
    {
      id: "discovery",
      title: "Smart Discovery",
      content:
        "Users can browse books by category, rating, price, and availability. The goal is simple: help readers find the right book quickly with minimal clicks.",
      bullets: [
        "Search by title and author",
        "Filter by category, price, and rating",
        "Consistent card UI for fast scanning",
      ],
    },
    {
      id: "security",
      title: "Secure Ordering",
      content:
        "Orders and user accounts are protected using JWT authentication and role-based access. This ensures only authorized users can manage inventory and orders.",
      bullets: [
        "JWT-based protected routes",
        "bcrypt password hashing",
        "Role-based control: User / Librarian / Admin",
      ],
    },
    {
      id: "tracking",
      title: "Transparent Tracking",
      content:
        "Delivery status is clear and measurable. Users can track progress with a readable lifecycle: pending → shipped → delivered.",
      callout:
        "Tip: Make sure your order status is updated by the responsible role in the dashboard to keep tracking accurate.",
    },
    {
      id: "scalability",
      title: "Scalable Architecture",
      content:
        "The system is modular on both frontend and backend. This makes it easier to add features like coupons, rewards, and notifications later without refactoring everything.",
      bullets: [
        "Express + MongoDB modular API structure",
        "Reusable React components and hooks",
        "Optimized UI: lazy loading + consistent layouts",
      ],
    },
    {
      id: "next",
      title: "What’s Next",
      content:
        "Next improvements can include: rewards, gift cards, automated emails, and admin reports. These features increase retention and make the platform feel truly production-ready.",
    },
  ],
};

const relatedPosts = [
  {
    title: "Building a Reliable Delivery Status System",
    excerpt: "A practical guide to designing status updates that users trust.",
    cover:
      "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "Role-Based Dashboards: Admin vs Librarian",
    excerpt: "How roles reduce mistakes and improve workflow in platforms.",
    cover:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=60",
  },
  {
    title: "UX Patterns for Book Marketplace Cards",
    excerpt: "Design decisions that improve scanning and conversion.",
    cover:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=60",
  },
];

function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return { words, minutes };
}

function ShareButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-sm btn-outline rounded-xl"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function Toast({ show, text }) {
  if (!show) return null;
  return (
    <div className="toast toast-top toast-center z-50">
      <div className="alert alert-success rounded-2xl shadow-lg">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm">{text}</span>
      </div>
    </div>
  );
}

function FloatingShareBar({ title, shareUrl, onCopy, onShare }) {
  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 lg:left-auto lg:right-6 lg:translate-x-0">
      <div className="flex items-center gap-2 rounded-2xl border border-base-300 bg-[var(--bc-bg)]  p-2 shadow-lg shadow-base-300/25 ring-1 ring-base-300/40 backdrop-blur transition-colors">
        <button
          type="button"
          onClick={onCopy}
          className="btn btn-sm btn-primary rounded-xl"
          title="Copy link"
          aria-label="Copy link"
        >
          <Link2 className="h-4 w-4" />
          <span className="hidden sm:inline">Copy</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onShare(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                shareUrl
              )}`
            )
          }
          className="btn btn-sm btn-outline rounded-xl hover:bg-primary hover:text-primary-content transition-colors"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
          <span className="hidden sm:inline">Facebook</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onShare(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                title
              )}&url=${encodeURIComponent(shareUrl)}`
            )
          }
          className="btn btn-sm btn-outline rounded-xl hover:bg-primary hover:text-primary-content transition-colors"
          title="Share on Twitter"
          aria-label="Share on Twitter"
        >
          <Twitter className="h-4 w-4" />
          <span className="hidden sm:inline">Twitter</span>
        </button>

        <button
          type="button"
          onClick={() =>
            onShare(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                shareUrl
              )}`
            )
          }
          className="btn btn-sm btn-outline rounded-xl hover:bg-primary hover:text-primary-content transition-colors"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </button>
      </div>
    </div>
  );
}

export default function Blog() {
  const contentRef = useRef(null);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState({ show: false, text: "" });
  const [progress, setProgress] = useState(0);
  const [helpful, setHelpful] = useState(null); // "yes" | "no" | null
  const [showFloating, setShowFloating] = useState(false);

  const fullText = useMemo(() => {
    const all = [
      blogPost.title,
      blogPost.excerpt,
      ...blogPost.sections.map(
        (s) => `${s.title} ${s.content} ${(s.bullets || []).join(" ")}`
      ),
    ].join(" ");
    return all;
  }, []);

  const reading = useMemo(() => estimateReadingTime(fullText), [fullText]);

  const dateLabel = useMemo(
    () => new Date(blogPost.createdAt).toLocaleDateString(),
    []
  );

  const shareUrl = useMemo(() => window.location.href, []);

  const showToast = (text) => {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: "" }), 1600);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Copy failed — please copy from address bar.");
    }
  };

  const openShare = (url) => window.open(url, "_blank", "noopener,noreferrer");

  // reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;

      const total = el.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const pct =
        total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setProgress(pct);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // show floating share bar after some scroll
  useEffect(() => {
    const onScroll = () => setShowFloating(window.scrollY > 250);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="py-14 transition-colors">
      {/* progress bar */}
      <div className="fixed left-0 top-0 z-50 h-1 w-full bg-transparent">
        <div
          className="h-1 bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Toast show={toast.show} text={toast.text} />

      {showFloating ? (
        <FloatingShareBar
          title={blogPost.title}
          shareUrl={shareUrl}
          onCopy={copyLink}
          onShare={openShare}
        />
      ) : null}

      <div className="mx-auto w-full max-w-8xl px-10">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="mt-4 text-3xl font-bold text-primary md:text-4xl">
             Blog Page
          </span>

          <div className="flex flex-wrap gap-2">
            <ShareButton icon={Link2} label="Copy Link" onClick={copyLink} />
            <ShareButton
              icon={Facebook}
              label="Facebook"
              onClick={() =>
                openShare(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    shareUrl
                  )}`
                )
              }
            />
            <ShareButton
              icon={Twitter}
              label="Twitter"
              onClick={() =>
                openShare(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    blogPost.title
                  )}&url=${encodeURIComponent(shareUrl)}`
                )
              }
            />
            <ShareButton
              icon={Linkedin}
              label="LinkedIn"
              onClick={() =>
                openShare(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    shareUrl
                  )}`
                )
              }
            />
          </div>
        </div>

        {/* Hero */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-base-300  bg-[var(--bc-bg)] shadow-lg shadow-base-300/20 ring-1 ring-base-300/30 transition-colors">
          <div className="h-64 w-full bg-base-200 md:h-80">
            <img
              src={blogPost.coverImage}
              alt={blogPost.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-6 md:p-10">
            {/* tags */}
            <div className="flex flex-wrap gap-2">
              {blogPost.tags.map((t) => (
                <span key={t} className="badge badge-outline rounded-xl">
                  <Tag className="mr-1 h-3.5 w-3.5" />
                  {t}
                </span>
              ))}
            </div>

            <h1 className="mt-4 text-3xl font-bold text-base-content md:text-4xl">
              {blogPost.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base-content/70">
              {blogPost.excerpt}
            </p>

            {/* meta + actions */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70">
                <span className="inline-flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium text-base-content">
                    {blogPost.author}
                  </span>
                </span>

                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {dateLabel}
                </span>

                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  {reading.minutes} min read • {reading.words} words
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLiked((v) => !v);
                    showToast(!liked ? "Liked!" : "Like removed");
                  }}
                  className={`btn btn-sm rounded-xl ${
                    liked
                      ? "btn-primary"
                      : "btn-outline hover:bg-primary hover:text-primary-content transition-colors"
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {liked ? "Liked" : "Like"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSaved((v) => !v);
                    showToast(
                      !saved ? "Saved to bookmarks!" : "Removed from bookmarks"
                    );
                  }}
                  className={`btn btn-sm rounded-xl ${
                    saved
                      ? "btn-primary"
                      : "btn-outline hover:bg-primary hover:text-primary-content transition-colors"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {saved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          ref={contentRef}
          className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* main */}
          <article className="lg:col-span-2 rounded-3xl border border-base-300  bg-[var(--bc-bg)] p-6 shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors md:p-8">
            {blogPost.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-base-content md:text-2xl">
                  {s.title}
                </h2>

                <p className="mt-3 text-base-content/80">{s.content}</p>

                {s.bullets?.length ? (
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-base-content/80">
                    {s.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                ) : null}

                {s.callout ? (
                  <div className="mt-4 rounded-2xl border border-base-300 bg-base-200/70 p-4 text-sm text-base-content/80 backdrop-blur-sm">
                    <span className="font-semibold">Note:</span> {s.callout}
                  </div>
                ) : null}

                <div className="mt-7 border-b border-base-300/60" />
              </section>
            ))}

            {/* Helpful feedback */}
            <div className="mt-6 rounded-2xl border border-base-300 bg-base-200/60 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-base-content">
                    Was this article helpful?
                  </div>
                  <div className="text-sm text-base-content/70">
                    Your feedback helps us write better guides.
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm rounded-xl ${
                      helpful === "yes"
                        ? "btn-primary"
                        : "btn-outline hover:bg-primary hover:text-primary-content transition-colors"
                    }`}
                    onClick={() => {
                      setHelpful("yes");
                      showToast("Thanks for the feedback!");
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-xl ${
                      helpful === "no"
                        ? "btn-primary"
                        : "btn-outline hover:bg-primary hover:text-primary-content transition-colors"
                    }`}
                    onClick={() => {
                      setHelpful("no");
                      showToast("Got it — we’ll improve.");
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* sidebar */}
          <aside className="space-y-4">
            {/* TOC */}
            <div className="rounded-3xl border border-base-300  bg-[var(--bc-bg)] p-6 shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-base-content">
                  Contents
                </h3>
                <span className="text-xs text-base-content/60">
                  {blogPost.sections.length} sections
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {blogPost.sections.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className="w-full rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-left text-sm text-base-content/80 hover:bg-primary hover:text-primary-content transition-colors"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Author */}
            <div className="rounded-3xl border border-base-300  bg-[var(--bc-bg)] p-6 shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors">
              <h3 className="text-lg font-semibold text-base-content">
                About the author
              </h3>
              <p className="mt-2 text-sm text-base-content/70">
                {blogPost.authorBio}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/contact"
                  className="btn btn-primary btn-sm rounded-xl"
                >
                  Contact
                </Link>
                <Link to="/books" className="btn btn-outline btn-sm rounded-xl">
                  Explore Books
                </Link>
              </div>
            </div>

            {/* Share */}
            <div className="rounded-3xl border border-base-300  bg-[var(--bc-bg)] p-6 shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors">
              <h3 className="text-lg font-semibold text-base-content">Share</h3>
              <p className="mt-2 text-sm text-base-content/70">
                Send this article to your friends or teammates.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <ShareButton icon={Link2} label="Copy Link" onClick={copyLink} />
                <ShareButton
                  icon={Facebook}
                  label="Facebook"
                  onClick={() =>
                    openShare(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        shareUrl
                      )}`
                    )
                  }
                />
                <ShareButton
                  icon={Twitter}
                  label="Twitter"
                  onClick={() =>
                    openShare(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        blogPost.title
                      )}&url=${encodeURIComponent(shareUrl)}`
                    )
                  }
                />
                <ShareButton
                  icon={Linkedin}
                  label="LinkedIn"
                  onClick={() =>
                    openShare(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        shareUrl
                      )}`
                    )
                  }
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-xl font-semibold text-base-content">
              Related posts
            </h2>
            <Link to="/blog" className="btn btn-outline btn-sm rounded-xl">
              View all
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3 ">
            {relatedPosts.map((p) => (
              <div
                key={p.title}
                className="overflow-hidden rounded-3xl border border-base-300 bg-[var(--bc-bg)] shadow-md shadow-base-300/20 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
              >
                <div className="h-36">
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="line-clamp-2 text-base font-semibold text-base-content">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-base-content/70">
                    {p.excerpt}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm mt-4 rounded-xl hover:bg-primary hover:text-base-100 transition-colors"
                    onClick={() => showToast("Static demo — connect dynamic later")}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-3xl border border-base-300 bg-[var(--bc-bg)] p-8 text-center shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors">
          <h3 className="text-xl font-semibold text-base-content">
            Want faster self-service?
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-base-content/70">
            Explore books, manage your orders, and track deliveries directly from
            your dashboard.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Link to="/books" className="btn btn-outline rounded-xl">
              Explore Books
            </Link>
            <Link to="/dashboard" className="btn btn-primary rounded-xl">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}