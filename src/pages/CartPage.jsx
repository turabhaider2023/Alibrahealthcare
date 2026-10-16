import { Link } from 'react-router-dom'
import { isActiveProduct } from '../data/catalog'
import { site } from '../data/site'
import { useCart } from '../context/CartContext'
import { useProducts, useTitle } from '../hooks/useCatalog'
import { money, shippingFor, subtotalOf } from '../lib/format'

export default function CartPage() {
  useTitle('Cart')
  const { items, setQty, remove } = useCart()
  const { products } = useProducts()
  const subtotal = subtotalOf(items)
  const shipping = shippingFor(subtotal)

  function changeQty(item, next) {
    const live = products.find((product) => product.id === item.id)
    const max = live && isActiveProduct(live) ? live.stock : item.qty
    setQty(item.id, Math.min(next, Math.max(max, 1)))
  }

  return (
    <div className="wrap page">
      <h1>Cart</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
          <Link className="btn btn-dark" to="/shop">
            Browse supplements
          </Link>
        </div>
      ) : (
        <div className="split">
          <div className="stack">
            {items.map((item) => (
              <article key={item.id} className="line">
                <div>
                  <h2>
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </h2>
                  <p className="muted">{item.pack}</p>
                  <button className="text-btn" type="button" onClick={() => remove(item.id)}>
                    Remove
                  </button>
                </div>
                <div className="qty">
                  <button type="button" onClick={() => changeQty(item, item.qty - 1)} disabled={item.qty <= 1} aria-label="Decrease quantity">
                    −
                  </button>
                  <span>{item.qty}</span>
                  <button type="button" onClick={() => changeQty(item, item.qty + 1)} aria-label="Increase quantity">
                    +
                  </button>
                </div>
                <strong>{money(item.price * item.qty)}</strong>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Summary</h2>
            <p>
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </p>
            <p>
              <span>Delivery</span>
              <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
            </p>
            <p className="total">
              <span>Total</span>
              <span>{money(subtotal + shipping)}</span>
            </p>
            <p className="fine">
              {subtotal >= site.freeShippingOver
                ? 'This order qualifies for free delivery.'
                : `Add ${money(site.freeShippingOver - subtotal)} more for free delivery.`}
            </p>
            <Link className="btn btn-dark" to="/checkout">
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
