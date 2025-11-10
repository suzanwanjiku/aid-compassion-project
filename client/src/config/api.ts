export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchJson(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = options.headers || {};
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  const res = await fetch(url, { ...options, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(json.message || 'API error');
    err.info = json;
    throw err;
  }
  return json;
}
