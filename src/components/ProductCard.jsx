import { useState } from 'react'
import { Link } from 'react-router-dom'
import Strip, { stripName } from './Strip'
import { Heart } from './Icons'
import { categoryById } from '../data/catalog'
import { useCart } from '../context/CartContext'
import { useWish } from '../context/WishContext'
import { money } from '../lib/format'

export default function ProductCard({ product }) {
  const { add } = useCart()
  const { has, toggle } = useWish()
  const category = categoryById(product.category)
  const [added, setAdded] = useState(false)
  const soldOut = product.stock <= 0
  const saved = has(product.id)

  function addOne() {
    const ok = add(product, 1)
    if (!ok) return
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className="pcard">
      <div className="pcard-frame">
        <Link to={`/product/${product.id}`} className="pcard-media" aria-label={product.name} style={{ background: category.tint }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt="" />
          ) : (
            <Strip tint="#fffdf8" tablet={category.tablet} name={stripName(product.name)} />
          )}
        </Link>
        <button
          className={saved ? 'wish-btn on' : 'wish-btn'}
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => toggle(product)}
        >
          <Heart filled={saved} />
        </button>
      </div>
      <div className="pcard-body">
        <p className="eyebrow">{category.name}</p>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="muted">
          {product.pack} · {product.form}
        </p>
        <div className="pcard-row">
          <p className="price">
            {money(product.price)}
            {product.mrp > product.price && <span className="mrp">{money(product.mrp)}</span>}
          </p>
          <button className="btn btn-small" type="button" onClick={addOne} disabled={soldOut}>
            {soldOut ? 'Sold out' : added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </article>
  )
}
