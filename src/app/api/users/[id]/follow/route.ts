import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPrismaErrorCode, toggleUniqueRelation } from "@/lib/toggle-relation";

export async function POST(_request: Request, { params }: RouteContext<"/api/users/[id]/follow">) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id: followingId } = await params;
  const followerId = session.user.id;

  if (followerId === followingId) {
    return NextResponse.json({ error: "자기 자신은 팔로우할 수 없습니다." }, { status: 400 });
  }

  try {
    const following = await toggleUniqueRelation({
      create: () => prisma.follow.create({ data: { followerId, followingId } }),
      deleteRow: () =>
        prisma.follow.delete({ where: { followerId_followingId: { followerId, followingId } } }),
    });

    const followerCount = await prisma.follow.count({ where: { followingId } });

    return NextResponse.json({ following, followerCount });
  } catch (error) {
    if (isPrismaErrorCode(error, "P2003")) {
      return NextResponse.json({ error: "존재하지 않는 사용자입니다." }, { status: 404 });
    }
    console.error("Failed to toggle follow:", error);
    return NextResponse.json({ error: "팔로우 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
