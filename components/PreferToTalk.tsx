const NATAN = {
  img: "/faces/natan.webp",
  name: "Natan Benchimol",
  role: "Brokerage Operation Lead",
  phone: "+13232159495",
  phoneDisplay: "+1 (323) 215-9495",
  email: "nbenchimol@flycraft.com",
};

/**
 * Programme enquiries route to a named person rather than a form. Rides in
 * PageHero's `aside` slot on /programs and each programme page, so it sits
 * beside the title instead of waiting at the foot of the page.
 */
export default function PreferToTalk() {
  return (
    <div className="w-full rounded-3xl glass p-6 sm:w-[280px]">
      <p className="mb-5 text-[10px] font-normal tracking-[0.3em] text-ink-3 uppercase">
        Prefer to Talk?
      </p>

      <div className="flex items-center gap-4">
        <img
          src={NATAN.img}
          alt={NATAN.name}
          className="h-14 w-14 shrink-0 rounded-full object-cover shadow-[0_8px_24px_rgba(12,29,61,0.18)]"
        />
        <div className="min-w-0">
          <p className="text-[15px] font-light text-navy">{NATAN.name}</p>
          <p className="mt-0.5 text-[9px] font-medium tracking-[0.18em] text-ink-3 uppercase">
            {NATAN.role}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-border pt-4">
        <a
          href={`tel:${NATAN.phone}`}
          className="text-[13px] font-light text-navy transition-opacity hover:opacity-60"
        >
          {NATAN.phoneDisplay}
        </a>
        <a
          href={`mailto:${NATAN.email}`}
          className="text-[13px] font-light break-all text-navy transition-opacity hover:opacity-60"
        >
          {NATAN.email}
        </a>
      </div>
    </div>
  );
}
