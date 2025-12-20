import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

export default function useRole() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState("user");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (loading) return; // wait for firebase auth to resolve

    if (!user?.email) {
      setRole("user");
      setRoleLoading(false);
      return;
    }

    setRoleLoading(true);

    axiosSecure
      .get(`/users/${user.email}`)
      .then((res) => {
        setRole(res.data?.role || "user");
      })
      .catch((err) => {
        console.error("Failed to fetch user role:", err);
        setRole("user");
      })
      .finally(() => setRoleLoading(false));
  }, [user?.email, loading, axiosSecure]);

  return { role, roleLoading };
}
