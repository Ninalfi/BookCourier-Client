import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.init';

export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();
//const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

 const registerUser = async (email, password, name) => {
  setLoading(true);

  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, {
      displayName: name,
    });

    return result;
  } finally {
    setLoading(false);
  }
};



    const signInUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
        .finally(() => setLoading(false));
    }

    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
         .finally(() => setLoading(false));
    }

//      const signInGithub = () => {
//     setLoading(true);
//     return signInWithPopup(auth, githubProvider)
//       .finally(() => setLoading(false));
//   };



    const logOut = () => {
        setLoading(true);
        return signOut(auth)
        .then(() => setUser(null))
      .finally(() => setLoading(false));
    }

    const updateUserProfile = async (name, photoURL) => {
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }

  const updateData = {};

  if (name) updateData.displayName = name;
  if (photoURL) updateData.photoURL = photoURL;

  return updateProfile(auth.currentUser, updateData);
};

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unSubscribe();
        }
    }, [])

    const authInfo = {
        user,
        loading,
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        updateUserProfile
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;