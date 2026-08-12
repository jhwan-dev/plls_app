import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones/other devices on the LAN load dev assets when testing against
  // this machine's LAN IP — Next.js dev mode blocks cross-origin requests for
  // _next/* assets from unlisted hosts. This machine's IP changes per Wi-Fi
  // network, so both recently-seen addresses are listed.
  // Tunnel hostnames change each time a tunnel restarts (free/quick tunnels) —
  // update this when a new one is issued. Switched from ngrok to Cloudflare's
  // quick tunnel because ngrok's free-tier warning interstitial breaks links
  // opened from in-app browsers (Instagram, KakaoTalk, etc.) that don't carry
  // the "already clicked through" cookie a regular browser would have.
  allowedDevOrigins: [
    "192.168.0.13",
    "172.29.113.188",
    "172.20.10.2",
    "bonus-swore-squeezing.ngrok-free.dev",
    "bonus-zone-smell-nature.trycloudflare.com",
    "suffered-preliminary-happen-retreat.trycloudflare.com",
    "automotive-inputs-pull-ministries.trycloudflare.com",
    "kentucky-obtaining-organizer-giants.trycloudflare.com",
  ],
  images: {
    // Every image we render is a Deezer CDN cover that's already sized
    // appropriately (cover_medium etc.) — there's nothing for Next's
    // optimizer to usefully resize, so skip proxying them through our own
    // server. This also sidesteps Next's SSRF guard misfiring on carrier
    // NAT64 addresses (e.g. testing over a phone hotspot on an IPv6-only
    // network), since the browser fetches the image directly instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.dzcdn.net",
      },
      {
        protocol: "https",
        hostname: "api.deezer.com",
      },
    ],
  },
};

export default nextConfig;
