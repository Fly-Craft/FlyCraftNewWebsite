/**
 * Generates docs/CRAFT-site-structure.pdf — a vector site-structure map.
 *
 * Uses @react-pdf/renderer (already a dependency, and what the charter
 * request PDF uses) via React.createElement rather than JSX, so it runs
 * under plain `node` with no build step.
 *
 * Run: node scripts/gen-structure-pdf.mjs
 */
import React from "react";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import {
  Document,
  Page,
  View,
  Text,
  Svg,
  Path,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";

const e = React.createElement;

/* ── Site palette ─────────────────────────────────────────────
   Hex only: react-pdf does not parse rgba() inside the `border`
   shorthand and silently falls back to red, so the site's translucent
   inks are pre-flattened against white here. */
const NAVY = "#0c1d3d";
const INK2 = "#6d778b"; // navy @ 60% on white
const INK3 = "#9ea5b1"; // navy @ 40% on white
const BORDER = "#dadde2"; // navy @ 15% on white
const WASH = "#f6fafc";

for (const w of [300, 400, 500, 600]) {
  Font.register({
    family: "Inter",
    fonts: [
      {
        src: path.join(
          process.cwd(),
          "node_modules/@fontsource/inter/files",
          `inter-latin-${w}-normal.woff`,
        ),
        fontWeight: w,
      },
    ],
  });
}
Font.registerHyphenationCallback((word) => [word]);

/* ── Layout constants (landscape A4: 842 x 595pt) ─────────── */
const PAGE_W = 842;
const M = 34; // page margin
const COL_GAP = 13;
const NODE_H = 34;
const ROW_Y = { nav: 190, sub: 258, leaf: 326 };

/* ── Primitives ───────────────────────────────────────────── */

/** A route box. `tone` picks the visual weight of the node. */
function Node({ x, y, w, label, sub, tone = "page", h = NODE_H }) {
  const tones = {
    home: { bg: NAVY, fg: "#ffffff", sub: "rgba(255,255,255,0.65)", bd: NAVY },
    nav: { bg: "#ffffff", fg: NAVY, sub: INK3, bd: NAVY },
    page: { bg: "#ffffff", fg: NAVY, sub: INK3, bd: BORDER },
    leaf: { bg: WASH, fg: INK2, sub: INK3, bd: BORDER },
    api: { bg: "#ffffff", fg: INK2, sub: INK3, bd: BORDER, dash: true },
  };
  const t = tones[tone];
  return e(
    View,
    {
      style: {
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: t.bg,
        border: `${tone === "nav" || tone === "home" ? 1.2 : 0.8}pt solid ${t.bd}`,
        borderRadius: 6,
        paddingTop: sub ? 5 : 0,
        justifyContent: sub ? "flex-start" : "center",
        alignItems: "center",
      },
    },
    e(
      Text,
      {
        style: {
          fontFamily: "Inter",
          fontSize: tone === "home" ? 10 : 8.5,
          fontWeight: tone === "page" || tone === "leaf" || tone === "api" ? 500 : 600,
          color: t.fg,
          letterSpacing: tone === "home" ? 1.4 : 0.3,
        },
      },
      label,
    ),
    sub
      ? e(
          Text,
          {
            style: {
              fontFamily: "Inter",
              fontSize: 6,
              fontWeight: 400,
              color: t.sub,
              marginTop: 2.5,
              letterSpacing: 0.2,
            },
          },
          sub,
        )
      : null,
  );
}

/** Orthogonal connector: down from `from`, across, down into `to`. */
function Elbow({ x1, y1, x2, y2, color = BORDER, dash }) {
  const midY = y1 + (y2 - y1) / 2;
  const d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
  return e(
    View,
    { style: { position: "absolute", left: 0, top: 0 } },
    e(
      Svg,
      { width: PAGE_W, height: 595 },
      e(Path, {
        d,
        stroke: color,
        strokeWidth: 0.7,
        fill: "none",
        strokeDasharray: dash ? "2 2" : undefined,
      }),
    ),
  );
}

function SectionLabel({ x, y, children }) {
  return e(
    Text,
    {
      style: {
        position: "absolute",
        left: x,
        top: y,
        fontFamily: "Inter",
        fontSize: 6.5,
        fontWeight: 600,
        color: INK3,
        letterSpacing: 1.6,
      },
    },
    children,
  );
}

/* ── Content model ────────────────────────────────────────── */

// Four primary nav columns, each with its children.
const COLUMNS = [
  {
    label: "BOOK",
    href: "/charter",
    children: [
      { label: "/asap", sub: "Also its own page", tone: "page" },
    ],
    chips: {
      title: "?tab=  ·  3 TABS, SERVER-RESOLVED",
      items: ["Contact", "Trip Planner", "ASAP"],
    },
  },
  {
    label: "PROGRAMS",
    href: "/programs",
    children: [
      { label: "/programs/enquire", sub: "?program=  ·  noindex", tone: "page" },
      { label: "/programs/management", sub: "Leaseback", tone: "page" },
      { label: "/programs/corporate", sub: "Corporate", tone: "page" },
      { label: "/glidepath", sub: "721 fund  ·  links out to glidepath.ai", tone: "page" },
    ],
    chips: {
      title: "4 CARDS ON /programs",
      items: ["Leaseback", "Jet Card", "Corporate", "Glidepath"],
    },
  },
  {
    label: "FLEET",
    href: "/fleet",
    children: [
      { label: "/fleet/menu", sub: "Inflight menu", tone: "page" },
    ],
    chips: {
      title: "/fleet/[tail]  ·  5 AIRCRAFT",
      items: ["N971MC", "N150MB", "N251FT", "N395PD", "N7PG"],
    },
  },
  {
    label: "COMPANY",
    href: "/company",
    children: [],
    note: "History, leadership,\nsafety record, standards",
  },
];

const FOOTER_PAGES = [
  { label: "/faq" },
  { label: "/reviews" },
  { label: "/contact" },
  { label: "/legal" },
];

const FORM_APIS = [
  { label: "/api/charter-request", sub: "from /charter" },
  { label: "/api/contact", sub: "from /contact" },
  { label: "/api/corporate-program", sub: "from /programs/corporate" },
  { label: "/api/management-inquiry", sub: "from /programs/management" },
  { label: "/api/program-enquiry", sub: "from /programs/enquire" },
];

const AGENT_APIS = [
  { label: "/api/agent", sub: "Capability manifest" },
  // Plain ASCII: the Inter latin subset has no arrow glyph, and react-pdf
  // renders the miss as a stray quote mark.
  { label: "/api/agent/airports", sub: "Resolve a place name to airport codes" },
  { label: "/api/agent/quote", sub: "Price + file a request" },
];

const MACHINE = [
  { label: "/sitemap.xml", sub: "19 routes" },
  { label: "/robots.txt", sub: "AI crawlers named" },
  { label: "/llms.txt", sub: "Site summary" },
];

/* ── Page 1: the route tree ───────────────────────────────── */

function TreePage() {
  const usableW = PAGE_W - M * 2;
  const colW = (usableW - COL_GAP * 3) / 4;
  const homeW = 150;
  const homeX = PAGE_W / 2 - homeW / 2;
  const homeY = 120;

  const nodes = [];
  const wires = [];

  // Home
  nodes.push(
    e(Node, {
      key: "home",
      x: homeX,
      y: homeY,
      w: homeW,
      h: 40,
      label: "CRAFT",
      sub: "/  ·  scroll-driven hero",
      tone: "home",
    }),
  );

  COLUMNS.forEach((col, i) => {
    const x = M + i * (colW + COL_GAP);
    const cx = x + colW / 2;

    wires.push(
      e(Elbow, {
        key: `w-nav-${i}`,
        x1: homeX + homeW / 2,
        y1: homeY + 40,
        x2: cx,
        y2: ROW_Y.nav,
      }),
    );

    nodes.push(
      e(Node, {
        key: `nav-${i}`,
        x,
        y: ROW_Y.nav,
        w: colW,
        label: col.label,
        sub: col.href,
        tone: "nav",
      }),
    );

    // Children stack under each nav item
    col.children.forEach((child, j) => {
      const y = ROW_Y.sub + j * (NODE_H + 6);
      wires.push(
        e(Elbow, {
          key: `w-sub-${i}-${j}`,
          x1: cx,
          y1: ROW_Y.nav + NODE_H,
          x2: cx,
          y2: y,
        }),
      );
      nodes.push(
        e(Node, {
          key: `sub-${i}-${j}`,
          x,
          y,
          w: colW,
          label: child.label,
          sub: child.sub,
          tone: child.tone,
        }),
      );
    });

    // Fleet's five aircraft as a compact grid
    if (col.chips) {
      const gridY = ROW_Y.sub + (col.children.length * (NODE_H + 6)) + 6;
      wires.push(
        e(Elbow, {
          key: `w-ac-${i}`,
          x1: cx,
          y1: ROW_Y.sub + NODE_H,
          x2: cx,
          y2: gridY,
        }),
      );
      nodes.push(
        e(
          View,
          {
            key: `ac-${i}`,
            style: {
              position: "absolute",
              left: x,
              top: gridY,
              width: colW,
              border: `0.8pt solid ${BORDER}`,
              borderRadius: 6,
              backgroundColor: WASH,
              padding: 7,
            },
          },
          e(
            Text,
            {
              style: {
                fontFamily: "Inter",
                fontSize: 6,
                fontWeight: 600,
                color: INK3,
                letterSpacing: 1,
                marginBottom: 4,
              },
            },
            col.chips.title,
          ),
          e(
            View,
            { style: { flexDirection: "row", flexWrap: "wrap" } },
            ...col.chips.items.map((t) =>
              e(
                Text,
                {
                  key: t,
                  style: {
                    fontFamily: "Inter",
                    fontSize: 7,
                    fontWeight: 500,
                    color: NAVY,
                    marginRight: 7,
                    marginBottom: 2,
                  },
                },
                t,
              ),
            ),
          ),
        ),
      );
    }

    if (col.note) {
      const noteY = ROW_Y.sub + col.children.length * (NODE_H + 6) + 4;
      nodes.push(
        e(
          Text,
          {
            key: `note-${i}`,
            style: {
              position: "absolute",
              left: x + 2,
              top: noteY,
              width: colW,
              fontFamily: "Inter",
              fontSize: 6.5,
              fontWeight: 400,
              color: INK3,
              lineHeight: 1.5,
            },
          },
          col.note,
        ),
      );
    }
  });

  // Footer row
  const footerY = 496;
  const fW = (usableW - COL_GAP * 3) / 4;
  nodes.push(e(SectionLabel, { key: "flab", x: M, y: footerY - 14 }, "IN THE FOOTER, ON EVERY PAGE"));
  FOOTER_PAGES.forEach((p, i) => {
    nodes.push(
      e(Node, {
        key: `f-${i}`,
        x: M + i * (fW + COL_GAP),
        y: footerY,
        w: fW,
        h: 26,
        label: p.label,
        tone: "leaf",
      }),
    );
  });

  return e(
    Page,
    { size: "A4", orientation: "landscape", style: { backgroundColor: "#ffffff" } },
    // Header
    e(
      View,
      { style: { position: "absolute", left: M, top: 34 } },
      e(
        Text,
        {
          style: {
            fontFamily: "Inter",
            fontSize: 20,
            fontWeight: 300,
            color: NAVY,
            letterSpacing: -0.2,
          },
        },
        "CRAFT — Website Structure",
      ),
      e(
        Text,
        {
          style: {
            fontFamily: "Inter",
            fontSize: 8,
            fontWeight: 400,
            color: INK2,
            marginTop: 5,
          },
        },
        "Public route tree. Nav dropdowns expand Programs and Fleet; the footer set is reachable from every page.",
      ),
    ),
    e(
      Text,
      {
        style: {
          position: "absolute",
          right: M,
          top: 40,
          fontFamily: "Inter",
          fontSize: 7,
          fontWeight: 500,
          color: INK3,
          letterSpacing: 1.2,
        },
      },
      "PAGE 1 OF 2  ·  ROUTES",
    ),
    e(
      View,
      {
        style: {
          position: "absolute",
          left: M,
          top: 76,
          width: PAGE_W - M * 2,
          height: 0.8,
          backgroundColor: BORDER,
        },
      },
    ),
    ...wires,
    ...nodes,
    // Legend
    e(
      View,
      {
        style: {
          position: "absolute",
          left: M,
          top: 538,
          flexDirection: "row",
          alignItems: "center",
        },
      },
      ...[
        ["Primary nav", NAVY, 1.2],
        ["Page", BORDER, 0.8],
        ["Footer / secondary", BORDER, 0.8],
      ].flatMap(([label, bd, bw], i) => [
        e(View, {
          key: `lg-${i}`,
          style: {
            width: 13,
            height: 9,
            border: `${bw}pt solid ${bd}`,
            backgroundColor: i === 2 ? WASH : "#ffffff",
            borderRadius: 2,
            marginRight: 5,
            marginLeft: i ? 16 : 0,
          },
        }),
        e(
          Text,
          {
            key: `lt-${i}`,
            style: { fontFamily: "Inter", fontSize: 6.5, color: INK2 },
          },
          label,
        ),
      ]),
    ),
  );
}

/* ── Page 2: the machine layer ────────────────────────────── */

function ApiPage() {
  const usableW = PAGE_W - M * 2;
  const colW = (usableW - 40) / 2;

  const block = (x, y, title, caption, items, tone) =>
    e(
      View,
      { key: title, style: { position: "absolute", left: x, top: y, width: colW } },
      e(
        Text,
        {
          style: {
            fontFamily: "Inter",
            fontSize: 6.5,
            fontWeight: 600,
            color: INK3,
            letterSpacing: 1.6,
            marginBottom: 4,
          },
        },
        title,
      ),
      e(
        Text,
        {
          style: {
            fontFamily: "Inter",
            fontSize: 7.5,
            fontWeight: 400,
            color: INK2,
            lineHeight: 1.5,
            marginBottom: 9,
          },
        },
        caption,
      ),
      ...items.map((it) =>
        e(
          View,
          {
            key: it.label,
            style: {
              border: `0.8pt ${tone === "api" ? "dashed" : "solid"} ${BORDER}`,
              borderRadius: 5,
              padding: 7,
              marginBottom: 6,
              backgroundColor: tone === "api" ? "#ffffff" : WASH,
            },
          },
          e(
            Text,
            {
              style: {
                fontFamily: "Inter",
                fontSize: 8,
                fontWeight: 500,
                color: NAVY,
              },
            },
            it.label,
          ),
          e(
            Text,
            {
              style: {
                fontFamily: "Inter",
                fontSize: 6.5,
                fontWeight: 400,
                color: INK3,
                marginTop: 2,
              },
            },
            it.sub,
          ),
        ),
      ),
    );

  return e(
    Page,
    { size: "A4", orientation: "landscape", style: { backgroundColor: "#ffffff" } },
    e(
      View,
      { style: { position: "absolute", left: M, top: 34 } },
      e(
        Text,
        {
          style: {
            fontFamily: "Inter",
            fontSize: 20,
            fontWeight: 300,
            color: NAVY,
          },
        },
        "CRAFT — Machine Layer",
      ),
      e(
        Text,
        {
          style: {
            fontFamily: "Inter",
            fontSize: 8,
            fontWeight: 400,
            color: INK2,
            marginTop: 5,
          },
        },
        "Endpoints and files no visitor sees: form intake, the agent API, and the discovery surfaces.",
      ),
    ),
    e(
      Text,
      {
        style: {
          position: "absolute",
          right: M,
          top: 40,
          fontFamily: "Inter",
          fontSize: 7,
          fontWeight: 500,
          color: INK3,
          letterSpacing: 1.2,
        },
      },
      "PAGE 2 OF 2  ·  APIs",
    ),
    e(
      View,
      {
        style: {
          position: "absolute",
          left: M,
          top: 76,
          width: usableW,
          height: 0.8,
          backgroundColor: BORDER,
        },
      },
    ),
    block(
      M,
      104,
      "FORM INTAKE",
      "Each site form POSTs to its own route; all five send mail via Resend and need RESEND_API_KEY set. Programme enquiries also copy that programme's own recipients.",
      FORM_APIS,
      "api",
    ),
    block(
      M + colW + 40,
      104,
      "AGENT API",
      "A documented JSON path so an AI agent can price and request a trip without driving the booking form.",
      AGENT_APIS,
      "api",
    ),
    block(
      M + colW + 40,
      300,
      "DISCOVERY SURFACES",
      "How crawlers and assistants find and understand the site. JSON-LD is embedded in every page's HTML.",
      MACHINE,
      "leaf",
    ),
    // Note panel
    e(
      View,
      {
        style: {
          position: "absolute",
          left: M,
          top: 356,
          width: colW,
          border: `0.8pt solid ${BORDER}`,
          borderRadius: 6,
          backgroundColor: WASH,
          padding: 11,
        },
      },
      e(
        Text,
        {
          style: {
            fontFamily: "Inter",
            fontSize: 6.5,
            fontWeight: 600,
            color: INK3,
            letterSpacing: 1.4,
            marginBottom: 6,
          },
        },
        "STATE AT TIME OF EXPORT",
      ),
      ...[
        "Hosted on Vercel at craft-website-tau.vercel.app.",
        "flycraft.com still serves the previous site and is not connected.",
        "SITE_PUBLIC is unset, so the site sends noindex and robots.txt disallows all.",
        "RESEND_API_KEY is unset — forms report success but deliver nothing.",
      ].map((t, i) =>
        e(
          Text,
          {
            key: i,
            style: {
              fontFamily: "Inter",
              fontSize: 7.5,
              fontWeight: 400,
              color: INK2,
              lineHeight: 1.55,
              marginBottom: 4,
            },
          },
          `·  ${t}`,
        ),
      ),
    ),
  );
}

const doc = e(Document, { title: "CRAFT — Website Structure", author: "CRAFT" }, e(TreePage), e(ApiPage));

const buf = await renderToBuffer(doc);
await mkdir("docs", { recursive: true });
await writeFile("docs/CRAFT-site-structure.pdf", buf);
console.log(`wrote docs/CRAFT-site-structure.pdf (${(buf.length / 1024).toFixed(0)} KB)`);
