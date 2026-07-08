// Centralized API helper — automatically attaches the JWT to protected calls.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const TOKEN_KEY = 'blog_token';

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
};

const parseError = async (res, fallback) => {
  try {
    const data = await res.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
};

export const api = async (path, { method = 'GET', body, auth = false } = {}) => {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    // The fetch itself threw — backend is down, CORS blocked, or wrong URL.
    throw new Error(
      `Cannot reach the API at ${API_URL}. Is the backend server running? (${networkErr.message})`
    );
  }

  if (!res.ok) {
    const message = await parseError(res, `Request failed: ${res.status}`);
    throw new Error(message);
  }

  // Some endpoints (e.g. login) return JSON; 204 returns null.
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export const authApi = {
  register: (payload) => api('/auth/register', { method: 'POST', body: payload }),
  login: async (payload) => {
    const data = await api('/auth/login', { method: 'POST', body: payload });
    if (data?.token) setToken(data.token);
    return data;
  },
  logout: () => clearToken(),
};

export const blogApi = {
  list: () => api('/blogs'),
  get: (id) => api(`/blogs/${id}`),
  create: (payload) => api('/blogs', { method: 'POST', body: payload, auth: true }),
  update: (id, payload) => api(`/blogs/${id}`, { method: 'PUT', body: payload, auth: true }),
  remove: (id) => api(`/blogs/${id}`, { method: 'DELETE', auth: true }),
};

export const userApi = {
  profile: () => api('/profile', { auth: true }),
};
