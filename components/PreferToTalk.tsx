const NATAN = {
  img: "/faces/natan.webp",
  name: "Natan Benchimol",
  role: "Brokerage Operation Lead",
  phone: "+13232159495",
  phoneDisplay: "+1 (323) 215-9495",
  email: "nbenchimol@flycraft.com",
};

/**
 * Programme enquiries route to a named person rather than a form. Sits at
 * the foot of /programs and each individual programme page.
 */
export default function PreferToTalk() {
  return (
    <section className="px-6 pb-24 sm:px-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 rounded-3xl glass p-10 text-center sm:flex-row sm:gap-10 sm:p-12 sm:text-left">
        <img
          src={NATAN.img}
          alt={NATAN.name}
          className="h-28 w-28 shrink-0 rounded-full object-cover shadow-[0_16px_44px_rgba(12,29,61,0.2)]"
        />

        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="mb-2 text-[11px] font-normal tracking-[0.35em] text-ink-3 uppercase">
            Prefer to Talk?
          </p>
          <p className="text-[20px] font-light text-navy">{NATAN.name}</p>
          <p className="text-[10px] font-medium tracking-[0.22em] text-ink-3 uppercase">
            {NATAN.role}
          </p>

          <div className="mt-5 flex flex-col items-center gap-2 sm:items-start">
            <a
              href={`tel:${NATAN.phone}`}
              className="text-[14px] font-light text-navy transition-opacity hover:opacity-60"
            >
              {NATAN.phoneDisplay}
            </a>
            <a
              href={`mailto:${NATAN.email}`}
              className="text-[14px] font-light text-navy transition-opacity hover:opacity-60"
            >
              {NATAN.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
