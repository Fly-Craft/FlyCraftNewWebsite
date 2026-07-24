// Display order: Izzy centered, Natan and Roy flanking him, Tania and
// Shaked on the far ends.
const EXECS = [
  {
    img: "/faces/tania.webp",
    mobileOrder: "max-lg:order-4",
    name: "Tania Ureta",
    role: "Accounting & Finance Lead",
    bio: "A CPA with a background at Univision and Big Language Solutions, Tania has led CRAFT's finance and accounting for the past three years — from charter billing to the reporting that keeps a growing fleet on the books.",
  },
  {
    img: "/faces/natan.webp",
    mobileOrder: "max-lg:order-2",
    name: "Natan Benchimol",
    role: "Brokerage Operation Lead",
    bio: "A USC-trained engineer who began his career at Raytheon, Natan has helped run CRAFT since its earliest days. Today he leads the brokerage operation, managing wholesale charter with the industry's leading operators and brokers.",
  },
  {
    img: "/faces/izzy.webp",
    mobileOrder: "max-lg:order-1",
    name: "Israel Slodowitz",
    role: "Founder & CEO",
    bio: "A former IDF combat soldier and USC Marshall graduate, Izzy founded CRAFT in 2020 and built it into an all-Challenger operator trusted by the industry's biggest names — flying everyone from heads of state to touring artists.",
  },
  {
    img: "/faces/roy.webp",
    mobileOrder: "max-lg:order-3",
    name: "Roy Naor",
    role: "Flight Operation Lead",
    bio: "Roy leads flight operations across the fleet — crews, scheduling, and dispatch — upholding the day-to-day standards that keep every CRAFT flight safe, on time, and flown to spec.",
  },
  {
    img: "/faces/shaked.webp",
    mobileOrder: "max-lg:order-5",
    name: "Shaked Rogovsky",
    role: "Client Services Lead",
    bio: "Shaked came to CRAFT from Israel's Ministry of Defense and the Israeli Air Force, bringing a service mindset forged under pressure. He leads client services — the team that owns every trip from first quote to touchdown.",
  },
];

/** Static exec grid — hover an executive to reveal a short bio below them. */
export default function ExecCarousel() {
  return (
    <div className="flex flex-wrap justify-center gap-x-10 gap-y-12 px-6 sm:px-20 lg:flex-nowrap lg:gap-x-6 xl:gap-x-10">
      {EXECS.map((exec) => (
        <div
          key={exec.name}
          tabIndex={0}
          className={`group relative w-[220px] flex-shrink-0 outline-none sm:w-[260px] lg:min-w-0 lg:max-w-[260px] lg:flex-1 ${exec.mobileOrder}`}
        >
          <div className="flex flex-col items-center gap-5">
            <img
              src={exec.img}
              alt={exec.name}
              className="h-40 w-40 rounded-full border border-navy/10 object-cover shadow-[0_16px_48px_rgba(12,29,61,0.18)] sm:h-44 sm:w-44 lg:h-36 lg:w-36 xl:h-44 xl:w-44"
            />
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-[15px] font-medium text-navy">
                {exec.name}
              </span>
              <span className="text-[10px] tracking-[0.2em] text-ink-3 uppercase">
                {exec.role}
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute top-full left-1/2 z-20 w-64 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
            <div className="rounded-2xl border border-navy/10 bg-white/95 p-4 text-left shadow-[0_16px_48px_rgba(12,29,61,0.14)] backdrop-blur">
              <p className="text-[12px] leading-relaxed font-light text-ink-2">
                {exec.bio || "Bio coming soon."}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
