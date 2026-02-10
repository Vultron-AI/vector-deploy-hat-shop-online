/**
 * Orders API Service
 *
 * API client for checkout and order endpoints.
 */

import { api, PaginatedResponse } from './api'

// Types
export interface ShippingAddress {
  id: string
  name: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface OrderItem {
  id: string
  product_name: string
  quantity: number
  price_at_purchase: string
  subtotal: string
}

export interface Order {
  id: string
  email: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  total_price: string
  item_count: number
  items: OrderItem[]
  shipping_address: ShippingAddress
  created_at: string
  updated_at: string
}

export interface OrderListItem {
  id: string
  email: string
  status: Order['status']
  total_price: string
  item_count: number
  created_at: string
}

export interface CheckoutData {
  email: string
  name: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country?: string
}

// API functions
export const ordersApi = {
  /**
   * Create an order from the current cart (checkout)
   */
  checkout: async (data: CheckoutData): Promise<Order> => {
    const response = await api.post<Order>('/api/orders/checkout/', data)
    return response.data
  },

  /**
   * Get order details by ID
   */
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/api/orders/${orderId}/`)
    return response.data
  },

  /**
   * List user's orders (requires authentication)
   */
  listOrders: async (page?: number): Promise<PaginatedResponse<OrderListItem>> => {
    const response = await api.get<PaginatedResponse<OrderListItem>>('/api/orders/', {
      params: { page },
    })
    return response.data
  },
}

export default ordersApi
