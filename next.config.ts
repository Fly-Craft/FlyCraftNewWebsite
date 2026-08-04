import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones/tablets on the local network load dev assets when testing
  // via http://<mac-ip>:3001 — without this, Next blocks all /_next/*
  // requests from non-localhost origins and the site renders with no JS.
  allowedDevOrigins: ["192.168.50.212", "192.168.50.*"],

  // About Us and Safety merged into /company; Glidepath lost its nav tab but
  // kept its page. Anyone holding an old link still lands somewhere useful.
  async redirects() {
    return [
      { source: "/about", destination: "/company", permanent: true },
      { source: "/safety", destination: "/company", permanent: true },
    ];
  },
};

export default nextConfig;
