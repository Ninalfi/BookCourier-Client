// src/pages/Contact/Contact.jsx
import { useMemo, useState } from "react";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";

const TOPICS = [
  { label: "General Question", subject: "General Question" },
  { label: "Order Support", subject: "Order Support" },
  { label: "Account Issue", subject: "Account Issue" },
  { label: "Partnership", subject: "Partnership Request" },
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-error">{message}</p>;
}

function StatPill({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-base-200">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <div className="text-xs text-base-content/60">{title}</div>
        <div className="text-sm font-semibold">{value}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  const API = "https://book-courier-server-iota.vercel.app";

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const errors = useMemo(() => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 20)
      e.message = "Message should be at least 20 characters.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const markTouched = (name) => setTouched((p) => ({ ...p, [name]: true }));

  const chooseTopic = (subject) => {
    setForm((p) => ({ ...p, subject }));
    setTouched((p) => ({ ...p, subject: true }));
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    // Touch all fields so inline errors show
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to send message.");

      setSuccess("Thanks! Your message has been received. We’ll reply soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTouched({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-base-200/40 py-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        {/* Hero */}
        <div className="rounded-3xl border border-base-300 bg-base-100 p-8 shadow-lg shadow-base-300/40 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-(--color-primary) text-base-200 px-4 py-2 text-sm">
                <Sparkles className="h-4 w-4 text-base-200 " />
                <span className="text-base-200 font-medium "> 
                  Premium Support • Fast Response
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold text-primary md:text-4xl">
                Contact BookCourier
              </h1>
              <p className="mt-3 text-base-content/70">
                Need help with an order, account, or listing? Send us a message and
                we’ll get back to you with clear next steps.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <StatPill icon={Clock} title="Response time" value="Within 24 hours" />
                <StatPill icon={ShieldCheck} title="Data privacy" value="Secure handling" />
                <StatPill icon={Mail} title="Support email" value="support@bookcourier.com" />
              </div>
            </div>

            {/* Right mini-card */}
            <div className="rounded-3xl border border-base-300 bg-base-200/60 p-6 lg:w-[360px]">
              <h3 className="text-lg font-semibold">Quick topics</h3>
              <p className="mt-1 text-sm text-base-content/70">
                Choose a topic to auto-fill the subject.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => chooseTopic(t.subject)}
                    className="btn btn-sm btn-ghost rounded-xl border border-base-300 hover:bg-(--color-primary) hover:text-base-100 transition"
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-base-300 bg-base-100 p-4 text-sm">
                <div className="font-semibold">Support hours</div>
                <div className="mt-1 text-base-content/70">
                  Sat–Thu • 10:00 AM – 7:00 PM (BST)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left: Contact info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-base-200">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="mt-1 text-sm text-base-content/70">
                    support@bookcourier.com
                  </p>
                  <p className="mt-2 text-xs text-base-content/60">
                    Best for order & account issues.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-base-200">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="mt-1 text-sm text-base-content/70">
                    +880 1234 567890
                  </p>
                  <p className="mt-2 text-xs text-base-content/60">
                    Available during support hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-md">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-base-200">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="mt-1 text-sm text-base-content/70">
                    Dhaka, Bangladesh
                  </p>
                  <p className="mt-2 text-xs text-base-content/60">
                    Serving nationwide delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-base-300 bg-base-100 p-6">
              <h3 className="font-semibold">Before you message</h3>
              <ul className="mt-3 space-y-2 text-sm text-base-content/70">
                <li>• Include your order ID (if applicable).</li>
                <li>• Describe the issue clearly in 1–2 sentences.</li>
                <li>• Mention device/browser if it’s a technical problem.</li>
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-8 shadow-lg">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Send a message</h2>
                  <p className="mt-1 text-sm text-base-content/70">
                    We’ll reply with next steps as soon as possible.
                  </p>
                </div>
                <div className="text-xs text-base-content/60">
                  Fields marked * are required
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="label" htmlFor="name">
                      <span className="label-text font-medium">Full Name *</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={() => markTouched("name")}
                      className="input input-bordered w-full rounded-xl"
                      placeholder="Your name"
                      aria-invalid={!!(touched.name && errors.name)}
                    />
                    <FieldError message={touched.name ? errors.name : ""} />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="label" htmlFor="email">
                      <span className="label-text font-medium">Email *</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => markTouched("email")}
                      className="input input-bordered w-full rounded-xl"
                      placeholder="you@email.com"
                      aria-invalid={!!(touched.email && errors.email)}
                    />
                    <FieldError message={touched.email ? errors.email : ""} />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="label" htmlFor="subject">
                    <span className="label-text font-medium">Subject *</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    onBlur={() => markTouched("subject")}
                    className="input input-bordered w-full rounded-xl"
                    placeholder="What is this about?"
                    aria-invalid={!!(touched.subject && errors.subject)}
                  />
                  <FieldError message={touched.subject ? errors.subject : ""} />

                  <div className="mt-2 flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <button
                        key={t.subject}
                        type="button"
                        onClick={() => chooseTopic(t.subject)}
                        className="btn btn-xs btn-ghost rounded-xl border border-base-300 hover:bg-(--color-primary) hover:text-base-100 transition"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="label" htmlFor="message">
                    <span className="label-text font-medium">Message *</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={() => markTouched("message")}
                    className="textarea textarea-bordered w-full rounded-xl"
                    rows={5}
                    placeholder="Tell us what happened… (include order ID if you have one)"
                    aria-invalid={!!(touched.message && errors.message)}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <FieldError message={touched.message ? errors.message : ""} />
                    <span className="text-xs text-base-content/60">
                      {form.message.trim().length}/500
                    </span>
                  </div>
                </div>

                {/* Alerts */}
                {error ? <div className="alert alert-error text-sm">{error}</div> : null}
                {success ? <div className="alert alert-success text-sm">{success}</div> : null}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className="btn btn-primary w-full rounded-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="loading loading-spinner loading-sm" />
                      Sending...
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>

                <p className="text-center text-xs text-base-content/60">
                  By submitting, you agree that we can contact you regarding this request.
                </p>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-10 rounded-3xl border border-base-300 bg-base-100 p-8 text-center shadow-md">
          <h3 className="text-xl font-semibold">Want faster self-service?</h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-base-content/70">
            Explore books, manage your orders, and track deliveries directly from your dashboard.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <a href="/books" className="btn btn-outline rounded-xl">
              Explore Books
            </a>
            <a href="/dashboard" className="btn btn-primary rounded-xl">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}