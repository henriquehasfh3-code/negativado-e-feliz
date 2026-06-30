import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/data";
import PostCard from "@/components/PostCard";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import { TrendingUp, AlertTriangle } from "lucide-react";

// ISR: revalida a cada 60 segundos
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Negativado e Feliz | Porque alguém tem que rir das contas",
  description:
    "Aprenda a lidar com dívidas, score baixo e boletos atrasados com muito humor negro e dicas reais de sobrevivência financeira.",
};

export default async function HomePage() {
  let allPosts: any[] = [];
  let apiError = false;

  try {
    // Busca todos os posts do Notion (ou MDX fallback)
    allPosts = await getAllPosts();
  } catch (error) {
    console.error("[HomePage Error] Erro ao buscar artigos no Notion CMS:", error);
    apiError = true;
  }

  // Se a API falhar, renderiza tela de erro amigável
  if (apiError) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 text-center text-[#F5F5F5] pt-24">
        <div className="relative z-10 max-w-lg flex flex-col items-center gap-6 py-20">
          <div className="bg-[#111111]/80 backdrop-blur-md p-8 rounded-xl border border-[#CC0000]/20 shadow-lg shadow-[#CC0000]/20 text-[#CC0000]">
            <AlertTriangle className="w-16 h-16 animate-bounce" />
          </div>
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#FFD600]">
            ERRO DE INTEGRAÇÃO - NOTION CMS
          </span>
          <h1 className="font-heading text-4xl md:text-5xl leading-tight">
            SISTEMA FINANCEIRO FORA DO AR
          </h1>
          <p className="font-sans text-[#A0A0A0] text-sm md:text-base leading-relaxed">
            Nossa conexão com o Notion CMS foi protestada em cartório. Não conseguimos carregar os artigos agora, mas fique tranquilo: seus boletos reais vão continuar vencendo normalmente.
          </p>
          <Link
            href="/"
            className="font-sans text-[12px] font-bold uppercase tracking-widest bg-[#CC0000] hover:bg-[#8B0000] text-white px-8 py-3.5 rounded-[4px] mt-4"
          >
            Tentar Novamente
          </Link>
        </div>
      </div>
    );
  }

  // Mapeamos NotionPost para o PostSummary compatível com o PostCard
  const mappedRecentPosts = allPosts.slice(0, 3).map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    date: post.date,
    coverUrl: post.coverUrl || "/hero-bg.png",
    readingTime: post.readingTime,
    tags: [post.category],
    source: "notion" as const,
  }));

  return (
    <div className="bg-[#080808] w-full min-h-screen text-[#F5F5F5]">
      {/* Hero da Home */}
      <HeroSection />

      {/* Seção das Últimas Confissões */}
      <section className="container mx-auto px-6 md:px-12 max-w-7xl py-20 lg:py-28 relative z-10">
        <div className="mb-12 text-center md:text-left">
          <h2 className="font-heading font-black text-[48px] md:text-[64px] text-[#F5F5F5] leading-none tracking-wide uppercase">
            ÚLTIMAS <span className="text-[#CC0000] drop-shadow-md">CONFISSÕES</span>
          </h2>
          <p className="font-sans text-base text-[#A0A0A0] mt-2">
            Artigos fresquinhos pra você rir enquanto paga o boleto
          </p>
        </div>

        {mappedRecentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mappedRecentPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#111111] border border-[#CC0000]/20 rounded-lg max-w-md mx-auto p-8">
            <TrendingUp className="w-12 h-12 text-[#CC0000] mx-auto mb-4" />
            <h3 className="font-heading text-2xl text-[#F5F5F5] mb-2">Sem confissões por enquanto</h3>
            <p className="font-sans text-sm text-[#A0A0A0]">
              Junte-se a +10.000 pessoas que já aceitaram a realidade.
            </p>
          </div>
        )}

        {mappedRecentPosts.length > 0 && (
          <div className="flex justify-center mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-sans text-[13px] font-bold uppercase tracking-widest border border-[#CC0000] hover:bg-[#CC0000] text-[#F5F5F5] hover:text-white px-8 py-4 rounded-[4px] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Ver todos os artigos
            </Link>
          </div>
        )}
      </section>

      {/* Seção Informativa */}
      <FeaturesSection />
    </div>
  );
}
