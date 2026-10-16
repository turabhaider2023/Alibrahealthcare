import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWish } from '../context/WishContext'
import { useProducts, useTitle } from '../hooks/useCatalog'
import { money } from '../lib/format'

export default function WishlistPage() {
  useTitle('Wishlist')
  const { items, remove } = useWish()
  const { add } = useCart()
  const { products } = useProducts()

  return (
    <div className="wrap page">
      <p className="eyebrow">Saved for later</p>
      <h1>Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>Nothing saved yet. Tap the heart on a supplement to keep it here.</p>
          <Link className="btn btn-dark" to="/shop">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="stack">
          {items.map((item) => {
            const live = products.find((product) => product.id === item.id)
            const price = live?.price ?? item.price
            const soldOut = live ? live.stock <= 0 || live.active === false : false
            return (
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
                <strong>{money(price)}</strong>
                <button
                  className="btn btn-small btn-dark"
                  type="button"
                  disabled={soldOut || !live}
                  onClick={() => live && add(live, 1)}
                >
                  {soldOut ? 'Sold out' : 'Add to cart'}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
