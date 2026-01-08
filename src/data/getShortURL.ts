import { loadOrCreateURLRow } from "@/data/loadOrCreateURLRow";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const baseURL = process.env.BASE_URL || "http://localhost:3000/";

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
      console.log({ originalURL, userId });
      const { shortURLSlug } = await loadOrCreateURLRow(originalURL, userId);
      return {
        shortURL: `${baseURL}urls/${shortURLSlug}`,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
