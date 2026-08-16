import { useState, useEffect, type ReactNode } from "react";
import {
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
  loginAdmin,
  registerAdmin,
} from "../services/api.js";
import { AuthContext, type AuthUser } from "./auth-context.js";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const data = await loginAdmin(email, pass);
    setToken(data.accessToken);
    setUser(data.user);
    setStoredAuth(data.accessToken, data.user);
  };

  const register = async (email: string, pass: string, name: string) => {
    const data = await registerAdmin(email, pass, name);
    setToken(data.accessToken);
    setUser(data.user);
    setStoredAuth(data.accessToken, data.user);
  };

  const logout = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
