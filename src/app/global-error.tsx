"use client";

import { useEffect } from "react";
import "./globals.css";

// Catches errors thrown by the root layout itself (e.g. the header's
// session lookup) — regular error.tsx can't, since it doesn't wrap its own
// segment's layout. Must render its own <html>/<body>: this replaces the
// entire root layout when active, so nothing from layout.tsx renders here.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center text-foreground antialiased">
        <h1 className="text-lg font-semibold">문제가 발생했어요</h1>
        <p className="text-sm text-muted-foreground">
          페이지를 불러오는 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={retry}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            다시 시도
          </button>
          {/*
            A plain <a>, not next/link — this fallback fires when the root
            layout itself crashed, so it can't lean on the app's router context.
          */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium"
          >
            홈으로
          </a>
        </div>
      </body>
    </html>
  );
}
