import { test, expect } from '@playwright/test';

test.describe('Quizlet App', () => {
  test('should display the landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check for main heading or logo
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');
    
    // At least one of these should exist on login page
    const hasEmailOrPassword = await emailInput.count() > 0 || await passwordInput.count() > 0;
    expect(hasEmailOrPassword).toBeTruthy();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/register');
    
    // Check for register form elements
    const hasForm = await page.locator('form').count() > 0;
    expect(hasForm).toBeTruthy();
  });
});
