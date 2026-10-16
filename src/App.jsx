import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishProvider } from './context/WishContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductPage from './pages/ProductPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderPage from './pages/OrderPage'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import RequireAdmin from './pages/admin/RequireAdmin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminOrders from './pages/admin/AdminOrders'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order/:id" element={<OrderPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="products" replace />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/:id" element={<AdminProductForm />} />
                <Route path="orders" element={<AdminOrders />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        </WishProvider>
      </CartProvider>
    </AuthProvider>
  )
}
