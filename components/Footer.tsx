"use client";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Falha ao assinar newsletter");
      
      setSubmitted(true);
      setEmail("");
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao tentar cadastrar. Tente de novo, quem sabe né?");
    }
  };

  return (
    <footer
      id="newsletter"
      className="bg-[#050505] border-t border-[#CC0000]/20 pt-16 pb-8 px-6 md:px-12 w-full relative z-10"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">

          {/* COLUNA 1 — Logo e slogan */}
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-[#CC0000]"
              >
                {/* ✅ Trocado Skull por TrendingUp */}
                <TrendingUp className="w-8 h-8" />
              </motion.div>
              <span className="font-heading text-2xl font-bold tracking-wider text-[#F5F5F5]">
                NEGATIVADO <span className="text-[#FFD600]">E</span> FELIZ
              </span>
            </Link>
            <p className="font-sans text-sm text-[#A0A0A0] leading-relaxed max-w-sm">
              Porque alguém tem que rir das contas. O único blog financeiro
              sincero e quebrado da internet brasileira.
            </p>

            {/* ✅ Redes sociais com ícones inline SVGs robustos */}
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://twitter.com/negativadoefeliz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#111111] border border-[#CC0000]/10 hover:border-[#CC0000]/50 rounded text-[#A0A0A0] hover:text-[#CC0000] hover:bg-[#CC0000]/5 transition-all duration-200"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/negativadoefeliz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#111111] border border-[#CC0000]/10 hover:border-[#CC0000]/50 rounded text-[#A0A0A0] hover:text-[#CC0000] hover:bg-[#CC0000]/5 transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@negativadoefeliz"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#111111] border border-[#CC0000]/10 hover:border-[#CC0000]/50 rounded text-[#A0A0A0] hover:text-[#CC0000] hover:bg-[#CC0000]/5 transition-all duration-200"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.518 3.5 12 3.5 12 3.5s-7.518 0-9.388.556a3.003 3.003 0 00-2.11 2.107C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.107C4.482 20.5 12 20.5 12 20.5s7.518 0 9.388-.556a3.003 3.003 0 002.11-2.107C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUNA 2 — Links rápidos */}
          <div className="flex flex-col items-start">
            <h3 className="font-heading text-xl text-[#F5F5F5] tracking-wider mb-6">
              NAVEGUE
            </h3>
            <ul className="space-y-4 font-sans text-sm">
              <li>
                <Link
                  href="/blog"
                  className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  Blog & Artigos
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  Quiz — Qual Negativado Sou?
                </Link>
              </li>
              <li>
                <Link
                  href="/calculadora"
                  className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  Calculadora de Dívida
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  Nossa História (Triste)
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  Enviar Reclamação
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUNA 3 — Newsletter */}
          <div className="flex flex-col items-start w-full">
            <h3 className="font-heading text-xl text-[#F5F5F5] tracking-wider mb-6">
              RECEBA OS BOLETOS
            </h3>
            <p className="font-sans text-[13px] text-[#606060] uppercase tracking-wider mb-4">
              Receba as piores notícias financeiras direto no seu e-mail.
            </p>

            {/* ✅ Formulário com feedback visual */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-[4px] px-4 py-3"
              >
                <p className="font-sans text-sm text-[#CC0000] font-semibold">
                  ✅ Cadastrado! Prepare o coração para os boletos.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 w-full max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  className="flex-1 bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-[4px] focus:outline-none transition-colors placeholder:text-[#606060]"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#CC0000] hover:bg-[#8B0000] text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-[4px] transition-colors whitespace-nowrap"
                >
                  Cadastrar
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Linha Inferior */}
        <div className="border-t border-[#1A1A1A] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-[12px] text-[#606060] tracking-wide text-center md:text-left">
            © {currentYear} Negativado e Feliz — Todos os boletos reservados
          </p>
          <p className="font-sans text-[11px] text-[#606060] uppercase tracking-wider">
            Feito sem mindset milionário.
          </p>
        </div>
      </div>
    </footer>
  );
}
