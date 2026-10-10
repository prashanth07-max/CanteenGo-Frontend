import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await api('/auth/login', { method: 'POST', body: form })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="card auth-card" onSubmit={submit}>
      <h2>Welcome back</h2>
      <p className="muted">Log in to order from the canteen.</p>
      {error && <div className="alert">{error}</div>}
      <label>Email
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label>Password
        <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      <button className="btn btn-primary" type="submit">Login</button>
      <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
    </form>
  )
}
