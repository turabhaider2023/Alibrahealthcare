import { useState } from 'react'
import { useOrders, useTitle } from '../../hooks/useCatalog'
import { formatWhen, money, statusLabel } from '../../lib/format'
import { updateOrderStatus } from '../../services/store'

const statuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  useTitle('Orders')
  const { orders, loading, error } = useOrders()
  const [message, setMessage] = useState('')

  async function changeStatus(id, status) {
    setMessage('')
    try {
      await updateOrderStatus(id, status)
    } catch (err) {
      setMessage(err.message || 'Could not update this order.')
    }
  }

  return (
    <div>
      <p className="eyebrow">Cash on delivery</p>
      <h1>Orders</h1>
      <p className="muted">Confirm an order here before it is packed. The price is what the customer submitted.</p>
      {(error || message) && <p className="alert">{error || message}</p>}
      {loading ? (
        <p className="muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="admin-top">
                <div>
                  <h2>{order.customer?.name || 'Customer'}</h2>
                  <p className="muted">
                    {formatWhen(order.createdAt)} · {order.id}
                  </p>
                </div>
                <label className="sort-label">
                  {statusLabel(order.status)}
                  <select value={order.status || 'placed'} onChange={(event) => changeStatus(order.id, event.target.value)}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p>
                {order.customer?.phone} · {order.customer?.email}
              </p>
              <p>
                {order.customer?.address}, {order.customer?.city}, {order.customer?.state} {order.customer?.pincode}
              </p>
              {order.customer?.note && <p className="fine">Note: {order.customer.note}</p>}
              <ul className="order-items">
                {order.items?.map((item) => (
                  <li key={`${order.id}-${item.id}`}>
                    {item.name} × {item.qty}
                    <span>{money(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="total">
                <span>{order.paymentMethod || 'Cash on delivery'}</span>
                <span>{money(order.total)}</span>
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
