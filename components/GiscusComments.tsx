"use client";

import { useEffect, useRef } from "react";

export default function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    
    // Configurações do Giscus
    script.setAttribute("data-repo", "henriquehasfh3-code/negativado-e-feliz");
    script.setAttribute("data-repo-id", "R_kgDOTJH7KQ");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOTJH7Kc4DAL7Y");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "pt");
    script.setAttribute("data-loading", "lazy");

    ref.current.appendChild(script);
  }, []);

  return (
    <div className="mt-16 border-t border-[#CC0000]/20 pt-10">
      <h3 className="font-heading text-[28px] text-[#F5F5F5] mb-8">
        Reclame Aqui (Comentários)
      </h3>
      <div ref={ref} />
    </div>
  );
}
