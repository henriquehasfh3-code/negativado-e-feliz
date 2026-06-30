import type { Metadata } from "next";
import { getAllPosts } from "@/lib/data";
import BlogClient from "@/components/BlogClient";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

// ISR: revalida a cada 60 segundos
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Arquivo de Confissões | Negativado e Feliz",
  description:
    "Todos os nossos artigos e confissões financeiras. Leia, ria e aprenda a organizar sua vida financeira antes que o banco leve tudo.",
  openGraph: {
    title: "Arquivo de Confissões | Negativado e Feliz",
    description: "Todos os artigos do blog. Finanças com humor, direto ao ponto.",
    images: [
      {
        url: `https://negativadoefeliz.com.br/og?title=Arquivo+de+Confissões&category=Blog`,
        width: 1200,
        height: 630,
        alt: "Arquivo de Confissões — Negativado e Feliz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`https://negativadoefeliz.com.br/og?title=Arquivo+de+Confissões&category=Blog`],
  },
};

export default async function BlogPage() {
  let posts: any[] = [];
  let apiError = false;

  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error("[BlogPage Error] Falha ao carregar posts do Notion CMS:", error);
    apiError = true;
  }

  // Tratamento de Erro Amigável
  if (apiError) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center px-6 text-center text-[#F5F5F5] pt-24">
        <div className="relative z-10 max-w-lg flex flex-col items-center gap-6 py-20">
          <div className="p-4 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full text-[#CC0000]">
            <AlertTriangle className="w-16 h-16 animate-bounce" />
          </div>
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#FFD600]">
            CONEXÃO EXPIRADA - NOTION CMS
          </span>
          <h1 className="font-heading text-4xl md:text-5xl leading-tight">
            NÃO CONSEGUIMOS CONECTAR AO CMS
          </h1>
          <p className="font-sans text-[#A0A0A0] text-sm md:text-base leading-relaxed">
            Parece que o nosso sinal com o Notion caiu (deve ser porque atrasamos a conta de luz também). Tente recarregar a página para restabelecer a conexão.
          </p>
          <Link href="/blog" className="font-sans text-[12px] font-bold uppercase tracking-widest bg-[#CC0000] hover:bg-[#8B0000] text-white px-8 py-3.5 rounded-[4px] mt-4 inline-block">
            Recarregar
          </Link>
        </div>
      </div>
    );
  }

  // Mapeia os NotionPost para o formato esperado pelo BlogClient (PostSummary)
  const mappedPosts = posts.map((post) => ({
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

  // Extrai as categorias únicas dinamicamente a partir dos posts
  const categories = Array.from(new Set(posts.map((p) => p.category))).sort();

  return (
    <div className="min-h-screen bg-[#080808] pt-12 md:pt-16 pb-16 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-heading font-black text-[48px] md:text-[72px] text-[#F5F5F5] leading-none mb-3">
            TODOS OS <span className="text-[#CC0000] drop-shadow-md">ARTIGOS</span>
          </h1>
          <p className="font-sans text-sm text-[#A0A0A0] max-w-xl leading-relaxed">
            Exibindo {mappedPosts.length} confissões sobre dívidas, cartões de crédito e a arte de sobreviver ao fim do mês.
          </p>
        </div>

        <BlogClient posts={mappedPosts} categories={categories} />
      </div>
    </div>
  );
}
