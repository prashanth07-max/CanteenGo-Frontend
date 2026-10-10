import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Menu from './pages/Menu.jsx'
import Cart from './pages/Cart.jsx'
import Orders from './pages/Orders.jsx'
import AdminFoods from './pages/AdminFoods.jsx'
import AdminOrders from './pages/AdminOrders.jsx'

function Protected({ role, children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function Home() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'ADMIN' ? <Navigate to="/admin/orders" replace /> : <Menu />
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Protected role="STUDENT"><Cart /></Protected>} />
          <Route path="/orders" element={<Protected role="STUDENT"><Orders /></Protected>} />
          <Route path="/admin/foods" element={<Protected role="ADMIN"><AdminFoods /></Protected>} />
          <Route path="/admin/orders" element={<Protected role="ADMIN"><AdminOrders /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
