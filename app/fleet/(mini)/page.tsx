import type { Metadata } from 'next';
import OrbitScene from '@/components/fleet/OrbitScene';

export const metadata: Metadata = {
  title: 'The Fleet | Craft',
  description: "Craft's fleet of private charter aircraft.",
};

/* The sky and cloud deck behind this page are rendered by the site chrome
   (components/RouteSky), so they can span the viewport and carry on behind
   the footer instead of stopping where the orbit scene ends. */
export default function HomePage() {
  return <OrbitScene />;
}
