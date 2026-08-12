import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nicknameSchema } from "@/lib/validations/user";
import { isPrismaErrorCode } from "@/lib/toggle-relation";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);

  if (json === null) {
    return NextResponse.json({ error: "요청 본문을 읽을 수 없습니다." }, { status: 400 });
  }

  const parsed = nicknameSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "요청이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const { nickname } = parsed.data;

  // Case-insensitive pre-check for a friendly error — the DB unique index
  // below is the real (case-sensitive) guarantee against a race.
  const existing = await prisma.user.findFirst({
    where: { nickname: { equals: nickname, mode: "insensitive" }, id: { not: session.user.id } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "이미 사용 중인 닉네임이에요." }, { status: 409 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { nickname },
      select: { nickname: true },
    });

    return NextResponse.json({ nickname: updated.nickname });
  } catch (error) {
    if (isPrismaErrorCode(error, "P2002")) {
      return NextResponse.json({ error: "이미 사용 중인 닉네임이에요." }, { status: 409 });
    }
    console.error("Failed to update nickname:", error);
    return NextResponse.json(
      { error: "닉네임 저장 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
