import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTitle } from '../hooks/useCatalog'
import { formatWhen, money, statusLabel } from '../lib/format'
import { getOrder } from '../services/store'

export default function OrderPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  useTitle('Order confirmed')

  useEffect(() => {
    let active = true
    getOrder(id)
      .then((next) => {
        if (active) setOrder(next)
      })
      .catch(() => {
        if (active) setOrder(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="wrap page">
        <p className="muted">Loading order…</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="wrap page">
        <h1>Order not found</h1>
        <p className="muted">This confirmation is not on this browser, or the order id is wrong.</p>
        <Link className="btn btn-dark" to="/shop">
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap page narrow">
      <p className="eyebrow">{statusLabel(order.status)}</p>
      <h1>Thank you. We have your order.</h1>
      <p className="hero-lead">
        Order <strong>{order.id}</strong>
        {order.createdAt ? ` · ${formatWhen(order.createdAt)}` : ''}. Pay {money(order.total)} in cash when it arrives.
      </p>
      {order.demo && (
        <p className="alert">This is a preview order saved only in this browser. Connect Firebase to store it for the admin panel.</p>
      )}
      <div className="summary">
        {order.items?.map((item) => (
          <p key={item.id}>
            <span>
              {item.name} × {item.qty}
            </span>
            <span>{money(item.price * item.qty)}</span>
          </p>
        ))}
        <p>
          <span>Delivery</span>
          <span>{order.shipping ? money(order.shipping) : 'Free'}</span>
        </p>
        <p className="total">
          <span>Total</span>
          <span>{money(order.total)}</span>
        </p>
      </div>
      <p className="muted">
        Delivery address: {order.customer?.name}, {order.customer?.address}, {order.customer?.city}, {order.customer?.state}{' '}
        {order.customer?.pincode}. We will contact {order.customer?.phone}.
      </p>
      <Link className="btn btn-dark" to="/shop">
        Continue shopping
      </Link>
    </div>
  )
}
