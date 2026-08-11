"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import ProgramEnquiryDialog from "./ProgramEnquiryDialog";
import { programBySlug, type ProgramSlug } from "@/lib/programs";

/* The dialog portals into <body>, which needs a real document, and a
   portal contributes no server markup — so rendering it during SSR is
   both impossible and a hydration mismatch waiting to happen. This is
   the sanctioned way to ask "are we past hydration yet": it returns the
   server snapshot through SSR and hydration, then flips. */
const NEVER_CHANGES = () => () => {};
function useHydrated() {
  return useSyncExternalStore(
    NEVER_CHANGES,
    () => true,
    () => false,
  );
}

/**
 * Owns which enquiry dialog is open, for the whole /programs page.
 *
 * One owner rather than one per card, for two reasons: only a single
 * dialog can ever be open, and the Programs nav menu can ask for one by
 * name. Those menu links point at /programs?enquire=<slug>, the page
 * resolves that against lib/programs on the server, and the resolved
 * programme arrives here as `initialSlug` — the raw query string never
 * reaches the client.
 */
const OpenContext = createContext<(slug: ProgramSlug) => void>(() => {});

export function ProgramEnquiryProvider({
  initialSlug,
  children,
}: {
  initialSlug?: ProgramSlug;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrated = useHydrated();

  /* The URL is the default answer to "which dialog is open"; `choice` is
     the local override once someone clicks a card or closes the dialog.
     Deriving it this way rather than syncing in an effect means arriving
     at /programs?enquire=leaseback renders with the dialog already open,
     instead of opening it a frame later. */
  const [choice, setChoice] = useState<ProgramSlug | null | undefined>(
    undefined,
  );

  /* Re-navigating to the same page with a different (or repeated) query
     hands control back to the URL. Adjusting state during render is
     React's own pattern for this and re-renders before anything paints. */
  const [lastFromUrl, setLastFromUrl] = useState(initialSlug);
  const [urlNonce, setUrlNonce] = useState(0);
  if (lastFromUrl !== initialSlug) {
    setLastFromUrl(initialSlug);
    setChoice(undefined);
    setUrlNonce((n) => n + 1);
  }

  const openSlug = choice === undefined ? (initialSlug ?? null) : choice;

  const open = useCallback((slug: ProgramSlug) => setChoice(slug), []);

  const close = useCallback(() => {
    setChoice(null);
    /* Drop the query param so choosing the same programme from the menu
       again is a fresh navigation, and a reload doesn't reopen it. */
    if (initialSlug) router.replace("/programs", { scroll: false });
  }, [initialSlug, router]);

  const program = openSlug ? programBySlug(openSlug) : undefined;

  return (
    <OpenContext.Provider value={open}>
      {children}
      {hydrated && program ? (
        // Remounts when the URL asks for a different programme, so the
        // form never carries one programme's answers into another.
        <ProgramEnquiryDialog
          key={`${program.slug}-${urlNonce}`}
          program={program}
          onClose={close}
        />
      ) : null}
    </OpenContext.Provider>
  );
}

/** The Contact Us button on a programme card. */
export function ProgramEnquireButton({ slug }: { slug: ProgramSlug }) {
  const open = useContext(OpenContext);
  return (
    <button
      type="button"
      onClick={() => open(slug)}
      aria-haspopup="dialog"
      className="glass-selected glass-btn rounded-full px-7 py-3.5 text-[11px] font-medium tracking-[0.24em] text-white uppercase"
    >
      Contact Us
    </button>
  );
}
