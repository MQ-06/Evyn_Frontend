import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // sends httpOnly refresh token cookie automatically
});

// ─── Request interceptor: attach access token ─────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('evyn-auth');
    if (raw) {
      try {
        const { state } = JSON.parse(raw) as { state: { token: string | null } };
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
        // corrupted storage — ignore
      }
    }
  }
  return config;
});

// ─── Response interceptor: silent refresh on 401 ─────────────────────────────

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processPendingQueue(err: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (err) reject(err);
    else resolve(token!);
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // backend reads httpOnly refresh cookie; no body needed
      const { data } = await axios.post<{ access_token: string; user: unknown }>(
        `${API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newToken = data.access_token;

      // update persisted Zustand store token in localStorage
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('evyn-auth');
        if (raw) {
          const parsed = JSON.parse(raw) as { state: Record<string, unknown> };
          parsed.state.token = newToken;
          localStorage.setItem('evyn-auth', JSON.stringify(parsed));
        }
      }

      processPendingQueue(null, newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      processPendingQueue(refreshError, null);
      // clear auth state so the user is redirected to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('evyn-auth');
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
