import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor: attach token ──────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: handle 401 ───────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Typed response shapes ─────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiError {
  error: string;
  details?: Array<{ path: string; message: string }>;
}

// ─── Helper for extracting error message ────────────────────────────
// "Validation isIn on exception_type failed" → "Exception type: choose one of the listed options"
function friendlyDetail(d: { path?: string | (string | number)[]; message?: string }): string {
  const field = String(Array.isArray(d.path) ? d.path.join('.') : d.path || '')
    .replace(/_/g, ' ')
    .replace(/^./, (c) => c.toUpperCase());
  const msg = String(d.message || '');
  const m = msg.match(/^Validation (\w+) on (\w+) failed$/);
  if (m) {
    const what = m[1] === 'isIn' ? 'choose one of the listed options' : 'is not valid';
    return `${field || m[2].replace(/_/g, ' ')}: ${what}`;
  }
  return field && !msg.toLowerCase().startsWith(field.toLowerCase()) ? `${field}: ${msg}` : msg;
}

/**
 * A message fit to show the user. `fallback` is used when the server gives no
 * reason (e.g. the network is down), e.g. "Failed to load slips".
 */
export function getErrorMessage(err: unknown, fallback?: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;
    // Don't show internal permission codes to users
    if (err.response?.status === 403) {
      return "You don't have access to this. Ask a manager if you need it.";
    }
    if (!err.response) {
      return `${fallback ? fallback + '. ' : ''}Check your connection and try again.`;
    }
    if (data?.details && data.details.length > 0) {
      return data.details.map(friendlyDetail).join(', ');
    }
    if (data?.error) return data.error;
    return fallback || err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback || 'Something went wrong';
}