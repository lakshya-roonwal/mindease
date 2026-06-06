import { test, expect } from "@playwright/test";

test.describe("Wellness Toolkit", () => {
  test("Toolkit features are visible and functional", async ({ page }) => {
    // Register and login for access
    const randomEmail = `toolkit_${Date.now()}@example.com`;
    await page.goto("/register");
    await page.fill('input[name="name"]', "Toolkit User");
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/.*\/login\?registered=true/);
    
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL(/.*\/dashboard/);

    // Go to toolkit
    await page.click("text=Toolkit");
    await page.waitForURL(/.*\/dashboard\/toolkit/);

    // Check header
    await expect(page.locator("text=Wellness Toolkit")).toBeVisible();

    // Check all cards exist
    await expect(page.locator("text=4-7-8 Breathing")).toBeVisible();
    await expect(page.locator("text=Box Breathing")).toBeVisible();
    await expect(page.locator("text=5-4-3-2-1 Grounding")).toBeVisible();
    await expect(page.locator("text=Guided Reflection")).toBeVisible();
    await expect(page.locator("text=Daily Affirmations")).toBeVisible();

    // Open Breathing exercise
    await page.click("text=4-7-8 Breathing");
    
    // Check if modal opened
    await expect(page.locator("button:has-text('Start Exercise')")).toBeVisible();
    
    // Start exercise
    await page.click("button:has-text('Start Exercise')");
    
    // Check pause button appears
    await expect(page.locator("button:has-text('Pause')")).toBeVisible();

    // Close modal
    await page.click('button[aria-label="Close"]');
  });
});
