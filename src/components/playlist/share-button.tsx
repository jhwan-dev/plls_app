"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
}

export function ShareButton({ title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User dismissed the native share sheet — not an error.
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button type="button" variant="outline" onClick={handleShare} className="shrink-0">
      {copied ? (
        <>
          <Check className="size-4" />
          링크 복사됨
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          공유하기
        </>
      )}
    </Button>
  );
}
