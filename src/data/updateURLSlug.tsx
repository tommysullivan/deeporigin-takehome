import { dbTypesafe } from "@/db/dbTypesafe";
import { createServerFn } from "@tanstack/react-start";
import { auth } from "@clerk/tanstack-react-start/server";
import z from "zod";

export const updateURLSlug = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number(), newSlug: z.string() }))
  .handler(async ({ data: { id, newSlug } }) => {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized", { cause: { status: 403 } });
    }

    try {
      // First, verify the URL belongs to the authenticated user
      const url = await dbTypesafe
        .selectFrom("urls")
        .select(["id", "userId"])
        .where("id", "=", id)
        .executeTakeFirst();

      if (!url) {
        throw new Error("URL not found");
      }

      if (url.userId !== userId) {
        throw new Error("Unauthorized", { cause: { status: 403 } });
      }

      // Update the slug
      await dbTypesafe
        .updateTable("urls")
        .set({ shortURLSlug: newSlug })
        .where("id", "=", id)
        .execute();

      return { success: true };
    } catch (error: any) {
      // Check if it's a unique constraint violation
      if (error?.code === "23505" || error?.message?.includes("unique")) {
        throw new Error(
          "This slug is already in use. Please choose a different one."
        );
      }
      throw new Error("Failed to update slug. Please try again.");
    }
  });
