import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PageHero from "@/components/PageHero";
import ProgramEnquiryForm from "@/components/programs/ProgramEnquiryForm";
import { enquirableProgram } from "@/lib/programs";

/**
 * Reachable only from a programme card's Contact Us button, so it stays
 * out of the sitemap and out of search results. Landing here without a
 * recognised `?program=` bounces to /programs rather than rendering a
 * form with nothing behind it.
 */
export const metadata: Metadata = {
  title: "Programs — Contact | CRAFT",
  robots: { index: false, follow: false },
};

export default async function ProgramEnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { program } = await searchParams;

  /* Resolve against the known list rather than trusting the query string.
     Nothing below is built from the raw parameter, so a hostile value has
     nowhere to land — it just redirects. */
  const found = enquirableProgram(program);
  if (!found) redirect("/programs");

  return (
    <>
      <PageHero
        eyebrow={found.label}
        title={
          <>
            Let&apos;s Build <span className="font-medium">Your Program</span>
          </>
        }
        subtitle={`Tell us how to reach you and someone from the ${found.label} team will take it from there.`}
        divider={false}
      />

      <section className="px-6 pb-28 sm:px-20">
        <ProgramEnquiryForm
          program={found.slug}
          programLabel={found.label}
          image={found.image}
          fields={found.fields}
        />

        {/* Anchored at the card you came from, but labelled for the section
            — same wording as the button on the confirmation screen. */}
        <p className="mt-10 text-center text-[12px] font-light text-ink-3">
          <Link
            href={`/programs#${found.slug}`}
            className="text-navy underline underline-offset-4"
          >
            Back to Programs
          </Link>
        </p>
      </section>
    </>
  );
}
