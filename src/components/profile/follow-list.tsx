import { UserListRow } from "@/components/profile/user-list-row";
import { FollowButton } from "@/components/profile/follow-button";

interface FollowListUser {
  id: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
}

interface FollowListProps {
  users: FollowListUser[];
  emptyMessage: string;
  viewerId?: string;
  viewerFollowingIds: Set<string>;
}

export function FollowList({ users, emptyMessage, viewerId, viewerFollowingIds }: FollowListProps) {
  if (users.length === 0) {
    return <p className="py-16 text-center text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {users.map((user) => (
        <UserListRow
          key={user.id}
          user={user}
          action={
            user.id !== viewerId ? (
              <FollowButton
                targetUserId={user.id}
                initialFollowing={viewerFollowingIds.has(user.id)}
                isAuthenticated={!!viewerId}
              />
            ) : undefined
          }
        />
      ))}
    </div>
  );
}
