import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// On Vercel (serverless — no writable/persistent local disk) this uploads to
// Vercel Blob. In local dev, where BLOB_READ_WRITE_TOKEN isn't set up, it
// falls back to writing under public/uploads/avatars instead.
async function saveAvatar(
  userId: string,
  extension: string,
  contentType: string,
  buffer: Buffer,
): Promise<string> {
  const filename = `${userId}-${Date.now()}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`avatars/${filename}`, buffer, {
      access: "public",
      contentType,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/avatars/${filename}`;
}

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
    const buffer = Buffer.from(await file.arrayBuffer());
    const imageUrl = await saveAvatar(session.user.id, extension, file.type, buffer);

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
