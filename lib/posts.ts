import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  faq?: { pergunta: string; resposta: string }[];
  image?: string;
  featured?: boolean;
  readingTime: string;
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  faq?: { pergunta: string; resposta: string }[];
  image?: string;
  featured?: boolean;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.(mdx|md)$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug,
      title: data.title || "Sem título",
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      author: data.author || "Negativado e Feliz", // ✅ corrigido
      category: data.category || "Geral",
      tags: data.tags || [],
      faq: data.faq || undefined,
      image: data.image,
      featured: data.featured || false,
      readingTime: `${Math.ceil(stats.minutes)} min de leitura`,
    } as PostMeta;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);

  let filePath = "";

  if (fs.existsSync(fullPath)) {
    filePath = fullPath;
  } else if (fs.existsSync(mdPath)) {
    filePath = mdPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title || "Sem título",
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    author: data.author || "Negativado e Feliz", // ✅ corrigido
    category: data.category || "Geral",
    tags: data.tags || [],
    faq: data.faq || undefined,
    image: data.image,
    featured: data.featured || false,
    readingTime: `${Math.ceil(stats.minutes)} min de leitura`,
    content,
  };
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));
  return categories.sort();
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getFeaturedPosts(): PostMeta[] {
  const featured = getAllPosts().filter((post) => post.featured);
  
  // ✅ Se não houver posts marcados como featured, retorna os 3 mais recentes
  if (featured.length === 0) {
    return getAllPosts().slice(0, 3);
  }
  
  return featured.slice(0, 3);
}

export function getRecentPosts(count: number = 3): PostMeta[] {
  return getAllPosts().slice(0, count);
}

export function getRelatedPosts(
  currentSlug: string,
  category: string,
  count: number = 3
): PostMeta[] {
  const related = getAllPosts().filter(
    (post) => post.slug !== currentSlug && post.category === category
  );

  // ✅ Se não houver posts relacionados na categoria, retorna os mais recentes
  if (related.length === 0) {
    return getAllPosts()
      .filter((post) => post.slug !== currentSlug)
      .slice(0, count);
  }

  return related.slice(0, count);
}

