/**
 * Display order: Izzy centered, Natan and Roy flanking him, Tania and
 * Shaked on the far ends.
 *
 * All five follow the same shape: where they came from, what they do here,
 * what they're accountable for, and then anything personal they chose to
 * share. Only Natan has that last line so far.
 *
 * Every claim is either supplied by CRAFT or carried over from the bios
 * these replaced. The founder's flying age and certificate come from
 * AOPA's 2018 interview with him; the rest of that flying history, and
 * the freeway landing it's known for, came out on request, since the
 * company he built is the point of the entry rather than the hours.
 *
 * Neither Roy's service nor Shaked's names a country, at CRAFT's request.
 */
const EXECS = [
  {
    img: "/faces/tania.webp",
    mobileOrder: "max-lg:order-4",
    name: "Tania Ureta",
    role: "Accounting & Finance Lead",
    bio: "Tania qualified as a CPA and came to CRAFT from Univision and Big Language Solutions, where she worked on the finances of businesses that answer to a lot of people. She leads finance and accounting across the company, running from charter billing through to the reporting a growing fleet depends on. CRAFT's newer programs are financial products as much as flying ones, which means the numbers underneath them have to be exact.",
  },
  {
    /* Filename carries a hash of the image, so a browser holding the
       old portrait can't keep serving it after the swap. */
    img: "/faces/natan-3778c4e4.webp",
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
    bio: "Izzy has flown since he was a teenager and held an airline transport certificate by twenty-three. A former IDF combat soldier and USC Marshall graduate, he founded CRAFT in 2020 and grew it from a single Challenger 300 into an all-Challenger fleet trusted by some of the biggest names in the industry. He leads the company as CEO, setting the standard the fleet is held to and the direction it grows in.",
  },
  {
    img: "/faces/roy.webp",
    mobileOrder: "max-lg:order-3",
    name: "Roy Naor",
    role: "Flight Operation Lead",
    bio: "Roy flew for the Air Force as both a pilot and a commander, then flew the line at El Al, so he has spent his career in the cockpit and responsible for the people in it. He runs flight operations across the CRAFT fleet, which covers crews, scheduling, and dispatch. Every trip is flown under Part 135, including owner trips where the rules would permit less, and Roy is the one holding that line day to day. When weather, duty limits, or a short runway make a trip harder than it looked on paper, his desk is where the call gets made.",
  },
  {
    img: "/faces/shaked.webp",
    mobileOrder: "max-lg:order-5",
    name: "Shaked Rogovsky",
    role: "Client Services Lead",
    bio: "Shaked came to CRAFT from the Air Force and the Ministry of Defense, where moving people on time carried a different kind of weight. He leads client services, the team that owns a trip from the first quote through touchdown. CRAFT sells direct, with no broker sitting in the middle, so the person who picks up is the person who can change the plan.",
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
