/**
 * Shared between the /charter server page (which resolves ?tab= before
 * render) and the client BookTabs component. Kept out of the "use client"
 * module on purpose: exports from a client module can't be *called* on the
 * server, only rendered or passed as props.
 */
export type Tab = "contact" | "planner" | "asap";

export const isTab = (v: unknown): v is Tab =>
  v === "contact" || v === "planner" || v === "asap";
