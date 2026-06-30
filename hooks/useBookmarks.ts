"use client";

import { useState, useEffect } from "react";
import { type PostSummary } from "@/lib/types";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<PostSummary[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("nf_bookmarks");
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  const saveBookmarks = (newBookmarks: PostSummary[]) => {
    setBookmarks(newBookmarks);
    localStorage.setItem("nf_bookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (slug: string) => {
    return bookmarks.some((b) => b.slug === slug);
  };

  const toggleBookmark = (post: PostSummary) => {
    if (isBookmarked(post.slug)) {
      saveBookmarks(bookmarks.filter((b) => b.slug !== post.slug));
    } else {
      saveBookmarks([...bookmarks, post]);
    }
  };

  return { bookmarks, isBookmarked, toggleBookmark, isMounted };
}
