export async function api(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const user = JSON.parse(localStorage.getItem('canteengo_user') || 'null')
  if (user?.token) headers.Authorization = `Bearer ${user.token}`

  const res = await fetch(`/api${path}`, {
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
