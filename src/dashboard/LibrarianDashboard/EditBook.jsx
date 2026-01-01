import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../contexts/AuthProvider";


const EditBook =() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [book, setBook] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    img: "",
    price: "",
    desc: "",
    language: "",
    category: "",
    status: "published",
  });

  const canSubmit = useMemo(() => {
    return (
      form.title.trim() &&
      form.author.trim() &&
      form.img.trim() &&
      Number(form.price) > 0
    );
  }, [form]);

  useEffect(() => {
    let mounted = true;

    const fetchBook = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosSecure.get(`/books/${id}`);
        const data = res.data;
        if (!mounted) return;
        setBook(data);
        setForm({
          title: data?.title || "",
          author: data?.author || "",
          img: data?.img || data?.image || "",
          price: data?.price ? String(data.price).replace(/[^0-9.]/g, "") : "",
          desc: data?.desc || "",
          language: data?.language || "",
          category: data?.category || "",
          status: data?.status || "published",
        });
      } catch (err) {
        console.error("Fetch book error:", err?.response?.data || err.message);
        if (!mounted) return;
        setError(err?.response?.data?.message || "Failed to load book");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id) fetchBook();

    return () => {
      mounted = false;
    };
  }, [id, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fill required fields (title, author, image, price)");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        img: form.img.trim(),
        desc: form.desc.trim(),
        language: form.language.trim(),
        category: form.category.trim(),
        status: form.status,
        price: Number(String(form.price).replace(/[^0-9.]/g, "")),
        librarianEmail: book?.librarianEmail || user?.email || "",
      };

      await axiosSecure.patch(`/books/${id}`, payload);

      toast.success("Book updated!");
      navigate("/dashboard/my-books");
    } catch (err) {
      console.error("Update book error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] rounded-2xl p-6 shadow-sm">
        <p className="text-[var(--bc-text)]">Loading book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[var(--color-primary)]">Edit Book</h2>
        <p className="mt-2 text-[var(--bc-accent)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bc-surface)] border border-[var(--color-secondary)] rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[var(--color-secondary)]">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Edit Book</h2>
        <p className="text-sm text-[color:var(--bc-text)]/70 mt-1">
          Update your book details and save changes.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-[var(--bc-text)]">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="mt-1 w-full input input-bordered border-[var(--color-secondary)]"
            placeholder="Book title"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--bc-text)]">Author *</label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            className="mt-1 w-full input input-bordered border-[var(--color-secondary)]"
            placeholder="Author name"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[var(--bc-text)]">Image URL *</label>
          <input
            name="img"
            value={form.img}
            onChange={handleChange}
            className="mt-1 w-full input input-bordered border-[var(--color-secondary)]"
            placeholder="https://..."
            required
          />
          {form.img ? (
            <img
              src={form.img}
              alt="preview"
              className="mt-3 w-full max-w-sm rounded-xl border border-[var(--color-secondary)]"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : null}
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--bc-text)]">Price *</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="mt-1 w-full input input-bordered border-[var(--color-secondary)]"
            placeholder="12.50"
            inputMode="decimal"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--bc-text)]">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 w-full select select-bordered border-[var(--color-secondary)]"
          >
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--bc-text)]">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full input input-bordered border-[var(--color-secondary)]"
            placeholder="Fiction"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-[var(--bc-text)]">Language</label>
          <input
            name="language"
            value={form.language}
            onChange={handleChange}
            className="mt-1 w-full input input-bordered border-[var(--color-secondary)]"
            placeholder="English"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-[var(--bc-text)]">Description</label>
          <textarea
            name="desc"
            value={form.desc}
            onChange={handleChange}
            className="mt-1 w-full textarea textarea-bordered border-[var(--color-secondary)]"
            rows={5}
            placeholder="Write a short description..."
          />
        </div>
        <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving || !canSubmit}
            className="px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-xl border border-[var(--color-secondary)] bg-[var(--bc-bg)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-secondary)] transition"
          >Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBook;
