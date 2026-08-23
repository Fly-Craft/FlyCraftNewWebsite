"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig, exploreLinks } from "@/lib/site-config";
import type { Program, ProgramSlug } from "@/lib/programs";

/* Split so the dialog can run tighter than the full-page layout. The whole
   form has to clear the viewport there without scrolling, and the fields
   are the only place left to find the room. */
const inputBase =
  "w-full rounded-xl border border-border bg-white px-4 text-[14px] text-navy outline-none transition-colors focus:border-navy/40 placeholder:text-ink-3/70";
const labelBase =
  "block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase";

/**
 * The programme enquiry form. Deliberately separate from the site-wide
 * ContactForm: this one is reached only from a programme card, it carries
 * the programme it came from, and it routes to its own inbox — so the two
 * are free to diverge as each programme grows its own questions.
 *
 * `program` arrives already resolved against lib/programs on the server;
 * this component never sees the raw query string.
 */
export default function ProgramEnquiryForm({
  program,
  programLabel,
  image,
  fields,
  variant = "page",
  onDone,
  titleId,
}: {
  program: ProgramSlug;
  programLabel: string;
  /** Set `image` on the programme in lib/programs.ts to fill the slot. */
  image?: { src: string; alt: string };
  /** Extra questions for this programme — see lib/programs.ts. */
  fields?: Program["fields"];
  /**
   * "modal" is how this ships today: the dialog opened from a programme
   * card, showing the form on its own, with the dialog supplying the
   * surface and padding. "page" keeps the standalone layout (form left,
   * picture right) for whenever a programme wants its own route again.
   */
  variant?: "page" | "modal";
  /** Modal only: dismiss the dialog from the confirmation screen. */
  onDone?: () => void;
  /** Modal only: ties the programme label to the dialog's accessible name. */
  titleId?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [hours, setHours] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  const wantsCompany = fields?.company === true;
  const hoursField = fields?.hoursPerYear;
  const hoursMin = hoursField?.min;

  // Name is required; email OR phone is required; the message is optional.
  const hasName = name.trim() !== "";
  const hasReach = email.trim() !== "" || phone.trim() !== "";
  const hasCompany = !wantsCompany || company.trim() !== "";

  /* Hours are optional, but a programme with an entry point can't accept a
     number below it. Blank stays valid; a number under the floor doesn't. */
  const hoursNum = hours.trim() === "" ? null : Number(hours);
  const hoursInvalid =
    hoursNum !== null &&
    (!Number.isFinite(hoursNum) ||
      hoursNum <= 0 ||
      (hoursMin !== undefined && hoursNum < hoursMin));

  const canSubmit = hasName && hasReach && hasCompany && !hoursInvalid;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/program-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          ...(wantsCompany ? { company: company.trim() } : {}),
          ...(hoursField && hoursNum !== null
            ? { hoursPerYear: hoursNum }
            : {}),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const isModal = variant === "modal";
  const inputCls = `${inputBase} ${isModal ? "py-2.5" : "py-3.5"}`;
  const microLabel = `${isModal ? "mb-1.5" : "mb-2"} ${labelBase}`;
  const fieldGap = isModal ? "gap-3.5 sm:gap-4" : "gap-6";

  if (status === "sent") {
    return (
      <div
        className={
          isModal
            ? "flex flex-col items-center text-center"
            : "mx-auto flex max-w-3xl flex-col items-center rounded-3xl glass px-8 py-20 text-center sm:px-16"
        }
        role="status"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-[22px] text-white">
          ✓
        </span>
        <p className="mt-8 text-[26px] font-light text-navy">
          We&apos;ve received your form.
        </p>
        <p className="mt-5 max-w-lg text-[15px] font-light leading-loose text-ink-2">
          Someone from the {programLabel} team will reach back within the next
          24 hours
          {email.trim() ? (
            <>
              . A confirmation is on its way to{" "}
              <span className="break-words text-navy">{email.trim()}</span>
            </>
          ) : null}
          . For anything urgent, call{" "}
          <a
            href={`tel:${siteConfig.charterSalesPhone}`}
            className="whitespace-nowrap text-navy underline underline-offset-4"
          >
            {siteConfig.charterSalesPhoneDisplay}
          </a>
          .
        </p>

        {/* Same block as the charter confirmation — one definition in
            site-config feeds this, that screen, and the email. */}
        <div
          className={`w-full border-t border-border ${
            isModal ? "mt-10 pt-8" : "mt-14 pt-10"
          }`}
        >
          <p className="text-[10px] font-medium tracking-[0.3em] text-ink-3 uppercase">
            In the meantime
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {exploreLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="glass-capsule glass-btn rounded-full px-6 py-3.5 text-[10px] font-medium tracking-[0.2em] text-navy uppercase"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* In the dialog you're already on /programs, so the way out is
              to close it rather than navigate back to where you are. */}
          {isModal ? (
            <button
              type="button"
              onClick={onDone}
              className="mt-8 text-[12px] font-light text-navy underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Close
            </button>
          ) : (
            <Link
              href="/programs"
              className="mt-8 inline-block text-[12px] font-light text-navy underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Back to Programs
            </Link>
          )}
        </div>
      </div>
    );
  }

  const companyField = (
    <div>
      <label htmlFor="pe-company" className={microLabel}>
        Company <span className="text-ink-3/60">(required)</span>
      </label>
      <input
        id="pe-company"
        name="company"
        type="text"
        autoComplete="organization"
        required
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className={inputCls}
      />
    </div>
  );

  const nameField = (
    <div>
      <label htmlFor="pe-name" className={microLabel}>
        Name <span className="text-ink-3/60">(required)</span>
      </label>
      <input
        id="pe-name"
        name="name"
        type="text"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputCls}
      />
    </div>
  );

  const form = (
    <form
      onSubmit={handleSubmit}
      className={
        isModal
          ? "flex w-full flex-col gap-3.5 sm:gap-4"
          : "flex w-full max-w-xl flex-col gap-6 rounded-3xl glass p-8 sm:p-12"
      }
    >
      {/* Quiet label rather than a heading — the page title already says
          what this is; this just anchors the form to its programme. In the
          dialog it doubles as the accessible name, and it centres, since
          there's no page title above it to align to.
          The right padding offsets the trailing letter-space so the ink
          centres rather than the box. */}
      <p
        id={titleId}
        className={`text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase ${
          isModal ? "pr-[0.35em] text-center" : ""
        }`}
      >
        {programLabel}
      </p>

      {/* Company leads on the programmes that ask for it — the enquiry is
            from the business first and the person second. It shares a row
            with the name on wide screens rather than taking one of its own,
            which is what pushed the Corporate form past the fold. */}
      {wantsCompany ? (
        <div className={`grid grid-cols-1 ${fieldGap} sm:grid-cols-2`}>
          {companyField}
          {nameField}
        </div>
      ) : (
        nameField
      )}

      <div className={`grid grid-cols-1 ${fieldGap} sm:grid-cols-2`}>
        <div>
          {/* Either one reaches you, so the labels say so. This used to be
              a line of its own under the pair; the dialog can't spare it. */}
          <label htmlFor="pe-email" className={microLabel}>
            Email <span className="text-ink-3/60">(or phone)</span>
          </label>
          <input
            id="pe-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="pe-phone" className={microLabel}>
            Phone <span className="text-ink-3/60">(or email)</span>
          </label>
          <input
            id="pe-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {hoursField && (
        <div>
          {/* The entry point sits in the label and the reassurance sits in
              the placeholder, so the normal case costs no extra line. The
              paragraph below is now only there to carry an error. */}
          <label htmlFor="pe-hours" className={microLabel}>
            Hours per year{" "}
            <span className="text-ink-3/60">
              {hoursMin !== undefined
                ? `(optional · from ${hoursMin})`
                : "(optional)"}
            </span>
          </label>
          <input
            id="pe-hours"
            name="hoursPerYear"
            type="number"
            inputMode="numeric"
            min={hoursMin ?? 1}
            step={1}
            aria-describedby={hoursInvalid ? "pe-hours-help" : undefined}
            aria-invalid={hoursInvalid || undefined}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Leave blank if you're not sure"
            className={`${inputCls} ${hoursInvalid ? "border-red-400" : ""}`}
          />
          {hoursInvalid && (
            <p
              id="pe-hours-help"
              className="mt-2 text-[11px] font-light text-red-600"
            >
              {hoursMin !== undefined
                ? `The program starts at ${hoursMin} hours a year.`
                : "Enter a number of hours, or leave it blank."}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="pe-message" className={microLabel}>
          Anything else <span className="text-ink-3/60">(optional)</span>
        </label>
        <textarea
          id="pe-message"
          name="message"
          rows={isModal ? 3 : 5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you're looking for."
          className={`${inputCls} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={!canSubmit || status === "sending"}
        className="mt-2 glass-selected rounded-full px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-40"
      >
        {status === "sending" ? "Sending\u2026" : "Send"}
      </button>

      <p className="text-[11px] font-light leading-relaxed text-ink-3">
        By sending this you agree we may contact you about your request.
        See our{" "}
        <Link href="/legal#privacy" className="text-navy underline underline-offset-4">
        privacy policy
        </Link>
        .
      </p>

      {status === "error" && (
        <p className="text-[13px] text-red-600">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );

  // The dialog shows the form on its own — no picture column to balance.
  if (isModal) return form;

  return (
    /* Form left, picture right. The image column is deliberately rendered
       even when there's no image yet, so the form keeps its half of the
       page and the layout doesn't shift once one is added. */
    <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
      {form}

      {/* Picture slot. Matches the form's height on desktop so the two
          columns read as a pair; empty until a programme gets an image. */}
      <div className="relative mx-auto w-full max-w-xl lg:h-full">
        {image ? (
          <img
            src={image.src}
            alt={image.alt}
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)] lg:absolute lg:inset-0 lg:h-full"
          />
        ) : (
          <div
            aria-hidden
            className="hidden rounded-3xl border border-dashed border-border/80 lg:absolute lg:inset-0 lg:block"
          />
        )}
      </div>
    </div>
  );
}
