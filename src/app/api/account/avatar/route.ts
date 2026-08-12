import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Stored on the server's local disk under public/uploads/avatars — fine for
// this single-server dev setup, but won't survive a serverless/edge deploy
// (Vercel etc.) without swapping this for real object storage (S3, Vercel
// Blob, ...) later.
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "이미지 파일을 선택해 주세요." }, { status: 400 });
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "jpg, png, webp 형식의 이미지만 업로드할 수 있어요." },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "이미지는 5MB 이하여야 해요." }, { status: 400 });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
    await mkdir(uploadsDir, { recursive: true });

    const filename = `${session.user.id}-${Date.now()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    const imageUrl = `/uploads/avatars/${filename}`;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return NextResponse.json({ image: imageUrl });
  } catch (error) {
    console.error("Failed to upload avatar:", error);
    return NextResponse.json(
      { error: "프로필 사진 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
