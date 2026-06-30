import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 relative overflow-hidden text-[#F5F5F5]">
      {/* Detalhes visuais do background */}
      <div 
        className="absolute inset-0 z-0 opacity-40" 
        style={{
          background: "radial-gradient(circle at 50% 50%, #8B0000 0%, #080808 60%)"
        }}
      />

      <div className="relative z-10 text-center max-w-lg flex flex-col items-center gap-6">
        {/* Ícone de alerta animado */}
        <div className="p-4 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full text-[#CC0000] animate-pulse">
          <TrendingUp className="w-16 h-16" />
        </div>

        {/* Status */}
        <span className="font-sans text-sm font-extrabold uppercase tracking-widest text-[#FFD600] bg-[#FFD600]/10 border border-[#FFD600]/20 px-3 py-1 rounded">
          ERRO 404 - DÍVIDA ATIVA
        </span>

        {/* Título com humor */}
        <h1 className="font-heading text-[56px] md:text-[80px] leading-[0.95] text-[#F5F5F5] uppercase tracking-wide">
          PÁGINA <span className="text-[#CC0000]">LEILOADA</span>
        </h1>

        {/* Mensagem humorística */}
        <p className="font-sans text-base md:text-lg text-[#A0A0A0] leading-relaxed max-w-sm">
          Essa página foi a leilão e a gente não deu lance (o Score do Serasa estava baixo demais).
        </p>

        {/* Botão de volta */}
        <Link
          href="/"
          className="font-sans text-[13px] font-bold uppercase tracking-widest bg-[#CC0000] hover:bg-[#8B0000] text-white px-8 py-4 rounded-[4px] shadow-lg transition-all duration-200 mt-4"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
}
