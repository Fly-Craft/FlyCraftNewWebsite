const line = "#0c1d3d";

const FEATURES = ["Flat Floor", "Stand Up Cabin", "Widest of Its Class"];

export default function CabinByNumbers() {
  return (
    <div className="flex flex-col items-center gap-8 py-2 sm:flex-row sm:justify-center sm:gap-14">
      <svg
        viewBox="0 0 260 230"
        className="h-52 w-auto shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke={line} strokeOpacity="0.55" strokeWidth="1.2">
          <line x1="32" y1="20" x2="228" y2="20" />
          <path d="M32 20l7 -5M32 20l7 5" />
          <path d="M228 20l-7 -5M228 20l-7 5" />
        </g>
        <text
          x="130"
          y="14"
          textAnchor="middle"
          fontSize="11"
          fill={line}
          fillOpacity="0.6"
        >
          7.2 ft
        </text>

        <g stroke={line} strokeOpacity="0.55" strokeWidth="1.2">
          <line x1="16" y1="40" x2="16" y2="216" />
          <path d="M16 40l-5 7M16 40l5 7" />
          <path d="M16 216l-5 -7M16 216l5 -7" />
        </g>
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontSize="11"
          fill={line}
          fillOpacity="0.6"
          transform="translate(9 128) rotate(-90)"
        >
          6.0 ft
        </text>

        <image
          href="/assets/CABINDIMENSIONS.png"
          x="32"
          y="30"
          width="196"
          height="196"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>

      <ul className="space-y-4 text-center sm:text-left">
        {FEATURES.map((f) => (
          <li key={f} className="text-[15px] font-light text-ink-2">
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
