import Link from "next/link";
import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlaylistNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <Music2 className="size-8 text-muted-foreground" />
      <h1 className="text-lg font-semibold">플레이리스트를 찾을 수 없습니다</h1>
      <p className="text-sm text-muted-foreground">
        삭제되었거나 존재하지 않는 플레이리스트예요.
      </p>
      <Button render={<Link href="/search" />}>새 플레이리스트 만들기</Button>
    </div>
  );
}
