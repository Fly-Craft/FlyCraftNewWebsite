"use client";

import { useMemo, useRef, useState } from "react";
import type { Airport } from "@/lib/airports-data";
import {
  dayShift,
  distanceNm,
  flightMinutes,
  formatDuration,
  formatInZone,
  groundSpeedKts,
  isoDateInZone,
  isoTimeInZone,
  zonedToUtc,
} from "@/lib/flight";
import AirportSearch from "@/components/charter/AirportSearch";
import { blackoutLabel } from "@/lib/blackout-dates";
import { DateField, TimeField } from "@/components/charter/DateTimeFields";
import RouteMap, { type MapNotice, type MapRoute } from "@/components/charter/RouteMap";
import SegmentedToggle, { type SegmentedOption } from "@/components/SegmentedToggle";
import { siteConfig } from "@/lib/site-config";

const FUEL_STOP_MINUTES = 345; // 5 h 45 min
const TURN_MINUTES = 30; // minimum quick-turn between landing and next departure
const MAX_RANGE_NM = 3000; // beyond this a fuel stop is required, not optional
const BASE_MAX_PAX = 9;
const FA_MAX_PAX = 8; // a flight attendant takes one of the cabin seats
const MAX_UNDER_2 = 8; // hard ceiling regardless of the passenger mix
const MAX_PETS = 20;
const MEAL_TYPES = ["Regular", "Veggie", "Vegan", "Kosher"];
// Kosher is arranged per-trip with the client — no meal count needed
const COUNTED_MEALS = ["Regular", "Veggie", "Vegan"];

const OPTIONS = [
  "Flight Attendant",
  "Bed",
  "Pets",
  "Sliding Departure",
  "Catering",
];

const TRIP_TYPES = [
  { id: "oneway", label: "One Way" },
  { id: "roundtrip", label: "Round Trip" },
  { id: "multi", label: "Multiple" },
] as const;

// Amenity chips shown to the client ("TBD" = decide later)
const OPTION_CHIPS = [...OPTIONS, "TBD"];

type TripType = (typeof TRIP_TYPES)[number]["id"];
type ClientType = "individual" | "broker";

const CLIENT_TYPES: SegmentedOption<ClientType>[] = [
  { id: "individual", label: "Individual" },
  { id: "broker", label: "Broker" },
];

/** Whether the picked date/time anchors the departure or the arrival. */
type TimeMode = "depart" | "arrive";

type LegState = {
  id: number;
  from: Airport | null;
  to: Airport | null;
  date: string;
  time: string;
  timeMode: TimeMode;
};

type LegCalc = {
  nm: number;
  speed: number;
  minutes: number;
  label: string;
  departure: { timeStr: string; shift: number; utc: Date } | null;
  arrival: { timeStr: string; shift: number; utc: Date } | null;
};

const MAX_LEGS = 5;

function calcLeg(
  from: Airport | null,
  to: Airport | null,
  date: string,
  time: string,
  mode: TimeMode = "depart"
): LegCalc | null {
  if (!from || !to || from.icao === to.icao) return null;
  const nm = distanceNm(from, to);
  const speed = groundSpeedKts(from, to);
  const minutes = flightMinutes(nm, speed);
  let departure: LegCalc["departure"] = null;
  let arrival: LegCalc["arrival"] = null;
  if (date && time) {
    try {
      // "arrive" anchors the picked wall clock at the destination and works
      // backwards to the required departure; "depart" works forwards.
      const anchor = zonedToUtc(date, time, mode === "arrive" ? to.tz : from.tz);
      const dep =
        mode === "arrive" ? new Date(anchor.getTime() - minutes * 60000) : anchor;
      const arr =
        mode === "arrive" ? anchor : new Date(anchor.getTime() + minutes * 60000);
      departure = {
        timeStr: formatInZone(dep, from.tz, { hour: "numeric", minute: "2-digit" }),
        shift: dayShift(arr, to.tz, dep, from.tz),
        utc: dep,
      };
      arrival = {
        timeStr: formatInZone(arr, to.tz, { hour: "numeric", minute: "2-digit" }),
        shift: dayShift(dep, from.tz, arr, to.tz),
        utc: arr,
      };
    } catch {
      departure = null;
      arrival = null;
    }
  }
  return {
    nm,
    speed,
    minutes,
    label: `${Math.round(nm).toLocaleString()} NM · ${formatDuration(minutes)}`,
    departure,
    arrival,
  };
}

/**
 * Earliest allowed pick for a leg that follows another: the previous leg's
 * landing plus the quick-turn minimum. `utc` is the departure floor used
 * for validation; `date`/`time` are what the pickers show — the departure
 * floor in the departure airport's zone, or (for arrive-anchored legs) the
 * corresponding earliest arrival in the destination's zone.
 */
type MinPick = { date: string; time: string; utc: Date };

function minPickFor(
  prevArrivalUtc: Date,
  mode: TimeMode,
  minutes: number | undefined,
  fromTz: string | undefined,
  toTz: string | undefined
): MinPick | null {
  const floorUtc = new Date(prevArrivalUtc.getTime() + TURN_MINUTES * 60000);
  if (mode === "arrive") {
    if (minutes === undefined || !toTz) return null;
    const floorArr = new Date(floorUtc.getTime() + minutes * 60000);
    return {
      date: isoDateInZone(floorArr, toTz),
      time: isoTimeInZone(floorArr, toTz),
      utc: floorUtc,
    };
  }
  if (!fromTz) return null;
  return {
    date: isoDateInZone(floorUtc, fromTz),
    time: isoTimeInZone(floorUtc, fromTz),
    utc: floorUtc,
  };
}

function fmtMinDeparture(md: { date: string; time: string }): string {
  const [h, m] = md.time.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const day = new Date(`${md.date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"} on ${day}`;
}

const laterDate = (a: string, b: string) => (a > b ? a : b);

function TimingLine({
  calc,
  from,
  to,
  mode,
}: {
  calc: LegCalc | null;
  from: Airport | null;
  to: Airport | null;
  mode: TimeMode;
}) {
  if (mode === "arrive") {
    // The picked time is the landing — show the departure it implies
    if (!calc?.departure || !from) return null;
    return (
      <p className="text-[12px] font-light tracking-[0.06em] text-ink-2">
        <span className="font-medium text-navy">
          Departing {calc.departure.timeStr}
        </span>{" "}
        local at {from.iata || from.icao}
        {calc.departure.shift !== 0
          ? ` · ${calc.departure.shift > 0 ? "+" : ""}${calc.departure.shift} day`
          : ""}{" "}
        · {calc.label.toLowerCase()}
      </p>
    );
  }
  if (!calc?.arrival || !to) return null;
  return (
    <p className="text-[12px] font-light tracking-[0.06em] text-ink-2">
      <span className="font-medium text-navy">Landing {calc.arrival.timeStr}</span>{" "}
      local at {to.iata || to.icao}
      {calc.arrival.shift > 0 ? ` · +${calc.arrival.shift} day` : ""} ·{" "}
      {calc.label.toLowerCase()}
    </p>
  );
}

const TIME_MODES: SegmentedOption<TimeMode>[] = [
  { id: "depart", label: "Depart" },
  { id: "arrive", label: "Arrive" },
];

function TimeModeToggle({
  value,
  onChange,
}: {
  value: TimeMode;
  onChange: (m: TimeMode) => void;
}) {
  return (
    <SegmentedToggle
      options={TIME_MODES}
      value={value}
      onChange={onChange}
      ariaLabel="Anchor the time to departure or arrival"
      fit
      pad={2}
      buttonClassName="px-2 py-0.5 text-[8px] font-medium tracking-[0.12em] uppercase"
    />
  );
}

// Re-runs whenever the keyed leg block remounts, i.e. on every trip-type
// switch — the fields fade up instead of popping into place.
const legFade: React.CSSProperties = { animation: "pageFade 0.34s ease both" };

const inputCls =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-[14px] text-navy outline-none focus:border-navy/40";
const microLabel =
  "mb-2 block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase";

export default function CharterBooking() {
  const nextId = useRef(1);
  const newLeg = (): LegState => ({
    id: nextId.current++,
    from: null,
    to: null,
    date: "",
    time: "",
    timeMode: "depart",
  });

  const [tripType, setTripType] = useState<TripType>("oneway");
  const [legs, setLegs] = useState<LegState[]>(() => [newLeg()]);
  const [retDate, setRetDate] = useState("");
  const [retTime, setRetTime] = useState("");
  const [retTimeMode, setRetTimeMode] = useState<TimeMode>("depart");
  const [pax, setPax] = useState(1);
  const [paxTbd, setPaxTbd] = useState(false);
  // Multi-leg / round trip: one passenger count for the whole trip, or per leg
  const [paxAllTrips, setPaxAllTrips] = useState(true);
  const [legPax, setLegPax] = useState<Record<string, number>>({});
  const [legPaxTbd, setLegPaxTbd] = useState<Record<string, boolean>>({});
  const [options, setOptions] = useState<string[]>([]);
  const [catering, setCatering] = useState<string[]>([]);
  const [mealCounts, setMealCounts] = useState<Record<string, number>>({});
  const [allergyDetails, setAllergyDetails] = useState("");
  const [slidingHours, setSlidingHours] = useState(2);
  const [petCount, setPetCount] = useState(1);
  const [notes, setNotes] = useState("");
  // Multi-leg / round trip: one set of requests for the whole trip, or per leg
  const [allTrips, setAllTrips] = useState(true);
  const [legOptions, setLegOptions] = useState<Record<string, string[]>>({});
  // Drag-to-reorder legs
  const [dragArmed, setDragArmed] = useState<number | null>(null);
  const [dragId, setDragId] = useState<number | null>(null);
  const [clientType, setClientType] = useState<"individual" | "broker">(
    "individual"
  );
  const [brokerage, setBrokerage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [hasUnder18, setHasUnder18] = useState(false);
  const [under18, setUnder18] = useState(0);
  const [hasUnder2, setHasUnder2] = useState(false);
  const [under2, setUnder2] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flashNotice(text: string) {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 5000);
  }

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }, []);

  function switchType(t: TripType) {
    setTripType(t);
    if (t === "multi" && legs.length < 2) {
      const second = newLeg();
      second.from = legs[0]?.to ?? null;
      setLegs([...legs, second]);
    }
    if (t !== "multi" && legs.length > 1) {
      setLegs([legs[0]]);
    }
  }

  function updateLeg(id: number, patch: Partial<LegState>) {
    setLegs((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addLeg() {
    setLegs((prev) => {
      if (prev.length >= MAX_LEGS) return prev;
      const l = newLeg();
      l.from = prev[prev.length - 1]?.to ?? null;
      return [...prev, l];
    });
  }

  function removeLeg(id: number) {
    setLegs((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.id !== id)));
  }

  /** Drag-reorder: move the dragged leg to the target leg's position. */
  function moveLeg(fromId: number, toId: number) {
    setLegs((prev) => {
      const fromIdx = prev.findIndex((l) => l.id === fromId);
      const toIdx = prev.findIndex((l) => l.id === toId);
      if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }

  function toggleLegOption(segKey: string, o: string) {
    setLegOptions((prev) => {
      const cur = prev[segKey] ?? [];
      const next = cur.includes(o) ? cur.filter((x) => x !== o) : [...cur, o];
      if (
        o === "Flight Attendant" &&
        next.includes("Flight Attendant") &&
        !segPaxTbd(segKey) &&
        segPax(segKey) > FA_MAX_PAX
      ) {
        setLegPax((p) => ({ ...p, [segKey]: FA_MAX_PAX }));
        const label = segments.find((s) => s.key === segKey)?.label ?? "This leg";
        flashNotice(
          `${label}: having a flight attendant on board reduces the maximum passenger amount to 8.`
        );
      }
      return { ...prev, [segKey]: next };
    });
  }

  function segPax(key: string) {
    return legPax[key] ?? 1;
  }
  function segPaxTbd(key: string) {
    return legPaxTbd[key] ?? false;
  }
  function bumpSegPax(key: string, delta: number) {
    setLegPax((prev) => ({
      ...prev,
      [key]: Math.min(segPaxCap(key), Math.max(1, (prev[key] ?? 1) + delta)),
    }));
  }
  function toggleSegPaxTbd(key: string) {
    setLegPaxTbd((prev) => ({ ...prev, [key]: !(prev[key] ?? false) }));
  }

  /** Reset every selection on all trip types (contact details are kept). */
  function clearAll() {
    setLegs(tripType === "multi" ? [newLeg(), newLeg()] : [newLeg()]);
    setRetDate("");
    setRetTime("");
    setRetTimeMode("depart");
    setPax(1);
    setPaxTbd(false);
    setHasUnder18(false);
    setUnder18(0);
    setHasUnder2(false);
    setUnder2(0);
    setPaxAllTrips(true);
    setLegPax({});
    setLegPaxTbd({});
    setOptions([]);
    setCatering([]);
    setMealCounts({});
    setAllergyDetails("");
    setSlidingHours(2);
    setPetCount(1);
    setNotes("");
    setAllTrips(true);
    setLegOptions({});
  }

  const calcs = useMemo(
    () => legs.map((l) => calcLeg(l.from, l.to, l.date, l.time, l.timeMode)),
    [legs]
  );

  const returnCalc = useMemo(() => {
    if (tripType !== "roundtrip") return null;
    const l = legs[0];
    return calcLeg(l.to, l.from, retDate, retTime, retTimeMode);
  }, [tripType, legs, retDate, retTime, retTimeMode]);

  // Quick-turn floor: each leg after the first (and the round-trip return)
  // can't depart earlier than 30 minutes after the previous leg lands. The
  // pickers' `min` shows it in whichever wall clock the leg is anchored to
  // (departure at the origin, or arrival at the destination); validation
  // always compares the effective departure instant.
  const minDeps = useMemo(
    () =>
      legs.map((l, i) => {
        if (i === 0) return null;
        const prevCalc = calcs[i - 1];
        const prevTo = legs[i - 1].to;
        if (!prevCalc?.arrival || !prevTo) return null;
        return minPickFor(
          prevCalc.arrival.utc,
          l.timeMode,
          calcs[i]?.minutes,
          l.from?.tz ?? prevTo.tz,
          l.to?.tz
        );
      }),
    [legs, calcs]
  );

  const returnMinDep = useMemo(() => {
    if (tripType !== "roundtrip" || !calcs[0]?.arrival || !legs[0].to) return null;
    return minPickFor(
      calcs[0].arrival.utc,
      retTimeMode,
      returnCalc?.minutes,
      legs[0].to.tz,
      legs[0].from?.tz
    );
  }, [tripType, calcs, legs, retTimeMode, returnCalc]);

  // The pickers prevent new violations; these catch a selection that was
  // valid but got invalidated by a later edit to an earlier leg.
  const legTurnViolations = legs.map((l, i) => {
    const md = minDeps[i];
    const dep = calcs[i]?.departure;
    if (!md || !dep) return false;
    return dep.utc.getTime() < md.utc.getTime();
  });
  const returnTurnViolation =
    !!returnMinDep &&
    !!returnCalc?.departure &&
    returnCalc.departure.utc.getTime() < returnMinDep.utc.getTime();

  // "All Trips" (for both amenities and passengers) applies to multi-leg
  // and round trips — each has more than one flown segment. Round trips
  // don't have a second LegState, so segments are keyed "out"/"ret"
  // rather than by leg id.
  const showAllTripsToggle = tripType === "multi" || tripType === "roundtrip";
  const segments = useMemo(() => {
    if (tripType === "multi") {
      return legs.map((l, i) => ({
        key: String(l.id),
        label: `Leg ${i + 1}`,
        from: l.from,
        to: l.to,
      }));
    }
    if (tripType === "roundtrip") {
      return [
        { key: "out", label: "Outbound", from: legs[0].from, to: legs[0].to },
        { key: "ret", label: "Return", from: legs[0].to, to: legs[0].from },
      ];
    }
    return [];
  }, [tripType, legs]);

  const mapRoutes = useMemo<MapRoute[]>(() => {
    const rs: MapRoute[] = [];
    legs.forEach((l, i) => {
      const c = calcs[i];
      if (!l.from || !l.to || !c) return;
      if (tripType === "roundtrip" && i === 0 && returnCalc) {
        rs.push({
          key: `leg-${l.id}`,
          from: l.from,
          to: l.to,
          lines: [
            `${Math.round(c.nm).toLocaleString()} NM`,
            `(1) ${formatDuration(c.minutes)}`,
            `(2) ${formatDuration(returnCalc.minutes)}`,
          ],
        });
      } else if (tripType === "multi") {
        rs.push({
          key: `leg-${l.id}`,
          from: l.from,
          to: l.to,
          lines: [`(${i + 1}) ${c.label}`],
        });
      } else {
        rs.push({ key: `leg-${l.id}`, from: l.from, to: l.to, lines: [c.label] });
      }
    });
    return rs;
  }, [legs, calcs, tripType, returnCalc]);

  const pendingAirports = useMemo(() => {
    const out: Airport[] = [];
    for (const l of legs) {
      if (l.from && !l.to) out.push(l.from);
      if (!l.from && l.to) out.push(l.to);
    }
    return out;
  }, [legs]);

  const mapNotices = useMemo<MapNotice[]>(() => {
    const ns: MapNotice[] = [];

    // Pair each calc with the leg it belongs to so a note can name the
    // exact routing it applies to.
    const code = (a: Airport) => a.iata || a.icao;
    const legged: { c: LegCalc; label: string }[] = [];
    legs.forEach((l, i) => {
      const c = calcs[i];
      if (c && l.from && l.to) {
        legged.push({ c, label: `${code(l.from)} → ${code(l.to)}` });
      }
    });
    if (tripType === "roundtrip" && returnCalc && legs[0].from && legs[0].to) {
      legged.push({
        c: returnCalc,
        label: `${code(legs[0].to)} → ${code(legs[0].from)}`,
      });
    }
    const legList = (items: typeof legged) =>
      [...new Set(items.map((x) => x.label))].join(" · ");

    const overRange = legged.filter((x) => x.c.nm > MAX_RANGE_NM);
    const longLegs = legged.filter((x) => x.c.minutes > FUEL_STOP_MINUTES);
    if (overRange.length > 0) {
      ns.push({
        id: "fuel-stop-required",
        title: "Fuel Stop",
        legs: legList(overRange),
        text: `${
          overRange.length > 1 ? "These legs exceed" : "This leg exceeds"
        } the airplane's range — a fuel stop will be required.`,
      });
    } else if (longLegs.length > 0) {
      ns.push({
        id: "fuel-stop",
        title: "Fuel Stop",
        legs: legList(longLegs),
        text: `A fuel stop may be needed on ${
          longLegs.length > 1 ? "these legs" : "this leg"
        } depending on the amount of passengers, weather at the destination airport, and wind strength along the route.`,
      });
    }

    const selected = legs.flatMap((l) => [l.from, l.to]).filter(Boolean) as Airport[];
    if (selected.some((a) => a.icao === "KDCA")) {
      ns.push({
        id: "dca",
        title: "Expert Tip",
        text: "Additional security and coordination costs are required at DCA — the best option is to land in IAD.",
      });
    }
    // Generic Class B tip (DCA gets its own, more specific note above)
    const classB = [
      ...new Set(
        selected.filter((a) => a.classB && a.icao !== "KDCA").map(code)
      ),
    ];
    if (classB.length > 0) {
      ns.push({
        id: "class-b",
        title: "Expert Tip",
        legs: classB.join(" · "),
        text: `Airport fees and fuel prices may be expensive at ${
          classB.length > 1 ? "these large international airports" : classB[0]
        } — consider selecting a smaller airport nearby for cost saving.`,
      });
    }

    // Peak-period blackout dates (holidays etc.) — list every date that hits one
    const dates = [
      ...new Set(
        [
          ...legs.map((l) => l.date),
          ...(tripType === "roundtrip" ? [retDate] : []),
        ].filter(Boolean)
      ),
    ];
    const hits = dates
      .map((d) => ({ d, label: blackoutLabel(d) }))
      .filter((h) => h.label)
      .map(
        (h) =>
          `${new Date(`${h.d}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} (${h.label})`
      );
    if (hits.length === 1) {
      ns.push({
        id: "blackout",
        title: "Blackout Date",
        text: `${hits[0]} is considered a blackout date — prices and demand are higher than usual.`,
      });
    } else if (hits.length > 1) {
      ns.push({
        id: "blackout",
        title: "Blackout Dates",
        text: `${hits.slice(0, -1).join(", ")} and ${hits[hits.length - 1]} are considered blackout dates — prices and demand are higher than usual.`,
      });
    }

    return ns;
  }, [calcs, returnCalc, legs, tripType, retDate]);

  function swapAirports() {
    const l = legs[0];
    updateLeg(l.id, { from: l.to, to: l.from });
  }

  const legsComplete =
    tripType === "multi"
      ? legs.length >= 2 &&
        legs.every((l, i) => l.from && l.to && l.date && l.time && calcs[i])
      : legs[0].from && legs[0].to && legs[0].date && legs[0].time && calcs[0];

  const returnComplete =
    tripType !== "roundtrip" || (retDate !== "" && retTime !== "" && returnCalc);

  const contactOk = email.trim() !== "" || phone.trim() !== "";
  const brokerageOk = clientType === "individual" || brokerage.trim() !== "";

  // Brokers quote on a client's behalf and need the full picture; someone
  // booking their own trip gets a passenger count and nothing more.
  const isBroker = clientType === "broker";

  /** Dropping back to Individual clears everything the broker-only fields
      collected, so a hidden selection can't ride along on the request. */
  function switchClientType(t: ClientType) {
    setClientType(t);
    if (t === "individual") {
      setHasUnder18(false);
      setHasUnder2(false);
      setUnder18(0);
      setUnder2(0);
      setOptions([]);
      setLegOptions({});
      setAllTrips(true);
      setCatering([]);
      setMealCounts({});
      setAllergyDetails("");
      setPetCount(1);
      setSlidingHours(2);
      setBrokerage("");
    }
  }
  const perLegRequestsOk =
    !showAllTripsToggle ||
    allTrips ||
    segments.every((s) => (legOptions[s.key] ?? []).length > 0);
  const canSubmit =
    !!legsComplete &&
    !!returnComplete &&
    !legTurnViolations.some(Boolean) &&
    !returnTurnViolation &&
    perLegRequestsOk &&
    name.trim() !== "" &&
    contactOk &&
    brokerageOk;

  // "Passengers" (pax/paxTbd) counts adults only — Under 18 and Under 2 are
  // additive on top of it, not a slice of it, so at least 1 adult is always
  // guaranteed (pax itself never goes below 1) whenever a minor is aboard.
  //
  // A flight attendant takes one of the cabin seats, so it caps total seated
  // occupants (adults + under-18s) at 8 instead of 9.
  const paxCap = options.includes("Flight Attendant") ? FA_MAX_PAX : BASE_MAX_PAX;
  const adults = paxTbd ? paxCap : pax;

  // Under 18s can't sit on a lap, so each one needs its own seat — capped by
  // whatever the seat budget has left after adults claim theirs.
  const under18Cap = Math.max(0, paxCap - adults);
  const under18Clamped = Math.min(under18, under18Cap);

  // Under 2s can either take a spare seat (an infant seat) or ride on an
  // adult's lap — but a minor can't hold one, and one adult must always
  // stay free to work the emergency exit. E.g. 4 adults + 5 under-18s fills
  // all 9 seats, leaving only lap capacity: 4 adults − 1 (reserved) = 3.
  const spareSeats = Math.max(0, paxCap - adults - under18Clamped);
  const under2Cap = Math.min(MAX_UNDER_2, spareSeats + Math.max(0, adults - 1));
  const under2Clamped = Math.min(under2, under2Cap);

  // Symmetrically, adults can't grow past whatever Under 18 hasn't already
  // claimed — pax's own floor of 1 guarantees under18Cap above never eats
  // the last seat.
  const adultsCap = Math.max(1, paxCap - under18Clamped);

  // All of the above are clamped for display/submission rather than written
  // back to state, so a temporary cap drop (e.g. adding a flight attendant)
  // doesn't destructively lose a count if the cap opens back up later.

  function segPaxCap(key: string) {
    return (legOptions[key] ?? []).includes("Flight Attendant")
      ? FA_MAX_PAX
      : BASE_MAX_PAX;
  }

  function toggleOption(o: string) {
    setOptions((prev) => {
      const next = prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o];
      if (o === "Catering" && !next.includes("Catering")) {
        setCatering([]);
        setMealCounts({});
        setAllergyDetails("");
      }
      if (o === "Sliding Departure" && !next.includes("Sliding Departure")) {
        setSlidingHours(2);
      }
      if (o === "Pets" && !next.includes("Pets")) {
        setPetCount(1);
      }
      if (o === "Flight Attendant" && next.includes("Flight Attendant") && !paxTbd && pax > FA_MAX_PAX) {
        setPax(FA_MAX_PAX);
        flashNotice(
          "Having a flight attendant on board reduces the maximum passenger amount to 8."
        );
      }
      return next;
    });
  }

  function toggleCatering(c: string) {
    setCatering((prev) => {
      const next = prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c];
      if (c === "Allergies" && !next.includes("Allergies")) setAllergyDetails("");
      if (COUNTED_MEALS.includes(c)) {
        setMealCounts((counts) => {
          const copy = { ...counts };
          if (next.includes(c)) copy[c] = copy[c] ?? 1;
          else delete copy[c];
          return copy;
        });
      }
      return next;
    });
  }

  function setMealCount(type: string, delta: number) {
    setMealCounts((counts) => ({
      ...counts,
      [type]: Math.min(9, Math.max(1, (counts[type] ?? 1) + delta)),
    }));
  }

  const fmtAirport = (a: Airport) =>
    `${a.city} — ${a.name} (${a.iata || a.icao} / ${a.icao})`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "sending") return;
    setStatus("sending");

    // Legs travel in departure order regardless of how the boxes were
    // arranged — arrive-anchored legs order by their computed departure.
    const depMs = ({ l, c }: { l: LegState; c: LegCalc }) =>
      c.departure
        ? c.departure.utc.getTime()
        : new Date(`${l.date}T${l.time}`).getTime();
    const ordered = legs
      .map((l, i) => ({ l, c: calcs[i]! }))
      .sort((a, b) => depMs(a) - depMs(b));

    // Round trips only have one LegState (the outbound); the return leg
    // is synthesized below, so it's always keyed "out"/"ret" — multi-leg
    // segments are keyed by their (stable, reorder-proof) leg id.
    const requestsFor = (key: string) =>
      showAllTripsToggle && !allTrips
        ? (legOptions[key] ?? []).join(", ") || "—"
        : undefined;
    const passengersFor = (key: string) =>
      showAllTripsToggle && !paxAllTrips
        ? segPaxTbd(key)
          ? "TBD"
          : segPax(key)
        : undefined;

    const legPayload = ordered.map(({ l, c }) => {
      const key = tripType === "roundtrip" ? "out" : String(l.id);
      return {
        from: fmtAirport(l.from!),
        to: fmtAirport(l.to!),
        // Always the departure, even when the client anchored the arrival
        date: c.departure ? isoDateInZone(c.departure.utc, l.from!.tz) : l.date,
        time: c.departure ? isoTimeInZone(c.departure.utc, l.from!.tz) : l.time,
        distanceNm: Math.round(c.nm),
        speedKts: c.speed,
        flightTime: formatDuration(c.minutes),
        arrivalLocal: c.arrival
          ? `${c.arrival.timeStr}${
              c.arrival.shift > 0 ? ` (+${c.arrival.shift} day)` : ""
            }${l.timeMode === "arrive" ? " (requested)" : ""}`
          : "—",
        requests: requestsFor(key),
        passengers: passengersFor(key),
      };
    });

    if (tripType === "roundtrip" && returnCalc) {
      legPayload.push({
        from: fmtAirport(legs[0].to!),
        to: fmtAirport(legs[0].from!),
        date: returnCalc.departure
          ? isoDateInZone(returnCalc.departure.utc, legs[0].to!.tz)
          : retDate,
        time: returnCalc.departure
          ? isoTimeInZone(returnCalc.departure.utc, legs[0].to!.tz)
          : retTime,
        distanceNm: Math.round(returnCalc.nm),
        speedKts: returnCalc.speed,
        flightTime: formatDuration(returnCalc.minutes),
        arrivalLocal: returnCalc.arrival
          ? `${returnCalc.arrival.timeStr}${
              returnCalc.arrival.shift > 0 ? ` (+${returnCalc.arrival.shift} day)` : ""
            }${retTimeMode === "arrive" ? " (requested)" : ""}`
          : "—",
        requests: requestsFor("ret"),
        passengers: passengersFor("ret"),
      });
    }

    try {
      const res = await fetch("/api/charter-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripType: TRIP_TYPES.find((t) => t.id === tripType)!.label,
          legs: legPayload,
          passengers:
            showAllTripsToggle && !paxAllTrips
              ? "Varies by leg — see below"
              : paxTbd
                ? "TBD"
                : pax,
          under18:
            showAllTripsToggle && !paxAllTrips ? 0 : hasUnder18 ? under18Clamped : 0,
          under2: showAllTripsToggle && !paxAllTrips ? 0 : hasUnder2 ? under2Clamped : 0,
          options: showAllTripsToggle && !allTrips ? [] : options,
          pets: options.includes("Pets") ? petCount : null,
          slidingHours: options.includes("Sliding Departure") ? slidingHours : null,
          catering: options.includes("Catering")
            ? catering.map((c) =>
                COUNTED_MEALS.includes(c) ? `${c} ×${mealCounts[c] ?? 1}` : c
              )
            : [],
          allergyDetails:
            options.includes("Catering") && catering.includes("Allergies")
              ? allergyDetails
              : "",
          notes,
          clientType: clientType === "broker" ? "Broker" : "Individual",
          brokerage: clientType === "broker" ? brokerage.trim() : "",
          name,
          email,
          phone,
        }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-5 rounded-3xl glass px-8 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[20px] text-white">
          ✓
        </span>
        <p className="text-[22px] font-light text-navy">Request received.</p>
        <p className="max-w-sm text-[14px] font-light leading-relaxed text-ink-2">
          Our charter team will come back to you shortly with availability and
          a quote. For anything urgent, call{" "}
          <a
            href={`tel:${siteConfig.charterSalesPhone}`}
            className="whitespace-nowrap text-navy underline underline-offset-4"
          >
            {siteConfig.charterSalesPhoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[440px_1fr]">
      {/* ── Form ─────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="order-2 flex flex-col gap-8 rounded-3xl glass p-8 lg:order-1 sm:p-10"
      >
        {/* Trip type */}
        <div className="flex flex-col gap-2">
          <SegmentedToggle
            options={TRIP_TYPES}
            value={tripType}
            onChange={switchType}
            ariaLabel="Trip type"
            buttonClassName="px-2 py-2.5 text-[10px] font-medium tracking-[0.16em] whitespace-nowrap uppercase sm:text-[11px]"
          />
          <button
            type="button"
            onClick={clearAll}
            className="self-end text-[10px] font-medium tracking-[0.22em] text-ink-3 uppercase underline underline-offset-4 transition-colors hover:text-navy"
          >
            Clear All
          </button>
        </div>

        {/* Legs — keyed on the trip type so switching tabs fades the fields
            in rather than swapping them instantly */}
        {tripType !== "multi" ? (
          <div key={tripType} style={legFade} className="flex flex-col gap-5">
            <div className="relative flex flex-col gap-5">
              <AirportSearch
                label="From"
                placeholder="City or airport code (JFK, KTEB…)"
                value={legs[0].from}
                onChange={(a) => updateLeg(legs[0].id, { from: a })}
              />
              {/* branch already excludes multi — swap shows on one-way & round trip */}
              <button
                type="button"
                aria-label="Swap departure and destination"
                onClick={swapAirports}
                className="absolute top-[calc(50%+12px)] left-1/2 z-10 flex h-[27px] w-[27px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-navy/15 bg-white text-navy shadow-[0_6px_20px_rgba(12,29,61,0.14)] transition-colors hover:bg-navy hover:text-white"
              >
                <svg width="10.5" height="10.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M4 1 L4 10 M4 10 L1.5 7.5 M4 10 L6.5 7.5 M10 13 L10 4 M10 4 L7.5 6.5 M10 4 L12.5 6.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <AirportSearch
                label="To"
                placeholder="City or airport code (ASE, TJSJ…)"
                value={legs[0].to}
                onChange={(a) => updateLeg(legs[0].id, { to: a })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={microLabel}>
                  Date
                </label>
                <DateField
                  value={legs[0].date}
                  min={today}
                  onChange={(v) => updateLeg(legs[0].id, { date: v })}
                />
              </div>
              <div>
                <label className={microLabel}>Local Time</label>
                <TimeField
                  value={legs[0].time}
                  onChange={(v) => updateLeg(legs[0].id, { time: v })}
                />
                <div className="mt-2 flex justify-center">
                  <TimeModeToggle
                    value={legs[0].timeMode}
                    onChange={(m) => updateLeg(legs[0].id, { timeMode: m })}
                  />
                </div>
              </div>
            </div>
            <TimingLine
              calc={calcs[0]}
              from={legs[0].from}
              to={legs[0].to}
              mode={legs[0].timeMode}
            />

            {tripType === "roundtrip" && (
              <>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
                    Return
                  </span>
                  <span className="h-px flex-1 bg-border" />
                  {legs[0].from && legs[0].to && (
                    <span className="text-[10px] tracking-[0.18em] text-ink-3 uppercase">
                      {(legs[0].to.iata || legs[0].to.icao) +
                        " → " +
                        (legs[0].from.iata || legs[0].from.icao)}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={microLabel}>Date</label>
                    <DateField
                      value={retDate}
                      min={laterDate(returnMinDep?.date ?? "", legs[0].date || today)}
                      onChange={setRetDate}
                    />
                  </div>
                  <div>
                    <label className={microLabel}>Local Time</label>
                    <TimeField
                      value={retTime}
                      min={
                        returnMinDep && retDate === returnMinDep.date
                          ? returnMinDep.time
                          : undefined
                      }
                      onChange={setRetTime}
                    />
                    <div className="mt-2 flex justify-center">
                      <TimeModeToggle value={retTimeMode} onChange={setRetTimeMode} />
                    </div>
                  </div>
                </div>
                {returnTurnViolation && returnMinDep && (
                  <p className="text-[11px] font-light text-red-600">
                    The return can&apos;t depart within {TURN_MINUTES} minutes
                    of the outbound landing — earliest{" "}
                    {retTimeMode === "arrive" ? "arrival" : "departure"} is{" "}
                    {fmtMinDeparture(returnMinDep)} local.
                  </p>
                )}
                <TimingLine
                  calc={returnCalc}
                  from={legs[0].to}
                  to={legs[0].from}
                  mode={retTimeMode}
                />
              </>
            )}
          </div>
        ) : (
          <div key="multi" style={legFade} className="flex flex-col gap-5">
            {legs.map((leg, i) => (
              <div
                key={leg.id}
                draggable={dragArmed === leg.id}
                onDragStart={(e) => {
                  setDragId(leg.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId !== null && dragId !== leg.id) moveLeg(dragId, leg.id);
                  setDragId(null);
                  setDragArmed(null);
                }}
                onDragEnd={() => {
                  setDragId(null);
                  setDragArmed(null);
                }}
                className={`flex flex-col gap-4 rounded-2xl border border-border p-5 transition-opacity ${
                  dragId === leg.id ? "opacity-40" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {legs.length > 1 && (
                      <span
                        onMouseDown={() => setDragArmed(leg.id)}
                        onMouseUp={() => setDragArmed(null)}
                        aria-label={`Drag to reorder leg ${i + 1}`}
                        title="Drag to reorder"
                        className="cursor-grab text-[13px] leading-none text-ink-3 select-none active:cursor-grabbing"
                      >
                        ⠿
                      </span>
                    )}
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-navy/25 text-[10px] font-semibold text-navy">
                      {i + 1}
                    </span>
                    <span className="text-[10px] font-semibold tracking-[0.28em] text-navy uppercase">
                      Leg {i + 1}
                    </span>
                  </div>
                  {legs.length > 2 && (
                    <button
                      type="button"
                      aria-label={`Remove leg ${i + 1}`}
                      onClick={() => removeLeg(leg.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[14px] text-ink-3 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </div>
                <AirportSearch
                  label="From"
                  placeholder="City or airport code"
                  value={leg.from}
                  onChange={(a) => updateLeg(leg.id, { from: a })}
                />
                <AirportSearch
                  label="To"
                  placeholder="City or airport code"
                  value={leg.to}
                  onChange={(a) => updateLeg(leg.id, { to: a })}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={microLabel}>Date</label>
                    <DateField
                      value={leg.date}
                      min={laterDate(today, minDeps[i]?.date ?? "")}
                      onChange={(v) => updateLeg(leg.id, { date: v })}
                    />
                  </div>
                  <div>
                    <label className={microLabel}>Local Time</label>
                    <TimeField
                      value={leg.time}
                      min={
                        minDeps[i] && leg.date === minDeps[i]!.date
                          ? minDeps[i]!.time
                          : undefined
                      }
                      onChange={(v) => updateLeg(leg.id, { time: v })}
                    />
                    <div className="mt-2 flex justify-center">
                      <TimeModeToggle
                        value={leg.timeMode}
                        onChange={(m) => updateLeg(leg.id, { timeMode: m })}
                      />
                    </div>
                  </div>
                </div>
                {legTurnViolations[i] && minDeps[i] && (
                  <p className="text-[11px] font-light text-red-600">
                    Leg {i + 1} can&apos;t depart within {TURN_MINUTES} minutes
                    of leg {i} landing — earliest{" "}
                    {leg.timeMode === "arrive" ? "arrival" : "departure"} is{" "}
                    {fmtMinDeparture(minDeps[i]!)} local.
                  </p>
                )}
                <TimingLine
                  calc={calcs[i]}
                  from={leg.from}
                  to={leg.to}
                  mode={leg.timeMode}
                />
              </div>
            ))}

            {legs.length < MAX_LEGS && (
              <button
                type="button"
                onClick={addLeg}
                className="rounded-2xl border border-dashed border-navy/25 px-4 py-3.5 text-[11px] font-medium tracking-[0.24em] text-ink-2 uppercase transition-colors hover:border-navy/50 hover:text-navy"
              >
                + Add Leg
              </button>
            )}
          </div>
        )}

        <hr className="border-border" />

        {/* Who's booking — gates how much of the form is shown. Individuals
            get a passenger count and nothing else; brokers, who are quoting
            on someone else's behalf, get the full detail. */}
        <SegmentedToggle
          options={CLIENT_TYPES}
          value={clientType}
          onChange={switchClientType}
          ariaLabel="Client type"
          buttonClassName="px-2 py-2.5 text-[10px] font-medium tracking-[0.16em] uppercase sm:text-[11px]"
        />

        {/* Passengers */}
        <div>
          <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <label className="block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
              {isBroker ? "Adult Passengers" : "Passengers"}
            </label>
            {showAllTripsToggle && (
              <button
                type="button"
                aria-pressed={paxAllTrips}
                onClick={() => setPaxAllTrips((v) => !v)}
                className={`justify-self-center rounded-full border px-4 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                  paxAllTrips
                    ? "glass-selected text-white"
                    : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                }`}
              >
                All Trips
              </button>
            )}
            <span />
          </div>

          {showAllTripsToggle && !paxAllTrips ? (
            <div className="flex flex-col gap-3">
              {segments.map((seg) => (
                <div
                  key={seg.key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4"
                >
                  <span className="text-[10px] font-semibold tracking-[0.24em] text-navy uppercase">
                    {seg.label}
                    {seg.from && seg.to
                      ? ` · ${seg.from.iata || seg.from.icao} → ${seg.to.iata || seg.to.icao}`
                      : ""}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Fewer passengers — ${seg.label}`}
                      onClick={() => bumpSegPax(seg.key, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={segPaxTbd(seg.key) || segPax(seg.key) <= 1}
                    >
                      −
                    </button>
                    <span
                      className={`w-5 text-center text-[15px] font-light ${
                        segPaxTbd(seg.key) ? "text-ink-3" : "text-navy"
                      }`}
                    >
                      {segPaxTbd(seg.key) ? "—" : segPax(seg.key)}
                    </span>
                    <button
                      type="button"
                      aria-label={`More passengers — ${seg.label}`}
                      onClick={() => bumpSegPax(seg.key, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={segPaxTbd(seg.key) || segPax(seg.key) >= segPaxCap(seg.key)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      aria-pressed={segPaxTbd(seg.key)}
                      onClick={() => toggleSegPaxTbd(seg.key)}
                      className={`rounded-full border px-3 py-1 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                        segPaxTbd(seg.key)
                          ? "glass-selected text-white"
                          : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                      }`}
                    >
                      TBD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-y-3 gap-x-5">
                <button
                  type="button"
                  aria-label="Fewer passengers"
                  onClick={() => setPax((p) => Math.max(1, p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-[18px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                  disabled={paxTbd || pax <= 1}
                >
                  −
                </button>
                <span
                  className={`w-8 text-center text-[20px] font-light ${paxTbd ? "text-ink-3" : "text-navy"}`}
                >
                  {paxTbd ? "—" : pax}
                </span>
                <button
                  type="button"
                  aria-label="More passengers"
                  onClick={() => setPax((p) => Math.min(adultsCap, p + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-[18px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                  disabled={paxTbd || pax >= adultsCap}
                >
                  +
                </button>
                <span className="text-[11px] tracking-[0.2em] text-ink-3 uppercase">
                  Max {adultsCap}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isBroker && (
                  <>
                    <button
                      type="button"
                      aria-pressed={hasUnder18}
                      onClick={() => setHasUnder18((v) => !v)}
                      className={`rounded-full border px-3.5 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                        hasUnder18
                          ? "glass-selected text-white"
                          : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                      }`}
                    >
                      Under 18
                    </button>
                    <button
                      type="button"
                      aria-pressed={hasUnder2}
                      onClick={() => setHasUnder2((v) => !v)}
                      className={`rounded-full border px-3.5 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                        hasUnder2
                          ? "glass-selected text-white"
                          : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                      }`}
                    >
                      Under 2
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-pressed={paxTbd}
                  onClick={() => setPaxTbd((v) => !v)}
                  className={`rounded-full border px-3.5 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                    paxTbd
                      ? "glass-selected text-white"
                      : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                  }`}
                >
                  TBD
                </button>
              </div>

              {isBroker && hasUnder18 && (
                <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
                  <span className="text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
                    Under 18
                  </span>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                    <button
                      type="button"
                      aria-label="Fewer under-18 passengers"
                      onClick={() => setUnder18((v) => Math.max(0, Math.min(under18Cap, v) - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={under18Clamped <= 0}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-[15px] font-light text-navy">
                      {under18Clamped}
                    </span>
                    <button
                      type="button"
                      aria-label="More under-18 passengers"
                      onClick={() => setUnder18((v) => Math.min(under18Cap, Math.max(0, v) + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={under18Clamped >= under18Cap}
                    >
                      +
                    </button>
                    <span className="text-[11px] tracking-[0.2em] text-ink-3 uppercase">
                      Max {under18Cap}
                    </span>
                  </div>
                  <p className="text-[11px] font-light text-ink-3">
                    Of your total passenger count — at least one adult must stay
                    on board.
                  </p>
                </div>
              )}

              {isBroker && hasUnder2 && (
                <div className="flex flex-col gap-2 rounded-2xl border border-border p-4">
                  <span className="text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
                    Under 2
                  </span>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                    <button
                      type="button"
                      aria-label="Fewer under-2 passengers"
                      onClick={() => setUnder2((v) => Math.max(0, Math.min(under2Cap, v) - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={under2Clamped <= 0}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-[15px] font-light text-navy">
                      {under2Clamped}
                    </span>
                    <button
                      type="button"
                      aria-label="More under-2 passengers"
                      onClick={() => setUnder2((v) => Math.min(under2Cap, Math.max(0, v) + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={under2Clamped >= under2Cap}
                    >
                      +
                    </button>
                    <span className="text-[11px] tracking-[0.2em] text-ink-3 uppercase">
                      Max {under2Cap}
                    </span>
                  </div>
                  <p className="text-[11px] font-light text-ink-3">
                    Under-2s may sit in an infant seat or on an adult&apos;s lap —
                    a minor can&apos;t hold one.
                  </p>
                </div>
              )}

              {isBroker && ((hasUnder18 && under18Clamped > 0) || (hasUnder2 && under2Clamped > 0)) && (
                <p className="text-[11px] font-light text-ink-3">
                  For international travel, if a child or infant is traveling
                  without both parents, a travel consent letter is required
                  from the parent who is not traveling.
                </p>
              )}
            </div>
          )}
        </div>

        {notice && (
          <div
            className="rounded-2xl glass px-4 py-3"
            style={{ animation: "pageFade 0.3s ease both" }}
          >
            <p className="mb-1 text-[10px] font-semibold tracking-[0.22em] text-navy uppercase">
              Notice
            </p>
            <p className="text-[11px] font-light leading-relaxed text-ink-2">{notice}</p>
          </div>
        )}

        {/* Options — broker-only. Someone booking their own trip gets a
            clean form; a broker quoting for a client needs the full
            amenity detail up front. */}
        {isBroker && (
        <div>
          <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <label className="block text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
              Options
            </label>
            {showAllTripsToggle && (
              <button
                type="button"
                aria-pressed={allTrips}
                onClick={() => setAllTrips((v) => !v)}
                className={`justify-self-center rounded-full border px-4 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                  allTrips
                    ? "glass-selected text-white"
                    : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                }`}
              >
                All Trips
              </button>
            )}
            <span />
          </div>

          {showAllTripsToggle && !allTrips ? (
            <div className="flex flex-col gap-3">
              {segments.map((seg) => (
                <div
                  key={seg.key}
                  className="flex flex-col gap-2.5 rounded-2xl border border-border p-4"
                >
                  <span className="text-[10px] font-semibold tracking-[0.24em] text-navy uppercase">
                    {seg.label}
                    {seg.from && seg.to
                      ? ` · ${seg.from.iata || seg.from.icao} → ${seg.to.iata || seg.to.icao}`
                      : ""}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {OPTION_CHIPS.map((o) => {
                      const on = (legOptions[seg.key] ?? []).includes(o);
                      return (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleLegOption(seg.key, o)}
                          className={`rounded-full border px-3.5 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                            on
                              ? "glass-selected text-white"
                              : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="text-[11px] font-light text-ink-3">
                Select at least one request per leg — or TBD if you&apos;d
                rather decide later.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {OPTION_CHIPS.map((o) => {
                const on = options.includes(o);
                return (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleOption(o)}
                    className={`rounded-full border px-4 py-2 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors ${
                      on
                        ? "glass-selected text-white"
                        : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          )}

          {options.includes("Flight Attendant") && (
            <p className="mt-4 text-[11px] font-light text-ink-3">
              Flight attendant may require additional costs.
            </p>
          )}

          {options.includes("Bed") && (
            <p className="mt-4 text-[11px] font-light text-ink-3">
              Selecting a bed will reduce the maximum passenger capacity to 7 or
              8, depending on the aircraft&apos;s cabin configuration.
            </p>
          )}

          {options.includes("Pets") && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border p-4">
              <span className="text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
                How Many Pets?
              </span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Fewer pets"
                  onClick={() => setPetCount((p) => Math.max(1, p - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                  disabled={petCount <= 1}
                >
                  −
                </button>
                <span className="w-7 text-center text-[15px] font-light text-navy">
                  {petCount}
                </span>
                <button
                  type="button"
                  aria-label="More pets"
                  onClick={() => setPetCount((p) => Math.min(MAX_PETS, p + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                  disabled={petCount >= MAX_PETS}
                >
                  +
                </button>
              </div>
              <p className="text-[11px] font-light text-ink-3">
                Cleaning fee may be required after the trip.
              </p>
            </div>
          )}

          {options.includes("Sliding Departure") && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border p-4">
              <span className="text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
                Sliding Window
              </span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Fewer sliding hours"
                  onClick={() => setSlidingHours((h) => Math.max(1, h - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                  disabled={slidingHours <= 1}
                >
                  −
                </button>
                <span className="w-14 text-center text-[15px] font-light text-navy">
                  {slidingHours} h
                </span>
                <button
                  type="button"
                  aria-label="More sliding hours"
                  onClick={() => setSlidingHours((h) => Math.min(12, h + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-[15px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                  disabled={slidingHours >= 12}
                >
                  +
                </button>
              </div>
              <p className="text-[11px] font-light text-ink-3">
                Hours after requested departure time. Additional fees may be
                incurred.
              </p>
            </div>
          )}

          {options.includes("Catering") && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-border p-4">
              <span className="text-[10px] font-medium tracking-[0.25em] text-ink-3 uppercase">
                Catering Preferences
              </span>
              <div className="flex flex-wrap gap-2">
                {[...MEAL_TYPES, "Allergies"].map((c) => {
                  const on = catering.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleCatering(c)}
                      className={`rounded-full border px-3.5 py-1.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
                        on
                          ? "glass-selected text-white"
                          : "border-border text-ink-2 hover:border-navy/40 hover:text-navy"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              {COUNTED_MEALS.filter((c) => catering.includes(c)).map((c) => (
                <div
                  key={c}
                  className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5"
                >
                  <span className="text-[10px] font-medium tracking-[0.2em] text-ink-2 uppercase">
                    {c} meals
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Fewer ${c} meals`}
                      onClick={() => setMealCount(c, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-[13px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={(mealCounts[c] ?? 1) <= 1}
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-[14px] font-light text-navy">
                      {mealCounts[c] ?? 1}
                    </span>
                    <button
                      type="button"
                      aria-label={`More ${c} meals`}
                      onClick={() => setMealCount(c, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-[13px] text-navy transition-colors hover:bg-navy-light disabled:opacity-30"
                      disabled={(mealCounts[c] ?? 1) >= 9}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              {catering.includes("Allergies") && (
                <textarea
                  value={allergyDetails}
                  onChange={(e) => setAllergyDetails(e.target.value)}
                  rows={3}
                  placeholder="Tell us about any allergies we should plan around…"
                  className={`${inputCls} resize-none placeholder:text-ink-3/60`}
                />
              )}
            </div>
          )}
        </div>
        )}

        <hr className="border-border" />

        {/* Contact — the Individual/Broker slider that used to open this
            block now sits above Passengers, since it decides how much of
            the form appears. */}
        <div className="flex flex-col gap-4">
          {isBroker && (
            <div>
              <label className={microLabel}>Brokerage Name *</label>
              <input
                type="text"
                value={brokerage}
                onChange={(e) => setBrokerage(e.target.value)}
                className={inputCls}
              />
            </div>
          )}
          <div>
            <label className={microLabel}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={microLabel}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={microLabel}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          {!contactOk && (name !== "" || email !== "" || phone !== "") && (
            <p className="text-[11px] font-light text-ink-3">
              Please provide an email or a phone number so we can reach you.
            </p>
          )}
          <div>
            <label className={microLabel}>Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Anything else we should know — catering preferences, ground transport details, special requests…"
              className={`${inputCls} resize-none placeholder:text-ink-3/60`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || status === "sending"}
          className="mt-1 glass-selected rounded-full px-8 py-4 text-[11px] font-medium tracking-[0.3em] text-white uppercase transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {status === "sending" ? "Sending…" : "Send Request"}
        </button>

        {status === "error" && (
          <p className="text-center text-[12px] text-red-600">
            Something went wrong — please try again, or call{" "}
            {siteConfig.charterSalesPhoneDisplay}.
          </p>
        )}

        <p className="text-center text-[11px] font-light text-ink-3">
          Prefer to talk?{" "}
          <a
            href={`tel:${siteConfig.charterSalesPhone}`}
            className="text-navy underline underline-offset-4"
          >
            Call Charter Sales
          </a>
        </p>
      </form>

      {/* ── Map ─────────────────────────────────────────── */}
      <div className="order-1 lg:sticky lg:top-28 lg:order-2">
        <RouteMap routes={mapRoutes} pending={pendingAirports} notices={mapNotices} />
        <p className="mt-4 text-center text-[11px] font-light tracking-[0.06em] text-ink-3">
          Estimated flight time is shown — weather and airspace restrictions
          may impact it.
        </p>
      </div>
    </div>
  );
}
