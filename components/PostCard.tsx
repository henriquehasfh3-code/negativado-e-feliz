"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Bookmark } from "lucide-react";
import { type PostSummary } from "@/lib/types";
import { useBookmarks } from "@/hooks/useBookmarks";

import { formatDate } from "@/lib/utils";

interface PostCardProps {
  post: PostSummary | (Record<string, any> & { slug: string; title: string; date: string; category: string; readingTime: string; description: string });
  index?: number;
  variant?: "default" | "featured" | "compact";
}

export default function PostCard({
  post,
  index = 0,
  variant = "default",
}: PostCardProps) {
  const { isBookmarked, toggleBookmark, isMounted } = useBookmarks();
  
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  // ✅ Variantes de tamanho por tipo de card
  const imageHeight =
    variant === "featured"
      ? "h-[280px]"
      : variant === "compact"
      ? "h-[140px]"
      : "h-[200px]";

  const titleSize =
    variant === "featured"
      ? "text-[36px]"
      : variant === "compact"
      ? "text-[20px]"
      : "text-[28px]";

  // Extrai a imagem de capa suportando tanto a estrutura local (image) quanto a do Notion (coverUrl)
  const imageUrl = (post as any).image || (post as any).coverUrl;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full h-full"
    >
      <Link href={`/blog/${post.slug}`} className="block h-full cursor-pointer">
        <div className="group relative flex flex-col h-full bg-[#111111] border border-[#CC0000]/20 rounded-lg overflow-hidden transition-all duration-300 ease-out hover:border-[#CC0000] hover:shadow-[0_8px_32px_rgba(204,0,0,0.15)] hover:-translate-y-1">

          {/* Imagem */}
          <div className={`relative w-full ${imageHeight} overflow-hidden`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              // ✅ Placeholder com gradiente quando não há imagem
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 30% 50%, #550000 0%, #111111 70%)`,
                }}
              />
            )}

            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80" />

            {/* Tag Categoria */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#CC0000] text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-sm">
                {post.category}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-5 flex flex-col flex-1">

            {/* Data + tempo de leitura */}
            <div className="font-sans text-[11px] text-[#606060] uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis mb-2">
              {formatDate(post.date)}
              <span className="mx-1.5">|</span>
              {post.readingTime}
            </div>

            {/* Título */}
            <h3
              className={`font-heading ${titleSize} text-[#F5F5F5] leading-tight tracking-wide group-hover:text-[#FFD600] transition-colors duration-200 line-clamp-2 mt-2`}
            >
              {post.title}
            </h3>

            {/* Descrição — escondida no compact para economizar espaço */}
            {variant !== "compact" && (
              <p className="font-sans text-sm text-[#A0A0A0] leading-relaxed line-clamp-3 mt-3 flex-1">
                {post.description}
              </p>
            )}

            {/* Rodapé */}
            <div className="flex items-center justify-between border-t border-[#CC0000]/10 pt-4 mt-5">
              <span className="font-sans text-[12px] font-bold text-[#CC0000] uppercase tracking-widest group-hover:text-[#FFD600] transition-colors flex items-center gap-1">
                Ler artigo{" "}
                <span className="transition-transform group-hover:translate-x-1 inline-block">
                  →
                </span>
              </span>
              <div className="flex items-center gap-3">
                {isMounted && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleBookmark(post as PostSummary);
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      isBookmarked(post.slug)
                        ? "text-[#FFD600] bg-[#FFD600]/10"
                        : "text-[#606060] hover:text-[#FFD600] hover:bg-[#FFD600]/10"
                    }`}
                    title={isBookmarked(post.slug) ? "Remover dos salvos" : "Salvar para depois"}
                  >
                    <Bookmark className="w-4 h-4" fill={isBookmarked(post.slug) ? "currentColor" : "none"} />
                  </button>
                )}
                <TrendingUp className="w-4 h-4 text-[#CC0000] group-hover:text-[#FFD600] transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
