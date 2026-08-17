const getBaseUrl = (): string => {
  if (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1") &&
    import.meta.env.DEV
  ) {
    const devUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1";
    const cleanDev = devUrl.trim().replace(/\/+$/, "");
    return cleanDev.endsWith("/api/v1") ? cleanDev : `${cleanDev}/api/v1`;
  }

  const raw =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "https://portfolio-856o.onrender.com/api/v1";

  const clean = raw.trim().replace(/\/+$/, "");
  return clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
};

export const API_BASE = getBaseUrl();

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
const TOKEN_KEY = "portfolio_access_token";

export const getStoredToken = (): string | null => {
  return (
    getCookie("accessToken") ||
    (typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null)
  );
};

export const setStoredAuth = (token: string, user?: any) => {
  if (token) {
    setCookie("accessToken", token, 1);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }
  if (user && typeof localStorage !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearStoredAuth = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
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

    const text = await res.text();
    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(`Invalid response from auth server (${res.status})`);
    }

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

export const fetchPublic = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  const response = await fetch(url, options);

  const text = await response.text();
  let responseData: any;
  try {
    responseData = JSON.parse(text);
  } catch {
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    responseData = text;
  }

  if (!response.ok) {
    const message =
      typeof responseData === "object" && responseData?.message
        ? responseData.message
        : `Request failed with status ${response.status}`;
    const err = new Error(message);
    (err as any).status = response.status;
    (err as any).data = responseData;
    throw err;
  }

  return responseData;
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

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  let response = await fetch(url, requestOptions);

  if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
    try {
      const newToken = await triggerTokenRefresh();
      headers.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, { ...requestOptions, headers });
    } catch {
      throw new Error("Session expired. Please log in again.");
    }
  }

  const text = await response.text();
  let responseData: any;
  try {
    responseData = JSON.parse(text);
  } catch {
    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }
    responseData = text;
  }

  if (!response.ok) {
    const message =
      typeof responseData === "object" && responseData?.message
        ? responseData.message
        : `Request failed with status ${response.status}`;
    const err = new Error(message);
    (err as any).status = response.status;
    (err as any).data = responseData;
    throw err;
  }

  return responseData;
};
