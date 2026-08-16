import { useState, useEffect, type ReactNode } from "react";
import {
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
  loginAdmin,
  logoutAdmin,
  getMe,
  updateAdminProfile,
} from "../services/api.js";
import { AuthContext, type AuthUser, type UpdateProfilePayload } from "./auth-context.js";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const u = await getMe();
      if (u) {
        setUser(u);
        const curToken = getStoredToken();
        if (curToken) setStoredAuth(curToken, u);
      }
    } catch {
      // If fetching fails, keep stored
    }
  };

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(storedUser);
      }
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await loginAdmin(email, pass);
    setToken(data.accessToken);
    setUser(data.user);
    setStoredAuth(data.accessToken, data.user);
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // Ignore
    } finally {
      clearStoredAuth();
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload): Promise<AuthUser> => {
    const updated = await updateAdminProfile(payload);
    setUser(updated);
    const curToken = getStoredToken();
    if (curToken) {
      setStoredAuth(curToken, updated);
    }
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
