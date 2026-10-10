import type { Metadata } from "next";
import Link from "next/link";
import { Heart, UserPlus, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserProfile, isFollowing } from "@/lib/profile";
import { displayName } from "@/lib/user-display";
import { FollowButton } from "@/components/profile/follow-button";
import { ProfileHeroCard } from "@/components/profile/profile-hero-card";
import { PlaylistLibrary } from "@/components/profile/playlist-library";
import { Logo } from "@/components/brand/logo";

export async function generateMetadata({
  params,
}: PageProps<"/profile/[id]">): Promise<Metadata> {
  const { id } = await params;
  const profile = await getUserProfile(id);

  if (!profile) {
    return { title: "사용자를 찾을 수 없습니다" };
  }

  return { title: `${displayName(profile.user)}의 프로필` };
}

export default async function ProfilePage({ params }: PageProps<"/profile/[id]">) {
  const { id } = await params;
  const profile = await getUserProfile(id);

  if (!profile) {
    notFound();
  }

  const session = await auth();
  const viewerId = session?.user?.id;
  const isOwnProfile = viewerId === id;
  const viewerFollows = viewerId && !isOwnProfile ? await isFollowing(viewerId, id) : false;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <header className="flex h-10 shrink-0 items-center border-b border-border px-3 md:hidden">
        <Logo iconSize={18} />
      </header>

      <div className="flex flex-col gap-12 px-4 pt-10 pb-8">
        <div className="flex flex-col items-center gap-3">
          <ProfileHeroCard
            initialImage={profile.user.image}
            initialNickname={profile.user.nickname}
            fallbackName={profile.user.name}
            editable={isOwnProfile}
          />

          <div className="flex items-baseline gap-8">
            <p className="font-pixel text-xl leading-none text-foreground">
              {profile.playlists.length} PLLS
            </p>
            <div className="font-pixel flex items-baseline gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 text-primary">
                <Heart className="size-3.5 fill-current" />
                {profile.totalLikesReceived}
              </span>
              <Link
                href={`/profile/${id}/followers`}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <Users className="size-3.5" />
                {profile.followerCount}
              </Link>
              <Link
                href={`/profile/${id}/following`}
                className="flex items-center gap-1 hover:text-foreground"
              >
                <UserPlus className="size-3.5" />
                {profile.followingCount}
              </Link>
            </div>
          </div>

          {!isOwnProfile && (
            <FollowButton
              targetUserId={id}
              initialFollowing={viewerFollows}
              isAuthenticated={!!viewerId}
            />
          )}
        </div>

        <PlaylistLibrary
          isOwnProfile={isOwnProfile}
          playlists={profile.playlists.map((playlist) => ({
            id: playlist.id,
            title: playlist.title,
            coverImageUrl: playlist.coverImageUrl,
            tracks: playlist.tracks,
            trackCount: playlist._count.tracks,
          }))}
          reposts={profile.reposts.map((playlist) => ({
            id: playlist.id,
            title: playlist.title,
            coverImageUrl: playlist.coverImageUrl,
            tracks: playlist.tracks,
            trackCount: playlist._count.tracks,
            owner: playlist.user,
          }))}
        />
      </div>
    </div>
  );
}
