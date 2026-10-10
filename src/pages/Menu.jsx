import { useEffect, useMemo, useState } from 'react'
import { api, money } from '../api.js'
import { useCart } from '../context/CartContext.jsx'

export default function Menu() {
  const [foods, setFoods] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const { add, items } = useCart()

  useEffect(() => {
    api('/foods').then(setFoods).catch((e) => setError(e.message))
  }, [])

  const categories = useMemo(() => ['All', ...new Set(foods.map((f) => f.category))], [foods])
  const visible = foods.filter(
    (f) =>
      (category === 'All' || f.category === category) &&
      f.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (food) => {
    add(food)
    setToast(`${food.name} added to cart`)
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <>
      <div className="page-head">
        <h1>Today's Menu</h1>
        <input className="search" placeholder="Search food…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="pills">
        {categories.map((c) => (
          <button key={c} className={`pill ${c === category ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
        ))}
      </div>
      {error && <div className="alert">{error}</div>}
      <div className="grid">
        {visible.map((f) => {
          const inCart = items.find((i) => i.food.id === f.id)?.qty
          return (
            <div className="card food" key={f.id}>
              <span className="tag">{f.category}</span>
              <h3>{f.name}</h3>
              <p className="muted">{f.description}</p>
              <div className="food-foot">
                <strong className="price">{money(f.price)}</strong>
                <button className="btn btn-primary" onClick={() => handleAdd(f)}>
                  {inCart ? `Add more (${inCart})` : 'Add to cart'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
      {!visible.length && !error && <p className="muted center">No items found.</p>}
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}
