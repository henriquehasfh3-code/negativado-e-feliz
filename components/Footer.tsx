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
