import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Legal | CRAFT",
  description: "CRAFT's terms, policies, and legal disclosures.",
};

const SECTIONS = [
  {
    label: "Company",
    paragraphs: [
      "CRAFT is a dba for Craft Charter, LLC, a limited liability company with its principal place of business at 14200 NW 42nd Ave, Opa-locka, Florida 33054. References on this website to “CRAFT,” “we,” “us,” or “our” refer to Craft Charter, LLC.",
    ],
  },
  {
    label: "Air Carrier Disclosure",
    paragraphs: [
      "Craft Charter, LLC is an FAA-certificated direct air carrier operating under Part 135 of the Federal Aviation Regulations. All flights operated by Craft Charter, LLC are conducted under its air carrier certificate and are subject to the operational control of Craft Charter, LLC.",
      "From time to time, CRAFT may arrange flights on aircraft operated by other FAA-certificated direct air carriers. In those cases, the operating carrier — not CRAFT — exercises full operational control of the flight, and CRAFT acts solely as an authorized agent in arranging the transportation. The identity of the operating carrier will be disclosed prior to flight.",
    ],
  },
  {
    label: "Website Terms of Use",
    paragraphs: [
      "This website and its content are provided for general informational purposes only. Nothing on this website constitutes a binding offer of transportation, a guarantee of aircraft availability, or a guarantee of pricing. All quotes are estimates, subject to aircraft and crew availability, airport conditions, weather, and final confirmation in a signed charter agreement. Charter services are provided subject to the terms and conditions of the applicable charter agreement between the client and Craft Charter, LLC.",
      "By using this website, you agree not to misuse it, interfere with its operation, or attempt to gain unauthorized access to any of its systems or data.",
    ],
  },
  {
    label: "Safety & Regulatory",
    paragraphs: [
      "All operations are conducted in accordance with applicable Federal Aviation Administration (FAA), Transportation Security Administration (TSA), and U.S. Department of Transportation (DOT) regulations. Passengers and baggage are subject to applicable security screening requirements. International travel is subject to customs, immigration, and documentation requirements of the countries of departure and arrival, and passengers are responsible for carrying valid travel documents.",
    ],
  },
  {
    label: "Glidepath Disclaimer",
    paragraphs: [
      "The Glidepath Fund is an independent investment vehicle and is not owned, operated, or offered by Craft Charter, LLC. Nothing on this website constitutes an offer to sell, or a solicitation of an offer to buy, any security or investment product. Any such offer is made solely through the fund’s official offering documents, and only to persons eligible to invest under applicable law. Prospective investors should consult their own legal, tax, and financial advisors.",
    ],
  },
  {
    label: "Intellectual Property",
    paragraphs: [
      "All content on this website — including text, photography, graphics, logos, and the CRAFT name and marks — is the property of Craft Charter, LLC or its licensors and is protected by applicable intellectual property laws. No content may be reproduced, distributed, or used for commercial purposes without prior written permission.",
    ],
  },
  {
    label: "Disclaimer & Limitation of Liability",
    paragraphs: [
      "This website is provided “as is” and “as available” without warranties of any kind, express or implied. While we work to keep the information on this site accurate and current — including aircraft specifications, range figures, and performance data — it is provided for general reference only and may change without notice. To the fullest extent permitted by law, Craft Charter, LLC shall not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, this website. Nothing in these terms limits any liability that cannot be limited under applicable law, including liability arising under the terms of a signed charter agreement.",
    ],
  },
  {
    label: "Privacy",
    paragraphs: [
      "Information you submit through this website — such as your name, contact details, and trip preferences — is used solely to respond to your request and provide our services. We do not sell your personal information. For any privacy questions, or to request access to or deletion of your information, contact us at the email below.",
    ],
  },
  {
    label: "Governing Law",
    paragraphs: [
      "These terms are governed by the laws of the State of Florida, without regard to its conflict-of-law principles. Any dispute arising out of the use of this website shall be subject to the exclusive jurisdiction of the state and federal courts located in Miami-Dade County, Florida.",
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={
          <>
            Legal <span className="font-medium">Notices</span>
          </>
        }
        subtitle="Terms, disclosures, and policies governing this website and CRAFT's services."
        divider={false}
      />

      <section className="px-6 pb-28 sm:px-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-navy/10 bg-white/90 p-10 shadow-[0_24px_80px_rgba(12,29,61,0.1)] backdrop-blur sm:p-14">
          <ul className="flex flex-col">
            {SECTIONS.map((section) => (
              <li
                key={section.label}
                className="border-t border-border py-8 first:border-t-0 first:pt-0"
              >
                <p className="mb-3 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
                  {section.label}
                </p>
                {section.paragraphs.map((text) => (
                  <p
                    key={text.slice(0, 40)}
                    className="mt-3 text-[15px] font-light leading-relaxed text-ink-2 first:mt-0"
                  >
                    {text}
                  </p>
                ))}
              </li>
            ))}
          </ul>

          <p className="mt-10 text-[13px] font-light leading-relaxed text-ink-3">
            Questions about any of the above? Contact us at{" "}
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="text-navy underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
