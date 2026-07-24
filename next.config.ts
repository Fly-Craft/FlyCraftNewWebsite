import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones/tablets on the local network load dev assets when testing
  // via http://<mac-ip>:3001 — without this, Next blocks all /_next/*
  // requests from non-localhost origins and the site renders with no JS.
  allowedDevOrigins: ["192.168.50.212", "192.168.50.*"],
};

export default nextConfig;
