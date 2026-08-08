/**
 * The two people who handle same-day trips. Shared by /asap and the ASAP
 * tab on /charter, so their numbers live in exactly one place.
 */
const TEAM = [
  {
    img: "/asap/shaked2.png",
    name: "Shaked Rogovsky",
    role: "Client Services Lead",
    phone: "+13239742649",
    phoneDisplay: "+1 (323) 974-2649",
    email: "shaked@flycraft.com",
  },
  {
    img: "/asap/paul2.png",
    name: "Paul Castillo",
    role: "Sales Manager",
    phone: "+13235425305",
    phoneDisplay: "+1 (323) 542-5305",
    email: "pcastillo@flycraft.com",
  },
];

export default function AsapTeam() {
  return (
    <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 sm:gap-12">
      {TEAM.map((person) => (
        <div
          key={person.name}
          className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center"
        >
          <img
            src={person.img}
            alt={person.name}
            className="aspect-[4/5] w-full max-w-[280px] rounded-3xl border border-navy/10 object-cover shadow-[0_24px_80px_rgba(12,29,61,0.18)]"
          />

          <div className="flex flex-col items-center gap-1">
            <span className="text-[20px] font-medium text-navy">
              {person.name}
            </span>
            <span className="text-[11px] tracking-[0.25em] text-ink-3 uppercase">
              {person.role}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <a
              href={`tel:${person.phone}`}
              className="text-[14px] font-medium tracking-[0.05em] text-navy hover:opacity-70"
            >
              {person.phoneDisplay}
            </a>
            <a
              href={`mailto:${person.email}`}
              className="text-[13px] tracking-[0.05em] text-ink-2 hover:text-navy"
            >
              {person.email}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
