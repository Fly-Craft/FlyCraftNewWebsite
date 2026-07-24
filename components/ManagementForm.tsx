"use client";

import { useState } from "react";
import AirportSearch from "@/components/charter/AirportSearch";
import type { Airport } from "@/lib/airports-data";
import { airportLabel } from "@/lib/airport-search";
import { siteConfig } from "@/lib/site-config";

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3.5 text-[14px] text-navy outline-none transition-colors focus:border-navy/40 placeholder:text-ink-3/70";
const microLabel =
  "mb-2 block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase";

const OWNERSHIP = [
  "I own the aircraft",
  "Under contract to buy",
  "Exploring a purchase",
];

export default function ManagementForm() {
  const [name, setName] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [ownership, setOwnership] = useState("");
  const [baseAirport, setBaseAirport] = useState<Airport | null>(null);
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit =
    name.trim() !== "" && (email.trim() !== "" || phone.trim() !== "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/management-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          aircraft: aircraft.trim(),
          ownership,
          baseAirport: baseAirport ? airportLabel(baseAirport) : "",
          notes: notes.trim(),
          email: email.trim(),
          phone: phone.trim(),
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
        <div className="flex max-w-xl flex-col items-center justify-center gap-5 rounded-3xl border border-navy/10 bg-white px-8 py-20 text-center shadow-[0_24px_80px_rgba(12,29,61,0.1)]">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[20px] text-white">
            ✓
          </span>
          <p className="text-[22px] font-light text-navy">Inquiry received.</p>
          <p className="max-w-sm text-[14px] font-light leading-relaxed text-ink-2">
            Our management team will reach out shortly to talk through your
            aircraft and how CRAFT can operate it. For anything urgent, call{" "}
            <a
              href={`tel:${siteConfig.charterSalesPhone}`}
              className="whitespace-nowrap text-navy underline underline-offset-4"
            >
              {siteConfig.charterSalesPhoneDisplay}
            </a>
            .
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:h-full">
          <img
            src="/programs/management.jpg"
            alt="A CRAFT Challenger jet with its airstair down, mirrored in a rain puddle on the ramp"
            className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)] lg:absolute lg:inset-0 lg:h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 lg:gap-20">
      <form
        onSubmit={handleSubmit}
        className="flex max-w-xl flex-col gap-6 rounded-3xl border border-navy/10 bg-white/90 p-8 shadow-[0_24px_80px_rgba(12,29,61,0.1)] backdrop-blur sm:p-12"
      >
        <div>
          <label className={microLabel}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={microLabel}>
            Aircraft <span className="normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={aircraft}
            onChange={(e) => setAircraft(e.target.value)}
            placeholder="e.g. Challenger 350 — tail number if you have one"
            className={inputCls}
          />
        </div>

        <div>
          <label className={microLabel}>
            Where Are You In The Process?{" "}
            <span className="normal-case">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {OWNERSHIP.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={ownership === o}
                onClick={() => setOwnership(ownership === o ? "" : o)}
                className={`rounded-full border px-3.5 py-2 text-[11px] font-medium tracking-[0.08em] transition-colors ${
                  ownership === o
                    ? "border-navy bg-navy text-white"
                    : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <AirportSearch
          label={
            <>
              Home Base <span className="normal-case">(optional)</span>
            </>
          }
          placeholder="City or airport code (OPF, KTEB…)"
          value={baseAirport}
          onChange={setBaseAirport}
        />

        <div>
          <label className={microLabel}>
            Anything Else <span className="normal-case">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How much you expect to fly, current management arrangement, timing…"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="border-t border-border pt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={microLabel}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={microLabel}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <p className="mt-3 text-[11px] font-light text-ink-3">
            An email or phone number is all we need to reach you.
          </p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || status === "sending"}
          className="mt-2 rounded-full bg-navy px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-40"
        >
          {status === "sending" ? "Sending…" : "Send Inquiry"}
        </button>

        {status === "error" && (
          <p className="text-[13px] text-red-600">
            Something went wrong — please try again.
          </p>
        )}
      </form>

      <div className="relative mx-auto w-full max-w-xl lg:h-full">
        <img
          src="/programs/management.jpg"
          alt="A CRAFT Challenger jet with its airstair down, mirrored in a rain puddle on the ramp"
          className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)] lg:absolute lg:inset-0 lg:h-full"
        />
      </div>
    </div>
  );
}
