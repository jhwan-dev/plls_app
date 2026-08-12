"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Check, Loader2, Pencil, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseJsonResponse } from "@/lib/api/http";

interface ProfileHeroCardProps {
  initialImage: string | null;
  initialNickname: string | null;
  fallbackName: string | null;
  /** Only the profile's own owner can upload a photo or edit the nickname. */
  editable: boolean;
}

interface UploadAvatarResponse {
  image: string;
}

interface UpdateNicknameResponse {
  nickname: string;
}

export function ProfileHeroCard({
  initialImage,
  initialNickname,
  fallbackName,
  editable,
}: ProfileHeroCardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(initialImage);
  const [nickname, setNickname] = useState(initialNickname);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [draft, setDraft] = useState(initialNickname ?? "");
  const [isSavingNickname, setIsSavingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const displayNickname = nickname ?? fallbackName ?? "익명";

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/account/avatar", { method: "POST", body: formData });
      const result = await parseJsonResponse<UploadAvatarResponse>(response);
      setImage(result.image);
      router.refresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  }

  function startEditingNickname() {
    setDraft(nickname ?? "");
    setNicknameError(null);
    setIsEditingNickname(true);
  }

  async function handleSaveNickname() {
    setIsSavingNickname(true);
    setNicknameError(null);

    try {
      const response = await fetch("/api/account/nickname", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: draft }),
      });
      const result = await parseJsonResponse<UpdateNicknameResponse>(response);
      setNickname(result.nickname);
      setIsEditingNickname(false);
      router.refresh();
    } catch (err) {
      setNicknameError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setIsSavingNickname(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => editable && fileInputRef.current?.click()}
        disabled={!editable || isUploading}
        aria-label={editable ? "프로필 사진 변경" : undefined}
        className={cn("group relative size-24 shrink-0 overflow-hidden rounded-[3px] sm:size-28", !editable && "cursor-default")}
      >
        {image ? (
          <Image src={image} alt={displayNickname} fill sizes="112px" className="object-cover" />
        ) : (
          // Neutral initial-letter tile, not the PLLS brand mark — see
          // UserAvatar's identical fallback for why.
          <span className="font-display absolute inset-0 flex items-center justify-center bg-secondary text-4xl leading-none text-muted-foreground">
            {displayNickname.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}

        {editable && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-white" />
            ) : (
              <Camera className="size-5 text-white" />
            )}
          </span>
        )}
      </button>

      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {isEditingNickname ? (
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="닉네임"
              maxLength={20}
              disabled={isSavingNickname}
              autoFocus
              // Same font/size as the display heading below — editing should
              // feel like typing directly over the big nickname, not dropping
              // into a small generic form field.
              className="font-display h-auto w-auto max-w-[220px] rounded-none border-0 border-b-2 border-foreground/30 bg-transparent px-1 py-0 text-center text-3xl text-foreground shadow-none focus-visible:border-primary focus-visible:ring-0 sm:max-w-[280px] sm:text-4xl"
            />
            <Button
              type="button"
              size="icon-sm"
              onClick={handleSaveNickname}
              disabled={isSavingNickname}
              aria-label="저장"
            >
              {isSavingNickname ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            </Button>
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={() => setIsEditingNickname(false)}
              disabled={isSavingNickname}
              aria-label="취소"
            >
              <X className="size-4" />
            </Button>
          </div>
          {nicknameError && <p className="text-xs text-destructive">{nicknameError}</p>}
        </div>
      ) : (
        // The pencil sits absolutely positioned so its reserved space
        // doesn't pull the visible nickname off-center — a flex `gap`
        // sibling would do that even while the button is small.
        <div className="relative inline-flex items-center">
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">{displayNickname}</h1>
          {editable && (
            <button
              type="button"
              onClick={startEditingNickname}
              aria-label="닉네임 수정"
              className="absolute top-1/2 -right-6 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Pencil className="size-4" />
            </button>
          )}
        </div>
      )}
      {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
    </div>
  );
}
