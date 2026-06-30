"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // Busca H2 e H3 dentro da div .prose
    const elements = Array.from(
      document.querySelectorAll(".prose h2, .prose h3")
    );

    const items: TOCItem[] = elements.map((elem) => {
      if (!elem.id) {
        elem.id =
          elem.textContent
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "") || "";
      }
      return {
        id: elem.id,
        title: elem.textContent || "",
        level: parseInt(elem.tagName[1]) as 2 | 3,
      };
    });

    setHeadings(items);

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

  // Precisa de pelo menos 2 headings para mostrar o sumário
  if (headings.length < 2) return null;

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden xl:block w-64 pr-4">
      <h3 className="font-heading text-lg text-[#F5F5F5] mb-4 uppercase tracking-widest border-b border-[#CC0000]/20 pb-2">
        Neste Artigo
      </h3>
      <ul className="space-y-1 border-l border-[#333333]">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          const isH3 = heading.level === 3;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`
                  block py-1 font-sans transition-colors border-l-2 -ml-[1px]
                  ${isH3 ? "pl-7 text-xs" : "pl-4 text-sm"}
                  ${
                    isActive
                      ? "border-[#CC0000] text-[#CC0000] font-bold"
                      : isH3
                      ? "border-transparent text-[#606060] hover:text-[#A0A0A0] hover:border-[#444444]"
                      : "border-transparent text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#606060]"
                  }
                `}
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
          );
        })}
      </ul>
    </nav>
  );
}
