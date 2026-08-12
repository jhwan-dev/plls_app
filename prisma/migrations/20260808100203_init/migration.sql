-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_tracks" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "deezerTrackId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "playlist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "playlist_tracks_playlistId_position_idx" ON "playlist_tracks"("playlistId", "position");

-- AddForeignKey
ALTER TABLE "playlist_tracks" ADD CONSTRAINT "playlist_tracks_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
