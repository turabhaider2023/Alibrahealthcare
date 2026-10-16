import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isActiveProduct } from '../data/catalog'
import { isFirebaseConfigured } from '../firebase'
import { useCart } from '../context/CartContext'
import { useProducts, useTitle } from '../hooks/useCatalog'
import { money, shippingFor, subtotalOf } from '../lib/format'
import { placeOrder } from '../services/store'

const emptyCustomer = {
  name: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  note: '',
}

function validate(customer) {
  if (customer.name.trim().length < 2) return 'Enter the full name.'
  const phone = customer.phone.replace(/\s/g, '')
  if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter a 10-digit Indian mobile number.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) return 'Enter a valid email address.'
  if (customer.address.trim().length < 8) return 'Enter the house number, street, and area.'
  if (customer.city.trim().length < 2) return 'Enter the city.'
  if (customer.state.trim().length < 2) return 'Enter the state.'
  if (!/^\d{6}$/.test(customer.pincode.trim())) return 'Enter a 6-digit PIN code.'
  if (customer.note.trim().length > 300) return 'Keep the note under 300 characters.'
  return ''
}

export default function CheckoutPage() {
  useTitle('Checkout')
  const navigate = useNavigate()
  const { items, clear } = useCart()
  const { products, loading } = useProducts()
  const [customer, setCustomer] = useState(emptyCustomer)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const lines = useMemo(
    () =>
      items.map((item) => {
        const live = products.find((product) => product.id === item.id)
        if (!live || !isActiveProduct(live) || live.stock <= 0) {
          return { ...item, unavailable: true, qty: 0, price: live?.price ?? item.price }
        }
        const qty = Math.min(item.qty, live.stock)
        return {
          id: live.id,
          name: live.name,
          pack: live.pack || '',
          price: Number(live.price),
          qty,
          adjusted: qty !== item.qty,
          unavailable: false,
        }
      }),
    [items, products],
  )

  const blocked = lines.some((line) => line.unavailable)
  const payable = lines.filter((line) => !line.unavailable && line.qty > 0)
  const subtotal = subtotalOf(payable)
  const shipping = shippingFor(subtotal)
  const total = subtotal + shipping

  function update(event) {
    const { name, value } = event.target
    setCustomer((current) => ({ ...current, [name]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    const problem = validate(customer)
    if (problem) {
      setError(problem)
      return
    }
    if (blocked || payable.length === 0) {
      setError('Remove unavailable items before placing the order.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const order = await placeOrder({
        items: payable.map((line) => ({
          id: line.id,
          name: line.name,
          pack: line.pack,
          price: line.price,
          qty: line.qty,
        })),
        customer: {
          name: customer.name.trim(),
          phone: customer.phone.replace(/\s/g, ''),
          email: customer.email.trim(),
          address: customer.address.trim(),
          city: customer.city.trim(),
          state: customer.state.trim(),
          pincode: customer.pincode.trim(),
          note: customer.note.trim(),
        },
        subtotal,
        shipping,
        total,
      })
      clear()
      navigate(`/order/${order.id}`)
    } catch (err) {
      setError(err.message || 'The order could not be saved.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="wrap page">
        <h1>Checkout</h1>
        <p className="muted">Your cart is empty.</p>
        <Link className="btn btn-dark" to="/shop">
          Browse supplements
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap page">
      <h1>Checkout</h1>
      <p className="muted">Cash on delivery. We will call the mobile number below to confirm the order.</p>
      {!isFirebaseConfigured && (
        <p className="alert">Firebase is not connected, so this order stays in this browser only.</p>
      )}
      <form className="split" onSubmit={submit}>
        <div className="form-grid">
          <label>
            Full name
            <input name="name" autoComplete="name" value={customer.name} onChange={update} required />
          </label>
          <label>
            Mobile
            <input name="phone" autoComplete="tel" inputMode="numeric" value={customer.phone} onChange={update} required />
          </label>
          <label className="span-2">
            Email
            <input name="email" type="email" autoComplete="email" value={customer.email} onChange={update} required />
          </label>
          <label className="span-2">
            Address
            <textarea name="address" autoComplete="street-address" value={customer.address} onChange={update} required />
          </label>
          <label>
            City
            <input name="city" autoComplete="address-level2" value={customer.city} onChange={update} required />
          </label>
          <label>
            State
            <input name="state" autoComplete="address-level1" value={customer.state} onChange={update} required />
          </label>
          <label>
            PIN code
            <input name="pincode" autoComplete="postal-code" inputMode="numeric" value={customer.pincode} onChange={update} required />
          </label>
          <label>
            Note
            <input name="note" value={customer.note} onChange={update} placeholder="Optional" />
          </label>
          {error && <p className="alert span-2">{error}</p>}
          <div className="span-2">
            <button className="btn btn-dark" type="submit" disabled={submitting || loading || blocked}>
              {submitting ? 'Placing order…' : `Place order · ${money(total)}`}
            </button>
          </div>
        </div>
        <aside className="summary">
          <h2>Your order</h2>
          {loading && <p className="muted">Checking latest prices…</p>}
          {lines.map((line) => (
            <p key={line.id}>
              <span>
                {line.name} × {line.unavailable ? 0 : line.qty}
                {line.unavailable ? ' · unavailable' : ''}
                {line.adjusted ? ' · quantity adjusted to stock' : ''}
              </span>
              <span>{line.unavailable ? '—' : money(line.price * line.qty)}</span>
            </p>
          ))}
          <p>
            <span>Delivery</span>
            <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
          </p>
          <p className="total">
            <span>To pay</span>
            <span>{money(total)}</span>
          </p>
          <p className="fine">Payment method: cash on delivery.</p>
        </aside>
      </form>
    </div>
  )
}
