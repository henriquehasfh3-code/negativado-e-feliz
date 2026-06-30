import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categoryColors: Record<string, string> = {
  "Educação Financeira": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Investimentos": "bg-green-500/20 text-green-400 border-green-500/30",
  "Planejamento": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Dívidas": "bg-red-500/20 text-red-400 border-red-500/30",
  "Economia": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "Renda Extra": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Previdência": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Mercado": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Geral": "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export function getCategoryColor(category: string): string {
  // ✅ Corrigido: substituído bg-neon (inexistente) por bg-red (cor do blog)
  return categoryColors[category] || "bg-red-500/20 text-red-400 border-red-500/30";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function generateShareUrl(
  // ✅ Adicionado Pinterest
  platform: "whatsapp" | "twitter" | "linkedin" | "pinterest",
  url: string,
  title: string,
  image?: string // ✅ Adicionado parâmetro de imagem para o Pinterest
): string {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    case "pinterest":
      // ✅ Pinterest precisa da URL da imagem para funcionar corretamente
      const encodedImage = encodeURIComponent(image || "");
      return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}&media=${encodedImage}`;
    default:
      return url;
  }
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateString;
  }
}
