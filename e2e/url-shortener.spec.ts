import { test, expect } from "@playwright/test";
import { authenticateWithClerk } from "./helpers/auth";

/**
 * Example E2E test suite for URL shortener
 *
 * These tests will:
 * - Login with Clerk (if credentials are configured)
 * - Create short URLs
 * - Edit short URLs
 * - Verify click tracking
 * - Record videos on failure for debugging
 */

test.describe("URL Shortener E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate before each test (if credentials are set)
    // Note: You can optimize this by using Playwright's storage state
    // to authenticate once and reuse across tests
    await authenticateWithClerk(page);
  });

  test("should load the home page", async ({ page }) => {
    await page.goto("/");

    // Check that the page loads
    await expect(page).toHaveTitle(/.*/, { timeout: 10000 });
  });

  test("should create a new short URL", async ({ page }) => {
    await page.goto("/dashboard");

    // Find the URL input field
    const urlInput = page.locator('input[type="url"]').first();
    await expect(urlInput).toBeVisible();

    // Enter a URL to shorten
    const testURL = "https://example.com/test-page";
    await urlInput.fill(testURL);

    // Submit the form
    await page.keyboard.press("Enter");
    // Or click the submit button if there is one:
    // await page.click('button[type="submit"]');

    // Wait for the short URL to appear in the list
    await expect(page.locator(`text=${testURL}`)).toBeVisible({
      timeout: 5000,
    });

    // Verify a short URL was generated
    const shortURL = page.locator('a[href*="/u/"]').first();
    await expect(shortURL).toBeVisible();
  });

  test("should edit a short URL slug", async ({ page }) => {
    await page.goto("/dashboard");

    // First create a URL to edit
    const urlInput = page.locator('input[type="url"]').first();
    await urlInput.fill("https://example.com/editable");
    await page.keyboard.press("Enter");

    // Wait for the URL to appear
    await page.waitForTimeout(1000);

    // Find and click the edit button
    const editButton = page.locator('button:has-text("edit")').first();
    await editButton.click();

    // Wait for edit mode input to appear
    const editInput = page.locator('input[type="text"]').first();
    await expect(editInput).toBeVisible();

    // Change the slug
    const newSlug = `test-${Date.now()}`;
    await editInput.clear();
    await editInput.fill(newSlug);

    // Save the changes
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();

    // Verify the slug was updated
    await expect(page.locator(`text=${newSlug}`)).toBeVisible();
  });

  test("should track clicks on short URL", async ({ page, context }) => {
    await page.goto("/dashboard");

    // Create a test URL
    const urlInput = page.locator('input[type="url"]').first();
    const targetURL = "https://example.com/click-test";
    await urlInput.fill(targetURL);
    await page.keyboard.press("Enter");

    // Wait for the short URL to appear
    await page.waitForTimeout(1000);

    // Get the short URL link
    const shortURLLink = page.locator('a[href*="/u/"]').first();
    const shortURLHref = await shortURLLink.getAttribute("href");

    if (!shortURLHref) {
      throw new Error("Short URL not found");
    }

    // Verify initial click count is 0
    const clickCount = page.locator(".text-2xl.font-bold").first();
    await expect(clickCount).toHaveText("0");

    // Open the short URL in a new tab to simulate a click
    const newPage = await context.newPage();
    await newPage.goto(shortURLHref);

    // Should redirect to the target URL
    await expect(newPage).toHaveURL(targetURL, { timeout: 5000 });
    await newPage.close();

    // Refresh the dashboard and check the click count increased
    await page.reload();
    await expect(clickCount).toHaveText("1", { timeout: 5000 });
  });

  test("should handle invalid URLs gracefully", async ({ page }) => {
    await page.goto("/dashboard");

    const urlInput = page.locator('input[type="url"]').first();

    // Try to submit an invalid URL
    await urlInput.fill("not-a-valid-url");
    await page.keyboard.press("Enter");

    // Should show validation error or prevent submission
    // Adjust this based on your actual error handling
    await expect(urlInput).toHaveAttribute("type", "url");
  });
});
