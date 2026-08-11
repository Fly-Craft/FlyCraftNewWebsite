import type { Metadata } from 'next';
import Link from 'next/link';
import { AIRCRAFT } from '@/lib/fleet-aircraft';

export const metadata: Metadata = {
  title: 'Menu | Craft Fleet',
  description: "Craft's in-flight menu and snacks.",
};

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { from } = await searchParams;

  /* Resolve ?from against the real fleet rather than trusting it — the href
     is built from the matched aircraft, so an arbitrary value in the URL can
     never become a link. Arriving from the FAQ or directly leaves no
     aircraft to return to, so fall back to the fleet index. */
  const origin = AIRCRAFT.find((a) => a.slug === from);
  const backHref = origin ? `/fleet/${origin.slug}` : '/fleet';
  // The visible label is just "Back" — the destination still varies, so
  // the accessible name spells out where it actually goes.
  const backDest = origin
    ? `Challenger ${origin.model} · ${origin.tail}`
    : 'The Fleet';

  return (
    <>
      <Link href={backHref} className="menu-back" aria-label={`Back to ${backDest}`}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M8.5 2 L3.5 7 L8.5 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back
      </Link>

      {/* ── MENU CONTENT ──────────────────────────────────────── */}
      <div className="menu-page">

        {/* Left: menu image */}
        <div className="menu-page-left">
          <img src="/assets/menu-snacks.jpg" alt="Craft in-flight menu" className="menu-page-img" />
        </div>

        {/* Right: snack grid */}
        <div className="snack-grid-bg">
          <p className="snack-grid-intro">Partnering with Luxury Gourmet Sweets, we&apos;ve developed a snack selection made specifically for our clients. Each item is chosen for quality, and the whole range is served on board.</p>
        <div className="menu-page-right">

          <div className="snack-card">
            <div className="snack-card-title">Classic Gummy Bears</div>
            <img src="/assets/Snacks/Gummy.png" alt="Classic Gummy Bears" className="snack-card-img" />
            <p className="snack-card-desc">Soft, fruity, and colorful. A timeless treat served in a generous 110g jar.</p>
          </div>

          <div className="snack-card">
            <div className="snack-card-title">Peanut M&amp;M&apos;s</div>
            <img src="/assets/Snacks/MNM.png" alt="Peanut M&M's" className="snack-card-img" />
            <p className="snack-card-desc">Crunchy whole peanuts wrapped in smooth milk chocolate and a crisp candy shell.</p>
            <span className="snack-card-kosher">Kosher</span>
          </div>

          <div className="snack-card">
            <div className="snack-card-title">Honey Mustard Pretzels</div>
            <img src="/assets/Snacks/Mustard.png" alt="Honey Mustard Pretzels" className="snack-card-img" />
            <p className="snack-card-desc">Golden pretzels glazed with a perfectly balanced sweet and tangy honey mustard coating.</p>
            <span className="snack-card-kosher">Kosher</span>
          </div>

          <div className="snack-card">
            <div className="snack-card-title">Premium Nut Blend</div>
            <img src="/assets/Snacks/Nuts.png" alt="Premium Nut Blend" className="snack-card-img" />
            <p className="snack-card-desc">A roasted mix of cashews, almonds, and pistachios for a satisfying savory bite.</p>
            <span className="snack-card-kosher">Kosher</span>
          </div>

          <div className="snack-card">
            <div className="snack-card-title">Sweet Peach Slices</div>
            <img src="/assets/Snacks/Peach.png" alt="Sweet Peach Slices" className="snack-card-img" />
            <p className="snack-card-desc">Sweet and chewy peach-flavored rings with a soft, sugar-dusted fruity center.</p>
          </div>

          <div className="snack-card">
            <div className="snack-card-title">Crisp Plantain Bites</div>
            <img src="/assets/Snacks/Plantain.png" alt="Crisp Plantain Bites" className="snack-card-img" />
            <p className="snack-card-desc">Light and crispy plantain bites with a naturally sweet, tropical flavor in every crunch.</p>
            <span className="snack-card-kosher">Kosher</span>
          </div>

        </div>
        </div>
      </div>

    </>
  );
}
