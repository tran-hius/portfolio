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
      body: JSON.stringify({ email: email.trim().toLowerCase(), password: pass }),
      credentials: "include",
    });

    const text = await res.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Server connection error (${res.status}): Please check backend URL`);
    }

    if (!res.ok) {
      throw new Error(json?.message || `Login failed with status ${res.status}`);
    }

    const authData = json?.data || json;
    if (authData?.accessToken) {
      setStoredAuth(authData.accessToken, authData.user);
    }
    return authData;
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
    const res = await fetchWithAuth<any>("/auth/me", {
      method: "GET",
    });
    return res?.data || res;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const res = await fetchWithAuth<any>(
      "/auth/profile",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
    const updated = res?.data || res;
    const currentToken = getStoredToken();
    if (currentToken && updated) {
      setStoredAuth(currentToken, updated);
    }
    return updated;
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
