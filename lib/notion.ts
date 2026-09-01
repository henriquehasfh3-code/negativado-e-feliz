import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionPost } from "./notion-types";
import { NotionToMarkdown } from "notion-to-md";

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * Throttle + retry contra o rate limit do Notion.
 *
 * Com 100 artigos, o build dispara centenas de chamadas em paralelo (11 workers
 * do Next, e cada página pede metadados, conteúdo e relacionados). O Notion
 * limita a ~3 req/s e devolve 429 — o resultado eram 64 de 100 artigos caindo
 * em 404 a cada build.
 *
 * `notionFetch` do SDK é o ponto único por onde toda requisição passa, então é
 * aqui que a fila e o retry ficam — cobre inclusive as chamadas de bloco que o
 * notion-to-md faz por dentro.
 */
const MAX_CONCURRENT = 2;
const MIN_INTERVAL_MS = 340; // ~3 req/s
const MAX_RETRIES = 5;

let active = 0;
let lastStart = 0;
const waiting: (() => void)[] = [];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function acquire(): Promise<void> {
  if (active >= MAX_CONCURRENT) {
    await new Promise<void>((resolve) => waiting.push(resolve));
  }
  active++;
  const gap = Date.now() - lastStart;
  if (gap < MIN_INTERVAL_MS) await sleep(MIN_INTERVAL_MS - gap);
  lastStart = Date.now();
}

function release(): void {
  active--;
  waiting.shift()?.();
}

function retryAfterMs(err: unknown): number | null {
  const e = err as { status?: number; code?: string; headers?: Record<string, string> };
  if (e?.status !== 429 && e?.code !== "rate_limited") return null;
  const hdr = Number(e?.headers?.["retry-after"]);
  return Number.isFinite(hdr) && hdr > 0 ? hdr * 1000 : 1000;
}

const notion = new Client({
  auth: notionToken || "fake-token-for-build",
  // A fila acima faz a requisição esperar antes de sair. O cronômetro do SDK
  // já está correndo nesse meio tempo, então o padrão de 60s expira durante a
  // espera — com teto alto, a espera deixa de virar timeout.
  timeoutMs: 180000,
  fetch: async (url: RequestInfo | URL, init?: RequestInit) => {
    for (let attempt = 0; ; attempt++) {
      await acquire();
      let res: Response;
      try {
        res = await fetch(url, init);
      } finally {
        release();
      }
      // 429 chega como resposta HTTP, não como exceção — tratar aqui evita
      // que o SDK propague o erro antes de tentarmos de novo.
      if (res.status === 429 && attempt < MAX_RETRIES) {
        const hdr = Number(res.headers.get("retry-after"));
        const wait = Number.isFinite(hdr) && hdr > 0 ? hdr * 1000 : 2 ** attempt * 700;
        await sleep(wait + Math.random() * 250);
        continue;
      }
      return res;
    }
  },
});

/** Repete a chamada quando o próprio SDK lança rate limit. */
export async function withNotionRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const wait = retryAfterMs(err);
      if (wait === null || attempt >= MAX_RETRIES) throw err;
      await sleep(wait + 2 ** attempt * 300 + Math.random() * 250);
    }
  }
}

const n2m = new NotionToMarkdown({ notionClient: notion });

export interface NotionPostWithContent extends NotionPost {
  content: string;
}

// ─── Helpers de propriedade ───────────────────────────────────────────────────

function getTitle(page: PageObjectResponse): string {
  const prop = page.properties["Title"] || page.properties["Name"];
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("") || "Sem título";
  }
  return "Sem título";
}

function getRichText(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("") || "";
  }
  return "";
}

function getSelect(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "select") {
    return prop.select?.name || "Geral";
  }
  return "Geral";
}

function getCheckbox(page: PageObjectResponse, key: string): boolean {
  const prop = page.properties[key];
  if (prop?.type === "checkbox") {
    return prop.checkbox;
  }
  return false;
}

function getDate(page: PageObjectResponse, key: string): string {
  const prop = page.properties[key];
  if (prop?.type === "date" && prop.date?.start) {
    return prop.date.start;
  }
  return new Date().toISOString().split("T")[0];
}

function getCoverUrl(page: PageObjectResponse): string {
  let url = "/hero-bg.png";

  const coverProp = page.properties["Cover"];
  if (coverProp?.type === "files" && coverProp.files.length > 0) {
    const file = coverProp.files[0] as any;
    url = file.file?.url || file.external?.url || "/hero-bg.png";
  } else if (page.cover) {
    const coverObj = page.cover as any;
    url = coverObj.file?.url || coverObj.external?.url || "/hero-bg.png";
  }

  // Converte URLs do próprio domínio em caminhos relativos
  // para evitar dependência de DNS durante carregamento das imagens
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "negativadoefeliz.com.br") {
      return parsed.pathname;
    }
  } catch {}

  return url;
}

function mapPageToPost(page: PageObjectResponse): NotionPost {
  return {
    id: page.id,
    title: getTitle(page),
    slug: getRichText(page, "Slug") || getTitle(page).toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: getRichText(page, "Description"),
    category: getSelect(page, "Category"),
    published: getCheckbox(page, "Published"),
    date: getDate(page, "Date"),
    cover: getCoverUrl(page),
    readingTime: getRichText(page, "ReadingTime") || "5 min",
    author: getRichText(page, "Author") || "Negativado e Feliz",
  };
}

export function isNotionConfigured(): boolean {
  return !!(notionToken && databaseId);
}

export async function getAllPosts(): Promise<NotionPost[]> {
  if (!isNotionConfigured()) return [];

  try {
    // O Notion devolve no máximo 100 por página. Sem paginar, tudo além do
    // centésimo artigo fica invisível para o site — nem gera página estática,
    // nem aparece na listagem, nem entra no sitemap.
    const all: PageObjectResponse[] = [];
    let cursor: string | undefined = undefined;

    do {
      const response = await notion.databases.query({
        database_id: databaseId!,
        filter: {
          property: "Published",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Date", direction: "descending" }],
        page_size: 100,
        start_cursor: cursor,
      });
      all.push(...response.results.filter(isFullPage));
      cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
    } while (cursor);

    return all.map(mapPageToPost);
  } catch (error) {
    console.error("[Notion API ERROR] Falha ao executar getAllPosts():", error);
    throw new Error("Erro de comunicação com o Notion CMS.");
  }
}

export async function getPostBySlug(slug: string): Promise<NotionPost | null> {
  if (!isNotionConfigured()) return null;

  try {
    const response = await notion.databases.query({
      database_id: databaseId!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Slug", rich_text: { equals: slug } },
        ],
      },
      page_size: 1,
    });

    const page = response.results.find(isFullPage);
    if (!page) return null;
    return mapPageToPost(page);
  } catch (error) {
    console.error(`[Notion API ERROR] Falha ao executar getPostBySlug() para o slug "${slug}":`, error);
    throw new Error("Erro de comunicação com o Notion CMS.");
  }
}

export async function getPostContent(pageId: string): Promise<string> {
  if (!isNotionConfigured()) return "";

  try {
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);
    return mdString.parent || "";
  } catch (error) {
    console.error(`[Notion API ERROR] Falha ao buscar markdown da página "${pageId}":`, error);
    throw new Error("Erro de renderização do conteúdo do Notion.");
  }
}

export async function getRelatedNotionPosts(
  currentSlug: string,
  category: string,
  count: number = 3
): Promise<NotionPost[]> {
  const posts = await getAllPosts();
  return posts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, count);
}

export async function getPostsByCategory(category: string): Promise<NotionPost[]> {
  if (!isNotionConfigured()) return [];

  try {
    const response = await notion.databases.query({
      database_id: databaseId!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Category", select: { equals: category } },
        ],
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results.filter(isFullPage).map(mapPageToPost);
  } catch (error) {
    console.error(`[Notion API ERROR] Falha ao executar getPostsByCategory() para "${category}":`, error);
    throw new Error("Erro de comunicação com o Notion CMS.");
  }
}

export async function getFeaturedPosts(): Promise<NotionPost[]> {
  if (!isNotionConfigured()) return [];

  try {
    const response = await notion.databases.query({
      database_id: databaseId!,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
      page_size: 3,
    });

    return response.results.filter(isFullPage).map(mapPageToPost);
  } catch (error) {
    console.error("[Notion API ERROR] Falha ao executar getFeaturedPosts():", error);
    throw new Error("Erro de comunicação com o Notion CMS.");
  }
}

export async function getFullNotionPost(slug: string): Promise<NotionPostWithContent | null> {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  const content = await getPostContent(post.id);
  return { ...post, content };
}

export async function getAllNotionCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  return Array.from(new Set(posts.map((p) => p.category))).sort();
}

export async function getAllNotionSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug).filter(Boolean);
}

export { getAllPosts as getAllNotionPosts };

export { type NotionPost } from "./notion-types";
