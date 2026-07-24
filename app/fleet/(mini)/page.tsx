import type { Metadata } from 'next';
import OrbitScene from '@/components/fleet/OrbitScene';
import Footer from '@/components/fleet/Footer';

export const metadata: Metadata = {
  title: 'The Fleet | Craft',
  description: "Craft's curated fleet of private charter aircraft.",
};

export default function HomePage() {
  return (
    <>
      <OrbitScene />
      <Footer variant="light" />
    </>
  );
}
