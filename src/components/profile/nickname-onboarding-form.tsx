"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseJsonResponse } from "@/lib/api/http";

interface UpdateNicknameResponse {
  nickname: string;
}

export function NicknameOnboardingForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch("/api/account/nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: value }),
      });
      await parseJsonResponse<UpdateNicknameResponse>(response);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="닉네임 (2~20자)"
        maxLength={20}
        disabled={isPending}
        autoFocus
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={isPending || value.trim().length < 2}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : "시작하기"}
      </Button>
    </form>
  );
}
