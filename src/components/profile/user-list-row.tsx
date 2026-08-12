import Link from "next/link";
import type { ReactNode } from "react";
import { UserAvatar } from "@/components/brand/user-avatar";
import { displayName } from "@/lib/user-display";

interface UserListRowProps {
  user: { id: string; name: string | null; nickname: string | null; image: string | null };
  action?: ReactNode;
}

export function UserListRow({ user, action }: UserListRowProps) {
  const name = displayName(user);

  return (
    <div className="flex items-center gap-3 border-b border-border py-3">
      <Link href={`/profile/${user.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <UserAvatar image={user.image} name={name} className="size-10" />
        <p className="truncate font-semibold">{name}</p>
      </Link>
      {action}
    </div>
  );
}
