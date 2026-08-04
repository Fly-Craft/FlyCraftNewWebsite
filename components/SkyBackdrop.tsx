/**
 * The landing screen's sky, as a static backdrop for pages that want it —
 * same gradient and cloud art as the hero, minus the scroll choreography.
 * Purely decorative: sits behind everything and never takes pointer events.
 */

type Cloud = {
  src: number;
  left: number; // vw
  top: number; // vh
  w: number; // vw
  op: number;
  flip?: boolean;
  dur: number; // idle drift seconds
  delay?: number;
};

// Spread wide and kept clear of the centre, where the orbit sits.
const CLOUDS: Cloud[] = [
  { src: 2, left: -4, top: 14, w: 22, op: 0.85, dur: 26 },
  { src: 8, left: 74, top: 10, w: 18, op: 0.75, flip: true, dur: 30, delay: -8 },
  { src: 1, left: 8, top: 52, w: 26, op: 0.95, dur: 22, delay: -5 },
  { src: 3, left: 68, top: 46, w: 28, op: 0.92, dur: 25, delay: -12 },
  { src: 5, left: -8, top: 74, w: 24, op: 0.9, dur: 21, delay: -3 },
  { src: 7, left: 78, top: 72, w: 26, op: 0.88, flip: true, dur: 19, delay: -9 },
  { src: 4, left: 34, top: 82, w: 30, op: 0.8, dur: 20, delay: -14 },
];

export default function SkyBackdrop() {
  return (
    <div className="sky-backdrop" aria-hidden="true">
      <div className="sky-backdrop-wash" />
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className={`sky-backdrop-cloud${i % 2 ? " sky-backdrop-cloud--alt" : ""}`}
          style={{
            left: `${c.left}vw`,
            top: `${c.top}vh`,
            width: `${c.w}vw`,
            opacity: c.op,
          }}
        >
          <div
            className={`hf-cloud-drift${c.flip ? " hf-cloud-flip" : ""}`}
            style={
              {
                "--drift-dur": `${c.dur}s`,
                "--drift-delay": `${c.delay ?? 0}s`,
                "--drift-x": `${i % 2 ? -18 : 18}px`,
                "--drift-y": `${i % 2 ? 9 : -9}px`,
              } as React.CSSProperties
            }
          >
            <img src={`/clouds/${c.src}.webp`} alt="" loading="lazy" />
          </div>
        </div>
      ))}
    </div>
  );
}
