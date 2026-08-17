/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `playlist_tracks` table. All the data in the column will be lost.
  - You are about to drop the column `deezerTrackId` on the `playlist_tracks` table. All the data in the column will be lost.
  - You are about to drop the column `previewUrl` on the `playlist_tracks` table. All the data in the column will be lost.
  - Added the required column `itunesTrackId` to the `playlist_tracks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "playlist_tracks" DROP COLUMN "coverUrl",
DROP COLUMN "deezerTrackId",
DROP COLUMN "previewUrl",
ADD COLUMN     "itunesTrackId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "playlists" ADD COLUMN     "coverImageUrl" TEXT;
