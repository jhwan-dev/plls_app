import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans_KR, Space_Mono, Silkscreen, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { ChromeVisibility } from "@/components/layout/chrome-visibility";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileContentOffset } from "@/components/layout/mobile-content-offset";
import { SplashScreen } from "@/components/brand/splash-screen";
import { Toaster } from "@/components/ui/toast";

// Retro LCD/mono type system (see "PLLS Redesign" design doc, turns 6-7):
// IBM Plex Mono carries body/list text, Space Mono carries screen and
// section titles, and Silkscreen carries short all-caps/numeric meta
// (counts, durations) — never Korean, which mixes badly with a pixel face.
// IBM Plex Sans KR rides along in every stack below as the Hangul fallback,
// so Korean titles/nicknames/body copy render in the same Plex family
// instead of dropping to a system font per-glyph.
const plexMono = IBM_Plex_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexSansKr = IBM_Plex_Sans_KR({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono-title",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// The wordmark only (masthead, splash) — a real bitmap face, not a decorative
// afterthought. Never used for running UI text, see globals.css's --font-word.
const pressStart2p = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "PLLS — Playlist Sharing",
    template: "%s | PLLS",
  },
  description: "Search for tracks and build a playlist you can share.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="ko"
      className={`${plexMono.variable} ${plexSansKr.variable} ${spaceMono.variable} ${silkscreen.variable} ${pressStart2p.variable} min-h-[100dvh] antialiased`}
    >
      {/* dvh (not vh) — vh is known to misreport on some in-app browsers
          (e.g. Instagram's) whose chrome height changes without resizing
          the layout viewport. */}
      <body className="min-h-[100dvh] flex flex-col">
        <SplashScreen />
        <QueryProvider>
          <Toaster>
            <ChromeVisibility>
              <SiteHeader session={session} />
            </ChromeVisibility>
            <MobileContentOffset>{children}</MobileContentOffset>
            <BottomNav userId={session?.user?.id} />
          </Toaster>
        </QueryProvider>
      </body>
    </html>
  );
}
