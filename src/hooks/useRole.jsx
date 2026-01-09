import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { useAuth } from "../contexts/AuthProvider";

export default function useRole() {
  const axiosSecure = useAxiosSecure();
  const { user, loading } = useAuth();
  const [role, setRole] = useState("user");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    if (loading) return;

    if (!user) {
      if (mounted) {
        setRole("user");
        setRoleLoading(false);
      }
      return;
    }

    (async () => {
      try {
        setRoleLoading(true);
        const res = await axiosSecure.get("/users/me");

        if (mounted) setRole(res?.data?.role || "user");
      } catch (err) {
        console.error("Failed to fetch role:", err?.response?.data || err.message);
        if (mounted) setRole("user");
      } finally {
        if (mounted) setRoleLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [axiosSecure, user, loading]);

  return { role, roleLoading };
}
