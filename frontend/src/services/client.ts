export const API_BASE = "http://localhost:3001/api/v1";

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieVal = parts.pop()?.split(";").shift();
    return cookieVal ? decodeURIComponent(cookieVal) : null;
  }
  return null;
};

export const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
};

const USER_KEY = "portfolio_admin_user";

export const getStoredToken = (): string | null => {
  return getCookie("accessToken");
};

export const setStoredAuth = (token: string, user?: any) => {
  if (token) {
    setCookie("accessToken", token, 1);
  }
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearStoredAuth = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  localStorage.removeItem(USER_KEY);
};


export const getStoredUser = () => {
  try {
    const str = localStorage.getItem(USER_KEY);
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
};

let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null, error?: Error) => void> = [];

const subscribeTokenRefresh = (cb: (token: string | null, error?: Error) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const onRefreshFailed = (error: Error) => {
  refreshSubscribers.forEach((cb) => cb(null, error));
  refreshSubscribers = [];
};

export const triggerTokenRefresh = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((token, error) => {
        if (error) reject(error);
        else if (token) resolve(token);
        else reject(new Error("Token refresh failed"));
      });
    });
  }

  isRefreshing = true;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
    });

    const json = await res.json();
    if (!res.ok || !json.data?.accessToken) {
      throw new Error(json.message || "Failed to refresh session");
    }

    const newToken = json.data.accessToken;
    const user = json.data.user;
    setStoredAuth(newToken, user);
    onRefreshed(newToken);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:refreshed", { detail: { token: newToken, user } }));
    }

    return newToken;
  } catch (err: any) {
    clearStoredAuth();
    onRefreshFailed(err);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw err;
  } finally {
    isRefreshing = false;
  }
};

export const fetchWithAuth = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const requestOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  let res = await fetch(`${API_BASE}${endpoint}`, requestOptions);

  const isAuthEndpoint =
    endpoint.startsWith("/auth/login") ||
    endpoint.startsWith("/auth/register") ||
    endpoint.startsWith("/auth/refresh");

  if (res.status === 401 && !isAuthEndpoint) {
    try {
      const newToken = await triggerTokenRefresh();
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } catch {
      throw new Error("Session expired. Please log in again.");
    }
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }
  return json;
};

export const fetchPublic = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }
  return json;
};
