import { Client, isFullPage } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionPost } from "./notion-types";

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

const notion = new Client({
  auth: notionToken || "fake-token-for-build",
});

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
  const coverProp = page.properties["Cover"];
  if (coverProp?.type === "files" && coverProp.files.length > 0) {
    const file = coverProp.files[0] as any;
    return file.file?.url || file.external?.url || "/hero-bg.png";
  }
  if (page.cover) {
    const coverObj = page.cover as any;
    return coverObj.file?.url || coverObj.external?.url || "/hero-bg.png";
  }
  return "/hero-bg.png";
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
    const response = await notion.dataSources.query({
      data_source_id: databaseId!,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results.filter(isFullPage).map(mapPageToPost);
  } catch (error) {
    console.error("[Notion API ERROR] Falha ao executar getAllPosts():", error);
    throw new Error("Erro de comunicação com o Notion CMS.");
  }
}

export async function getPostBySlug(slug: string): Promise<NotionPost | null> {
  if (!isNotionConfigured()) return null;

  try {
    const response = await notion.dataSources.query({
      data_source_id: databaseId!,
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
    const response = await notion.pages.retrieveMarkdown({ page_id: pageId });
    return response.markdown || "";
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
    const response = await notion.dataSources.query({
      data_source_id: databaseId!,
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
    const response = await notion.dataSources.query({
      data_source_id: databaseId!,
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

export {
  getAllPosts as getAllNotionPosts,
  getPostBySlug as getNotionPostBySlug,
  getPostContent as getNotionPostContent,
  getFeaturedPosts as getFeaturedNotionPosts,
};

export { type NotionPost } from "./notion-types";
