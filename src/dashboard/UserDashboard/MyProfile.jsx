import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let photoURL = user?.photoURL;

    await updateUserProfile(name, photoURL);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-8">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card bg-base-200 p-6">
          <div className="flex flex-col items-center text-center">
            <img
              src={user?.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">
              {user?.displayName || "No Name"}
            </h3>
            <p className="text-sm opacity-70">{user?.email}</p>
          </div>
        </div>
        <div className="card bg-base-200 p-6 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Update Profile</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Profile Image</label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
