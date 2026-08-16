import {
  API_BASE,
  fetchWithAuth,
  setStoredAuth,
  clearStoredAuth,
  getStoredToken,
  getStoredUser,
  triggerTokenRefresh,
} from "./client.js";
import type { AuthUser, UpdateProfilePayload } from "../context/auth-context.js";

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export const authService = {
  async login(email: string, pass: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
      credentials: "include",
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Login failed");
    }

    if (json.data?.accessToken) {
      setStoredAuth(json.data.accessToken, json.data.user);
    }
    return json.data;
  },

  async refreshToken(): Promise<string> {
    return await triggerTokenRefresh();
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearStoredAuth();
    }
  },

  async getMe(): Promise<AuthUser> {
    const json = await fetchWithAuth<{ success: boolean; data: AuthUser }>("/auth/me", {
      method: "GET",
    });
    return json.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const json = await fetchWithAuth<{ success: boolean; message: string; data: AuthUser }>(
      "/auth/profile",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
    if (!json.success || !json.data) {
      throw new Error(json.message || "Failed to update profile");
    }
    const currentToken = getStoredToken();
    if (currentToken) {
      setStoredAuth(currentToken, json.data);
    }
    return json.data;
  },

  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
};

export const loginAdmin = authService.login;
export const logoutAdmin = authService.logout;
export const getMe = authService.getMe;
export const updateAdminProfile = authService.updateProfile;
export { getStoredToken, getStoredUser, setStoredAuth, clearStoredAuth };
