import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { sampleProducts } from '../data/catalog'
import { db, isFirebaseConfigured, storage } from '../firebase'

function mapDoc(snapshot) {
  return { id: snapshot.id, ...snapshot.data() }
}

export function listenProducts(onData, onError) {
  if (!isFirebaseConfigured || !db) {
    onData(sampleProducts, 'sample')
    return () => {}
  }

  const productsQuery = query(collection(db, 'products'), orderBy('name'))
  return onSnapshot(
    productsQuery,
    (snapshot) => onData(snapshot.docs.map(mapDoc), 'firebase'),
    (error) => onError?.(error.message || 'Could not load products.'),
  )
}

export function listenProduct(id, onData, onError) {
  if (!id) {
    onData(null)
    return () => {}
  }

  if (!isFirebaseConfigured || !db) {
    onData(sampleProducts.find((product) => product.id === id) || null, 'sample')
    return () => {}
  }

  return onSnapshot(
    doc(db, 'products', id),
    (snapshot) => onData(snapshot.exists() ? mapDoc(snapshot) : null, 'firebase'),
    (error) => onError?.(error.message || 'Could not load this product.'),
  )
}

export function listenOrders(onData, onError) {
  if (!isFirebaseConfigured || !db) {
    onData([])
    return () => {}
  }

  const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100))
  return onSnapshot(
    ordersQuery,
    (snapshot) => onData(snapshot.docs.map(mapDoc)),
    (error) => onError?.(error.message || 'Could not load orders.'),
  )
}

async function uploadImage(file) {
  if (!storage) {
    throw new Error('Firebase Storage is not set up yet.')
  }
  const safeName = file.name.replace(/[^\w.]+/g, '-')
  const fileRef = ref(storage, `products/${crypto.randomUUID()}-${safeName}`)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}

function productPayload(data, imageUrl) {
  const mrp = data.mrp === '' || data.mrp == null ? null : Number(data.mrp)
  return {
    name: data.name.trim(),
    category: data.category,
    price: Number(data.price),
    mrp,
    pack: data.pack.trim(),
    form: data.form.trim(),
    summary: data.summary.trim(),
    details: data.details.trim(),
    usage: data.usage.trim(),
    nutrients: data.nutrients.trim(),
    stock: Number(data.stock),
    imageUrl: imageUrl || '',
    featured: Boolean(data.featured),
    active: Boolean(data.active),
    updatedAt: serverTimestamp(),
  }
}

export async function saveProduct(id, data, file) {
  if (!db) throw new Error('Connect Firebase before saving products.')
  const imageUrl = file ? await uploadImage(file) : data.imageUrl || ''
  const payload = productPayload(data, imageUrl)

  if (id) {
    const batch = writeBatch(db)
    batch.set(doc(db, 'products', id), payload, { merge: true })
    await batch.commit()
    return id
  }

  const created = await addDoc(collection(db, 'products'), {
    ...payload,
    createdAt: serverTimestamp(),
  })
  return created.id
}

export async function deleteProduct(id) {
  if (!db) throw new Error('Connect Firebase before deleting products.')
  await deleteDoc(doc(db, 'products', id))
}

export async function seedProducts() {
  if (!db) throw new Error('Connect Firebase before loading the sample catalog.')
  const batch = writeBatch(db)
  sampleProducts.forEach((product) => {
    const { id, ...rest } = product
    batch.set(
      doc(db, 'products', id),
      { ...rest, updatedAt: serverTimestamp() },
      { merge: true },
    )
  })
  await batch.commit()
}

export async function placeOrder(order) {
  const record = {
    items: order.items,
    customer: order.customer,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    paymentMethod: 'Cash on delivery',
    status: 'placed',
  }

  if (!db) {
    const id = crypto.randomUUID()
    const preview = { id, ...record, createdAt: new Date().toISOString(), demo: true }
    sessionStorage.setItem(`alibra-order-${id}`, JSON.stringify(preview))
    return preview
  }

  const created = await addDoc(collection(db, 'orders'), {
    ...record,
    createdAt: serverTimestamp(),
  })
  return { id: created.id }
}

export async function getOrder(id) {
  if (!db) {
    const saved = sessionStorage.getItem(`alibra-order-${id}`)
    return saved ? JSON.parse(saved) : null
  }
  const snapshot = await getDoc(doc(db, 'orders', id))
  return snapshot.exists() ? mapDoc(snapshot) : null
}

export async function updateOrderStatus(id, status) {
  if (!db) throw new Error('Connect Firebase before updating orders.')
  const batch = writeBatch(db)
  batch.set(
    doc(db, 'orders', id),
    { status, updatedAt: serverTimestamp() },
    { merge: true },
  )
  await batch.commit()
}
