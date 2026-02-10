/**
 * E2E Tests - Hat Shop
 *
 * These tests capture screenshots for visual validation.
 *
 * Required screenshots:
 * - MainPage.png: Your app's main/home page
 * - LandingPage.png: Landing page (same as main for this app)
 */

import { test, expect } from '@playwright/test'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// DO NOT CHANGE THESE NAMES
const MAIN_PAGE_SCREENSHOT_NAME = 'MainPage'
const LANDING_PAGE_SCREENSHOT_NAME = 'LandingPage'

// Ensure screenshots directory exists (ESM-compatible)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const screenshotsDir = join(__dirname, '..', 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
}

test.describe('Hat Shop E2E Tests', () => {
  /**
   * Landing/Home Page Test
   * Captures the homepage with hero section and categories
   */
  test('captures LandingPage screenshot', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    // Wait for the hero section to be visible
    await expect(page.getByTestId('hero-section')).toBeVisible()

    // Take screenshot
    await page.screenshot({
      path: join(screenshotsDir, LANDING_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    // Verify key elements are present
    await expect(page).toHaveTitle(/.+/)
    await expect(page.getByTestId('header-logo')).toBeVisible()
    await expect(page.getByTestId('cart-icon')).toBeVisible()
  })

  /**
   * Main Page Test (Homepage)
   * Verifies the main content loads correctly
   */
  test('captures MainPage screenshot', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    // Wait for sections to load
    await expect(page.getByTestId('hero-section')).toBeVisible()

    // Take screenshot
    await page.screenshot({
      path: join(screenshotsDir, MAIN_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    // Verify main page elements
    await expect(page).toHaveTitle(/.+/)
    await expect(page.getByTestId('categories-section')).toBeVisible()
  })

  /**
   * Navigation Test
   * Verifies header navigation works
   */
  test('header navigation works', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click on logo should stay on home
    await page.getByTestId('header-logo').click()
    await expect(page).toHaveURL('/')

    // Click on cart icon should go to cart
    await page.getByTestId('cart-icon').click()
    await expect(page).toHaveURL('/cart')
  })
})
