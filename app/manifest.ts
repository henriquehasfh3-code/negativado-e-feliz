import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Negativado e Feliz",
    short_name: "Negativado",
    description: "Finanças com humor. Pra quem tá no vermelho mas não perde a piada.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#CC0000",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
