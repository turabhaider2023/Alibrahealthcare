import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { isFirebaseConfigured } from '../firebase'
import { useCart } from '../context/CartContext'
import { useWish } from '../context/WishContext'
import { Bag, Heart } from './Icons'
import { site } from '../data/site'

export default function Layout() {
  const { count } = useCart()
  const { count: saved } = useWish()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="site">
      {!isFirebaseConfigured && (
        <div className="preview-banner">
          Preview catalog. Add Firebase keys in <code>.env.local</code> before real orders are saved.
        </div>
      )}
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true" />
            <span>
              YZAR
              <small>Healthcare</small>
            </span>
          </Link>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <nav className={open ? 'nav open' : 'nav'}>
            <NavLink to="/shop" end className="nav-shop">
              Shop
            </NavLink>
            <NavLink to="/wishlist" className="nav-tool nav-wish" aria-label={`Wishlist, ${saved} saved`}>
              <Heart filled={saved > 0} />
              Wishlist
              <span className="badge">{saved}</span>
            </NavLink>
            <NavLink to="/cart" className="nav-tool" aria-label={`Cart, ${count} items`}>
              <Bag />
              Cart
              <span className="badge">{count}</span>
            </NavLink>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div className="wrap footer-grid">
          <div>
            <p className="logo footer-logo">
              <span className="logo-mark" aria-hidden="true" />
              YZAR HEALTHCARE
            </p>
            <p>{site.tagline} Food-category vitamins and mineral supplements.</p>
          </div>
          <div>
            <h2>Shop</h2>
            <Link to="/shop">All supplements</Link>
            <Link to="/shop?category=vitamin-d">Vitamin D</Link>
            <Link to="/shop?category=family">Women & kids</Link>
          </div>
          <div>
            <h2>Orders</h2>
            <p>Cash on delivery. Free delivery on orders of ₹999 or more.</p>
            <Link to="/admin/login">Admin</Link>
          </div>
        </div>
        <div className="wrap disclaimer">
          <p>{site.disclaimer}</p>
        </div>
      </footer>
    </div>
  )
}
