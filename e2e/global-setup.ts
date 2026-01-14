import { test as setup } from "@playwright/test";
import { authenticateWithClerk } from "./helpers/auth";

const authFile = "e2e/.auth/user.json";

/**
 * Global setup that authenticates once and saves the session
 * This allows all tests to reuse the authentication state
 *
 * To use this, add to playwright.config.ts:
 *
 * export default defineConfig({
 *   globalSetup: require.resolve('./e2e/global-setup'),
 *   projects: [
 *     {
 *       name: 'chromium',
 *       use: {
 *         ...devices['Desktop Chrome'],
 *         storageState: authFile,
 *       },
 *     },
 *   ],
 * });
 */

setup("authenticate", async ({ page }) => {
  // Perform authentication
  await authenticateWithClerk(page);

  // Save the authenticated state
  await page.context().storageState({ path: authFile });
});
