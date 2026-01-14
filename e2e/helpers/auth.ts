import { Page } from "@playwright/test";

/**
 * Authentication helper for E2E tests
 *
 * Clerk provides test tokens that can be used to bypass authentication in tests.
 * See: https://clerk.com/docs/testing/playwright/overview
 *
 * For production tests, you would:
 * 1. Set up a dedicated test user in Clerk
 * 2. Use Clerk's test mode or authentication tokens
 * 3. Store session cookies for reuse across tests
 */

interface AuthOptions {
  email?: string;
  password?: string;
}

/**
 * Helper to authenticate a user via Clerk's UI
 * This performs an actual login through the Clerk sign-in form
 */
export async function authenticateWithClerk(
  page: Page,
  options: AuthOptions = {}
) {
  const email = options.email || process.env.TEST_USER_EMAIL;
  const password = options.password || process.env.TEST_USER_PASSWORD;

  if (!email || !password) {
    console.warn(
      "⚠️  TEST_USER_EMAIL and TEST_USER_PASSWORD not set in .env.test"
    );
    console.warn("Skipping authentication - tests will run unauthenticated");
    return;
  }

  try {
    // Go to the home page which should trigger Clerk auth
    await page.goto("/");

    // Wait for Clerk sign-in form to appear
    // Note: You'll need to adjust these selectors based on your Clerk setup
    await page.waitForSelector('input[name="identifier"]', { timeout: 10000 });

    // Fill in email
    await page.fill('input[name="identifier"]', email);
    await page.click('button[type="submit"]');

    // Wait for password field
    await page.waitForSelector('input[name="password"]', { timeout: 5000 });

    // Fill in password
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for authentication to complete
    // Adjust the selector to match an element that only appears when logged in
    await page.waitForSelector('[data-testid="user-button"]', {
      timeout: 10000,
    });
  } catch (error) {
    console.error("Authentication failed:", error);
    console.warn("Tests will continue without authentication");
  }
}

/**
 * Alternative: Use Clerk's test tokens (recommended for faster tests)
 *
 * This bypasses the UI and directly sets authentication state.
 * Requires setting up Clerk test mode or using their test API.
 */
export async function authenticateWithTestToken(page: Page) {
  // Get the test token from environment or Clerk's test API
  const testToken = process.env.CLERK_TEST_TOKEN;

  if (!testToken) {
    console.warn("CLERK_TEST_TOKEN not set, falling back to UI authentication");
    return authenticateWithClerk(page);
  }

  // Set the Clerk session token directly
  await page.goto("/");
  await page.evaluate((token) => {
    // This is a simplified example - adjust based on Clerk's actual implementation
    localStorage.setItem("__clerk_db_jwt", token);
  }, testToken);

  // Reload to apply the session
  await page.reload();
  await page.waitForLoadState("networkidle");
}

/**
 * Global authentication setup to be used in playwright.config.ts
 * This can authenticate once and reuse the session across all tests
 */
export async function globalSetup() {
  // This function can be used in playwright.config.ts to set up auth once
  // and save it to a file that all tests can reuse
  console.log("Setting up global authentication...");
  // Implementation depends on your specific needs
}

/**
 * Helper to check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Check for the presence of user-specific UI element
    await page.waitForSelector('[data-testid="user-button"]', {
      timeout: 2000,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Sign out helper
 */
export async function signOut(page: Page) {
  // Click user button
  await page.click('[data-testid="user-button"]');

  // Click sign out in dropdown
  await page.click("text=Sign out");

  // Wait for sign-out to complete
  await page.waitForSelector('input[name="identifier"]', { timeout: 5000 });
}
