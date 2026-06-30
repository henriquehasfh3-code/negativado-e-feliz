import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getAllSlugs, getRelatedPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import ProgressBar from "@/components/ProgressBar";
import ShareButtons from "@/components/ShareButtons";
import { TrendingUp, ArrowLeft, User } from "lucide-react";
import PostCard from "@/components/PostCard";
import TableOfContents from "@/components/TableOfContents";
import BookmarkButton from "@/components/BookmarkButton";
import CommentForm from "@/components/CommentForm";

// ISR: revalida a cada 60 segundos
export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Gera os parâmetros estáticos para build/pré-renderização
 */
export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error("[Slug Page - generateStaticParams ERROR] Falha ao listar caminhos estticos do Notion CMS:", error);
    return [];
  }
}

/**
 * Gera metadados de SEO com base no artigo do Notion
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Artigo não encontrado" };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://negativadoefeliz.com.br";

    return {
      title: `${post.title} | Negativado e Feliz`,
      description: post.description,
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        url: `${siteUrl}/blog/${slug}`,
        images: [
          {
            url: `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [
          {
            url: `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
            alt: post.title,
          },
        ],
      },
    };
  } catch (error) {
    console.error(`[Slug Page - generateMetadata ERROR] Falha ao gerar metadados para slug "${slug}":`, error);
    return { title: "Artigo não encontrado" };
  }
}

// Componente AdSense Customizado para o meio do post
const AdSenseSlot = () => (
  <div className="w-full h-[90px] bg-[#1A1A1A] border border-dashed border-[#CC0000]/60 flex items-center justify-center my-8 rounded select-none">
    <span className="font-sans text-[11px] uppercase tracking-widest text-[#606060] font-bold">
      Publicidade
    </span>
  </div>
);

// MDX Custom Components mapping
const mdxComponents = {
  AdSenseSlot,
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let post = null;
  let markdownContent = "";

  try {
    // Busca o post principal
    post = await getPostBySlug(slug);
    
    if (post) {
      markdownContent = post.content || "";
    }
  } catch (error) {
    console.error(`[Slug Page ERROR] Erro na busca do artigo "${slug}":`, error);
    // Em caso de falha da API, redirecionamos para o NotFound para mostrar a tela 404 personalizada
    notFound();
  }

  // Se o slug não existir no Notion, redireciona para a página 404 personalizada
  if (!post) {
    console.warn(`[Slug Page Warning] Artigo com o slug "${slug}" não foi encontrado no Notion. Redirecionando para 404.`);
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category, 3);

  // Tratamento de Imagem de Capa ausente (se for string vazia, usa default)
  const coverUrl = (post as any).coverUrl || (post as any).cover || (post as any).image || "/hero-bg.png";

  // Inserindo o banner de publicidade programaticamente após o 3º parágrafo
  const paragraphs = markdownContent.split(/\n\s*\n/);
  let processedContent = markdownContent;
  
  if (paragraphs.length > 3) {
    const firstPart = paragraphs.slice(0, 3).join("\n\n");
    const secondPart = paragraphs.slice(3).join("\n\n");
    processedContent = `${firstPart}\n\n<AdSenseSlot />\n\n${secondPart}`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://negativadoefeliz.com.br";

  // Schema.org Article JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: coverUrl,
    url: `${siteUrl}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: (post as any).author || "Negativado e Feliz",
    },
    publisher: {
      "@type": "Organization",
      name: "Negativado e Feliz",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
  };

  const faqJsonLd = post.faq && post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.pergunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.resposta,
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Barra de progresso fixed topo */}
      <ProgressBar />

      {/* Compartilhamento Sidebar (Desktop) & Bottom Bar (Mobile) */}
      <ShareButtons url={`/blog/${slug}`} title={post.title} coverUrl={coverUrl} />

      <div className="min-h-screen bg-[#080808] pt-12 md:pt-16 pb-20 px-6 md:px-0">
        <div className="max-w-5xl mx-auto flex justify-center gap-8 xl:gap-16 relative">
          
          <article className="max-w-[720px] w-full">
            {/* Voltar */}
            <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-[#CC0000] transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Voltar ao Blog
          </Link>

          {/* CABEÇALHO DO ARTIGO */}
          <header className="mb-10">
            {/* Título H1 */}
            <h1 className="font-heading text-[48px] md:text-[72px] text-[#F5F5F5] leading-[0.95] tracking-wide mb-6">
              {post.title}
            </h1>

            {/* Descrição */}
            <p className="font-sans text-lg md:text-[20px] text-[#A0A0A0] leading-relaxed mb-6 font-light">
              {post.description}
            </p>

            {/* Linha de metadata */}
            <div className="flex flex-wrap items-center justify-between border-y border-[#CC0000]/10 py-3.5 my-6">
              <div className="flex flex-wrap items-center gap-2 font-sans text-[13px] text-[#606060] uppercase tracking-widest">
                <span className="inline-block bg-[#CC0000] text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-sm">
                  {post.category}
                </span>
                <span>|</span>
                <span>{formatDate(post.date)}</span>
                <span>|</span>
                <span>{post.readingTime}</span>
                <span>|</span>
                <span className="flex items-center gap-1 text-[#A0A0A0]">
                  <User className="w-3.5 h-3.5" />
                  {(post as any).author || "Negativado e Feliz"}
                </span>
              </div>
              <BookmarkButton post={post as any} />
            </div>
          </header>

          {/* Capa do Artigo */}
          <div className="relative w-full h-[320px] md:h-[400px] rounded-lg overflow-hidden mb-12 shadow-[0_16px_64px_rgba(204,0,0,0.15)] border border-[#CC0000]/15">
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/40 to-transparent" />
            <div className="absolute bottom-4 right-4 text-[#CC0000]">
              <TrendingUp className="w-8 h-8 opacity-40" />
            </div>
          </div>

          {/* CORPO DO ARTIGO (MDX) */}
          <div className="prose max-w-none">
            <MDXRemote source={processedContent} components={mdxComponents} />
          </div>

          <CommentForm postTitle={post.title} postSlug={slug} />

          {relatedPosts.length > 0 && (
            <section className="mt-20 pt-12 border-t border-[#CC0000]/10">
              <h2 className="font-heading text-[40px] text-[#F5F5F5] mb-8">
                Você também vai gostar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <PostCard key={related.slug} post={related} />
                ))}
              </div>
            </section>
          )}

          </article>
          
          {/* Table of Contents - Sidebar */}
          <aside className="hidden xl:block w-64 flex-shrink-0 pt-24">
            <TableOfContents />
          </aside>
          
        </div>
      </div>
    </>
  );
}
