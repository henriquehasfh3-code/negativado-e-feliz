"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Pequeno delay para não travar o carregamento inicial
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-[9995] p-4 md:p-6"
          role="dialog"
          aria-label="Consentimento de cookies"
        >
          <div className="max-w-4xl mx-auto bg-[#111111] border border-[#CC0000]/30 rounded-xl shadow-[0_-8px_32px_rgba(0,0,0,0.6)] p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">

              {/* Ícone + Texto */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 mt-0.5 p-2 bg-[#CC0000]/10 border border-[#CC0000]/20 rounded-lg">
                  <Cookie className="w-5 h-5 text-[#CC0000]" />
                </div>
                <div>
                  <p className="font-sans text-sm font-bold text-[#F5F5F5] mb-1">
                    Esse site usa cookies
                  </p>
                  <p className="font-sans text-xs text-[#A0A0A0] leading-relaxed">
                    Usamos cookies para lembrar suas preferências, artigos salvos e melhorar sua experiência.
                    Futuramente também usaremos para publicidade (Google AdSense) — mas isso só acontece com seu aceite.{" "}
                    <Link
                      href="/politica-de-privacidade"
                      className="text-[#CC0000] hover:underline"
                    >
                      Saiba mais
                    </Link>
                    .
                  </p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <button
                  onClick={handleEssential}
                  className="font-sans text-xs font-bold uppercase tracking-wider text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#333333] hover:border-[#666666] px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Só o essencial
                </button>
                <button
                  onClick={handleAccept}
                  className="font-sans text-xs font-bold uppercase tracking-wider text-white bg-[#CC0000] hover:bg-[#8B0000] px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  Aceitar tudo
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
