import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | CRAFT",
  description: "Answers to common questions about flying with CRAFT.",
};

const linkCls = "text-navy underline underline-offset-4 hover:opacity-70";

/* Safety first, then the day itself in the order it happens: when to turn
   up, how to find the aircraft, what to bring, and what's in the cabin. */
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What safety standards does CRAFT fly to?",
    answer: (
      <>
        We have flown charter since 2020 with a spotless safety record. Every
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
    question: "How early do I need to be at the airport?",
    answer:
      "Fifteen minutes before departure, whether you're flying domestically or internationally. That covers baggage loading, a short briefing from the crew, and an ID check. There is no terminal to cross and no line to stand in.",
  },
  {
    question: "How will I find my airplane at the airport?",
    answer:
      "Your trip sheet has everything you need on it, including which FBO to head for and the tail number of your aircraft. The crew waits for you in the FBO lobby, and at most airports you can drive straight out to the ramp instead. The tail number is painted on the tail, and either our crew or the ground crew will take you out to it.",
  },
  {
    question: "Do I need to bring ID on a private flight?",
    answer:
      "Yes. TSA rules require passengers over 18 to carry a Real ID on domestic flights, and anyone flying internationally to carry a passport.",
  },
  {
    question: "Is there a flight attendant on board?",
    answer:
      "Not as standard, but we can arrange one for your trip when you book. The attendant takes a cabin seat, so a flight with one on board seats eight passengers rather than nine.",
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
        . Catering beyond that can be arranged with your trip.
      </>
    ),
  },
  {
    question: "Is there Wi-Fi on board?",
    answer:
      "Yes. Every aircraft in the fleet has Starlink. If you have not flown with it before, expect a pleasant surprise: streaming, video calls, and anything else you would do on the connection at home all work the same way at altitude.",
  },
  {
    question: "Are pets allowed on board?",
    answer:
      "Pets are welcome. Add them when you book and tell us how many are coming, so the crew can set the cabin up for them.",
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
