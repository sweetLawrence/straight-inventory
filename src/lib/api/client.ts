// import axios, { AxiosError } from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// export const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ─── Request interceptor: attach token ──────────────────────────────
// apiClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('auth_token');
//   if (token) {
//     config.headers = config.headers || {};
//     (config.headers as any).Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // ─── Response interceptor: handle 401 ───────────────────────────────
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('auth_user');
//       // Redirect to login if not already there
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// // ─── Typed response shapes ─────────────────────────────────────────
// export interface ApiResponse<T> {
//   data: T;
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   meta: {
//     total: number;
//     page: number;
//     limit: number;
//     pages: number;
//   };
// }

// export interface ApiError {
//   error: string;
//   details?: Array<{ path: string; message: string }>;
// }

// // ─── Helper for extracting error message ────────────────────────────
// export function getErrorMessage(err: unknown): string {
//   if (axios.isAxiosError(err)) {
//     const data = err.response?.data as ApiError | undefined;
//     if (data?.details && data.details.length > 0) {
//       return data.details.map((d) => d.message).join(', ');
//     }
//     if (data?.error) return data.error;
//     return err.message;
//   }
//   if (err instanceof Error) return err.message;
//   return 'Unknown error';
// }












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
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;
    // Don't show internal permission codes to users
    if (err.response?.status === 403) {
      return "You don't have permission to do this. Ask a manager if you need access.";
    }
    if (data?.details && data.details.length > 0) {
      return data.details.map((d) => d.message).join(', ');
    }
    if (data?.error) return data.error;
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return 'Unknown error';
}