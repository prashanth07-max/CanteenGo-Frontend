// Production API base URL, set at build time via VITE_API_URL (e.g.
// https://canteengo-backend-nfpl.onrender.com or https://canteengo-backend-nfpl.onrender.com/api).
// Empty => same origin (uses the Vite proxy in dev).
const rawUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
const API_BASE = rawUrl.endsWith('/api') ? rawUrl.slice(0, -4) : rawUrl

export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const user = JSON.parse(localStorage.getItem('canteengo_user') || 'null')
  if (user?.token) headers.Authorization = `Bearer ${user.token}`

  const targetUrl = API_BASE ? `${API_BASE}/api${path}` : `/api${path}`
  const res = await fetch(targetUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    if (res.status === 401 && user) {
      localStorage.removeItem('canteengo_user')
      window.location.href = '/login'
    }
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Something went wrong')
  }
  return res.status === 204 ? null : res.json()
}

export const money = (n) => `₹${Number(n).toFixed(0)}`
