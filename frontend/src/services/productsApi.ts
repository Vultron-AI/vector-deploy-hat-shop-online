/**
 * Products API Service
 *
 * API client for products and categories endpoints.
 */

import { api, PaginatedResponse } from './api'

// Types
export interface Category {
  id: string
  name: string
  slug: string
  description: string
  product_count: number
  created_at: string
}

export interface ProductImage {
  id: string
  image_url: string
  display_order: number
  is_primary: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: string
  category: Category
  stock: number
  is_active: boolean
  in_stock: boolean
  primary_image: ProductImage | null
  created_at: string
}

export interface ProductDetail extends Omit<Product, 'primary_image'> {
  images: ProductImage[]
  updated_at: string
}

// API functions
export const productsApi = {
  /**
   * List all categories
   */
  listCategories: async (): Promise<Category[]> => {
    const response = await api.get<PaginatedResponse<Category>>('/api/categories/')
    return response.data.results
  },

  /**
   * Get a category by slug
   */
  getCategory: async (slug: string): Promise<Category> => {
    const response = await api.get<Category>(`/api/categories/${slug}/`)
    return response.data
  },

  /**
   * List products with optional category filter
   */
  listProducts: async (params?: {
    category?: string
    page?: number
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/api/products/', { params })
    return response.data
  },

  /**
   * Get a product by slug
   */
  getProduct: async (slug: string): Promise<ProductDetail> => {
    const response = await api.get<ProductDetail>(`/api/products/${slug}/`)
    return response.data
  },
}

export default productsApi
