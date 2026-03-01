// src/components/home/HomeFAQSection.jsx
import { Link } from "react-router-dom";
import { HelpCircle, ShieldCheck, Truck, RefreshCcw, CreditCard, User } from "lucide-react";
import SectionHeader from "./SectionHeader";

const FAQS = [
  {
    icon: Truck,
    q: "How does BookCourier delivery work?",
    a: "Browse books, place your order, and track status from your dashboard. Delivery updates follow a clear flow: pending → shipped → delivered.",
  },
  {
    icon: RefreshCcw,
    q: "Can I cancel or change an order after placing it?",
    a: "If your order is still in 'pending', you can request a change or cancellation. Once it’s shipped, changes may not be possible.",
  },
  {
    icon: CreditCard,
    q: "What payment options are supported?",
    a: "We support common payment methods depending on availability in your area. Payment instructions are shown clearly at checkout.",
  },
  {
    icon: ShieldCheck,
    q: "Is my account and data secure?",
    a: "Yes. Your password is protected using bcrypt hashing and access is secured with JWT-based authentication and role-based permissions.",
  },
  {
    icon: User,
    q: "What’s the difference between User, Librarian, and Admin?",
    a: "Users browse and order books. Librarians manage listings and order updates. Admins manage users, inventory, and overall platform settings.",
  },
  {
    icon: HelpCircle,
    q: "How do I contact support quickly?",
    a: "Use the Contact page for support requests. For faster self-service, check your Dashboard to manage orders and track delivery progress.",
  },
];

export default function HomeFAQSection() {
  return (
    <section className="bg-base-200/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-14">
        <SectionHeader
          title="Frequently Asked Questions"
          subtitle="Quick answers about ordering, delivery tracking, roles, and support — designed to save your time."
          primaryCta={{ to: "/contact", label: "Contact Support" }}
          secondaryCta={{ to: "/blog", label: "Read Guides" }}
        />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: FAQ list */}
          <div className="lg:col-span-2 space-y-4">
            {FAQS.map(({ icon: Icon, q, a }, idx) => (
              <div
                key={idx}
                className="collapse collapse-arrow rounded-3xl border border-base-300 bg-base-100 shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors"
              >
                <input type="radio" name="home-faq" defaultChecked={idx === 0} />
                <div className="collapse-title flex items-center gap-3 text-base font-semibold">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-base-200">
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-base-content">{q}</span>
                </div>
                <div className="collapse-content">
                  <p className="text-sm leading-relaxed text-base-content/75">{a}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Support card */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors">
              <h3 className="text-lg font-semibold text-base-content">Need personal help?</h3>
              <p className="mt-2 text-sm text-base-content/70">
                If your question is about an order, include your order ID. For account issues,
                mention the email you used to sign in.
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <Link to="/contact" className="btn btn-primary rounded-xl">
                  Contact Support
                </Link>
                <Link to="/dashboard" className="btn btn-outline rounded-xl">
                  Go to Dashboard
                </Link>
              </div>

              <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/60 p-4">
                <div className="text-sm font-semibold text-base-content">Support hours</div>
                <div className="mt-1 text-sm text-base-content/70">
                  Sat–Thu • 10:00 AM – 7:00 PM (BST)
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md shadow-base-300/20 ring-1 ring-base-300/30 transition-colors">
              <h3 className="text-lg font-semibold text-base-content">Pro tip</h3>
              <p className="mt-2 text-sm text-base-content/70">
                Most order questions are solved faster from your Dashboard, where you can track status
                and view your order history.
              </p>
              <Link to="/dashboard" className="btn btn-outline mt-4 rounded-xl">
                View Order Activity
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}