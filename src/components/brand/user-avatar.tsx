import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  image: string | null;
  name: string;
  className?: string;
  sizes?: string;
}

/** Square user photo, or a neutral initial-letter tile when there's no
 * photo — the brand-consistent replacement for the shadcn circular Avatar
 * wherever a person's photo shows up (credit lines, follow lists). Never
 * falls back to the PLLS "P" brand mark: that symbol represents the app
 * itself, not a placeholder for a person, see BrandMark. */
export function UserAvatar({ image, name, className, sizes = "32px" }: UserAvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className={cn("relative aspect-square shrink-0 overflow-hidden rounded-[3px] bg-secondary", className)}>
      {image ? (
        <Image src={image} alt={name} fill sizes={sizes} className="object-cover" />
      ) : (
        <span
          className="font-display absolute inset-0 flex items-center justify-center leading-none text-muted-foreground"
          style={{ fontSize: "42%" }}
          aria-hidden="true"
        >
          {initial}
        </span>
      )}
    </div>
  );
}
