/**
 * Dashboard Style Smoke Test
 * 
 * Ensures Tailwind CSS is processing and AppLayout is rendering correctly.
 * Catches regressions where styles fail to apply (e.g., cache issues, config errors).
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard Style Smoke Test', () => {
  test('should render 3-panel layout with Tailwind classes applied', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that Sidebar exists and has fixed positioning
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeVisible();
    
    // Check that main content has left margin (proves Tailwind is processing)
    const main = page.locator('main');
    await expect(main).toBeVisible();
    const mainStyles = await main.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        marginLeft: computed.marginLeft,
        marginRight: computed.marginRight,
      };
    });
    
    // ml-[220px] should result in 220px left margin
    expect(mainStyles.marginLeft).toBe('220px');
    
    // mr-[320px] should result in 320px right margin (when right rail is shown)
    expect(mainStyles.marginRight).toBe('320px');
    
    // Check that RightRail exists
    const rightRail = page.locator('aside').last();
    await expect(rightRail).toBeVisible();
    
    // Verify search bar is present (part of AppLayout)
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeVisible();
  });
  
  test('should have semantic color tokens applied', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that CSS variables are defined
    const rootStyles = await page.evaluate(() => {
      const root = document.documentElement;
      const computed = window.getComputedStyle(root);
      return {
        background: computed.getPropertyValue('--background').trim(),
        foreground: computed.getPropertyValue('--foreground').trim(),
        card: computed.getPropertyValue('--card').trim(),
      };
    });
    
    // Verify CSS variables are not empty (proves globals.css loaded)
    expect(rootStyles.background).toBeTruthy();
    expect(rootStyles.foreground).toBeTruthy();
    expect(rootStyles.card).toBeTruthy();
  });
});
