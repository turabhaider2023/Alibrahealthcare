import { useState } from 'react'
import { Link } from 'react-router-dom'
import { categoryById } from '../../data/catalog'
import { isFirebaseConfigured } from '../../firebase'
import { useProducts, useTitle } from '../../hooks/useCatalog'
import { money } from '../../lib/format'
import { seedProducts } from '../../services/store'

export default function AdminProducts() {
  useTitle('Products')
  const { products, loading, error } = useProducts()
  const [seedError, setSeedError] = useState('')
  const [seeding, setSeeding] = useState(false)

  async function loadSamples() {
    if (!window.confirm('Add the sample YZAR HEALTHCARE catalog to Firebase? Existing sample products will be updated.')) return
    setSeeding(true)
    setSeedError('')
    try {
      await seedProducts()
    } catch (err) {
      setSeedError(err.message || 'Could not load the sample catalog.')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div>
      <div className="admin-top">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Products</h1>
        </div>
        <div className="hero-actions">
          {isFirebaseConfigured && (
            <button className="btn btn-ghost-dark" type="button" onClick={loadSamples} disabled={seeding}>
              {seeding ? 'Loading…' : 'Load sample catalog'}
            </button>
          )}
          <Link className="btn btn-dark" to="/admin/products/new">
            Add product
          </Link>
        </div>
      </div>
      {(error || seedError) && <p className="alert">{error || seedError}</p>}
      {loading ? (
        <p className="muted">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="muted">No products yet. Add one, or load the sample catalog.</p>
      ) : (
        <div className="admin-list">
          {products.map((product) => (
            <article key={product.id} className="admin-row">
              <div>
                <h2>{product.name}</h2>
                <p className="muted">
                  {categoryById(product.category).name} · {product.pack || 'No pack size'} · Stock {product.stock ?? 0}
                  {product.active === false ? ' · Hidden' : ''}
                  {product.featured ? ' · Featured' : ''}
                </p>
              </div>
              <strong>{money(product.price)}</strong>
              <Link to={`/admin/products/${product.id}`}>Edit</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
