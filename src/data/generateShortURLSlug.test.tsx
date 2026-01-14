import { describe, it, expect } from "vitest";
import { generateShortURLSlug } from "./generateShortURLSlug";

describe("generateShortURLSlug", () => {
  it("should generate a 12-character slug for authenticated user", () => {
    const slug = generateShortURLSlug("https://example.com", "user_123");
    expect(slug).toBe("3a3bbde58073");
    expect(slug.length).toBe(12);
  });

  it("should generate a 12-character slug for anonymous user", () => {
    const slug = generateShortURLSlug("https://example.com", null);
    expect(slug).toBe("1d7cf682a4fe");
    expect(slug.length).toBe(12);
  });

  it("should generate different slugs for different URLs", () => {
    const slug1 = generateShortURLSlug("https://example.com", "user_123");
    const slug2 = generateShortURLSlug("https://different.com", "user_123");
    expect(slug1).not.toBe(slug2);
  });

  it("should generate different slugs for different users", () => {
    const slug1 = generateShortURLSlug("https://example.com", "user_123");
    const slug2 = generateShortURLSlug("https://example.com", "user_456");
    expect(slug1).not.toBe(slug2);
  });

  it("should generate the same slug for the same URL and user (deterministic)", () => {
    const slug1 = generateShortURLSlug("https://example.com", "user_123");
    const slug2 = generateShortURLSlug("https://example.com", "user_123");
    expect(slug1).toBe(slug2);
  });

  it("should handle long URLs", () => {
    const longURL =
      "https://example.com/very/long/path/with/many/segments?query=param&another=value";
    const slug = generateShortURLSlug(longURL, "user_123");
    expect(slug).toBe("ec7074028e8b");
    expect(slug.length).toBe(12);
  });

  it("should handle URLs with special characters", () => {
    const urlWithSpecialChars =
      "https://example.com/path?query=hello%20world&foo=bar#section";
    const slug = generateShortURLSlug(urlWithSpecialChars, "user_123");
    expect(slug).toBe("8f22b35df612");
    expect(slug.length).toBe(12);
  });

  it("should only contain hexadecimal characters", () => {
    const slug = generateShortURLSlug("https://example.com", "user_123");
    expect(slug).toMatch(/^[0-9a-f]{12}$/);
  });
});
