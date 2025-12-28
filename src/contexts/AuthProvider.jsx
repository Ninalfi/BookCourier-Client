import  { useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';

export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();
//const githubProvider = new GithubAuthProvider();
const API = "http://localhost:3000";

async function syncUserToDB(firebaseUser) {
  if (!firebaseUser?.email) return;
   const token = await firebaseUser.getIdToken(true);

   await fetch(`${API}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: firebaseUser.displayName || "",
      email: firebaseUser.email,
    }),
      });
}

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

 const registerUser = async (email, password, name) => {
  setLoading(true);

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

     await cred.user.getIdToken(true);
     if (name) {
        await updateProfile(cred.user, { displayName: name });
      }
      await cred.user.getIdToken(true);
      await syncUserToDB(cred.user);
       setUser(cred.user);
      return cred.user;
    }  catch (err) {
    console.log("SIGNUP ERROR CODE:", err.code);
    console.log("SIGNUP ERROR MESSAGE:", err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};
const signInUser = async (email, password) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      await cred.user.getIdToken(true);
      await syncUserToDB(cred.user);

      setUser(cred.user);
      return cred.user;
    } finally {
      setLoading(false);
    }
  };

 const signInGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await cred.user.getIdToken(true);
      await syncUserToDB(cred.user);

      setUser(cred.user);
      return cred.user;
    } finally {
      setLoading(false);
    }
  };

//      const signInGithub = () => {
//     setLoading(true);
//     return signInWithPopup(auth, githubProvider)
//       .finally(() => setLoading(false));
//   };



  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

 const updateUserProfile = async (name, photoURL) => {
    const current = auth.currentUser;
    if (!current) throw new Error("User not authenticated");

    const updateData = {};
    if (typeof name === "string" && name.trim()) updateData.displayName = name.trim();
    if (typeof photoURL === "string" && photoURL.trim()) updateData.photoURL = photoURL.trim();

    if (!Object.keys(updateData).length) return current;

    await current.getIdToken(true);
    await updateProfile(current, updateData);
    await syncUserToDB(current);
    setUser(current);
    return current;
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
          await syncUserToDB(currentUser);
        } catch (e) {
          console.log("syncUserToDB failed onAuthStateChanged:", e?.message);
        }
      }
    });
        return () => {
            unSubscribe();
        }
    }, [])

    const authInfo = useMemo(
    () => ( {
        user,
        loading,
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        updateUserProfile
    }),
    [user, loading]
  );

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;