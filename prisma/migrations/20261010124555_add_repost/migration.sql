-- CreateTable
CREATE TABLE "reposts" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,

    CONSTRAINT "reposts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reposts_playlistId_idx" ON "reposts"("playlistId");

-- CreateIndex
CREATE INDEX "reposts_userId_idx" ON "reposts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reposts_userId_playlistId_key" ON "reposts"("userId", "playlistId");

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reposts" ADD CONSTRAINT "reposts_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
