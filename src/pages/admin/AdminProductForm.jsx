import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { categories, productForms } from '../../data/catalog'
import { useProduct, useTitle } from '../../hooks/useCatalog'
import { deleteProduct, saveProduct } from '../../services/store'

const emptyForm = {
  name: '',
  category: 'vitamin-d',
  price: '',
  mrp: '',
  pack: '',
  form: 'Tablet',
  summary: '',
  details: '',
  usage: '',
  nutrients: '',
  stock: '',
  imageUrl: '',
  featured: false,
  active: true,
}

export default function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useTitle(id ? 'Edit product' : 'Add product')

  useEffect(() => {
    if (!product) return
    setForm({
      name: product.name || '',
      category: product.category || 'vitamin-d',
      price: product.price ?? '',
      mrp: product.mrp ?? '',
      pack: product.pack || '',
      form: product.form || 'Tablet',
      summary: product.summary || '',
      details: product.details || '',
      usage: product.usage || '',
      nutrients: product.nutrients || '',
      stock: product.stock ?? '',
      imageUrl: product.imageUrl || '',
      featured: Boolean(product.featured),
      active: product.active !== false,
    })
  }, [product])

  function update(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function validate() {
    if (form.name.trim().length < 2) return 'Add the product name.'
    if (!form.category) return 'Choose a category.'
    if (!(Number(form.price) > 0)) return 'Price should be more than zero.'
    if (form.mrp !== '' && Number(form.mrp) < Number(form.price)) return 'MRP should be the same as the price, or higher.'
    if (!form.pack.trim()) return 'Add the pack size, for example 60 tablets.'
    if (!form.summary.trim()) return 'Add a short description.'
    if (!Number.isFinite(Number(form.stock)) || Number(form.stock) < 0) return 'Stock cannot be negative.'
    return ''
  }

  async function submit(event) {
    event.preventDefault()
    const problem = validate()
    if (problem) {
      setMessage(problem)
      return
    }
    setSaving(true)
    setMessage('')
    try {
      await saveProduct(id, form, file)
      navigate('/admin/products')
    } catch (err) {
      setMessage(err.message || 'Could not save this product.')
      setSaving(false)
    }
  }

  async function remove() {
    if (!id || !window.confirm('Delete this product from the shop?')) return
    setSaving(true)
    setMessage('')
    try {
      await deleteProduct(id)
      navigate('/admin/products')
    } catch (err) {
      setMessage(err.message || 'Could not delete this product.')
      setSaving(false)
    }
  }

  if (id && loading) return <p className="muted">Loading product…</p>
  if (id && error) return <p className="alert">{error}</p>
  if (id && !loading && !product) {
    return (
      <div>
        <h1>Product not found</h1>
        <Link to="/admin/products">Back to products</Link>
      </div>
    )
  }

  return (
    <div>
      <p className="eyebrow">{id ? 'Edit product' : 'New product'}</p>
      <h1>{id ? form.name || 'Edit product' : 'Add a product'}</h1>
      <form className="form-grid admin-form" onSubmit={submit}>
        <label className="span-2">
          Name
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={update}>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Form
          <select name="form" value={form.form} onChange={update}>
            {productForms.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price (₹)
          <input name="price" type="number" min="1" step="1" value={form.price} onChange={update} required />
        </label>
        <label>
          MRP (₹)
          <input name="mrp" type="number" min="0" step="1" value={form.mrp} onChange={update} />
        </label>
        <label>
          Pack size
          <input name="pack" value={form.pack} onChange={update} placeholder="60 tablets" required />
        </label>
        <label>
          Stock
          <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={update} required />
        </label>
        <label className="span-2">
          Short description
          <textarea name="summary" value={form.summary} onChange={update} required />
        </label>
        <label className="span-2">
          Details
          <textarea name="details" value={form.details} onChange={update} />
        </label>
        <label className="span-2">
          How to take
          <textarea name="usage" value={form.usage} onChange={update} />
        </label>
        <label className="span-2">
          Nutrients
          <textarea name="nutrients" value={form.nutrients} onChange={update} />
        </label>
        <label className="span-2">
          Image URL
          <input name="imageUrl" value={form.imageUrl} onChange={update} placeholder="https://…" />
        </label>
        <label className="span-2">
          Or upload an image
          <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        {form.imageUrl && !file && (
          <img className="thumb span-2" src={form.imageUrl} alt="" />
        )}
        <label className="check">
          <input type="checkbox" name="featured" checked={form.featured} onChange={update} />
          Show on the home page
        </label>
        <label className="check">
          <input type="checkbox" name="active" checked={form.active} onChange={update} />
          Visible in the shop
        </label>
        {message && <p className="alert span-2">{message}</p>}
        <div className="span-2 form-actions">
          <button className="btn btn-dark" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save product'}
          </button>
          {id && (
            <button className="btn btn-danger" type="button" onClick={remove} disabled={saving}>
              Delete
            </button>
          )}
          <Link to="/admin/products">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
