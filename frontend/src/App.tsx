/**
 * Main App Component
 *
 * Pre-wrapped with DialogProvider to enable the useDialog hook throughout the app.
 * Includes React Router for navigation and CartProvider for cart state.
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DialogProvider } from '@/components/ui'
import { CartProvider } from '@/context/CartContext'
import { Header } from '@/components/Header'
import { HomePage } from '@/pages/HomePage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage'

function App() {
  return (
    <BrowserRouter>
      <DialogProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:orderId" element={<OrderConfirmationPage />} />
              </Routes>
            </main>
            <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] py-8">
              <div className="container mx-auto px-4 text-center text-sm text-[var(--color-muted)]">
                <p>© 2024 Hat Shop. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </CartProvider>
      </DialogProvider>
    </BrowserRouter>
  )
}

export default App
