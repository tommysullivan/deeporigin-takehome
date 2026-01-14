import { describe, it, expect } from "vitest";
import { shortURLFromSlug } from "./shortURLFromSlug";

describe("shortURLFromSlug", () => {
  it("should generate a short URL from a slug", () => {
    const slug = "abc123";
    const result = shortURLFromSlug(slug);
    expect(result).toBe("http://localhost:3000/urls/abc123");
  });

  it("should handle slugs with special characters", () => {
    const slug = "test-123_ABC";
    const result = shortURLFromSlug(slug);
    expect(result).toBe("http://localhost:3000/urls/test-123_ABC");
  });

  it("should handle empty string slug", () => {
    const slug = "";
    const result = shortURLFromSlug(slug);
    expect(result).toBe("http://localhost:3000/urls/");
  });

  it("should preserve slug case sensitivity", () => {
    const slug = "AbCdEf";
    const result = shortURLFromSlug(slug);
    expect(result).toBe("http://localhost:3000/urls/AbCdEf");
  });
});
