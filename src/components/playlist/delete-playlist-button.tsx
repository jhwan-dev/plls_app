"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deletePlaylist } from "@/lib/api/playlist-client";

interface DeletePlaylistButtonProps {
  playlistId: string;
  redirectTo: string;
}

export function DeletePlaylistButton({ playlistId, redirectTo }: DeletePlaylistButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      await deletePlaylist(playlistId);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button type="button" variant="destructive" size="icon" aria-label="플레이리스트 삭제">
            <Trash2 className="size-4" />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>플레이리스트를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            삭제하면 되돌릴 수 없어요. 담긴 곡 목록과 좋아요도 함께 사라져요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="size-4 animate-spin" /> : "삭제"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
