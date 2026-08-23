import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Legal & Privacy | CRAFT",
  description:
    "CRAFT's website terms, privacy policy, air carrier disclosure, and legal notices.",
};

/* Shown at the top of the page and referred to by the Changes paragraph.
   Update it whenever the text below changes in substance. */
const LAST_UPDATED = "August 22, 2026";

type Section = {
  /** Anchor, so the privacy policy can be linked as /legal#privacy. */
  id: string;
  label: string;
  paragraphs?: string[];
  subsections?: { title: string; paragraphs: string[] }[];
};

/*
 * Everything below describes what the site actually does, checked against
 * the code rather than written from a template. In particular: the forms
 * and what they collect, where that data goes (Postmark, Vercel, Google
 * Calendar on Book a Call, and nothing else), the absence of cookies and
 * analytics, and the AI-agent endpoint. If any of that changes, this page
 * has to change with it, or it stops being true.
 */
const SECTIONS: Section[] = [
  {
    id: "company",
    label: "Company",
    paragraphs: [
      "CRAFT is a dba for Craft Charter, LLC, a limited liability company with its principal place of business at 14200 NW 42nd Ave, Opa-locka, Florida 33054. References on this website to “CRAFT,” “we,” “us,” or “our” refer to Craft Charter, LLC.",
    ],
  },
  {
    id: "air-carrier",
    label: "Air Carrier Disclosure",
    paragraphs: [
      "Craft Charter, LLC is an FAA-certificated direct air carrier operating under Part 135 of the Federal Aviation Regulations. Flights operated by Craft Charter, LLC are conducted under its air carrier certificate and are subject to the operational control of Craft Charter, LLC.",
      "From time to time, CRAFT may arrange flights on aircraft operated by other FAA-certificated direct air carriers. In those cases the operating carrier, and not CRAFT, exercises operational control of the flight, and CRAFT acts as an authorized agent in arranging the transportation. The identity of the operating carrier will be disclosed before the charter agreement is signed, and you may ask for it at any time before then.",
    ],
  },
  {
    id: "terms",
    label: "Website Terms of Use",
    paragraphs: [
      "This website and its content are provided for general informational purposes. Nothing on it is a binding offer of transportation, a guarantee of aircraft availability, or a guarantee of pricing. Quotes are estimates, subject to aircraft and crew availability, airport conditions, weather, and final confirmation in a signed charter agreement. Charter services are provided under the terms of the charter agreement between the client and Craft Charter, LLC, and each programme described on this site (Leaseback, the Fleet Jet Card, and the Corporate Program) is governed by its own written agreement.",
      "Pricing comparisons on this site, including statements about rates relative to booking through a broker, are illustrative, based on CRAFT's experience, and vary by trip, aircraft, and date. They are not a promise of any particular price or saving.",
      "By using this website you agree not to misuse it: not to interfere with its operation, attempt to gain unauthorized access to its systems or data, scrape or harvest its content for commercial use, submit information that is false or that you have no right to give, or impersonate another person. You agree to hold Craft Charter, LLC harmless from claims that arise out of your misuse of this website or your breach of these terms.",
      "This website links to sites we do not control, including Glidepath, Matterport (for aircraft cabin tours), Google Calendar (for booking a call), ARGUS, Wyvern, and our social media pages. Those sites have their own terms and privacy policies, and CRAFT is not responsible for their content or for how they handle your information.",
      "Reviews and testimonials on this site reflect the individual experience of the person quoted. They are not a promise that anyone else will have the same experience, and they are not a substitute for the terms of your own charter agreement.",
    ],
  },
  {
    id: "safety",
    label: "Safety & Regulatory",
    paragraphs: [
      "All operations are conducted in accordance with applicable Federal Aviation Administration (FAA), Transportation Security Administration (TSA), and U.S. Department of Transportation (DOT) regulations. Passengers and baggage are subject to applicable security screening requirements. International travel is subject to the customs, immigration, and documentation requirements of the countries of departure and arrival, and passengers are responsible for carrying valid travel documents.",
      "Aircraft specifications, range, speed, and capacity figures on this site are planning figures and may vary with weather, weight, routing, and the specific aircraft assigned to a flight.",
    ],
  },
  {
    id: "glidepath",
    label: "Glidepath",
    paragraphs: [
      "Glidepath is an exchange fund offered by a separate company. Craft Charter, LLC does not sponsor, manage, advise, or offer the fund, and nothing on this website is an offer to sell, or a solicitation of an offer to buy, any security or investment product.",
      "Where this website describes CRAFT as the operator for Glidepath, it means that CRAFT operates the aircraft and flights made available to the fund's members under CRAFT's Part 135 certificate. It does not mean that CRAFT operates, manages, or controls the fund or any investment in it.",
      "Any investment is made solely through the fund's own offering documents, only to persons eligible under applicable law, and on the terms set out there. Prospective investors should consult their own legal, tax, and financial advisors. Links to glidepath.ai leave this website and are subject to Glidepath's own terms and policies.",
    ],
  },
  {
    id: "ip",
    label: "Intellectual Property",
    paragraphs: [
      "All content on this website, including text, photography, graphics, logos, and the CRAFT name and marks, is the property of Craft Charter, LLC or its licensors and is protected by applicable intellectual property laws. No content may be reproduced, distributed, or used for commercial purposes without prior written permission.",
      "Names and marks of other companies that appear on this site, including Bombardier and Challenger, Starlink, Apple TV, ARGUS, Wyvern, Matterport, and Google, belong to their respective owners. They are used to identify those products and services, and their appearance does not imply that those companies endorse CRAFT.",
    ],
  },
  {
    id: "liability",
    label: "Disclaimer & Limitation of Liability",
    paragraphs: [
      "This website is provided “as is” and “as available” without warranties of any kind, express or implied. While we work to keep the information on this site accurate and current, it is provided for general reference only and may change without notice. To the fullest extent permitted by law, Craft Charter, LLC shall not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, this website. Nothing in these terms limits any liability that cannot be limited under applicable law, including liability arising under the terms of a signed charter agreement.",
    ],
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    paragraphs: [
      "This policy explains what personal information this website collects, what we do with it, who sees it, and the choices you have. It applies to this website and to enquiries sent through it. The terms of your charter or programme agreement govern the information we hold as your operator once you become a client.",
    ],
    subsections: [
      {
        title: "What we collect",
        paragraphs: [
          "When you send a form on this site, we collect what you type into it. Depending on the form, that is your name, email address, phone number, company, and message. A charter request also includes the trip itself: airports, dates and times, the number of passengers (including how many are under 18 or under 2), pets, catering preferences, any allergy or dietary details you choose to tell us, and your notes. If you are a broker, the name of your brokerage. We ask for passenger-age and allergy details only so the crew can prepare the cabin, and you can leave them blank.",
          "Like every web server, our hosting provider records technical information about each request in its logs, such as your IP address, browser type, and the pages requested. We do not combine that with your form submissions.",
        ],
      },
      {
        title: "How we use it",
        paragraphs: [
          "To respond to your enquiry, quote and arrange the trip or programme you asked about, send you an email confirming that we received your request, and keep a record of the enquiry. We do not use your information for advertising, and we do not sell it, rent it, or share it with anyone for their own marketing.",
        ],
      },
      {
        title: "Who sees it",
        paragraphs: [
          "The CRAFT team members responsible for your request, including the people who run the programme you asked about. Replies to your enquiry come from them directly.",
          "The service providers that carry it. Postmark delivers our email and keeps a copy of each message for roughly 45 days to provide delivery reporting. Vercel hosts this website. Both are based in the United States and process your information only to provide those services to us.",
          "If you book a call through the Book a Call button, the scheduling page is provided by Google Calendar. The details you enter there (your name, email address, and the time you choose) go to Google under Google's privacy policy, and the booking appears in our calendar.",
          "We may also disclose information where the law requires it, in response to a valid legal request, or where necessary to protect the rights, safety, or property of CRAFT, our crews, or our passengers.",
        ],
      },
      {
        title: "Cookies and tracking",
        paragraphs: [
          "This website does not set cookies, does not use analytics or advertising trackers, and does not build profiles of visitors. Fonts are served from our own domain rather than fetched from a third party. The only third-party content that loads inside the site is the Google Calendar scheduler, and only when you open Book a Call. Because we do not track, a Do Not Track or Global Privacy Control signal from your browser has nothing to switch off, and we honour it by default.",
        ],
      },
      {
        title: "AI assistants",
        paragraphs: [
          "Some requests reach us through AI assistants acting for a person who asked them to price or request a trip, using an endpoint on this site built for that purpose. We treat a request that arrives that way exactly as we would one typed into a form, and this policy applies to the contact details it carries in the same way.",
        ],
      },
      {
        title: "How long we keep it",
        paragraphs: [
          "We keep enquiry emails for as long as we need them to respond to you, to serve you as a client, and to meet our legal, accounting, and regulatory obligations, after which they are deleted. Our email provider keeps its own copy for roughly 45 days. You can ask us to delete your information sooner; see Your rights and choices below.",
        ],
      },
      {
        title: "Your rights and choices",
        paragraphs: [
          "You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it, by emailing the address at the foot of this page. We will confirm your identity before acting and respond within the time the law requires. We will not treat you differently for exercising these rights.",
          "Because we do not sell personal information or share it for targeted advertising, there is no sale or sharing to opt out of. If you live in a place that gives you additional privacy rights, such as California, the European Union, or the United Kingdom, those rights apply to you, and you can exercise them the same way.",
        ],
      },
      {
        title: "Children",
        paragraphs: [
          "This website is for adults arranging travel. It is not directed at children under 13, and we do not knowingly collect personal information from them. A charter request may include how many passengers are under 18 or under 2 so the crew can prepare the cabin; that is a count, not a child's personal information.",
        ],
      },
      {
        title: "Security",
        paragraphs: [
          "This website is served over HTTPS, and we take reasonable measures to protect the information you send us. No method of transmission or storage is completely secure, so we cannot promise absolute security. If we learn of a breach affecting your information, we will notify you as the law requires.",
        ],
      },
      {
        title: "Where it is processed",
        paragraphs: [
          "CRAFT is based in Florida, and the providers that carry and store your information are in the United States. If you contact us from outside the United States, your information is processed there.",
        ],
      },
      {
        title: "Changes to this policy",
        paragraphs: [
          "When this policy changes, we post the new version here with an updated date at the top of the page. Continued use of the site after a change means the new version applies.",
        ],
      },
    ],
  },
  {
    id: "communications",
    label: "Electronic Communications",
    paragraphs: [
      "By submitting a form or booking a call, you agree that CRAFT may contact you by email and, if you gave us a number, by telephone, about your request. We send one automatic email confirming that we received your message; that is the only automated message we send. We do not currently send text messages, and we will not send you marketing by email or text unless you ask us to. If that changes, we will ask for your consent first. You can tell us at any time to stop contacting you, and we will.",
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    paragraphs: [
      "CRAFT wants this website to be usable by everyone, including people who rely on assistive technology, and we build it with that in mind. If any part of the site is difficult for you to use, or you would like information in another format, email or call us and we will help, and fix what we can.",
    ],
  },
  {
    id: "law",
    label: "Governing Law",
    paragraphs: [
      "These terms are governed by the laws of the State of Florida, without regard to its conflict-of-law principles. Any dispute arising out of the use of this website shall be subject to the exclusive jurisdiction of the state and federal courts located in Miami-Dade County, Florida.",
    ],
  },
];

const para =
  "mt-3 text-[15px] font-light leading-relaxed text-ink-2 first:mt-0";

export default function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Legal <span className="font-medium">&amp; Privacy</span>
          </>
        }
        subtitle="Terms, privacy policy, disclosures, and the notices that govern this website and CRAFT's services."
        divider={false}
      />

      <section className="px-6 pb-28 sm:px-20">
        <div className="mx-auto max-w-3xl rounded-3xl glass p-10 sm:p-14">
          <p className="mb-8 text-[12px] font-light tracking-wide text-ink-3">
            Last updated {LAST_UPDATED}
          </p>

          <ul className="flex flex-col">
            {SECTIONS.map((section) => (
              <li
                key={section.id}
                id={section.id}
                className="scroll-mt-28 border-t border-border py-8 first:border-t-0 first:pt-0"
              >
                <p className="mb-3 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
                  {section.label}
                </p>
                {section.paragraphs?.map((text) => (
                  <p key={text.slice(0, 40)} className={para}>
                    {text}
                  </p>
                ))}
                {section.subsections?.map((sub) => (
                  <div key={sub.title} className="mt-7">
                    <p className="mb-2 text-[14px] font-medium text-navy">
                      {sub.title}
                    </p>
                    {sub.paragraphs.map((text) => (
                      <p key={text.slice(0, 40)} className={para}>
                        {text}
                      </p>
                    ))}
                  </div>
                ))}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[13px] font-light leading-relaxed text-ink-3">
            For questions about any of the above, or to exercise your privacy
            rights, contact us at{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-navy underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {siteConfig.contactEmail}
            </a>{" "}
            or call{" "}
            <a
              href={`tel:${siteConfig.charterSalesPhone}`}
              className="whitespace-nowrap text-navy underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {siteConfig.charterSalesPhoneDisplay}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
