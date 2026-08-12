import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Superseded by the richer /profile/[id] page — kept as a redirect so old
// links/bookmarks still land somewhere useful.
export default async function MyPlaylistsRedirect() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/mine");
  }

  redirect(`/profile/${session.user.id}`);
}
