# E2E Testing with Playwright

This directory contains end-to-end tests for the URL shortener application.

## Features

- **Video Recording**: Tests record videos on failure (configurable to always record)
- **Screenshots**: Automatic screenshots on test failure
- **Separate Test Database**: Uses `deeporigin_test` database to avoid interfering with dev data
- **Clerk Authentication**: Helper functions to authenticate or bypass auth in tests
- **Multiple Browser Support**: Configured for Chromium (can enable Firefox/Safari)

## Setup

### 1. Install Playwright Browsers

```bash
npx playwright install chromium
```

**Note**: In a dev container, `xvfb-run` is automatically used for UI mode to handle the headless environment.

### 2. Configure Test Environment

Update `.env.test` with your test credentials:

```env
# Use separate test database
DATABASE_URL=postgresql://postgres:password@postgres:5432/deeporigin_test

# Clerk credentials (same as dev or dedicated test account)
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
CLERK_SECRET_KEY=your_secret_here

# Optional: Test user credentials for Clerk login
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test_password
```

### 3. Set Up Test Database

```bash
# Create the test database
npm run test:db:setup
```

## Running Tests

### Quick Start (No Auth Required)

```bash
# Run simple smoke tests
npm run test:e2e -- smoke.spec.ts
```

### Run all tests (headless)

```bash
npm run test:e2e
```

### Run with UI mode (interactive)

```bash
npm run test:e2e:ui
```

**Note**: Uses `xvfb-run` in dev container environments.

### Generate tests with Codegen

```bash
npm run test:e2e:codegen
```

### Run in headed mode (see browser with xvfb)

```bash
npm run test:e2e:headed
```

### Debug mode (step through tests)

```bash
npm run test:e2e:debug
```

### View test report

```bash
npm run test:e2e:report
```

## Video Recording

Videos are recorded by default on test failure. To change this:

Edit `playwright.config.ts`:

```typescript
video: {
  mode: "on", // Always record
  // mode: "retain-on-failure", // Only on failure (default)
  // mode: "off", // Never record
  size: { width: 1280, height: 720 },
}
```

Videos are saved to `test-results/` directory.

## Database Management

### Reset test database (clean slate)

```bash
npm run test:db:reset
```

### Run migrations on test database

```bash
npm run test:db:migrate
```

## Test Structure

```
e2e/
├── helpers/
│   └── auth.ts              # Clerk authentication helpers
├── setup/
│   └── test-db.ts           # Test database management
├── global-setup.ts          # Optional: authenticate once, reuse session
├── url-shortener.spec.ts    # Example E2E tests
└── .auth/                   # Stored authentication state (gitignored)
```

## Writing Tests

Example test:

```typescript
import { test, expect } from "@playwright/test";
import { authenticateWithClerk } from "./helpers/auth";

test.describe("My Feature", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateWithClerk(page);
  });

  test("should do something", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });
});
```

## Troubleshooting

### Authentication Issues

If Clerk authentication fails:

1. Check that `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` are set in `.env.test`
2. Verify the Clerk selectors in `e2e/helpers/auth.ts` match your setup
3. Consider using Clerk's test tokens instead of UI login

### Database Connection

If tests can't connect to the database:

1. Ensure PostgreSQL is running: `docker ps`
2. Verify `DATABASE_URL` in `.env.test` is correct
3. Check that the test database exists: `npm run test:db:create`

### Videos Not Recording

Videos are only recorded on failure by default. To always record:

1. Change `video.mode` to `"on"` in `playwright.config.ts`
2. Or run a specific test with `--video=on` flag

## Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Clean Data**: Reset test database between test runs if needed
3. **Use Test IDs**: Add `data-testid` attributes to important elements
4. **Parallelize**: Tests run in parallel by default (faster)
5. **Watch Videos**: Review failure videos to understand what went wrong
