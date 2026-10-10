import { useEffect, useState } from 'react'
import { api, money } from '../api.js'
import StatusBadge from '../components/StatusBadge.jsx'

const STEPS = ['PENDING', 'PREPARING', 'READY', 'COMPLETED']

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const load = () => api('/orders/my').then(setOrders).catch((e) => setError(e.message))
    load()
    const t = setInterval(load, 8000) // live status tracking
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <h1>My Orders</h1>
      {error && <div className="alert">{error}</div>}
      {!orders.length && !error && <p className="muted">No orders yet.</p>}
      {orders.map((o) => (
        <div className="card order" key={o.id}>
          <div className="order-head">
            <strong>Order #{o.id}</strong>
            <span className="muted">{new Date(o.createdAt).toLocaleString()}</span>
            <StatusBadge status={o.status} />
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div key={s} className={`step ${i <= STEPS.indexOf(o.status) ? 'done' : ''}`}>
                <i />{s[0] + s.slice(1).toLowerCase()}
              </div>
            ))}
          </div>
          {o.items.map((i, idx) => (
            <div className="row slim" key={idx}>
              <span className="grow">{i.foodName} × {i.quantity}</span>
              <span>{money(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="row slim total"><span className="grow">Total</span><strong>{money(o.total)}</strong></div>
        </div>
      ))}
    </>
  )
}
