/**
 * Cart API Service
 *
 * API client for shopping cart endpoints.
 */

import { api } from './api'

// Types
export interface CartItem {
  product_id: string
  quantity: number
  name: string
  price: string
  image_url: string | null
}

export interface Cart {
  items: CartItem[]
  total_items: number
  subtotal: string
}

export interface CartResponse {
  item?: CartItem | null
  cart: Cart
  removed?: CartItem
}

// API functions
export const cartApi = {
  /**
   * Get current cart contents
   */
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/api/cart/')
    return response.data
  },

  /**
   * Add an item to the cart
   */
  addItem: async (productId: string, quantity: number = 1): Promise<CartResponse> => {
    const response = await api.post<CartResponse>('/api/cart/items/', {
      product_id: productId,
      quantity,
    })
    return response.data
  },

  /**
   * Update item quantity in cart
   */
  updateItem: async (productId: string, quantity: number): Promise<CartResponse> => {
    const response = await api.patch<CartResponse>(`/api/cart/items/${productId}/`, {
      quantity,
    })
    return response.data
  },

  /**
   * Remove an item from cart
   */
  removeItem: async (productId: string): Promise<CartResponse> => {
    const response = await api.delete<CartResponse>(`/api/cart/items/${productId}/`)
    return response.data
  },

  /**
   * Clear the entire cart
   */
  clearCart: async (): Promise<Cart> => {
    const response = await api.delete<Cart>('/api/cart/')
    return response.data
  },
}

export default cartApi
