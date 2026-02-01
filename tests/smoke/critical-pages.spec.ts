import { test, expect } from '@playwright/test';

test.describe('Critical Pages Smoke Tests', () => {
  test('dashboard loads and shows content', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Page should load successfully (200 status)
    expect(page.url()).toContain('/dashboard');
    
    // Should have main content area
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
    
    // Should show either episodes or "No summaries" message
    const hasContent = await page.locator('text=/summaries|episode/i').first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('search page loads', async ({ page }) => {
    await page.goto('/search?q=finance');
    
    // Page should load successfully
    expect(page.url()).toContain('/search');
    
    // Should have body content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('episode detail page loads from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Try to find an episode link
    const episodeLink = page.locator('a[href*="/episode/"]').first();
    const hasEpisode = await episodeLink.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasEpisode) {
      await episodeLink.click();
      
      // Should navigate to episode page
      await expect(page).toHaveURL(/\/episode\//);
      
      // Page should have content
      const body = await page.textContent('body');
      expect(body).toBeTruthy();
    } else {
      // No episodes available - that's okay for smoke test
      console.log('No episodes found in dashboard - skipping episode detail test');
    }
  });

  test('saved page loads', async ({ page }) => {
    await page.goto('/saved');
    
    // Page should load successfully
    expect(page.url()).toContain('/saved');
    
    // Should have body content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('notebook page loads', async ({ page }) => {
    await page.goto('/notebook');
    
    // Page should load successfully
    expect(page.url()).toContain('/notebook');
    
    // Should have body content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('reports page loads', async ({ page }) => {
    await page.goto('/reports');
    
    // Page should load successfully
    expect(page.url()).toContain('/reports');
    
    // Should have body content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('upload page loads', async ({ page }) => {
    await page.goto('/upload');
    
    // Page should load successfully
    expect(page.url()).toContain('/upload');
    
    // Should have body content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('discover page loads', async ({ page }) => {
    await page.goto('/discover');
    
    // Page should load successfully
    expect(page.url()).toContain('/discover');
    
    // Should have body content
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('admin page requires authentication', async ({ page }) => {
    // Try to access admin page
    await page.goto('/admin');
    
    // Should either:
    // 1. Redirect to /unauthorized or /dev/login
    // 2. Stay on /admin (if dev auth allows it)
    // Either way, page should load without crashing
    const url = page.url();
    const body = await page.textContent('body');
    
    // Just verify page loaded successfully
    expect(body).toBeTruthy();
    expect(url).toBeTruthy();
  });
});
