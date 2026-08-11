import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | CRAFT",
  description: "Answers to common questions about flying with CRAFT.",
};

const linkCls = "text-navy underline underline-offset-4 hover:opacity-70";

/* Ordered by what a client needs settled first: whether we're safe to fly
   with, then what happens when a trip goes sideways, then who pays for
   what, then the practical details of the day itself. */
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I know CRAFT is a safe operator?",
    answer: (
      <>
        We have flown charter since 2020 with a clean safety record. Every
        flight operates under FAA Part 135 rules, including owner trips, and
        we hold both an ARGUS Platinum rating and Wyvern certification.{" "}
        <Link href="/company#safety" className={linkCls}>
          Read more here
        </Link>
        .
      </>
    ),
  },
  {
    question: "What happens if my flight is cancelled?",
    answer:
      "Call the charter team as soon as you know. We'll go through the options with you, which can include rescheduling or a refund depending on the circumstances.",
  },
  {
    question:
      "If weather or a mechanical issue sends us to a different airport, who covers the cost?",
    answer:
      "CRAFT does. When a diversion is down to weather or maintenance, the additional cost is ours.",
  },
  {
    question: "Who pays if the aircraft needs de-icing?",
    answer:
      "De-icing is billed to the client. It is an expensive service, so our crews order only the fluid the conditions actually call for.",
  },
  {
    question: "Do I need to bring ID on a private flight?",
    answer:
      "Yes. TSA rules require passengers over 18 to carry a Real ID on domestic flights, and anyone flying internationally to carry a passport.",
  },
  {
    question: "What food and drink are on board?",
    answer: (
      <>
        Every flight carries snacks, soft drinks, and liquor. The full
        selection is on our{" "}
        <Link href="/fleet/menu" className={linkCls}>
          menu
        </Link>
        .
      </>
    ),
  },
  {
    question: "How old are the aircraft?",
    answer: (
      <>
        Year of manufacture and refurbishment for each tail are listed on
        the{" "}
        <Link href="/fleet" className={linkCls}>
          fleet page
        </Link>
        .
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div>
      <section className="flex flex-col px-6 pt-40 pb-10 sm:px-20">
        <h1 className="display-title max-w-3xl text-[clamp(40px,6vw,76px)] leading-title font-extralight tracking-tight text-navy">
          Frequently <span className="font-medium">Asked Questions</span>
        </h1>
        <p className="mt-6 max-w-xl text-[15px] font-light leading-relaxed text-ink-2">
          Answers to the questions we hear most from clients flying with
          CRAFT.
        </p>
      </section>

      <section className="px-6 pb-28 sm:px-20">
        <FaqAccordion items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
