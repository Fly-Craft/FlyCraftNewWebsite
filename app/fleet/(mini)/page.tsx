import type { Metadata } from 'next';
import OrbitScene from '@/components/fleet/OrbitScene';
import Footer from '@/components/fleet/Footer';
import SkyBackdrop from '@/components/SkyBackdrop';

export const metadata: Metadata = {
  title: 'The Fleet | Craft',
  description: "Craft's fleet of private charter aircraft.",
};

export default function HomePage() {
  return (
    <>
      <SkyBackdrop />
      <OrbitScene />
      <Footer variant="light" />
    </>
  );
}
