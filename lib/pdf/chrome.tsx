import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import path from "path";
import { siteConfig } from "@/lib/site-config";

/**
 * The parts every CRAFT PDF shares: the palette, the masthead, the footer,
 * and the card and label primitives the body is built from.
 *
 * Extracted from CharterRequestPdf, which was the only PDF for a while. The
 * enquiry PDFs have to look like they came from the same company, and the
 * surest way to guarantee that is for them to be drawn by the same code
 * rather than by a second copy of the same numbers.
 */

export const LOGO_MARK_PATH = path.join(process.cwd(), "public/logo-mark.png");

export const NAVY = "#0c1d3d";
export const INK_2 = "rgba(12,29,61,0.62)";
export const INK_3 = "rgba(12,29,61,0.42)";
/* Solid hex, not rgba — react-pdf's Yoga border-color resolver doesn't parse
   alpha colors and silently falls back to a bright red border when it fails. */
export const BORDER = "#dde1eb";
export const ACCENT = "#85b5d8";
/** Darker tint of the accent blue so small tracked labels stay legible. */
export const ACCENT_DARK = "#4f7fa3";

export const page = {
  paddingTop: 48,
  paddingBottom: 62,
  paddingHorizontal: 48,
  fontFamily: "Inter",
  fontWeight: 400 as const,
  fontSize: 9.5,
  color: NAVY,
};

export const chrome = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 20,
    marginBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 14, height: 14, marginRight: 8 },
  brandText: { fontWeight: 600, fontSize: 14, letterSpacing: 3, color: NAVY },
  docLabel: {
    fontWeight: 500,
    fontSize: 8,
    letterSpacing: 2,
    color: INK_3,
    textAlign: "right",
    textTransform: "uppercase",
  },
  docMeta: {
    fontWeight: 400,
    fontSize: 8,
    color: INK_3,
    textAlign: "right",
    marginTop: 4,
  },

  eyebrow: {
    fontWeight: 500,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: INK_3,
    marginBottom: 10,
  },

  card: {
    width: "48.5%",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardFull: { width: "100%" },
  cardRightGap: { marginRight: "3%" },
  cardLabel: {
    fontWeight: 500,
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: INK_3,
    marginBottom: 10,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },

  bodyText: { fontWeight: 400, fontSize: 9.5, lineHeight: 1.6, color: NAVY },
  mutedText: { fontWeight: 400, fontSize: 9.5, lineHeight: 1.6, color: INK_2 },
  /* No italic Inter variant is registered — fontStyle: "italic" anywhere here
     would crash rendering, since react-pdf can't synthesise an oblique. */
  emptyText: { fontWeight: 400, fontSize: 9.5, color: INK_3 },

  fieldRow: { flexDirection: "row", justifyContent: "space-between" },
  fieldCol: { flexDirection: "column" },
  fieldLabel: {
    fontWeight: 500,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: INK_3,
    marginBottom: 4,
  },
  fieldValue: { fontWeight: 600, fontSize: 10, color: NAVY },

  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: 400,
    fontSize: 7.5,
    color: INK_3,
  },
});

/** Logo and wordmark left, document type and reference right. */
export function PdfHeader({
  label,
  reference,
  generatedAt,
}: {
  label: string;
  reference: string;
  generatedAt: string;
}) {
  return (
    <View style={chrome.headerRow}>
      <View style={chrome.brandRow}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not a DOM <img> */}
        <Image style={chrome.logo} src={LOGO_MARK_PATH} />
        <Text style={chrome.brandText}>CRAFT</Text>
      </View>
      <View>
        <Text style={chrome.docLabel}>{label}</Text>
        <Text style={chrome.docMeta}>{reference}</Text>
        <Text style={chrome.docMeta}>{generatedAt}</Text>
      </View>
    </View>
  );
}

/**
 * Fixed to the foot of every page. The address and numbers come from
 * site-config, so a change of phone number reaches the PDFs as well.
 */
export function PdfFooter() {
  return (
    <View style={chrome.footer} fixed>
      <Text>CRAFT · {siteConfig.address}</Text>
      <Text>
        {siteConfig.charterSalesPhoneDisplay} · {siteConfig.contactEmail}
      </Text>
    </View>
  );
}
