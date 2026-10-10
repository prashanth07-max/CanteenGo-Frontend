import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await api('/auth/register', { method: 'POST', body: form })
      login(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="card auth-card" onSubmit={submit}>
      <h2>Create your account</h2>
      <p className="muted">Skip the queue. Order ahead.</p>
      {error && <div className="alert">{error}</div>}
      <label>Full name
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </label>
      <label>Email
        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </label>
      <label>Password
        <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      <button className="btn btn-primary" type="submit">Register</button>
      <p className="muted center">Already registered? <Link to="/login">Login</Link></p>
    </form>
  )
}
