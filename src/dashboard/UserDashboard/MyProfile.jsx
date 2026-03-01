import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(null); 
  const [loading, setLoading] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  const uploadToImgbb = async (file) => {
    const key = import.meta.env.VITE_IMGBB_KEY;
    if (!key) throw new Error("Missing VITE_IMGBB_KEY in .env");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      throw new Error(data?.error?.message || "Image upload failed");
    }

    return data.data.url; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      let photoURL = user?.photoURL || " https://i.ibb.co.com/0y4FCqHp/5472d1b09d3d724228109d381d617326.jpg";
      if (photo) {
        photoURL = await uploadToImgbb(photo);
      }

      await updateUserProfile(name, photoURL);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
    const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwMsg("");

    if (!user) return setPwMsg("Please login first.");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return setPwMsg("All password fields are required.");
    }
    if (newPassword.length < 6) {
      return setPwMsg("New password must be at least 6 characters.");
    }
    if (newPassword !== confirmNewPassword) {
      return setPwMsg("New password and confirm password do not match.");
    }

    const providers = user?.providerData?.map((p) => p.providerId) || [];
    const isEmailPass = providers.includes("password");
    if (!isEmailPass) {
      return setPwMsg("Password update is only available for Email/Password accounts.");
    }

    try {
      setPwLoading(true);

      const auth = getAuth();
      const firebaseUser = auth.currentUser;

      if (!firebaseUser?.email) {
        throw new Error("Missing user email for re-authentication.");
      }
            const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);
      await reauthenticateWithCredential(firebaseUser, credential);
            await updatePassword(firebaseUser, newPassword);

      setPwMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error(err);
            if (err?.code === "auth/wrong-password") {
        setPwMsg("Current password is incorrect.");
      } else if (err?.code === "auth/too-many-requests") {
        setPwMsg("Too many attempts. Try again later.");
      } else if (err?.code === "auth/requires-recent-login") {
        setPwMsg("Please logout and login again, then try updating the password.");
      } else {
        setPwMsg(err?.message || "Failed to update password.");
      }
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-semibold mb-8">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card bg-base-100 p-6">
          <div className="flex flex-col items-center text-center">
            <img
              src={user?.photoURL}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-semibold">
              {user?.displayName || "No Name"}
            </h3>
            <p className="text-sm opacity-70">{user?.email}</p>
          </div>
        </div>

        <div className="card bg-base-100 p-6 md:col-span-2">
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
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
              <p className="text-xs opacity-70 mt-1">
                (Optional) Upload a new photo. If you don’t choose one, only your name updates.
              </p>
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

                    <div className="card bg-base-100 p-6 max-w-6xl mx-auto mt-5">
            <h3 className="text-xl font-semibold mb-4">Update Password</h3>

            {pwMsg ? (
              <div className="alert alert-info mb-4">
                <span className="text-sm">{pwMsg}</span>
              </div>
            ) : null}
             <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  disabled={pwLoading}
                />
              </div>
             <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={pwLoading}
                />
                <p className="text-xs opacity-70 mt-1">
                  Must be at least 6 characters.
                </p>
              </div>
               <div>
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  disabled={pwLoading}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={pwLoading}>
                {pwLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
            <p className="text-xs opacity-70 mt-4">
              Note: If you logged in with Google/Facebook, password update may not be available unless you created a password account.
            </p>
          </div>
      </div>

  );
};

export default MyProfile;
