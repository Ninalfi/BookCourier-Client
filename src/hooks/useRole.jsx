import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";


export default function useRole() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/${user.email}`)
        .then(res => setRole(res.data?.role || "user"))
        .catch(err => console.error("Failed to fetch user role:", err));
    }
  }, [user, axiosSecure]);

  return role;
}
