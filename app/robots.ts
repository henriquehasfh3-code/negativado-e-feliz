import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Área de moderação: conteúdo retido, privado, nunca deve ser indexado
      disallow: ["/admin", "/admin/"],
    },
    sitemap: "https://www.negativadoefeliz.com.br/sitemap.xml",
  };
}
