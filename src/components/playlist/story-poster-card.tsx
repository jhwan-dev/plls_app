import { forwardRef } from "react";
import { POSTER_TEMPLATES } from "@/components/playlist/story-poster-templates";
import type { PosterData, TemplateId } from "@/lib/story-poster-data";

interface StoryPosterCardProps {
  templateId: TemplateId;
  data: PosterData;
}

/** Renders one of the 12 hand-designed poster templates at their native
 * 1080x1920 (Instagram Story) size. Callers scale the wrapper via CSS
 * transform for an on-screen preview — see instagram-story-share-button.tsx
 * — while the off-screen capture copy stays unscaled for html-to-image. */
export const StoryPosterCard = forwardRef<HTMLDivElement, StoryPosterCardProps>(function StoryPosterCard(
  { templateId, data },
  ref,
) {
  const Template = POSTER_TEMPLATES[templateId];

  return (
    <div ref={ref} style={{ position: "relative", width: 1080, height: 1920, overflow: "hidden" }}>
      <Template data={data} />
    </div>
  );
});
