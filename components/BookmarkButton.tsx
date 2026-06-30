"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { type PostSummary } from "@/lib/types";

export default function BookmarkButton({ post }: { post: PostSummary }) {
  const { isBookmarked, toggleBookmark, isMounted } = useBookmarks();

  if (!isMounted) return null;

  const saved = isBookmarked(post.slug);

  return (
    <button
      onClick={() => toggleBookmark(post)}
      className={`flex items-center gap-2 font-sans text-[13px] uppercase tracking-widest px-3 py-1.5 rounded transition-colors ${
        saved
          ? "text-[#FFD600] bg-[#FFD600]/10 border border-[#FFD600]/20"
          : "text-[#A0A0A0] hover:text-[#FFD600] hover:bg-[#FFD600]/10 border border-transparent hover:border-[#FFD600]/20"
      }`}
      title={saved ? "Remover dos salvos" : "Salvar para depois"}
    >
      <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
      {saved ? "Salvo" : "Salvar"}
    </button>
  );
}
