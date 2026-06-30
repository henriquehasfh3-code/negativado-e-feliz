"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { type PostSummary } from "@/lib/types";
import PostCard from "@/components/PostCard";
import AdBanner from "@/components/AdBanner";
import { cn } from "@/lib/utils";

interface BlogClientProps {
  posts: PostSummary[];
  categories: string[];
}

export default function BlogClient({ posts, categories }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.tags || []).some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [posts, selectedCategory, searchQuery]);

  const allCategories = ["Todos", ...categories];

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060] z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar artigos..."
            id="blog-search"
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#CC0000]/20 bg-[#111111] text-sm text-[#F5F5F5] placeholder:text-[#606060] focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] transition-all relative z-0"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              id={`filter-${category.toLowerCase().replace(/\s+/g, "-")}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                selectedCategory === category
                  ? "bg-[#CC0000] border-[#CC0000] text-white shadow-[0_4px_16px_rgba(204,0,0,0.3)]"
                  : "bg-[#111111] border-[#CC0000]/20 text-[#A0A0A0] hover:border-[#CC0000]/40 hover:text-[#F5F5F5]"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* AdSense — Antes dos artigos */}
      <AdBanner slot="blog-top" format="horizontal" label="Publicidade" />

      {/* Posts grid */}
      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key={`${selectedCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-4">
              <Search className="w-12 h-12 text-[#CC0000]/40" />
            </div>
            <h3 className="font-heading font-bold text-lg text-[#F5F5F5] mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-[#A0A0A0] text-sm">
              Tente buscar com outros termos ou explore todas as categorias.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Todos");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-lg text-sm text-[#CC0000] hover:text-[#FF3333] transition-colors"
            >
              Limpar filtros
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
