import { useState, useEffect } from "react";
import { apiClient, clearAuthToken, getAuthToken } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export type UserRole = "admin" | "donor" | null;

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        if (token) {
          const userData = await apiClient.get("/auth/me");
          setUser(userData);
          setUserRole(userData.role);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        clearAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    clearAuthToken();
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
  };
}