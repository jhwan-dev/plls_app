import "server-only";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * On Vercel (serverless — no writable/persistent local disk) this uploads to
 * Vercel Blob. In local dev, where BLOB_READ_WRITE_TOKEN isn't set up, it
 * falls back to writing under public/uploads/<folder> instead.
 */
export async function saveImageUpload(
  folder: string,
  filename: string,
  contentType: string,
  buffer: Buffer,
): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${folder}/${filename}`, buffer, {
      access: "public",
      contentType,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${folder}/${filename}`;
}
