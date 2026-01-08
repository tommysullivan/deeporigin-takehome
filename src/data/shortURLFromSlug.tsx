import { urlsBasePath } from "./urlsBasePath";

export const shortURLFromSlug = (slug: string) => {
  return `${urlsBasePath}${slug}`;
};
