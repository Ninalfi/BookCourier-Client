import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthProvider';

const API = "http://localhost:3000";


const SocialLogin = () => {
    const { signInGoogle } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   
const syncUserToDb = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken(true);

    const res = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: firebaseUser.displayName || "",
      }),
    });
        const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || "Failed to sync user to server");
    }

    return data;
  };

    const handleGoogleSignIn = async() => {
    try {
      setLoading(true);
        const firebaseUser = await signInGoogle();
        await syncUserToDb(firebaseUser);
  navigate(location.state || "/");
    }
    catch(error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
    };

    return (
        <div className='text-center pb-8'>
            <p className='mb-2 text-white'>OR</p>
            <button
                onClick={handleGoogleSignIn}
                className="btn bg-white text-black border-[#e5e5e5]">
                <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>

                 {loading ? "Signing in..." : "Login with Google"}
            </button>
        </div>
    );
};

export default SocialLogin;



