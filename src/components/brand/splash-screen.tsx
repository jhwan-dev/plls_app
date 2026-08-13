"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SESSION_KEY = "plls-splash-shown";

function subscribe() {
  // Never changes after mount within a session — no external updates to subscribe to.
  return () => {};
}

function getSnapshot() {
  return sessionStorage.getItem(SESSION_KEY) === null;
}

function getServerSnapshot() {
  return false;
}

/**
 * Brief P → PLLS brand moment shown once per browser session, on first
 * load only — not on every client-side navigation. Kept deliberately
 * simple (opacity/scale only, no flashy motion) per brand guidelines.
 */
export function SplashScreen() {
  // useSyncExternalStore (not a useEffect + setState) is what lets this read
  // sessionStorage without a hydration mismatch — SSR always sees
  // getServerSnapshot's `false`, then the client corrects to the real value.
  const shouldShow = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [stage, setStage] = useState<"mark" | "wordmark" | "out">("mark");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!shouldShow) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    const toWordmark = setTimeout(() => setStage("wordmark"), 500);
    const toOut = setTimeout(() => setStage("out"), 950);
    const unmount = setTimeout(() => setDismissed(true), 1250);
    return () => {
      clearTimeout(toWordmark);
      clearTimeout(toOut);
      clearTimeout(unmount);
    };
  }, [shouldShow]);

  if (!shouldShow || dismissed) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-background transition-opacity duration-300 motion-reduce:transition-none",
        stage === "out" ? "opacity-0" : "opacity-100",
      )}
    >
      <span
        className={cn(
          "relative h-14 w-auto transition-transform duration-500 motion-reduce:transition-none",
          stage === "mark" ? "scale-100" : "scale-90",
        )}
        style={{ aspectRatio: "623 / 780" }}
      >
        <Image src="/brand/p-symbol.png" alt="" fill sizes="112px" className="object-contain" priority />
      </span>

      <span
        className={cn(
          "relative h-7 w-auto transition-opacity duration-500 motion-reduce:transition-none",
          stage === "mark" ? "opacity-0" : "opacity-100",
        )}
        style={{ aspectRatio: "1267 / 405" }}
      >
        <Image src="/brand/plls-wordmark.png" alt="PLLS" fill sizes="184px" className="object-contain" />
      </span>
    </div>
  );
}
