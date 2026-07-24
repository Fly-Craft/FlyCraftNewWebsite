import PageFade from "@/components/PageFade";

// Gives each page a soft fade-in on every route change.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageFade>{children}</PageFade>;
}
