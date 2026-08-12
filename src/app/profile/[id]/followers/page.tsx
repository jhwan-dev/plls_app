import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFollowers, getFollowingIdsAmong, getUserBasic } from "@/lib/profile";
import { displayName } from "@/lib/user-display";
import { FollowList } from "@/components/profile/follow-list";

export async function generateMetadata({
  params,
}: PageProps<"/profile/[id]/followers">): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserBasic(id);
  return { title: user ? `${displayName(user)}의 팔로워` : "사용자를 찾을 수 없습니다" };
}

export default async function FollowersPage({ params }: PageProps<"/profile/[id]/followers">) {
  const { id } = await params;
  const user = await getUserBasic(id);

  if (!user) {
    notFound();
  }

  const followers = await getFollowers(id);
  const session = await auth();
  const viewerId = session?.user?.id;
  const viewerFollowingIds = viewerId
    ? await getFollowingIdsAmong(
        viewerId,
        followers.map((follower) => follower.id),
      )
    : new Set<string>();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="text-xl font-semibold tracking-tight">
        {displayName(user)}님의 팔로워
      </h1>
      <FollowList
        users={followers}
        emptyMessage="아직 팔로워가 없어요."
        viewerId={viewerId}
        viewerFollowingIds={viewerFollowingIds}
      />
    </div>
  );
}
