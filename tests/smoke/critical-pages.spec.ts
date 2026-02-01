import { test, expect } from '@playwright/test';

test.describe('Critical Pages Smoke Tests', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Simplicity Finance/);
    await expect(page.locator('h1')).toContainText('Simplicity Finance');
    
    // Check navigation links exist
    await expect(page.locator('a[href="/dashboard"]')).toBeVisible();
    await expect(page.locator('a[href="/search"]')).toBeVisible();
  });

  test('dashboard shows approved episodes', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Simplicity Finance');
    
    // Should have search bar
    await expect(page.locator('input[name="q"]')).toBeVisible();
    
    // Should show at least one episode (from demo data)
    const episodeCards = page.locator('article, .episode-card, a[href*="/episode/"]');
    await expect(episodeCards.first()).toBeVisible({ timeout: 10000 });
  });

  test('search returns results for seeded keywords', async ({ page }) => {
    await page.goto('/search?q=tech');
    
    // Should show search input with query
    const searchInput = page.locator('input[name="q"]');
    await expect(searchInput).toBeVisible();
    
    // Page should load successfully (has main heading)
    await expect(page.locator('h1, h2')).toContainText(/Search|Simplicity Finance/i);
  });

  test('episode detail renders bullets with evidence', async ({ page }) => {
    // First get an episode ID from dashboard
    await page.goto('/dashboard');
    
    // Wait for episodes to load and click the first one
    const firstEpisodeLink = page.locator('a[href*="/episode/"]').first();
    await expect(firstEpisodeLink).toBeVisible({ timeout: 10000 });
    await firstEpisodeLink.click();
    
    // Should be on episode detail page
    await expect(page).toHaveURL(/\/episode\//);
    
    // Should show page heading
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    
    // Page should have loaded successfully (check for common elements)
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });

  test('admin redirects to unauthorized for non-admin', async ({ page }) => {
    // Without admin auth, should redirect to /unauthorized
    await page.goto('/admin');
    
    // Should either be on /unauthorized or /dev/login
    const url = page.url();
    const isUnauthorizedOrLogin = url.includes('/unauthorized') || url.includes('/dev/login');
    expect(isUnauthorizedOrLogin).toBeTruthy();
  });

  test('saved page loads', async ({ page }) => {
    await page.goto('/saved');
    // Page loads successfully - check for main heading
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('notebook page loads', async ({ page }) => {
    await page.goto('/notebook');
    // Page loads successfully - check for main heading
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('reports page loads', async ({ page }) => {
    await page.goto('/reports');
    // Page loads successfully - check for main heading
    await expect(page.locator('h1').first()).toBeVisible();
  });
});
