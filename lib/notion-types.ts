export interface NotionPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  published: boolean;
  date: string;
  cover: string; // URL da imagem de capa (ou string vazia caso não exista)
  readingTime: string;
  author: string;
}
