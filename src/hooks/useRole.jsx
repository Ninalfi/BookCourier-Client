import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

export default function useRole() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get("/users").then(res => {
        const current = res.data.find(u => u.email === user.email);
        setRole(current?.role || "user");
      });
    }
  }, [user]);

  return role;
}
