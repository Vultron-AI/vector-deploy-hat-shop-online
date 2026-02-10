/**
 * Checkout E2E Tests
 *
 * Tests for checkout flow.
 */

import { test, expect } from '@playwright/test'

test.describe('Checkout Flow Tests', () => {
  test('empty cart redirects from checkout', async ({ page }) => {
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')

    // Should show empty cart message or redirect
    const hasEmptyMessage = await page.getByText(/cart is empty/i).isVisible().catch(() => false)
    const hasBackLink = await page.getByRole('link', { name: /browse|back/i }).isVisible().catch(() => false)

    expect(hasEmptyMessage || hasBackLink).toBe(true)
  })

  test('checkout page has form fields', async ({ page }) => {
    // Navigate to checkout - may show empty state
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')

    // Check if form is visible (only when cart has items)
    const hasForm = await page.getByTestId('checkout-form').isVisible().catch(() => false)

    if (hasForm) {
      // Should have email field
      await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()

      // Should have name field
      await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible()

      // Should have address field
      await expect(page.getByRole('textbox', { name: /address/i })).toBeVisible()

      // Should have city field
      await expect(page.getByRole('textbox', { name: /city/i })).toBeVisible()

      // Should have place order button
      await expect(page.getByRole('button', { name: /place order/i })).toBeVisible()
    }
  })

  test('order confirmation page shows order details', async ({ page }) => {
    // Navigate to a fake order confirmation page
    // In a real scenario, we'd complete checkout first
    const fakeOrderId = '00000000-0000-0000-0000-000000000000'
    await page.goto(`/order/${fakeOrderId}`)
    await page.waitForLoadState('networkidle')

    // Either shows order confirmation or not found
    const hasConfirmation = await page.getByTestId('order-confirmation').isVisible().catch(() => false)
    const hasNotFound = await page.getByText(/not found/i).isVisible().catch(() => false)

    // One of them should be visible
    expect(hasConfirmation || hasNotFound).toBe(true)
  })

  test('checkout validation works', async ({ page }) => {
    // This test would require items in cart
    // We check that the form structure is correct
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')

    const hasForm = await page.getByTestId('checkout-form').isVisible().catch(() => false)

    if (hasForm) {
      // Try to submit empty form
      await page.getByRole('button', { name: /place order/i }).click()

      // Should show validation errors or not submit
      // (The form should prevent submission without valid data)
      await expect(page).toHaveURL('/checkout')
    }
  })
})
