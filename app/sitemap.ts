import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-config";
import { AIRCRAFT } from "@/lib/fleet-aircraft";

/**
 * Every publicly reachable route. Agents and crawlers use this as the
 * index of what exists — anything missing here is effectively invisible
 * to anything that isn't following links by hand.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
  ) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/charter", 0.9, "weekly"),
    entry("/asap", 0.8),
    entry("/fleet", 0.8),
    entry("/fleet/menu", 0.5),
    ...AIRCRAFT.map((a) => entry(`/fleet/${a.slug}`, 0.6)),
    entry("/programs", 0.8),
    entry("/company", 0.7),
    entry("/contact", 0.7),
    entry("/faq", 0.6),
    entry("/reviews", 0.5),
    entry("/legal", 0.3, "yearly"),
  ];
}
