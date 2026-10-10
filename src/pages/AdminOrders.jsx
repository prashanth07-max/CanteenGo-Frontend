import { useEffect, useState } from 'react'
import { api, money } from '../api.js'
import StatusBadge from '../components/StatusBadge.jsx'

const STATUSES = ['PENDING', 'PREPARING', 'READY', 'COMPLETED']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [error, setError] = useState('')

  const load = () => api('/admin/orders').then(setOrders).catch((e) => setError(e.message))

  useEffect(() => {
    load()
    const t = setInterval(load, 8000)
    return () => clearInterval(t)
  }, [])

  const changeStatus = async (id, status) => {
    try {
      const updated = await api(`/admin/orders/${id}/status`, { method: 'PUT', body: { status } })
      setOrders((cur) => cur.map((o) => (o.id === id ? updated : o)))
    } catch (e) {
      setError(e.message)
    }
  }

  const visible = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  return (
    <>
      <h1>Incoming Orders</h1>
      <div className="pills">
        {['ALL', ...STATUSES].map((s) => (
          <button key={s} className={`pill ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'ALL' ? 'All' : s[0] + s.slice(1).toLowerCase()}
            {' '}({s === 'ALL' ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>
      {error && <div className="alert">{error}</div>}
      {!visible.length && <p className="muted">No orders here.</p>}
      {visible.map((o) => (
        <div className="card order" key={o.id}>
          <div className="order-head">
            <strong>#{o.id} · {o.studentName}</strong>
            <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>
            <StatusBadge status={o.status} />
          </div>
          {o.items.map((i, idx) => (
            <div className="row slim" key={idx}>
              <span className="grow">{i.foodName} × {i.quantity}</span>
              <span>{money(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="row slim total">
            <span className="grow">Total {money(o.total)}</span>
            <select value={o.status} onChange={(e) => changeStatus(o.id, e.target.value)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s[0] + s.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
        </div>
      ))}
    </>
  )
}
