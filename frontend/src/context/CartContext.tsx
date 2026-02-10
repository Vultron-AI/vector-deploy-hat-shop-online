/**
 * CartContext
 *
 * Global cart state management using React Context.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { cartApi, type Cart } from '@/services/cartApi'

interface CartContextValue {
  cart: Cart | null
  loading: boolean
  error: string | null
  addItem: (productId: string, quantity?: number) => Promise<void>
  updateItem: (productId: string, quantity: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextValue | null>(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshCart = useCallback(async () => {
    try {
      setError(null)
      const cartData = await cartApi.getCart()
      setCart(cartData)
    } catch (err) {
      setError('Failed to load cart')
      console.error('Error loading cart:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = async (productId: string, quantity: number = 1) => {
    try {
      setError(null)
      const response = await cartApi.addItem(productId, quantity)
      setCart(response.cart)
    } catch (err) {
      setError('Failed to add item to cart')
      throw err
    }
  }

  const updateItem = async (productId: string, quantity: number) => {
    try {
      setError(null)
      const response = await cartApi.updateItem(productId, quantity)
      setCart(response.cart)
    } catch (err) {
      setError('Failed to update cart')
      throw err
    }
  }

  const removeItem = async (productId: string) => {
    try {
      setError(null)
      const response = await cartApi.removeItem(productId)
      setCart(response.cart)
    } catch (err) {
      setError('Failed to remove item from cart')
      throw err
    }
  }

  const clearCart = async () => {
    try {
      setError(null)
      const cartData = await cartApi.clearCart()
      setCart(cartData)
    } catch (err) {
      setError('Failed to clear cart')
      throw err
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartContext
