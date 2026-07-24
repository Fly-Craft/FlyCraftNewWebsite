import { Document, Page, View, Text, Image, Svg, Polygon, StyleSheet } from "@react-pdf/renderer";
import path from "path";
import { registerFonts } from "./fonts";
import type { CharterRequestPayload, LegPayload } from "@/lib/charter-request";

registerFonts();

const LOGO_MARK_PATH = path.join(process.cwd(), "public/logo-mark.png");

const NAVY = "#0c1d3d";
const INK_2 = "rgba(12,29,61,0.62)";
const INK_3 = "rgba(12,29,61,0.42)";
// Solid hex, not rgba — react-pdf's Yoga border-color resolver doesn't parse
// alpha colors and silently falls back to a bright red border when it fails.
const BORDER = "#dde1eb";
const ACCENT = "#85b5d8";
// Darker tint of the accent blue so small tracked labels stay legible on white.
const ACCENT_DARK = "#4f7fa3";

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 62,
    paddingHorizontal: 48,
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 9.5,
    color: NAVY,
  },

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
  brandText: {
    fontWeight: 600,
    fontSize: 14,
    letterSpacing: 3,
    color: NAVY,
  },
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

  tripLabel: {
    fontWeight: 500,
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: INK_3,
    marginBottom: 10,
  },

  legCard: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    padding: 22,
    marginBottom: 14,
  },
  legLabel: {
    fontWeight: 500,
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: ACCENT_DARK,
    marginBottom: 14,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  airportBlock: { flexDirection: "column", width: 195 },
  airportCaption: {
    fontWeight: 500,
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: INK_3,
    marginBottom: 6,
  },
  airportName: {
    fontWeight: 100,
    fontSize: 27,
    color: NAVY,
  },
  arrow: {
    marginHorizontal: 16,
  },
  routeMetaRow: {
    flexDirection: "row",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  metaItem: { flexDirection: "column", marginRight: 36 },
  metaLabel: {
    fontWeight: 500,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: INK_3,
  },
  metaValue: {
    fontWeight: 600,
    fontSize: 11,
    marginTop: 4,
    color: NAVY,
  },

  grid: { flexDirection: "row", flexWrap: "wrap" },
  card: {
    width: "48.5%",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardRightGap: { marginRight: "3%" },
  cardFull: { width: "100%" },
  cardLabel: {
    fontWeight: 500,
    fontSize: 7.5,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: INK_3,
    marginBottom: 10,
  },
  badgeRow: { flexDirection: "row", flexWrap: "wrap" },
  badge: {
    backgroundColor: NAVY,
    color: "#ffffff",
    fontWeight: 500,
    fontSize: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeMuted: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: BORDER,
    color: INK_2,
    fontWeight: 500,
    fontSize: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  bodyText: { fontWeight: 400, fontSize: 9.5, lineHeight: 1.6, color: NAVY },
  mutedText: { fontWeight: 400, fontSize: 9.5, lineHeight: 1.6, color: INK_2 },
  // No italic Inter variant is registered — fontStyle: "italic" here would
  // crash PDF rendering (react-pdf can't fall back to a synthetic oblique).
  emptyText: { fontWeight: 400, fontSize: 9.5, color: INK_3 },

  contactRow: { flexDirection: "row", justifyContent: "space-between" },
  contactCol: { flexDirection: "column" },
  contactLabel: {
    fontWeight: 500,
    fontSize: 7,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: INK_3,
    marginBottom: 4,
  },
  contactValue: { fontWeight: 600, fontSize: 10, color: NAVY },

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
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
  },
});

function Badge({ children, muted }: { children: string; muted?: boolean }) {
  return <Text style={muted ? styles.badgeMuted : styles.badge}>{children}</Text>;
}

function Leg({ leg, index, total }: { leg: LegPayload; index: number; total: number }) {
  const fromCode = leg.from.split(" ")[0] ?? leg.from;
  const toCode = leg.to.split(" ")[0] ?? leg.to;
  const fromCity = leg.from.split("—")[0]?.trim() ?? leg.from;
  const toCity = leg.to.split("—")[0]?.trim() ?? leg.to;

  return (
    <View style={styles.legCard} wrap={false}>
      {total > 1 && (
        <Text style={styles.legLabel}>
          Leg {index + 1} of {total}
        </Text>
      )}
      <View style={styles.routeRow}>
        <View style={styles.airportBlock}>
          <Text style={styles.airportCaption}>{fromCode}</Text>
          <Text style={styles.airportName}>{fromCity}</Text>
        </View>
        <View style={styles.arrow}>
          <Svg width={16} height={10} viewBox="0 0 16 10">
            <Polygon points="0,0 16,5 0,10" fill={ACCENT} />
          </Svg>
        </View>
        <View style={styles.airportBlock}>
          <Text style={styles.airportCaption}>{toCode}</Text>
          <Text style={styles.airportName}>{toCity}</Text>
        </View>
      </View>
      <View style={styles.routeMetaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Departs (Local)</Text>
          <Text style={styles.metaValue}>
            {leg.date} · {leg.time}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Arrives (Local)</Text>
          <Text style={styles.metaValue}>{leg.arrivalLocal}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Flight Time</Text>
          <Text style={styles.metaValue}>{leg.flightTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Distance</Text>
          <Text style={styles.metaValue}>{leg.distanceNm} NM</Text>
        </View>
      </View>
      {(leg.passengers !== undefined || leg.requests) && (
        <View style={[styles.routeMetaRow, { borderTopWidth: 0, paddingTop: 0, marginTop: 12 }]}>
          {leg.passengers !== undefined && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Passengers</Text>
              <Text style={styles.metaValue}>{leg.passengers}</Text>
            </View>
          )}
          {leg.requests && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Requests</Text>
              <Text style={[styles.metaValue, { fontSize: 9 }]}>{leg.requests}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function CharterRequestPdf({
  data,
  requestId,
  generatedAt,
}: {
  data: CharterRequestPayload;
  requestId: string;
  generatedAt: string;
}) {
  const hasCatering = data.catering && data.catering.length > 0;

  return (
    <Document title={`Charter Request — ${data.name}`}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf's Image, not a DOM <img> */}
            <Image style={styles.logo} src={LOGO_MARK_PATH} />
            <Text style={styles.brandText}>CRAFT</Text>
          </View>
          <View>
            <Text style={styles.docLabel}>Charter Request</Text>
            <Text style={styles.docMeta}>{requestId}</Text>
            <Text style={styles.docMeta}>{generatedAt}</Text>
          </View>
        </View>

        <Text style={styles.tripLabel}>
          {data.tripType}
          {typeof data.passengers === "number"
            ? ` · ${data.passengers} Adult${data.passengers === 1 ? "" : "s"}`
            : data.passengers
              ? ` · ${data.passengers}`
              : ""}
          {data.under18 ? ` · ${data.under18} Under 18` : ""}
          {data.under2 ? ` · ${data.under2} Under 2` : ""}
        </Text>
        {data.legs.map((leg, i) => (
          <Leg key={i} leg={leg} index={i} total={data.legs.length} />
        ))}

        <View style={styles.grid}>
          <View style={[styles.card, styles.cardRightGap]} wrap={false}>
            <Text style={styles.cardLabel}>Options Requested</Text>
            {data.options.length ? (
              <View style={styles.badgeRow}>
                {data.options.map((o) => (
                  <Badge key={o}>{o}</Badge>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>None selected</Text>
            )}
            {data.pets ? (
              <Text style={[styles.mutedText, { marginTop: 8 }]}>
                Pets: {data.pets}
              </Text>
            ) : null}
            {data.slidingHours ? (
              <Text style={[styles.mutedText, { marginTop: 8 }]}>
                Sliding departure: up to {data.slidingHours}h after requested time
              </Text>
            ) : null}
          </View>

          <View style={styles.card} wrap={false}>
            <Text style={styles.cardLabel}>Catering</Text>
            {hasCatering ? (
              <View style={styles.badgeRow}>
                {data.catering.map((c) => (
                  <Badge key={c} muted>
                    {c}
                  </Badge>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>Not requested</Text>
            )}
            {data.allergyDetails?.trim() ? (
              <Text style={[styles.mutedText, { marginTop: 8 }]}>
                Allergies: {data.allergyDetails.trim()}
              </Text>
            ) : null}
          </View>

          <View style={[styles.card, styles.cardFull]} wrap={false}>
            <Text style={styles.cardLabel}>Special Remarks</Text>
            {data.notes?.trim() ? (
              <Text style={styles.bodyText}>{data.notes.trim()}</Text>
            ) : (
              <Text style={styles.emptyText}>None</Text>
            )}
          </View>

          <View style={[styles.card, styles.cardFull, { marginBottom: 0 }]} wrap={false}>
            <Text style={styles.cardLabel}>
              {data.clientType === "Broker"
                ? "Requested By — Broker"
                : "Requested By"}
            </Text>
            <View style={styles.contactRow}>
              {data.brokerage ? (
                <View style={styles.contactCol}>
                  <Text style={styles.contactLabel}>Brokerage</Text>
                  <Text style={styles.contactValue}>{data.brokerage}</Text>
                </View>
              ) : null}
              <View style={styles.contactCol}>
                <Text style={styles.contactLabel}>Name</Text>
                <Text style={styles.contactValue}>{data.name}</Text>
              </View>
              <View style={styles.contactCol}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{data.email || "—"}</Text>
              </View>
              <View style={styles.contactCol}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{data.phone || "—"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>CRAFT · 14200 NW 42nd Ave, Opa-locka, Florida 33054</Text>
          <Text>+1 (310) 848-3636 · charter@flycraft.com</Text>
        </View>
      </Page>
    </Document>
  );
}
