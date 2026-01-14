import { test, expect } from "@playwright/test";

/**
 * Simple smoke tests that don't require authentication
 * Use these to verify the basic E2E setup is working
 */

test.describe("Smoke Tests (No Auth Required)", () => {
  test("should load the home page", async ({ page }) => {
    await page.goto("/");

    // Page should load successfully
    await expect(page).toHaveURL(/localhost:3000/, { timeout: 10000 });

    // Should have a title
    await expect(page).toHaveTitle(/.+/);

    // Wait for page to be ready
    await page.waitForLoadState("networkidle");

    // Check that body exists
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("should create a shortened URL without login", async ({ page }) => {
    await page.goto("/");

    // Wait for page to be ready
    await page.waitForLoadState("networkidle");

    // Find the URL input field
    const urlInput = page.locator('input[type="text"]').first();
    await expect(urlInput).toBeVisible();

    // Enter the URL
    await urlInput.fill("https://www.npr.org");

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for the success message with the short URL
    await expect(page.locator("#success-message")).toBeVisible({
      timeout: 5000,
    });

    // Verify the short URL is displayed
    const shortURLLink = page.locator("#short-url-and-button a");
    await expect(shortURLLink).toBeVisible();

    // Verify it contains a valid URL
    const shortURL = await shortURLLink.getAttribute("href");
    expect(shortURL).toMatch(/http.*\/urls\/.+/);

    console.log("✅ Created short URL:", shortURL);
  });

  test("should show error for invalid URL and disable submit button", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for page to be ready
    await page.waitForLoadState("networkidle");

    // Find the URL input field
    const urlInput = page.locator('input[type="text"]').first();
    await expect(urlInput).toBeVisible();

    // Enter an INVALID URL (missing second 't' in http)
    await urlInput.fill("htp://www.npr.org");

    // Trigger validation by blurring the input
    await urlInput.blur();

    // Wait a moment for validation
    await page.waitForTimeout(500);

    // Verify error message is shown
    const errorMessage = page.locator(
      'p:has-text("Must be a valid http or https URL")'
    );
    await expect(errorMessage).toBeVisible();

    // Verify the input has invalid state (red border)
    await expect(urlInput).toHaveClass(/invalid/);

    // Verify submit button has disabled styling
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toHaveClass(/opacity-50/);
    await expect(submitButton).toHaveClass(/cursor-not-allowed/);

    console.log("✅ Invalid URL properly rejected with error message");
  });
});
