import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const WishContext = createContext(null)
const STORAGE_KEY = 'alibra-wishlist'

function readSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function WishProvider({ children }) {
  const [items, setItems] = useState(readSaved)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const api = useMemo(() => {
    function has(id) {
      return items.some((item) => item.id === id)
    }

    function toggle(product) {
      if (!product) return false
      let saved = false
      setItems((current) => {
        if (current.some((item) => item.id === product.id)) {
          saved = false
          return current.filter((item) => item.id !== product.id)
        }
        saved = true
        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            pack: product.pack || '',
            imageUrl: product.imageUrl || '',
            category: product.category || '',
          },
        ]
      })
      return saved
    }

    function remove(id) {
      setItems((current) => current.filter((item) => item.id !== id))
    }

    return { items, count: items.length, has, toggle, remove }
  }, [items])

  return <WishContext.Provider value={api}>{children}</WishContext.Provider>
}

export function useWish() {
  const wish = useContext(WishContext)
  if (!wish) throw new Error('useWish must be used inside WishProvider')
  return wish
}
