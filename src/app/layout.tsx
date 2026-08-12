import type { Metadata } from "next";
import { Geist, Geist_Mono, Black_Han_Sans } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import { QueryProvider } from "@/components/providers/query-provider";
import { GlobalAudioPlayer } from "@/components/player/global-audio-player";
import { MiniPlayer } from "@/components/player/mini-player";
import { SiteHeader } from "@/components/layout/site-header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileContentOffset } from "@/components/layout/mobile-content-offset";
import { SplashScreen } from "@/components/brand/splash-screen";
import { Toaster } from "@/components/ui/toast";
import { displayName } from "@/lib/user-display";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Bold poster-weight display face for headlines and the wordmark — carries
// Korean and Latin glyphs equally, so "PLLS" and "오늘의 취향을 골라보세요"
// headlines read with the same editorial weight instead of one falling back
// to a system font.
const blackHanSans = Black_Han_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "PLLS — Playlist Sharing",
    template: "%s | PLLS",
  },
  description: "Search Deezer tracks and build a playlist you can share.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth();

  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${blackHanSans.variable} min-h-[100dvh] antialiased`}
    >
      {/* dvh (not vh) — vh is known to misreport on some in-app browsers
          (e.g. Instagram's) whose chrome height changes without resizing
          the layout viewport. */}
      <body className="min-h-[100dvh] flex flex-col">
        <SplashScreen />
        <QueryProvider>
          <Toaster>
            <SiteHeader session={session} />
            <MobileContentOffset>{children}</MobileContentOffset>
            <GlobalAudioPlayer />
            <MiniPlayer />
            <BottomNav
            userId={session?.user?.id}
            userImage={session?.user?.image ?? null}
            userName={session?.user ? displayName(session.user) : null}
          />
          </Toaster>
        </QueryProvider>
      </body>
    </html>
  );
}
