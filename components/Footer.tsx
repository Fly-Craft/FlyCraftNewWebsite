import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

function InstagramIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 8.5H16.5V5.5H14.5C12.57 5.5 11 7.07 11 9V11H9V14H11V20.5H14V14H16L16.5 11H14V9C14 8.72 14.22 8.5 14.5 8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="9.5" width="3" height="10" fill="currentColor" />
      <circle cx="5.5" cy="6" r="1.7" fill="currentColor" />
      <path
        d="M10 9.5H13V11C13.6 10 14.7 9.3 16.2 9.3C18.8 9.3 20 11 20 13.8V19.5H17V14.2C17 12.7 16.4 11.9 15.2 11.9C13.9 11.9 13 12.8 13 14.4V19.5H10V9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="px-6 py-12 sm:px-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 text-center sm:grid-cols-3 sm:text-left">
        <div className="flex flex-col items-center gap-2.5 sm:items-start">
          <span className="text-[13px] font-semibold tracking-[0.32em] text-navy">
            CRAFT
          </span>
          <a
            href={`tel:${siteConfig.charterSalesPhone}`}
            className="text-[12px] font-light text-ink-2 transition-colors hover:text-navy"
          >
            {siteConfig.charterSalesPhoneDisplay}
          </a>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-[12px] font-light text-ink-2 transition-colors hover:text-navy"
          >
            {siteConfig.contactEmail}
          </a>
          <span className="text-[12px] font-light text-ink-2">
            {siteConfig.address}
          </span>
        </div>

        <div className="flex justify-center">
          <img
            src="/logo-mark.png"
            alt="CRAFT logo"
            className="h-14 w-14 object-contain opacity-80"
          />
        </div>

        <div className="flex items-center justify-center gap-6 sm:justify-end">
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CRAFT on Instagram"
            className="text-ink-2 transition-colors hover:text-navy"
          >
            <InstagramIcon />
          </a>
          <a
            href={siteConfig.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CRAFT on Facebook"
            className="text-ink-2 transition-colors hover:text-navy"
          >
            <FacebookIcon />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CRAFT on LinkedIn"
            className="text-ink-2 transition-colors hover:text-navy"
          >
            <LinkedInIcon />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl items-center justify-center gap-6">
        <Link
          href="/faq"
          className="text-[11px] font-medium tracking-[0.2em] text-ink-3 uppercase transition-colors hover:text-navy"
        >
          FAQ
        </Link>
        <Link
          href="/legal"
          className="text-[11px] font-medium tracking-[0.2em] text-ink-3 uppercase transition-colors hover:text-navy"
        >
          Legal
        </Link>
        <Link
          href="/reviews"
          className="text-[11px] font-medium tracking-[0.2em] text-ink-3 uppercase transition-colors hover:text-navy"
        >
          Reviews
        </Link>
        <Link
          href="/careers"
          className="text-[11px] font-medium tracking-[0.2em] text-ink-3 uppercase transition-colors hover:text-navy"
        >
          Careers
        </Link>
        <Link
          href="/contact"
          className="text-[11px] font-medium tracking-[0.2em] text-ink-3 uppercase transition-colors hover:text-navy"
        >
          Contact Us
        </Link>
      </div>

      <div className="mx-auto mt-4 max-w-6xl text-center text-[11px] font-light tracking-[0.06em] text-ink-3">
        &copy; {new Date().getFullYear()} CRAFT. All rights reserved.
      </div>
    </footer>
  );
}
