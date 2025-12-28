import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

export default function useRole() {
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState("user");
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    axiosSecure.get("/me").then((res) => {
        if (mounted) setRole(res.data.role || "user");
      })
      .catch((err) => {
        console.error("Failed to fetch role:", err.response?.data || err.message);
        if (mounted) setRole("user");
      })
      .finally(() => {
        if (mounted) setRoleLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [axiosSecure]);

  return { role, roleLoading };
}
