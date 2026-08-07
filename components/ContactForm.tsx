"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3.5 text-[14px] text-navy outline-none transition-colors focus:border-navy/40 placeholder:text-ink-3/70";
const microLabel =
  "mb-2 block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit =
    name.trim() !== "" &&
    message.trim() !== "" &&
    (email.trim() !== "" || phone.trim() !== "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex max-w-xl flex-col items-center justify-center gap-5 rounded-3xl glass px-8 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[20px] text-white">
            ✓
          </span>
          <p className="text-[22px] font-light text-navy">Message received.</p>
          <p className="max-w-sm text-[14px] font-light leading-relaxed text-ink-2">
            Thanks — we&apos;ll be in touch shortly. For anything urgent, call{" "}
            <a
              href={`tel:${siteConfig.charterSalesPhone}`}
              className="whitespace-nowrap text-navy underline underline-offset-4"
            >
              {siteConfig.charterSalesPhoneDisplay}
            </a>
            .
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl self-center">
          <img
            src="/contact/office.jpg"
            alt="The CRAFT conference room"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 lg:gap-20">
      <form
        onSubmit={handleSubmit}
        className="flex max-w-xl flex-col gap-6 rounded-3xl glass p-8 sm:p-12"
      >
        {/* id/htmlFor + name + autoComplete throughout: without them a
            screen reader announces an unlabelled box, and an agent filling
            the form has nothing but visual order to go on. */}
        <div>
          <label htmlFor="contact-name" className={microLabel}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className={microLabel}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              aria-describedby="contact-reach"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className={microLabel}>
              Phone
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-describedby="contact-reach"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
        <p id="contact-reach" className="-mt-3 text-[11px] font-light text-ink-3">
          An email or a phone number is all we need to reach you.
        </p>

        <div>
          <label htmlFor="contact-message" className={microLabel}>
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help?"
            className={`${inputCls} resize-none`}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit || status === "sending"}
          className="mt-2 glass-selected rounded-full px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
        </button>

        {status === "error" && (
          <p className="text-[13px] text-red-600">
            Something went wrong — please try again.
          </p>
        )}

        <p className="text-center text-[12px] font-light text-ink-3">
          Prefer to talk?{" "}
          <a
            href={`tel:${siteConfig.charterSalesPhone}`}
            className="text-navy underline underline-offset-4"
          >
            Call Charter Sales
          </a>{" "}
          or email{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-navy underline underline-offset-4"
          >
            {siteConfig.contactEmail}
          </a>
        </p>
      </form>

      {/* Fills the exact height of the form card on desktop */}
      <div className="relative mx-auto w-full max-w-xl lg:h-full">
        <img
          src="/contact/office.jpg"
          alt="The CRAFT conference room"
          className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)] lg:absolute lg:inset-0 lg:h-full"
        />
      </div>
    </div>
  );
}
