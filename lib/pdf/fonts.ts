import { Font } from "@react-pdf/renderer";
import path from "path";

const WEIGHTS = [100, 300, 400, 500, 600, 800] as const;

let registered = false;

/** Registers the site's Inter weights so PDFs share the website's type system. */
export function registerFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Inter",
    fonts: WEIGHTS.map((weight) => ({
      src: path.join(
        process.cwd(),
        "node_modules/@fontsource/inter/files",
        `inter-latin-${weight}-normal.woff`
      ),
      fontWeight: weight,
    })),
  });

  // react-pdf/Yoga hyphenates long uppercase labels by default, which reads
  // badly for tracked-out caption text — disable it globally for this doc.
  Font.registerHyphenationCallback((word) => [word]);
}
