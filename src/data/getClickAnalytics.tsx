import { dbTypesafe } from "@/db/dbTypesafe";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "kysely";
import { auth } from "@clerk/tanstack-react-start/server";
import z from "zod";

interface ClickBucket {
  bucket: Date;
  count: number;
}

export const getClickAnalytics = createServerFn({ method: "GET" })
  .inputValidator(z.object({
    urlId: z.number(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized", { cause: { status: 403 } });
    }

    // Verify the URL belongs to this user
    const url = await dbTypesafe
      .selectFrom("urls")
      .select(["id", "userId"])
      .where("id", "=", data.urlId)
      .executeTakeFirst();

    if (!url) {
      throw new Error("URL not found", { cause: { status: 404 } });
    }

    if (url.userId !== userId) {
      throw new Error("Unauthorized", { cause: { status: 403 } });
    }

    // Determine time range
    let startTime: Date;
    let endTime: Date = new Date();

    if (data.startTime && data.endTime) {
      startTime = new Date(data.startTime);
      endTime = new Date(data.endTime);
    } else {
      // Get the first click timestamp for "all time"
      const firstClick = await dbTypesafe
        .selectFrom("clicks")
        .select("timestamp")
        .where("url_id", "=", data.urlId)
        .orderBy("timestamp", "asc")
        .executeTakeFirst();

      if (!firstClick) {
        // No clicks yet, return empty data
        return {
          buckets: [],
          startTime: endTime.toISOString(),
          endTime: endTime.toISOString(),
          totalClicks: 0,
        };
      }

      startTime = new Date(firstClick.timestamp);
    }

    // Calculate bucket size based on time range
    const timeRangeMs = endTime.getTime() - startTime.getTime();
    const bucketSizeMs = timeRangeMs / 30;

    // We'll sum the bucket counts for totalClicks below

    // Query clicks grouped by time buckets
    // Using PostgreSQL's width_bucket function to create 30 buckets
    const buckets = await dbTypesafe
      .selectFrom("clicks")
      .select([
        sql<number>`
          width_bucket(
            EXTRACT(EPOCH FROM timestamp)::bigint,
            ${Math.floor(startTime.getTime() / 1000)},
            ${Math.floor(endTime.getTime() / 1000)},
            30
          )
        `.as("bucket_num"),
        sql<number>`count(*)`.as("count"),
      ])
      .where("url_id", "=", data.urlId)
      .where("timestamp", ">=", startTime)
      .where("timestamp", "<=", endTime)
      .groupBy("bucket_num")
      .orderBy("bucket_num", "asc")
      .execute();

    // Create all 30 buckets with counts (including zeros)
    const bucketMap = new Map<number, number>();
    for (const bucket of buckets) {
      bucketMap.set(Number(bucket.bucket_num), Number(bucket.count));
    }

    const allBuckets: ClickBucket[] = [];
    for (let i = 1; i <= 30; i++) {
      const bucketStartTime = new Date(
        startTime.getTime() + (i - 1) * bucketSizeMs
      );
      allBuckets.push({
        bucket: bucketStartTime,
        count: bucketMap.get(i) || 0,
      });
    }
    const totalClicks = allBuckets.reduce((sum, b) => sum + b.count, 0);
    return {
      buckets: allBuckets,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalClicks,
    };
  });

export type ClickAnalytics = Awaited<ReturnType<typeof getClickAnalytics>>;
