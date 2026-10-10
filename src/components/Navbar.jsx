import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count, clear } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    clear()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="brand">🍽️ Canteen<span>Go</span></NavLink>
        <nav>
          {user?.role === 'STUDENT' && (
            <>
              <NavLink to="/">Menu</NavLink>
              <NavLink to="/cart">Cart{count > 0 && <b className="badge">{count}</b>}</NavLink>
              <NavLink to="/orders">My Orders</NavLink>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <>
              <NavLink to="/admin/orders">Orders</NavLink>
              <NavLink to="/admin/foods">Menu Items</NavLink>
            </>
          )}
          {user ? (
            <>
              <span className="who">{user.name}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
