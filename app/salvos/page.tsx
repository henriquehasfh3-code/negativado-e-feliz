"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import { Bookmark, ArrowLeft } from "lucide-react";

export default function BookmarksPage() {
  const { bookmarks, isMounted } = useBookmarks();

  if (!isMounted) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-[#080808] pt-12 md:pt-16 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-[#CC0000] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para Home
        </Link>

        <header className="mb-12 border-b border-[#CC0000]/20 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <Bookmark className="w-8 h-8 text-[#CC0000]" />
            <h1 className="font-heading text-[40px] md:text-[56px] leading-none text-[#F5F5F5]">
              Artigos Salvos
            </h1>
          </div>
          <p className="font-sans text-lg text-[#A0A0A0] font-light max-w-2xl">
            Tudo que você prometeu ler depois (e que a gente sabe que vai acabar esquecendo, mas tudo bem).
          </p>
        </header>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-[#333333] rounded-xl">
            <Bookmark className="w-12 h-12 text-[#333333] mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-[#F5F5F5] mb-2">
              Nenhum artigo salvo
            </h3>
            <p className="font-sans text-[#A0A0A0] mb-6">
              Você ainda não salvou nenhuma pérola da sabedoria financeira.
            </p>
            <Link
              href="/blog"
              className="inline-block bg-[#CC0000] hover:bg-[#8B0000] text-white font-sans text-sm font-bold uppercase tracking-wider px-6 py-3 rounded transition-colors"
            >
              Explorar Artigos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
