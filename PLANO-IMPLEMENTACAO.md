# Plano de Implementação — Negativado e Feliz
Gerado em: 2026-06-29  
Baseado em: REVISAO-PLANO.md

---

## FASE 1 — SEO e Infraestrutura

### 1.1 Criar `app/sitemap.ts`

**Arquivo a criar:** `app/sitemap.ts`  
**Objetivo:** Gerar `/sitemap.xml` automaticamente com todas as rotas + slugs dos posts MDX.

```ts
import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllSlugs();
  const baseUrl = "https://negativadoefeliz.com.br";

  const posts = slugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...posts,
  ];
}
```

---

### 1.2 Criar `app/robots.ts`

**Arquivo a criar:** `app/robots.ts`  
**Objetivo:** Gerar `/robots.txt` apontando para o sitemap.

```ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: "https://negativadoefeliz.com.br/sitemap.xml",
  };
}
```

---

## FASE 2 — Limpeza final do conteúdo MDX

**Arquivo:** `content/posts/como-sair-das-dividas-surtado.mdx`

### 2.1 Remover tag "desespero" do frontmatter

**Localização:** Linha 7  
**Antes:**
```
tags: ["dívidas", "nome sujo", "desespero", "serasa"]
```
**Depois:**
```
tags: ["dívidas", "nome sujo", "serasa", "humor"]
```

---

### 2.2 Renomear "Juros Assassinos"

**Localização:** Linha 28 (subheading de seção)  
**Antes:**
```
## Passo 2: A técnica da "Bola de Neve" ou "Juros Assassinos"
```
**Depois:**
```
## Passo 2: A técnica da "Bola de Neve" ou "Avalanche de Juros"
```

---

### 2.3 Substituir gíria "pila"

**Localização:** Linha 37 (corpo do artigo)  
**Antes:**
```
quitada por 500 pila num feirão desses
```
**Depois:**
```
quitada por R$ 500 num feirão desses
```

---

## FASE 3 — Componentes

### 3.1 Adicionar botão Pinterest em `components/ShareButtons.tsx`

**Contexto:** A função `generateShareUrl("pinterest", ...)` já existe em `lib/utils.ts` e funciona corretamente. Só falta renderizar o botão na UI. O componente tem dois blocos de botões: desktop (sidebar lateral) e mobile (barra inferior). O botão Pinterest deve ser adicionado nos dois blocos, seguindo o mesmo padrão visual dos botões existentes (WhatsApp verde, Twitter preto/branco).

**Cor sugerida para Pinterest:** `#E60023` (vermelho oficial do Pinterest)  
**Ícone sugerido:** usar SVG inline do logo Pinterest (lucide-react não tem ícone do Pinterest):

```tsx
// SVG do Pinterest para usar inline nos botões:
<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
</svg>
```

**O que mudar:**  
Nos dois locais onde os botões são renderizados (desktop sidebar e mobile bar), adicionar o botão Pinterest com:
- `href={generateShareUrl("pinterest", url, title, coverUrl)}` — o terceiro parâmetro `image` deve receber a URL da imagem de capa do post (disponível via `post.coverUrl`)
- `target="_blank"` e `rel="noopener noreferrer"`
- Estilo visual: `bg-[#E60023]` ou variante com opacidade para seguir o padrão do componente

---

### 3.2 Substituir emoji 🔍 em `components/BlogClient.tsx`

**Localização:** Linha 103 (estado de "nenhum resultado encontrado")  
**Antes:**
```tsx
<div className="text-5xl mb-4">🔍</div>
```
**Depois:**
```tsx
import { Search } from "lucide-react"; // adicionar ao import existente do lucide-react
// ...
<Search className="w-12 h-12 mb-4 text-[#CC0000]/40" />
```

---

### 3.3 Deletar `components/NewsletterForm.tsx`

**Arquivo a deletar:** `components/NewsletterForm.tsx`  
**Motivo:** Componente nunca importado em nenhuma página. O `components/Footer.tsx` já tem sua própria implementação de newsletter inline. Código morto.  
**Ação:** Deletar o arquivo completamente.

---

## FASE 4 — Limpeza de dependências

### 4.1 Remover `notion-to-md` do `package.json`

**Arquivo:** `package.json`  
**Ação:** Remover a linha com `"notion-to-md": "^3.1.9"` da seção `dependencies`.  
**Depois:** Rodar `npm install` para atualizar o `package-lock.json`.  
**Motivo:** O `lib/notion.ts` foi reescrito para usar `notion.pages.retrieveMarkdown()` nativamente. O `notion-to-md` não é importado em nenhum arquivo do projeto.

---

## FASE 5 — Imagens de capa (ação manual — requer geração externa)

**Esta fase não pode ser feita por código. O usuário precisa gerar 4 novas imagens.**

As imagens com caveiras/esqueletos precisam ser substituídas. Os arquivos devem manter os **mesmos nomes** para não quebrar as referências no frontmatter dos MDX.

| Arquivo a substituir | Conceito novo sugerido |
|---|---|
| `/public/images/covers/cartao-de-credito.png` | Foto realista: cartão de crédito amassado/partido sobre mesa bagunçada, tom irônico |
| `/public/images/covers/score-zero.png` | Foto realista: tela de celular com score baixo, expressão cômica, fundo desfocado |
| `/public/images/covers/tesouro-direto.png` | Foto realista: moedas e cédulas sobre mesa, calculadora, tom de "tentativa de riqueza" |
| `/public/images/covers/reserva-emergencia.png` | Foto realista: cofrinho vazio ou quase vazio, expressão dramática cômica |

**Dimensões recomendadas:** 1200×630px (proporção 16:9 para OG image)  
**Formato:** PNG ou JPEG  
**Estilo:** Foto realista com humor leve. Sem caveiras, esqueletos ou elementos de terror.

---

## FASE 6 — Favicon

### 6.1 Adicionar favicon do site

**Arquivo a criar:** `app/icon.png`  
**Tamanho:** 32×32px (Next.js App Router detecta automaticamente e usa como favicon)  
**Conteúdo:** Logo do blog "Negativado e Feliz" — sugestão: "N&F" em Bebas Neue na cor #CC0000 sobre fundo #080808, ou ícone de gráfico/trending up na cor #CC0000.

**Alternativa mais simples:** colocar um arquivo `favicon.ico` na pasta `/public/` (Next.js serve arquivos de `/public/` diretamente).

---

## Resumo das ações por arquivo

| Arquivo | Ação | Fase |
|---|---|---|
| `app/sitemap.ts` | Criar novo arquivo | 1.1 |
| `app/robots.ts` | Criar novo arquivo | 1.2 |
| `content/posts/como-sair-das-dividas-surtado.mdx` | Editar 3 linhas (7, 28, 37) | 2 |
| `components/ShareButtons.tsx` | Adicionar botão Pinterest (desktop + mobile) | 3.1 |
| `components/BlogClient.tsx` | Substituir emoji 🔍 por `<Search />` | 3.2 |
| `components/NewsletterForm.tsx` | Deletar arquivo | 3.3 |
| `package.json` | Remover `notion-to-md` + rodar `npm install` | 4.1 |
| `/public/images/covers/*.png` | Substituir 4 imagens manualmente | 5 |
| `app/icon.png` ou `public/favicon.ico` | Criar favicon | 6.1 |
