import crypto from "crypto";

export function generateShortURLSlug(
  originalURL: string,
  userId: string | null
): string {
  const input = `${userId ?? "anonymous"}:${originalURL}`;
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return hash.substring(0, 12);
}
