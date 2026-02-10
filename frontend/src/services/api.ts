/**
 * API Client Configuration
 *
 * ⚠️ DO NOT MODIFY THIS FILE - It is a protected boilerplate file.
 *
 * To add API endpoints, create a NEW file like `src/services/myApi.ts`:
 *
 *   import { api, PaginatedResponse } from './api'
 *
 *   // Django REST Framework returns paginated responses by default
 *   export const myApi = {
 *     // Option 1: Extract just the results array (simple usage)
 *     list: async () => {
 *       const response = await api.get<PaginatedResponse<Item>>('/api/items/')
 *       return response.data.results
 *     },
 *
 *     // Option 2: Return full pagination (when you need count/next/previous)
 *     listPaginated: async (page?: number) => {
 *       const response = await api.get<PaginatedResponse<Item>>('/api/items/', { params: { page } })
 *       return response.data
 *     },
 *   }
 *
 * ❌ NEVER define your own API_BASE_URL - import from here if needed:
 *   import { API_BASE_URL } from './api'
 *
 * Uses relative URLs by default (works with Vite proxy).
 * Set VITE_API_URL in .env only if you need a full URL.
 */
import axios from 'axios'

// Use env variable if set, otherwise use relative URLs (proxy handles routing)
// Export for services that need the base URL (rare - prefer using the api instance)
export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

/**
 * Django REST Framework paginated response shape.
 * All list endpoints return this format by default.
 */
export interface PaginatedResponse<T> {
  count: number          // Total number of items across all pages
  next: string | null    // URL to next page, or null if last page
  previous: string | null // URL to previous page, or null if first page
  results: T[]           // Items for current page
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      // Optionally redirect to login
    }
    return Promise.reject(error)
  }
)

/**
 * Extract error message from various error formats
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // DRF error format
    const data = error.response?.data
    if (typeof data === 'string') return data
    if (data?.detail) return data.detail
    if (data?.message) return data.message
    if (data?.non_field_errors) return data.non_field_errors[0]
    // Field errors
    if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0]
      if (firstKey && Array.isArray(data[firstKey])) {
        return `${firstKey}: ${data[firstKey][0]}`
      }
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}

/**
 * Fetch all pages from a paginated endpoint.
 * Use sparingly - prefer pagination UI for large datasets.
 *
 * @example
 * const allItems = await fetchAllPages<Item>('/api/items/')
 */
export async function fetchAllPages<T>(url: string): Promise<T[]> {
  const allResults: T[] = []
  let nextUrl: string | null = url

  while (nextUrl !== null) {
    const response: { data: PaginatedResponse<T> } = await api.get<PaginatedResponse<T>>(nextUrl)
    allResults.push(...response.data.results)
    nextUrl = response.data.next
  }

  return allResults
}

