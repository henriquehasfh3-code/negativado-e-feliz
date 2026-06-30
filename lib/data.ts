/**
 * lib/data.ts
 *
 * Camada de abstração que unifica as fontes de dados:
 * - Fonte primária:  Notion API  (quando NOTION_TOKEN e NOTION_DATABASE_ID estão configurados)
 * - Fonte fallback: Arquivos MDX locais em /content/posts
 *
 * As páginas do blog usam APENAS este módulo — nunca importam notion.ts ou posts.ts diretamente.
 * Isso garante que o blog continue funcionando mesmo se o Notion estiver fora do ar.
 */

import {
  getAllNotionPosts,
  getFullNotionPost,
  getAllNotionCategories,
  getAllNotionSlugs,
  getRelatedNotionPosts,
  isNotionConfigured,
  type NotionPost,
} from "./notion";

import {
  getAllPosts as getAllMdxPosts,
  getPostBySlug as getMdxPostBySlug,
  getAllCategories as getMdxCategories,
  getRelatedPosts as getMdxRelatedPosts,
  type PostMeta,
  type Post,
} from "./posts";

import { type PostSummary, type PostDetail } from "./types";

// ─── Conversores ──────────────────────────────────────────────────────────────

function notionPostToSummary(p: NotionPost): PostSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: p.date,
    coverUrl: p.cover,
    readingTime: p.readingTime,
    tags: [],
    featured: false,
    source: "notion",
  };
}

function mdxPostToSummary(p: PostMeta): PostSummary {
  return {
    id: p.slug,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: typeof p.date === "string" ? p.date : new Date(p.date).toISOString().split("T")[0],
    coverUrl: p.image,
    readingTime: p.readingTime,
    tags: p.tags || [],
    faq: p.faq,
    featured: p.featured,
    source: "mdx",
  };
}

function mdxDetailToPostDetail(p: Post): PostDetail {
  return {
    id: p.slug,
    slug: p.slug,
    title: p.title,
    description: p.description,
    category: p.category,
    date: typeof p.date === "string" ? p.date : new Date(p.date).toISOString().split("T")[0],
    coverUrl: p.image,
    readingTime: p.readingTime,
    tags: p.tags || [],
    faq: p.faq,
    featured: p.featured,
    source: "mdx",
    content: p.content,
  };
}

// ─── Funções públicas ─────────────────────────────────────────────────────────

/**
 * Retorna todos os artigos publicados.
 * Prioridade: Notion → MDX local.
 * Se o Notion retornar resultados, usa apenas eles.
 * Se retornar vazio (API off/não configurada), usa MDX.
 */
export async function getAllPosts(): Promise<PostSummary[]> {
  if (isNotionConfigured()) {
    try {
      const notionPosts = await getAllNotionPosts();
      if (notionPosts.length > 0) {
        return notionPosts.map(notionPostToSummary);
      }
      // Notion configurado mas sem posts — pode ser DB vazio, tenta MDX
      console.warn("[data] Notion configurado mas sem posts publicados. Usando MDX.");
    } catch (err) {
      console.error("[data] Falha ao buscar do Notion, usando fallback MDX:", err);
    }
  }

  // Fallback MDX
  const mdxPosts = getAllMdxPosts();
  return mdxPosts.map(mdxPostToSummary);
}

/**
 * Retorna um artigo completo (metadados + conteúdo Markdown) pelo slug.
 * Prioridade: Notion → MDX local.
 */
export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  if (isNotionConfigured()) {
    try {
      const notionPost = await getFullNotionPost(slug);
      if (notionPost) {
        return {
          ...notionPostToSummary(notionPost),
          content: notionPost.content,
          readingTime: notionPost.readingTime,
        };
      }
    } catch (err) {
      console.error(`[data] Falha ao buscar "${slug}" do Notion, usando fallback MDX:`, err);
    }
  }

  // Fallback MDX
  const mdxPost = getMdxPostBySlug(slug);
  if (!mdxPost) return null;
  return mdxDetailToPostDetail(mdxPost);
}

/**
 * Retorna todas as categorias únicas dos artigos publicados.
 */
export async function getAllCategories(): Promise<string[]> {
  if (isNotionConfigured()) {
    try {
      const notionCategories = await getAllNotionCategories();
      if (notionCategories.length > 0) return notionCategories;
    } catch {
      // silencioso, cai para MDX
    }
  }
  return getMdxCategories();
}

/**
 * Retorna todos os slugs — usado em generateStaticParams.
 */
export async function getAllSlugs(): Promise<string[]> {
  if (isNotionConfigured()) {
    try {
      const notionSlugs = await getAllNotionSlugs();
      if (notionSlugs.length > 0) return notionSlugs;
    } catch {
      // silencioso, cai para MDX
    }
  }
  const mdxPosts = getAllMdxPosts();
  return mdxPosts.map((p) => p.slug);
}

/**
 * Retorna artigos relacionados por categoria (excluindo o atual).
 */
export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  count: number = 3
): Promise<PostSummary[]> {
  if (isNotionConfigured()) {
    try {
      const related = await getRelatedNotionPosts(currentSlug, category, count);
      if (related.length > 0) return related.map(notionPostToSummary);
    } catch {
      // silencioso, cai para MDX
    }
  }
  const mdxRelated = getMdxRelatedPosts(currentSlug, category, count);
  return mdxRelated.map(mdxPostToSummary);
}

/**
 * Retorna os N artigos mais recentes (para a Home).
 */
export async function getRecentPosts(count: number = 3): Promise<PostSummary[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}



/**
 * Retorna o nome da fonte de dados ativa (para debug).
 */
export function getActiveDataSource(): "notion" | "mdx" {
  return isNotionConfigured() ? "notion" : "mdx";
}

export async function getFeaturedPosts(count: number = 3): Promise<PostSummary[]> { return getRecentPosts(count); }
