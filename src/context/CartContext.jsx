import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'alibra-cart'

function readCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const api = useMemo(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0)

    function add(product, qty = 1) {
      if (!product || product.stock <= 0 || product.active === false) return false
      const amount = Math.max(1, Math.min(Number(qty) || 1, product.stock))
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id)
        if (!existing) {
          return [
            ...current,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              qty: amount,
              pack: product.pack || '',
              imageUrl: product.imageUrl || '',
            },
          ]
        }
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                name: product.name,
                price: product.price,
                pack: product.pack || '',
                imageUrl: product.imageUrl || '',
                qty: Math.min(existing.qty + amount, product.stock),
              }
            : item,
        )
      })
      return true
    }

    function setQty(id, qty) {
      setItems((current) =>
        current.flatMap((item) => {
          if (item.id !== id) return [item]
          if (qty <= 0) return []
          return [{ ...item, qty }]
        }),
      )
    }

    function remove(id) {
      setItems((current) => current.filter((item) => item.id !== id))
    }

    function clear() {
      setItems([])
    }

    return { items, count, add, setQty, remove, clear }
  }, [items])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const cart = useContext(CartContext)
  if (!cart) throw new Error('useCart must be used inside CartProvider')
  return cart
}
