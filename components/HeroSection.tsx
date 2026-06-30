"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, ArrowDown, Receipt } from "lucide-react"; // ✅ Removidos Skull e AlertOctagon e adicionado Receipt
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [count, setCount] = useState(4820); // ✅ Número mais crível

  useEffect(() => {
    const target = 5200;
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev >= target) {
          clearInterval(timer);
          return target;
        }
        return prev + 10; // ✅ Incremento maior para chegar mais rápido
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] flex items-center justify-center py-12 md:py-16 overflow-hidden bg-[#080808]">

      {/* Fundo com imagem e overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/hero-boletos.png"
          alt="Mesa de Boletos"
          fill
          priority
          className="object-cover opacity-15"
        />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, #8B0000 0%, #080808 80%)",
          }}
        />
      </div>

      {/* ✅ SVG de ruído com estilo inline correto */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.07,
        }}
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Coluna de Texto */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Label Superior */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0 }}
              className="mb-6 inline-flex items-center gap-2 border border-[#CC0000] px-3 py-1 rounded-full bg-[#CC0000]/10"
            >
              {/* ✅ Emoji removido, ícone no lugar */}
              <TrendingUp className="w-3 h-3 text-[#CC0000]" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#CC0000]">
                FINANÇAS SEM FRESCURA
              </span>
            </motion.div>

            {/* H1 */}
            <h1 className="font-heading text-[72px] sm:text-[96px] md:text-[110px] lg:text-[128px] font-black leading-[0.95] tracking-wide mb-6">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="block text-[#F5F5F5]"
              >
                NEGATIVADO
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="block bg-gradient-to-r from-[#CC0000] to-[#FFD600] bg-clip-text text-transparent"
              >
                E FELIZ
              </motion.span>
            </h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="font-sans text-base md:text-lg text-[#A0A0A0] max-w-[480px] leading-relaxed mb-8"
            >
              Você está endividado. Nós também. Aqui a gente chora vendo o
              extrato do banco, mas aprende a pagar as contas rindo. Sem papo
              furado de coach.
            </motion.p>

            {/* Botões */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-8"
            >
              <Link
                href="/blog"
                className="w-full sm:w-auto text-center font-sans text-[13px] font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#8B0000] text-white px-8 py-4 rounded-[4px] transition-colors duration-200"
              >
                VER ARTIGOS
              </Link>
              <Link
                href="/sobre"
                className="w-full sm:w-auto text-center font-sans text-[13px] font-bold uppercase tracking-wider border border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#080808] text-[#F5F5F5] px-8 py-4 rounded-[4px] transition-all duration-200"
              >
                NOSSA HISTÓRIA
              </Link>
            </motion.div>

            {/* ✅ Contador sem emoji */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="flex items-center gap-2 font-sans text-xs text-[#A0A0A0] font-medium tracking-wide"
            >
              <TrendingUp className="w-3 h-3 text-[#CC0000]" />
              <span>+{count.toLocaleString("pt-BR")} negativados felizes lendo</span>
            </motion.div>
          </div>

          {/* Coluna Visual — Boleto flutuante */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="w-full max-w-[420px]"
            >
              {/* ✅ Transform 3D via style inline — funciona sem config extra */}
              <motion.div
                animate={{ y: [-10, 0, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "perspective(1000px) rotateX(6deg) rotateY(-12deg) rotateZ(3deg)" }}
                className="relative bg-[#111111] border border-[#CC0000]/30 rounded-xl p-8 shadow-2xl"
              >
                {/* Boleto */}
                <div className="border-b-2 border-dashed border-[#CC0000]/20 pb-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-heading text-xl text-[#F5F5F5] tracking-wider">
                        BANCO DOS BOLETOS S.A.
                      </h4>
                      <p className="font-sans text-[10px] text-[#606060] uppercase tracking-wider">
                        Vencimento: Ontem
                      </p>
                    </div>
                    {/* ✅ Trocado Skull por Receipt */}
                    <Receipt className="w-8 h-8 text-[#CC0000]" />
                  </div>
                  <div className="space-y-1 font-mono text-xs text-[#A0A0A0]">
                    <p>Cedente: Agiotagem e Finanças Ltda.</p>
                    <p>Sacado: Você (Mesmo)</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded border border-[#CC0000]/10">
                    <span className="font-sans text-[11px] text-[#A0A0A0] uppercase tracking-wider">
                      Valor do Boleto
                    </span>
                    <span className="font-mono text-lg font-bold text-[#FFD600]">
                      R$ 1.542,88
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#606060] uppercase tracking-wider">
                      Multa por atraso
                    </span>
                    <span className="text-[#CC0000] font-mono">
                      Sua sanidade mental
                    </span>
                  </div>
                </div>

                {/* Carimbo NEGATIVADO */}
                <div className="absolute -bottom-2 -right-2 transform rotate-[-15deg] bg-[#CC0000] text-white font-heading text-4xl px-6 py-2 border-4 border-double border-white shadow-2xl tracking-widest select-none font-bold">
                  NEGATIVADO
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Seta de scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
        <span className="font-sans text-[9px] uppercase tracking-widest text-[#A0A0A0]">
          Rolar
        </span>
        <ArrowDown className="w-4 h-4 text-[#CC0000] animate-bounce" />
      </div>
    </section>
  );
}
