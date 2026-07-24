import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | CRAFT",
  description: "Get in touch with CRAFT Charter Sales.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Reach Charter Sales directly, or send us a message and we'll follow up."
        titleClassName="-ml-1.5"
        divider={false}
      />

      <section className="px-6 pb-24 sm:px-20">
        <ContactForm />
      </section>
    </>
  );
}
