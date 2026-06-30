"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  title: string;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Busca todos os H2 dentro da div .prose
    const elements = Array.from(document.querySelectorAll(".prose h2"));
    const items = elements.map((elem) => {
      // Se não tiver ID, cria um a partir do texto
      if (!elem.id) {
        elem.id = elem.textContent
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") || "";
      }
      return {
        id: elem.id,
        title: elem.textContent || "",
      };
    });
    
    setHeadings(items);

    // Configura o IntersectionObserver para saber qual heading está visível
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden xl:block w-64 pr-4">
      <h3 className="font-heading text-lg text-[#F5F5F5] mb-4 uppercase tracking-widest border-b border-[#CC0000]/20 pb-2">
        Neste Artigo
      </h3>
      <ul className="space-y-3 border-l border-[#333333]">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={`block pl-4 py-1 font-sans text-sm transition-colors border-l-2 -ml-[1px] ${
                activeId === heading.id
                  ? "border-[#CC0000] text-[#CC0000] font-bold"
                  : "border-transparent text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#606060]"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(`#${heading.id}`)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
