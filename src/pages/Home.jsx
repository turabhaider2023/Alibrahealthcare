import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Strip from '../components/Strip'
import { categories } from '../data/catalog'
import { site } from '../data/site'
import { useProducts, useTitle } from '../hooks/useCatalog'

export default function Home() {
  useTitle('')
  const { products, loading, error } = useProducts()
  const available = products.filter((product) => product.active !== false)
  const featured = available.filter((product) => product.featured)
  const picks = (featured.length ? featured : available).slice(0, 4)

  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <p className="eyebrow">Food-category supplements</p>
          <h1>Daily nutrition, from Vitamin D to multivitamins.</h1>
          <p className="hero-lead">
            {site.name} sells vitamins and minerals that sit in the food category. Clear packs, upfront prices, and cash on delivery.
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/shop">
              Shop supplements
            </Link>
            <Link className="btn btn-ghost" to="/shop?category=vitamin-d">
              Vitamin D
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Strip tint="#f0d48a" tablet="#c9922a" name="D3" />
          <Strip tint="#fffdf8" tablet="#2f6b52" name="Multi" />
          <Strip tint="#f3c7a1" tablet="#d86a32" name="C 1000" />
        </div>
      </section>

      <section className="trust">
        <article>
          <h2>Food supplements</h2>
          <p>Vitamin D, multivitamins, omega-3, and minerals. Not prescription medicines.</p>
        </article>
        <article>
          <h2>Cash on delivery</h2>
          <p>Pay when the parcel arrives. Orders of ₹999 or more ship free.</p>
        </article>
        <article>
          <h2>Checked before packing</h2>
          <p>Every order lands in the admin panel so it can be confirmed before dispatch.</p>
        </article>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Everyday picks</h2>
          <Link to="/shop">View the full shop</Link>
        </div>
        {error && <p className="alert">{error}</p>}
        {loading ? (
          <p className="muted">Loading supplements…</p>
        ) : picks.length === 0 ? (
          <p className="muted">No products yet. Add them from the admin panel.</p>
        ) : (
          <div className="grid">
            {picks.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Shop by need</h2>
        </div>
        <div className="cat-grid">
          {categories.map((category) => (
            <Link key={category.id} to={`/shop?category=${category.id}`} className="cat-tile" style={{ background: category.tint }}>
              <h3>{category.name}</h3>
              <p>{category.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
