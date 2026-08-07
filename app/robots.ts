import type { MetadataRoute } from "next";
import { siteUrl, isPublic } from "@/lib/site-config";

/**
 * AI assistants and agents identify themselves with their own user agents
 * rather than hiding behind Googlebot, and several are gated separately
 * from search indexing — Google-Extended and Applebot-Extended control
 * AI use only, and blocking them does nothing for (or against) search.
 *
 * We name them explicitly instead of relying on `*` so the intent is on
 * the record: CRAFT wants to be quotable by assistants, because someone
 * asking an assistant to charter a jet is exactly the customer here.
 */
const AI_AGENTS = [
  "GPTBot", // OpenAI training/index crawler
  "OAI-SearchBot", // ChatGPT search results
  "ChatGPT-User", // fetches a page because a user asked
  "ClaudeBot", // Anthropic crawler
  "Claude-User", // fetches a page because a user asked
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews grounding
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  // Private review — shared by link, not announced. This also shuts out
  // every AI crawler, so none of the structured data on the site can be
  // discovered until SITE_PUBLIC=true.
  if (!isPublic) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing here is secret, but the request endpoints are for
        // submitting, not for reading — keep them out of crawl budgets.
        disallow: ["/api/"],
      },
      {
        userAgent: AI_AGENTS,
        // Agents SHOULD reach the API: /api/agent/* is the documented,
        // machine-readable way to price and request a trip without
        // driving the booking form's DOM.
        allow: ["/", "/api/agent/"],
        disallow: [
          "/api/charter-request",
          "/api/contact",
          "/api/corporate-program",
          "/api/management-inquiry",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
