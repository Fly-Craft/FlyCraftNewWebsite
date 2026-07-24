import type { Metadata } from "next";
import Link from "next/link";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ | CRAFT",
  description: "Answers to common questions about flying with CRAFT.",
};

const linkCls = "text-navy underline underline-offset-4 hover:opacity-70";

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What happens if the flight is cancelled?",
    answer:
      "Reach out to our charter team as soon as possible and we'll walk you through your options, including rescheduling or a refund depending on the circumstances.",
  },
  {
    question:
      "What happens if we agreed on a departure time and I am late?",
    answer:
      "We'll do our best to accommodate a short delay, but crew duty-time limits and downstream schedules mean a late arrival can push back your departure or, in some cases, require rescheduling the flight.",
  },
  {
    question:
      "If we land at an alternate airport due to reasons beyond my control (mechanical or weather), who pays the difference?",
    answer:
      "CRAFT covers any additional cost associated with diverting to an alternate airport for mechanical or weather reasons beyond your control.",
  },
  {
    question: "Who pays the bill if the airplane needs to be de-iced?",
    answer:
      "The client is responsible for the bill in an instance such as this. Having said that, our crew will only take the necessary fluid amount to ensure a safe operation, as it is quite a large expense.",
  },
  {
    question:
      "What is the closest time before departure that I can cancel or change the flight time or date?",
    answer:
      "Reach out to our charter team as early as possible — cancellation and change windows depend on your specific trip, and the sooner we know, the more flexibility we can offer.",
  },
  {
    question: "Can I choose if I want to charter the Challenger 300 or 350?",
    answer: (
      <>
        Absolutely — each airplane offers a different cabin configuration,
        though, and may limit availability.
      </>
    ),
  },
  {
    question: "What happens if my luggage doesn't fit in the baggage compartment?",
    answer:
      "Any luggage that doesn't fit in the baggage compartment and is not a personal handbag will have to be left behind.",
  },
  {
    question: "How do I know that you are a safe and reliable operator?",
    answer: (
      <>
        CRAFT has operated charter flights since 2020 with an impeccable
        safety record. We operate all of our flights under Part 135
        regulations, and have obtained safety certificates from the leading
        audit companies in the industry.{" "}
        <Link href="/safety" className={linkCls}>
          Read more here
        </Link>
        .
      </>
    ),
  },
  {
    question: "Do I need to bring an ID when I am flying private?",
    answer:
      "Yes — according to TSA regulations, an adult (over 18) traveling on a domestic flight needs to carry a Real ID, and any person traveling internationally needs to carry a passport.",
  },
  {
    question: "What is provided on board the airplane in terms of food and drinks?",
    answer: (
      <>
        We provide a variety of snacks, drinks, and liquor on board. All can
        be found{" "}
        <Link href="/fleet/menu" className={linkCls}>
          here
        </Link>
        .
      </>
    ),
  },
  {
    question: "How old are the airplanes?",
    answer: (
      <>
        Information regarding specific tails can be found on our{" "}
        <Link href="/fleet" className={linkCls}>
          fleet page
        </Link>
        .
      </>
    ),
  },
  {
    question: "Can I smoke on board since it is a private jet?",
    answer:
      "No — even though it is a private flight, smoking any kind of substance on board is prohibited.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <section className="flex flex-col px-6 pt-40 pb-10 sm:px-20">
        <h1 className="max-w-3xl text-[clamp(40px,6vw,76px)] leading-[0.95] font-extralight tracking-tight text-navy">
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
