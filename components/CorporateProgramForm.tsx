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

export default function CorporateProgramForm() {
  const [company, setCompany] = useState("");
  const [airport, setAirport] = useState<Airport | null>(null);
  const [hoursPerYear, setHoursPerYear] = useState("");
  const [longestTrip, setLongestTrip] = useState("");
  const [frequentTrips, setFrequentTrips] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit =
    company.trim() !== "" &&
    name.trim() !== "" &&
    (email.trim() !== "" || phone.trim() !== "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/corporate-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          mainAirport: airport ? airportLabel(airport) : "",
          hoursPerYear: hoursPerYear.trim(),
          longestTrip: longestTrip.trim(),
          frequentTrips: frequentTrips.trim(),
          name: name.trim(),
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
        <div className="flex max-w-xl flex-col items-center justify-center gap-5 rounded-3xl glass px-8 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[20px] text-white">
            ✓
          </span>
          <p className="text-[22px] font-light text-navy">Request received.</p>
          <p className="max-w-sm text-[14px] font-light leading-relaxed text-ink-2">
            Our team will reach out shortly to start building your program. For
            anything urgent, call{" "}
            <a
              href={`tel:${siteConfig.charterSalesPhone}`}
              className="whitespace-nowrap text-navy underline underline-offset-4"
            >
              {siteConfig.charterSalesPhoneDisplay}
            </a>
            .
          </p>
        </div>

        {/* The company's card — name embossed in the bottom-right corner */}
        <div className="relative mx-auto w-full max-w-xl self-center">
          <img
            src="/programs/jetcard.png"
            alt="Your CRAFT corporate card"
            className="w-full rounded-3xl shadow-[0_24px_80px_rgba(12,29,61,0.28)]"
          />
          <span className="absolute right-[7%] bottom-[10%] text-[clamp(13px,1.8vw,24px)] font-medium tracking-[0.28em] text-[#c9ccd6] uppercase">
            {company}
          </span>
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
      <div>
        <label className={microLabel}>Company Name</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputCls}
        />
      </div>

      <AirportSearch
        label={
          <>
            Main Airport <span className="normal-case">(optional)</span>
          </>
        }
        placeholder="City or airport code (OPF, KTEB…)"
        value={airport}
        onChange={setAirport}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className={microLabel}>
            Hours Per Year <span className="normal-case">(optional)</span>
          </label>
          <input
            type="number"
            min="1"
            value={hoursPerYear}
            onChange={(e) => setHoursPerYear(e.target.value)}
            placeholder="e.g. 100"
            className={inputCls}
          />
        </div>
        <div>
          <label className={microLabel}>
            Longest Trip You Need <span className="normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={longestTrip}
            onChange={(e) => setLongestTrip(e.target.value)}
            placeholder="e.g. Miami → Los Angeles"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={microLabel}>
          Frequent Trips <span className="normal-case">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={frequentTrips}
          onChange={(e) => setFrequentTrips(e.target.value)}
          placeholder="Routes your team flies often — e.g. OPF → TEB weekly, TEB → ASE in winter…"
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="border-t border-border pt-6">
        <div className="mb-6">
          <label className={microLabel}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
        </div>
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
          Name plus an email or phone number is all we need.
        </p>
      </div>

      <button
        type="submit"
        disabled={!canSubmit || status === "sending"}
        className="mt-2 glass-selected rounded-full px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-white uppercase transition-opacity hover:opacity-85 disabled:opacity-40"
      >
        {status === "sending" ? "Sending…" : "Request a Program"}
      </button>

      {status === "error" && (
        <p className="text-[13px] text-red-600">
          Something went wrong — please try again.
        </p>
      )}
    </form>

    {/* Fills the exact height of the form card on desktop */}
    <div className="relative mx-auto w-full max-w-xl lg:h-full">
      <img
        src="/programs/corporate2.png"
        alt="Two executives boarding a CRAFT Challenger with their luggage"
        className="w-full rounded-3xl object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)] lg:absolute lg:inset-0 lg:h-full"
      />
    </div>
    </div>
  );
}
