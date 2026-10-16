import { useEffect, useState } from 'react'
import { listenOrders, listenProduct, listenProducts } from '../services/store'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [source, setSource] = useState('sample')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    return listenProducts(
      (list, nextSource) => {
        setProducts(list)
        setSource(nextSource)
        setError('')
        setLoading(false)
      },
      (message) => {
        setError(message)
        setLoading(false)
      },
    )
  }, [])

  return { products, source, loading, error }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setProduct(null)
      setLoading(false)
      return undefined
    }
    setLoading(true)
    return listenProduct(
      id,
      (next) => {
        setProduct(next)
        setError('')
        setLoading(false)
      },
      (message) => {
        setError(message)
        setLoading(false)
      },
    )
  }, [id])

  return { product, loading, error }
}

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    return listenOrders(
      (list) => {
        setOrders(list)
        setError('')
        setLoading(false)
      },
      (message) => {
        setError(message)
        setLoading(false)
      },
    )
  }, [])

  return { orders, loading, error }
}

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · YZAR HEALTHCARE` : 'YZAR HEALTHCARE'
  }, [title])
}
