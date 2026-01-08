import crypto from "crypto";

// Generate a short URL hash from the original URL and userId

export function generateShortURLSlug(
  originalURL: string,
  userId: string | null
): string {
  const input = `${userId ?? "anonymous"}:${originalURL}`;
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  // Take first 8 characters for a reasonably short URL
  return hash.substring(0, 12);
}
