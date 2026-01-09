import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  //baseURL: import.meta.env.VITE_API_URL,
  baseURL: "https://book-courier-server-iota.vercel.app",
});

export default function useAxiosSecure() {
  const { user, loading } = useAuth();

  useEffect(() => {
     if (loading) return;
    const interceptor = axiosSecure.interceptors.request.use(async (config) => {
      const auth = getAuth();
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken(true);
        config.headers = config.headers || {};
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => axiosSecure.interceptors.request.eject(interceptor);
  }, [user, loading]);

  return axiosSecure;
}
