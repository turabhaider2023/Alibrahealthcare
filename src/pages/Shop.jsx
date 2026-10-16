import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/catalog'
import { useProducts, useTitle } from '../hooks/useCatalog'

export default function Shop() {
  useTitle('Shop')
  const { products, loading, error } = useProducts()
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('featured')
  const category = params.get('category') || 'all'
  const query = params.get('q') || ''

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = products.filter((product) => {
      if (product.active === false) return false
      if (category !== 'all' && product.category !== category) return false
      if (!needle) return true
      return `${product.name} ${product.summary} ${product.pack}`.toLowerCase().includes(needle)
    })
    return filtered.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
    })
  }, [products, category, query, sort])

  function setCategory(next) {
    const updated = new URLSearchParams(params)
    if (next === 'all') updated.delete('category')
    else updated.set('category', next)
    setParams(updated)
  }

  function setQuery(value) {
    const updated = new URLSearchParams(params)
    if (value) updated.set('q', value)
    else updated.delete('q')
    setParams(updated, { replace: true })
  }

  return (
    <div className="wrap page">
      <div className="section-head">
        <div>
          <p className="eyebrow">The shop</p>
          <h1>Supplements</h1>
        </div>
        <label className="sort-label">
          Sort
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="shop-tools">
        <div className="chips">
          <button type="button" className={category === 'all' ? 'chip on' : 'chip'} onClick={() => setCategory('all')}>
            All
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={category === item.id ? 'chip on' : 'chip'}
              onClick={() => setCategory(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <input
          className="search"
          type="search"
          placeholder="Search Vitamin D, gummies…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search supplements"
        />
      </div>

      {error && <p className="alert">{error}</p>}
      {loading ? (
        <p className="muted">Loading supplements…</p>
      ) : visible.length === 0 ? (
        <p className="muted">Nothing matches this filter. Try another category, or add products in the admin panel.</p>
      ) : (
        <div className="grid">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
