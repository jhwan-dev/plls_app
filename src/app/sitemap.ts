import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [playlists, usersWithPlaylists] = await Promise.all([
    prisma.playlist.findMany({ select: { id: true, updatedAt: true } }),
    prisma.user.findMany({
      where: { playlists: { some: {} } },
      select: { id: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/search`, changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/curated`, changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/curator-zone`, changeFrequency: "daily", priority: 0.6 },
  ];

  const playlistRoutes: MetadataRoute.Sitemap = playlists.map((playlist) => ({
    url: `${baseUrl}/playlist/${playlist.id}`,
    lastModified: playlist.updatedAt,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const profileRoutes: MetadataRoute.Sitemap = usersWithPlaylists.map((user) => ({
    url: `${baseUrl}/profile/${user.id}`,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...playlistRoutes, ...profileRoutes];
}
