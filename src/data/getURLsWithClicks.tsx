import { dbTypesafe } from "@/db/dbTypesafe";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "kysely";
import { shortURLFromSlug } from "./shortURLFromSlug";
import { auth } from "@clerk/tanstack-react-start/server";

export const getURLsWithClicks = createServerFn({ method: "GET" })
  .handler(async () => {
    const { userId } = await auth();
    const results = await dbTypesafe
      .selectFrom("urls")
      .leftJoin("clicks", "urls.id", "clicks.url_id")
      .select([
        "urls.id",
        "urls.originalURL",
        "urls.shortURLSlug",
        sql<number>`count(clicks.id)`.as("clickCount"),
      ])
      .where("urls.userId", "=", userId)
      .groupBy(["urls.id", "urls.originalURL", "urls.shortURLSlug"])
      .orderBy("urls.id", "desc")
      .execute();

    return results.map((r) => ({
      ...r,
      shortURL: shortURLFromSlug(r.shortURLSlug),
      clickCount: Number(r.clickCount),
    }));
  });

export type URLsWithClicks = Awaited<ReturnType<typeof getURLsWithClicks>>;
