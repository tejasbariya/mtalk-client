import axios from 'axios';
import { useStore } from '../store/useStore';
import { toast } from '../components/ToastProvider.jsx';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 15000, // fail fast after 15s
});

// ── Attach JWT to every request ───────────────────────────────
API.interceptors.request.use((config) => {
  const token = useStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Global response error handler ─────────────────────────────
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // Don't toast on 401 — those are handled in-component (login/register forms)
    const status  = err?.response?.status;
    const message = err?.response?.data?.message || err?.message;

    if (!status) {
      // Network error — server is likely down
      toast.error('Cannot reach the server. Please check your connection.');
    } else if (status === 503) {
      toast.error('Database is temporarily unavailable. Try again shortly.');
    } else if (status === 500) {
      toast.error('Server error. Our team has been notified.');
    }
    // 400 and 401 are surfaced by the form itself, not globally

    return Promise.reject(err);
  }
);

export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser    = (data) => API.post('/api/auth/login', data);
export const getMe        = ()     => API.get('/api/auth/me');
export const deleteAccount= () => API.delete('/api/auth/me');
export const addToLibrary = (data) => API.post('/api/library', data);
export default API;
