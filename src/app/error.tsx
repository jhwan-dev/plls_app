"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
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
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <AlertTriangle className="size-8 text-muted-foreground" />
      <h1 className="text-lg font-semibold">문제가 발생했어요</h1>
      <p className="text-sm text-muted-foreground">
        페이지를 불러오는 중 오류가 생겼어요. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex gap-2">
        <Button type="button" onClick={retry}>
          다시 시도
        </Button>
        <Button type="button" variant="outline" render={<Link href="/" />}>
          홈으로
        </Button>
      </div>
    </div>
  );
}
