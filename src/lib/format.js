import { site } from '../data/site'

export function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export function formatWhen(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null
  if (!date || Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function subtotalOf(items) {
  return items.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0)
}

export function shippingFor(subtotal) {
  if (subtotal <= 0) return 0
  return subtotal >= site.freeShippingOver ? 0 : site.shippingFee
}

export function statusLabel(status) {
  const labels = {
    placed: 'New',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }
  return labels[status] || status || 'New'
}
