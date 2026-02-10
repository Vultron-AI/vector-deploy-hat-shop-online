/**
 * Product Page E2E Tests
 *
 * Tests for product browsing and detail pages.
 */

import { test, expect } from '@playwright/test'

test.describe('Product Page Tests', () => {
  test('can navigate to all products page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click "View All" or "Shop Now" button
    const shopNowButton = page.getByRole('link', { name: /shop now/i })
    if (await shopNowButton.isVisible().catch(() => false)) {
      await shopNowButton.click()
    } else {
      await page.goto('/category/all')
    }

    await page.waitForLoadState('networkidle')

    // Should be on category page
    await expect(page).toHaveURL(/\/category\//)
  })

  test('category page displays products grid', async ({ page }) => {
    await page.goto('/category/all')
    await page.waitForLoadState('networkidle')

    // Should have products grid
    await expect(page.getByTestId('products-grid')).toBeVisible()
  })

  test('can navigate to product detail from listing', async ({ page }) => {
    await page.goto('/category/all')
    await page.waitForLoadState('networkidle')

    // If there are products, click the first one
    const firstProduct = page.locator('[data-testid="products-grid"] a').first()
    const hasProducts = await firstProduct.isVisible().catch(() => false)

    if (hasProducts) {
      await firstProduct.click()
      await page.waitForLoadState('networkidle')

      // Should be on product page
      await expect(page).toHaveURL(/\/product\//)
      await expect(page.getByTestId('product-detail')).toBeVisible()
    }
  })

  test('product detail page shows product info', async ({ page }) => {
    // Navigate directly to product page (will show error if no products)
    await page.goto('/category/all')
    await page.waitForLoadState('networkidle')

    const firstProduct = page.locator('[data-testid="products-grid"] a').first()
    const hasProducts = await firstProduct.isVisible().catch(() => false)

    if (hasProducts) {
      await firstProduct.click()
      await page.waitForLoadState('networkidle')

      // Product detail should show key elements
      const productDetail = page.getByTestId('product-detail')
      await expect(productDetail).toBeVisible()

      // Should have Add to Cart button (if in stock)
      const addToCartButton = page.getByRole('button', { name: /add to cart/i })
      const outOfStockButton = page.getByRole('button', { name: /out of stock/i })
      const hasAddButton = await addToCartButton.isVisible().catch(() => false)
      const hasOutOfStock = await outOfStockButton.isVisible().catch(() => false)

      expect(hasAddButton || hasOutOfStock).toBe(true)
    }
  })
})
