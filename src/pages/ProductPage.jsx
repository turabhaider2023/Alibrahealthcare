import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Strip, { stripName } from '../components/Strip'
import ProductCard from '../components/ProductCard'
import { categoryById, isActiveProduct } from '../data/catalog'
import { site } from '../data/site'
import { useCart } from '../context/CartContext'
import { useWish } from '../context/WishContext'
import { Heart } from '../components/Icons'
import { useProduct, useProducts, useTitle } from '../hooks/useCatalog'
import { money } from '../lib/format'

export default function ProductPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { products } = useProducts()
  const { add } = useCart()
  const { has, toggle } = useWish()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useTitle(product?.name || 'Product')

  if (loading) {
    return (
      <div className="wrap page">
        <p className="muted">Loading product…</p>
      </div>
    )
  }

  if (error || !product || !isActiveProduct(product)) {
    return (
      <div className="wrap page">
        <h1>Product not available</h1>
        <p className="muted">{error || 'This supplement is not in the shop right now.'}</p>
        <Link className="btn btn-dark" to="/shop">
          Back to shop
        </Link>
      </div>
    )
  }

  const category = categoryById(product.category)
  const soldOut = product.stock <= 0
  const related = products
    .filter((item) => item.id !== product.id && item.category === product.category && isActiveProduct(item))
    .slice(0, 3)

  function addToCart() {
    const ok = add(product, qty)
    if (!ok) return
    setAdded(true)
  }

  return (
    <div className="wrap page">
      <p className="crumbs">
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`}>{category.name}</Link>
      </p>
      <article className="product">
        <div className="product-visual" style={{ background: category.tint }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} />
          ) : (
            <Strip tint="#fffdf8" tablet={category.tablet} name={stripName(product.name)} />
          )}
        </div>
        <div>
          <p className="eyebrow">{category.name}</p>
          <h1>{product.name}</h1>
          <p className="hero-lead">{product.summary}</p>
          <p className="price price-lg">
            {money(product.price)}
            {product.mrp > product.price && <span className="mrp">{money(product.mrp)}</span>}
          </p>
          <p className="muted">
            {product.pack} · {product.form}
            {product.stock > 0 && product.stock <= 8 ? ` · Only ${product.stock} left` : ''}
            {soldOut ? ' · Out of stock' : ''}
          </p>
          <div className="buy-row">
            <div className="qty">
              <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span>{qty}</span>
              <button
                type="button"
                onClick={() => setQty((value) => Math.min(product.stock || 1, value + 1))}
                aria-label="Increase quantity"
                disabled={soldOut || qty >= product.stock}
              >
                +
              </button>
            </div>
            <button className="btn btn-dark" type="button" disabled={soldOut} onClick={addToCart}>
              {soldOut ? 'Out of stock' : 'Add to cart'}
            </button>
            <button
              className={has(product.id) ? 'btn wish-label on' : 'btn wish-label'}
              type="button"
              aria-pressed={has(product.id)}
              onClick={() => toggle(product)}
            >
              <Heart filled={has(product.id)} />
              {has(product.id) ? 'Saved' : 'Wishlist'}
            </button>
            {added && (
              <Link to="/cart" className="added-note">
                Added. View cart
              </Link>
            )}
          </div>
          <dl className="meta">
            <dt>Details</dt>
            <dd>{product.details}</dd>
            <dt>How to take</dt>
            <dd>{product.usage}</dd>
            <dt>Nutrients</dt>
            <dd>{product.nutrients}</dd>
          </dl>
          <p className="fine">{site.disclaimer}</p>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section">
          <h2>More in {category.name}</h2>
          <div className="grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
