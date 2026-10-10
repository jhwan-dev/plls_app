"use client";

import { PixelIcon } from "@/components/pixel/pixel-icon";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 border border-border bg-card px-2.5 py-2">
      <PixelIcon name="icon-search" size={15} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="곡, 아티스트 검색"
        autoFocus
        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}
