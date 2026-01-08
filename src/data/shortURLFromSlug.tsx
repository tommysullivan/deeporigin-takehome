export const shortURLFromSlug = (slug: string) => {
  return `${process.env.BASE_URL || "http://localhost:3000"}/urls/${slug}`;
};
