"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseJsonResponse } from "@/lib/api/http";

interface EditableDescriptionProps {
  playlistId: string;
  initialDescription: string | null;
}

interface UpdateDescriptionResponse {
  description: string | null;
}

export function EditableDescription({
  playlistId,
  initialDescription,
}: EditableDescriptionProps) {
  const router = useRouter();
  const [description, setDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialDescription ?? "");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEditing() {
    setDraft(description ?? "");
    setError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: draft }),
      });
      const result = await parseJsonResponse<UpdateDescriptionResponse>(response);
      setDescription(result.description);
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setIsPending(false);
    }
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <Textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="플레이리스트에 대한 설명을 적어보세요"
          maxLength={1000}
          rows={3}
          disabled={isPending}
          autoFocus
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            저장
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(false)}
            disabled={isPending}
          >
            <X className="size-4" />
            취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    // The pencil icon is positioned absolutely (not laid out inline with the
    // text) so its reserved space doesn't pull the visible text off-center —
    // a flex `gap` sibling would do that even while invisible (opacity-0).
    <button
      type="button"
      onClick={startEditing}
      className="group relative inline-block text-center text-base leading-relaxed text-muted-foreground hover:text-foreground sm:text-left"
    >
      <span>{description || "설명을 추가해 보세요"}</span>
      <Pencil className="absolute top-1 -right-5 size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
