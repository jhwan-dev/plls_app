/*
  Warnings:

  - Added the required column `youtubeUrl` to the `playlist_tracks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "playlist_tracks" ADD COLUMN     "youtubeUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "track_link_cache" (
    "id" TEXT NOT NULL,
    "itunesTrackId" INTEGER NOT NULL,
    "youtubeUrl" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "lastCheckedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_link_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_link_cache_itunesTrackId_key" ON "track_link_cache"("itunesTrackId");

-- CreateIndex
CREATE INDEX "track_link_cache_itunesTrackId_idx" ON "track_link_cache"("itunesTrackId");
