import { loadOrCreateURLRow } from "@/data/loadOrCreateURLRow";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { urlsBasePath } from "./urlsBasePath";

export const getShortURL = createServerFn({
  method: "GET",
})
  .inputValidator(
    z.object({
      originalURL: z.url(),
    })
  )
  .handler(async ({ data: { originalURL } }) => {
    try {
      const { userId } = await auth();
      const { shortURLSlug } = await loadOrCreateURLRow(originalURL, userId);
      return {
        shortURL: `${urlsBasePath}${shortURLSlug}`,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
