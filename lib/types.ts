export interface PostSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  coverUrl?: string;
  readingTime: string;
  tags: string[];
  faq?: { pergunta: string; resposta: string }[];
  featured?: boolean;
  source: "notion" | "mdx";
}

export interface PostDetail extends PostSummary {
  content: string;
}
