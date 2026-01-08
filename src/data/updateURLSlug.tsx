import { dbTypesafe } from "@/db/dbTypesafe";
import { createServerFn } from "@tanstack/react-start";

interface UpdateURLSlugInput {
  id: number;
  newSlug: string;
}

export const updateURLSlug = createServerFn({ method: "POST" })
  .inputValidator((data: UpdateURLSlugInput) => data)
  .handler(async ({ data: { id, newSlug } }) => {
    try {
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
