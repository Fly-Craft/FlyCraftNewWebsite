import type { Metadata } from "next";
import BookTabs from "@/components/charter/BookTabs";
import { isTab, type Tab } from "@/lib/book-tabs";

export const metadata: Metadata = {
  title: "Book | CRAFT",
  description:
    "Three ways to start a trip with CRAFT. Plan it yourself in the trip planner, send us a message, or call the team for a same-day departure.",
};

export default async function CharterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  /* Resolve the tab on the SERVER rather than with useSearchParams. That
     hook would push everything up to the nearest Suspense boundary into
     client-side rendering, leaving the booking page empty in the initial
     HTML — invisible to crawlers and to the agents this site is built to
     serve. Reading it here costs the route its static rendering and keeps
     the content server-rendered, which is the better trade for the page
     that actually sells the product. */
  const { tab } = await searchParams;
  const initialTab: Tab = isTab(tab) ? tab : "planner";

  /* Keyed on the resolved tab so navigating between ?tab= values — via the
     nav dropdown, a shared link, or the back button — remounts BookTabs and
     re-seeds its state. Without the key, React reuses the instance and
     useState(initialTab) ignores the new prop, leaving the URL and the
     visible panel disagreeing. Switching tabs *within* the page uses
     replaceState, which doesn't re-render this component, so the key holds
     steady and in-page state survives. */
  return <BookTabs key={initialTab} initialTab={initialTab} />;
}
