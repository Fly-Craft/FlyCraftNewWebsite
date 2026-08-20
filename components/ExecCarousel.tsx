/**
 * Display order: Izzy centered, Natan and Roy flanking him, Tania and
 * Shaked on the far ends.
 *
 * Every claim here is either supplied by CRAFT or carried over from the
 * bios these replaced. The one exception is the founder's flying history,
 * which is on the public record: the January 2018 engine failure and
 * freeway landing were covered by NPR, KTLA, CBS, USC Today and AOPA, and
 * the certificates, hours and Wings of Rescue missions come from AOPA's
 * interview with him days afterwards. Nothing here is inferred. If a
 * detail can't be sourced to CRAFT or to print, it doesn't go in.
 */
const EXECS = [
  {
    img: "/faces/tania.webp",
    mobileOrder: "max-lg:order-4",
    name: "Tania Ureta",
    role: "Accounting & Finance Lead",
    bio: "Tania is a CPA who came to CRAFT from Univision and Big Language Solutions, and she leads finance and accounting across the company, from charter billing through the reporting a growing fleet runs on. CRAFT's newer programs are financial products as much as flying ones, which means the numbers underneath them have to be exact.",
  },
  {
    /* Filename carries a hash of the image, so a browser holding the
       old portrait can't keep serving it after the swap. */
    img: "/faces/natan-e3d3ae55.webp",
    mobileOrder: "max-lg:order-2",
    name: "Natan Benchimol",
    role: "Executive Vice President",
    bio: "Natan trained as an engineer at USC and began his career at Raytheon, in a discipline where tolerances aren't negotiable. He has helped run CRAFT since its earliest days and now works across strategic planning and partnerships while staying close to the day-to-day. He also leads CRAFT's programs: Corporate, Jet Card, and the structures behind how clients fly with us. Outside of work: new cities, good coffee, the gym, and family.",
  },
  {
    img: "/faces/izzy.webp",
    mobileOrder: "max-lg:order-1",
    name: "Israel Slodowitz",
    role: "Founder & CEO",
    bio: "Izzy soloed at sixteen and held commercial and airline transport certificates by twenty-three, with close to 2,000 hours behind him and a stretch flying rescue missions for Wings of Rescue. In January 2018 the engine of the Bonanza he was flying quit at 5,500 feet over the Pacific. After eight failed restarts he glided it down onto the 55 Freeway in Costa Mesa, passed under an overpass, dropped the gear at the last second, and stopped without touching a car. He has since described it as the night that settled what he wanted to build. A former IDF combat soldier and USC Marshall graduate, he started CRAFT in 2020.",
  },
  {
    img: "/faces/roy.webp",
    mobileOrder: "max-lg:order-3",
    name: "Roy Naor",
    role: "Flight Operation Lead",
    bio: "Roy runs flight operations across the fleet, which covers crews, scheduling, and dispatch. Every CRAFT trip is flown under Part 135, including owner trips where the rules would permit less, and Roy is the one holding that line day to day. When weather, duty limits, or a short runway make a trip harder than it looked on paper, his desk is where the call gets made.",
  },
  {
    img: "/faces/shaked.webp",
    mobileOrder: "max-lg:order-5",
    name: "Shaked Rogovsky",
    role: "Client Services Lead",
    bio: "Shaked came to CRAFT from the Israeli Air Force and Israel's Ministry of Defense, where moving people on time carried a different kind of weight. He leads client services, the team that owns a trip from the first quote through touchdown. CRAFT sells direct, with no broker sitting in the middle, so the person who picks up is the person who can change the plan.",
  },
];

/** Static exec grid. Hover or focus an executive to reveal their bio. */
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

          {/* Wider than the column it hangs under: these bios run a few
              hundred characters, and at the old 256px they came out as a
              tall narrow ribbon. The extra width keeps the line length
              readable and the card roughly square. */}
          <div className="pointer-events-none absolute top-full left-1/2 z-20 w-72 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:w-80">
            <div className="rounded-2xl glass p-4 text-left">
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
