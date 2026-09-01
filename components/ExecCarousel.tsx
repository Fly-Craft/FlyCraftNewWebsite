/**
 * Display order: Izzy centered, Natan and Roy flanking him, Tania and
 * Shaked on the far ends.
 *
 * Photograph, name and title only. The bios that used to appear on hover
 * were removed at CRAFT's request; they're in the git history if they're
 * ever wanted back.
 */
const EXECS = [
  {
    img: "/faces/tania.webp",
    mobileOrder: "max-lg:order-4",
    name: "Tania Ureta",
    role: "Accounting & Finance Lead",
  },
  {
    /* Filename carries a hash of the image, so a browser holding the
       old portrait can't keep serving it after the swap. */
    img: "/faces/natan-73089793.webp",
    mobileOrder: "max-lg:order-2",
    name: "Natan Benchimol",
    role: "Executive Vice President",
  },
  {
    img: "/faces/izzy-f90aa409.webp",
    mobileOrder: "max-lg:order-1",
    name: "Israel Slodowitz",
    role: "Founder & CEO",
  },
  {
    img: "/faces/roy.webp",
    mobileOrder: "max-lg:order-3",
    name: "Roy Naor",
    role: "Flight Operation Lead",
  },
  {
    img: "/faces/shaked-ebc45b79.webp",
    mobileOrder: "max-lg:order-5",
    name: "Shaked Rogovsky",
    role: "Client Services Lead",
  },
];

/**
 * Static exec grid. Nothing here is interactive now that the bios are gone,
 * so the cards no longer carry a tabIndex — a plain photograph and caption
 * has no business taking a stop in the keyboard tab order.
 */
export default function ExecCarousel() {
  return (
    <div className="flex flex-wrap justify-center gap-x-10 gap-y-12 px-6 sm:px-20 lg:flex-nowrap lg:gap-x-6 xl:gap-x-10">
      {EXECS.map((exec) => (
        <div
          key={exec.name}
          className={`w-[220px] flex-shrink-0 sm:w-[260px] lg:min-w-0 lg:max-w-[260px] lg:flex-1 ${exec.mobileOrder}`}
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
        </div>
      ))}
    </div>
  );
}
