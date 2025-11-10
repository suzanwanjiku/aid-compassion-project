import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "@/config/api";

export type UserRole = "admin" | "donor" | null;

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
      // fetch roles
      (async () => {
        try {
          const roles = await fetchJson(`/user_roles?user_id=${JSON.parse(userStr)._id}`);
          const first = roles && roles.length ? roles[0].role : null;
          setUserRole(first);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
    navigate("/");
  };

  return {
    user,
    userRole,
    loading,
    signOut,
    isAdmin: userRole === "admin",
    isDonor: userRole === "donor",
    setUserAndToken: (userObj: any, token: string) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
    }
  };
}
