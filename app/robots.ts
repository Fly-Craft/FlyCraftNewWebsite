import type { MetadataRoute } from "next";

/**
 * The site is in private review — shared by link for feedback, not yet
 * announced. Keep it out of search results until launch, then delete this
 * file (and the `robots` block in layout.tsx) to open it up.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
