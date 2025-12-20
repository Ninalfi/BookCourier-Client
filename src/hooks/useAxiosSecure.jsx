import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export default function useAxiosSecure() {
  const { user, logOut } = useAuth();

  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(async (config) => {
      if (user) {
        const token = await user.getIdToken();
        config.headers.authorization = `Bearer ${user?.accessToken || token}`;
      }
      return config;
    });

    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          // optional: force logout
          // await logOut();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOut]);

  return axiosSecure;
}
