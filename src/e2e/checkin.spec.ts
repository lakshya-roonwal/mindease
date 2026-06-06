import { test, expect } from "@playwright/test";

test.describe("Check-in Flow", () => {
  // Mock authentication or use a global setup for logged-in state.
  // For these tests, we will mock the API responses to isolate the UI tests 
  // from the backend logic, or simulate a login.
  
  test.beforeEach(async ({ page }) => {
    // Simulate login by setting a cookie or mocking auth API
    // Since Playwright doesn't easily mock server-side NextAuth without a custom server,
    // we'll mock the specific API endpoints the UI interacts with to verify UI logic.
  });

  test("Authenticated user can complete full check-in flow", async ({ page }) => {
    // We navigate to a page that contains the CheckInForm component.
    // Assuming it's on the dashboard. We'll mock the session to bypass redirect.
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        json: { user: { name: "Test User", email: "test@test.com" } }
      });
    });

    await page.route("**/api/insights/check-in", async (route) => {
      await route.fulfill({ status: 201, json: { success: true } });
    });

    // We can't directly load /dashboard if it redirects server-side unless we really log in.
    // For pure UI e2e, we would need a proper login. Let's assume we test the component in isolation
    // or through a test route if NextAuth is hard to mock E2E.
    // Let's write the test conceptually for the UI.
    
    // Instead, let's just register and login a real user for this test
    const randomEmail = `test_${Date.now()}@example.com`;
    await page.goto("/register");
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', "password123");
    await page.fill('input[name="confirmPassword"]', "password123");
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/.*\/login\?registered=true/);
    
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await page.waitForURL(/.*\/dashboard/);

    // Now on dashboard, interact with Check-in Form
    await expect(page.locator("text=How are you feeling today?")).toBeVisible();
    
    // Select Mood (Clicking the "Calm" button)
    await page.click("button[aria-label='Mood: Calm']");
    
    // Should show logged success message briefly
    await expect(page.locator("text=Logged!")).toBeVisible();
  });
});
