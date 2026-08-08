import type { Metadata } from "next";
import { Suspense } from "react";
import BookTabs from "@/components/charter/BookTabs";

export const metadata: Metadata = {
  title: "Book | CRAFT",
  description:
    "Three ways to start a trip with CRAFT — plan it yourself in the trip planner, send us a message, or call the team for a same-day departure.",
};

export default function CharterPage() {
  // BookTabs reads ?tab= via useSearchParams, which needs a Suspense
  // boundary on a prerendered route. The fallback holds the hero's height
  // so the page doesn't jump as the tabs hydrate.
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <BookTabs />
    </Suspense>
  );
}
