import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Precisa das DUAS formas: as capas dos artigos apontam para www (que é
      // o endereço que resolve em DNS hoje), mas o apex fica autorizado para o
      // caso do registro A ser criado depois. Sem www aqui, o next/image
      // rejeita a imagem e derruba a página inteira.
      { protocol: "https", hostname: "negativadoefeliz.com.br" },
      { protocol: "https", hostname: "www.negativadoefeliz.com.br" },
    ],
  },
};

export default nextConfig;
