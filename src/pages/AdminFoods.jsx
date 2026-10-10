import { useEffect, useState } from 'react'
import { api, money } from '../api.js'

const EMPTY = { name: '', category: '', price: '', description: '', available: true }

export default function AdminFoods() {
  const [foods, setFoods] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')

  const load = () => api('/admin/foods').then(setFoods).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const body = { ...form, price: parseFloat(form.price) }
      if (editId) await api(`/admin/foods/${editId}`, { method: 'PUT', body })
      else await api('/admin/foods', { method: 'POST', body })
      setForm(EMPTY)
      setEditId(null)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  const edit = (f) => {
    setEditId(f.id)
    setForm({ name: f.name, category: f.category, price: f.price, description: f.description || '', available: f.available })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (f) => {
    if (!window.confirm(`Delete "${f.name}"?`)) return
    try { await api(`/admin/foods/${f.id}`, { method: 'DELETE' }); load() } catch (e) { setError(e.message) }
  }

  const toggle = async (f) => {
    try { await api(`/admin/foods/${f.id}`, { method: 'PUT', body: { ...f, available: !f.available } }); load() }
    catch (e) { setError(e.message) }
  }

  return (
    <>
      <h1>Manage Menu</h1>
      {error && <div className="alert">{error}</div>}
      <form className="card form-grid" onSubmit={submit}>
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Category<input required placeholder="Meals, Snacks, Beverages…" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></label>
        <label>Price (₹)<input required type="number" min="1" step="0.5" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
        <label className="wide">Description<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label className="check"><input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} /> Available</label>
        <div className="actions wide">
          {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(EMPTY) }}>Cancel</button>}
          <button className="btn btn-primary" type="submit">{editId ? 'Update item' : 'Add item'}</button>
        </div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.category}</td>
                <td>{money(f.price)}</td>
                <td>
                  <button className={`status ${f.available ? 's-READY' : 's-PENDING'} clickable`} onClick={() => toggle(f)}>
                    {f.available ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="right">
                  <button className="btn btn-ghost sm" onClick={() => edit(f)}>Edit</button>
                  <button className="btn btn-danger sm" onClick={() => remove(f)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
