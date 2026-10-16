import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../hooks/useCatalog'

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const { orders } = useOrders()
  const fresh = orders.filter((order) => order.status === 'placed').length

  return (
    <div className="admin-app">
      <aside className="admin-side">
        <p className="logo footer-logo">
          <span className="logo-mark" aria-hidden="true" />
          YZAR
        </p>
        <nav>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">
            Orders
            {fresh > 0 && <span className="count-pill">{fresh}</span>}
          </NavLink>
          <NavLink to="/" end>
            View shop
          </NavLink>
        </nav>
        <button className="text-btn light" type="button" onClick={signOut}>
          Sign out
          <small>{user?.email}</small>
        </button>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  )
}
