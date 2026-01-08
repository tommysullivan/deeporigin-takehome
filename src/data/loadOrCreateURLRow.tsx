import { dbTypesafe } from "@/db/dbTypesafe";
import { generateShortURLSlug } from "./generateShortURLSlug";

export const loadOrCreateURLRow = async (
  originalURL: string,
  userId: string | null
) => {
  const shortURLSlug = generateShortURLSlug(originalURL, userId);

  const existing = await dbTypesafe
    .selectFrom("urls")
    .select("shortURLSlug")
    .where("originalURL", "=", originalURL)
    .where("userId", userId ? "=" : "is", userId ?? null)
    .executeTakeFirst();

  if (existing) {
    return existing;
  }

  const newRecord = await dbTypesafe
    .insertInto("urls")
    .values({
      userId: userId ?? null,
      originalURL,
      shortURLSlug,
    })
    .returning(["shortURLSlug"])
    .executeTakeFirstOrThrow();

  return newRecord;
};
