import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, money } from '../api.js'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const { items, setQty, clear, total } = useCart()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const placeOrder = async () => {
    setBusy(true)
    setError('')
    try {
      await api('/orders', {
        method: 'POST',
        body: { items: items.map((i) => ({ foodId: i.food.id, quantity: i.qty })) },
      })
      clear()
      navigate('/orders')
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (!items.length)
    return (
      <div className="card center">
        <h2>Your cart is empty</h2>
        <p className="muted">Pick something tasty from the menu.</p>
        <Link className="btn btn-primary" to="/">Browse menu</Link>
      </div>
    )

  return (
    <>
      <h1>Your Cart</h1>
      {error && <div className="alert">{error}</div>}
      <div className="card">
        {items.map(({ food, qty }) => (
          <div className="row" key={food.id}>
            <div className="grow">
              <strong>{food.name}</strong>
              <div className="muted">{money(food.price)} each</div>
            </div>
            <div className="qty">
              <button onClick={() => setQty(food.id, qty - 1)}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(food.id, qty + 1)}>+</button>
            </div>
            <strong className="line-total">{money(food.price * qty)}</strong>
          </div>
        ))}
        <div className="row total">
          <span className="grow">Total</span>
          <strong>{money(total)}</strong>
        </div>
        <div className="actions">
          <button className="btn btn-ghost" onClick={clear}>Clear cart</button>
          <button className="btn btn-primary" disabled={busy} onClick={placeOrder}>
            {busy ? 'Placing…' : 'Place order'}
          </button>
        </div>
      </div>
    </>
  )
}
