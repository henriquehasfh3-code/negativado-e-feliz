# Plano de Implementação — OG Images Dinâmicas
Gerado em: 2026-06-29

## Situação atual

O Gemini já criou a estrutura base:
- `app/og/route.tsx` — rota que gera a imagem existe e funciona
- `app/blog/[slug]/page.tsx` — `generateMetadata` já aponta para `/og?title=...&category=...`

**Problema:** a implementação tem 4 falhas que comprometem o resultado visual e a eficácia no WhatsApp.

---

## FALHA 1 — Fonte Bebas Neue não carregada (impacto visual crítico)

**O que está errado:** `app/og/route.tsx` usa a fonte padrão do sistema operacional do servidor (geralmente Noto Sans ou DejaVu). O título do artigo aparece em uma fonte genérica, não em Bebas Neue. A imagem não tem a identidade visual do blog.

**Como funciona o carregamento de fontes no ImageResponse:** o Next.js aceita um array `fonts` com os bytes da fonte em ArrayBuffer. Você pode buscar a fonte diretamente da API do Google Fonts dentro da rota.

**Arquivo a modificar:** `app/og/route.tsx`

**Substituir o arquivo inteiro por:**

```tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

async function loadBebasNeue() {
  const response = await fetch(
    "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff"
  );
  return response.arrayBuffer();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Negativado e Feliz";
  const category = searchParams.get("category") || "Finanças";

  const bebasNeue = await loadBebasNeue();

  // Truncar título muito longo para não transbordar
  const displayTitle = title.length > 80 ? title.slice(0, 77) + "..." : title;
  const fontSize = title.length > 60 ? 56 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#080808",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          position: "relative",
          fontFamily: "'Bebas Neue'",
        }}
      >
        {/* Linha vermelha no topo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            background: "#CC0000",
          }}
        />

        {/* Ruído de fundo sutil — grid de pontos */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle, #CC000015 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Badge de categoria */}
        <div
          style={{
            background: "#CC0000",
            color: "white",
            fontSize: "15px",
            fontFamily: "'Bebas Neue'",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            padding: "6px 16px",
            marginBottom: "20px",
            alignSelf: "flex-start",
          }}
        >
          {category}
        </div>

        {/* Título */}
        <div
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: "'Bebas Neue'",
            fontWeight: "400",
            color: "#F5F5F5",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            marginBottom: "36px",
            wordBreak: "break-word",
          }}
        >
          {displayTitle}
        </div>

        {/* Rodapé */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{ width: "40px", height: "4px", background: "#CC0000" }}
          />
          <div
            style={{
              fontSize: "18px",
              fontFamily: "'Bebas Neue'",
              color: "#606060",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            negativadoefeliz.com.br
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Bebas Neue",
          data: bebasNeue,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
```

---

## FALHA 2 — Faltam `width`, `height` e `alt` nas imagens do artigo

**O que está errado:** `app/blog/[slug]/page.tsx` linha 57 retorna a imagem OG sem dimensões. WhatsApp e outras redes precisam dessas propriedades para mostrar o preview corretamente sem precisar baixar a imagem primeiro.

**Arquivo a modificar:** `app/blog/[slug]/page.tsx`

**Localizar** dentro de `generateMetadata`, na parte do `openGraph`:

```ts
// ANTES:
images: [{ url: `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}` }],
```

```ts
// DEPOIS:
images: [
  {
    url: `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
    width: 1200,
    height: 630,
    alt: post.title,
  },
],
```

**Mesma correção para o Twitter card**, logo abaixo:

```ts
// ANTES:
images: [`${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`],

// DEPOIS — Twitter aceita array de objetos também:
images: [
  {
    url: `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}`,
    alt: post.title,
  },
],
```

---

## FALHA 3 — Página `/blog` sem imagem OG

**O que está errado:** `app/blog/page.tsx` tem `metadata` com title e description, mas nenhuma propriedade `openGraph`. Quando alguém compartilha `negativadoefeliz.com.br/blog` no WhatsApp, não aparece nenhuma imagem de preview.

**Arquivo a modificar:** `app/blog/page.tsx`

**Substituir o bloco `metadata` existente por:**

```ts
export const metadata: Metadata = {
  title: "Arquivo de Confissões | Negativado e Feliz",
  description:
    "Todos os nossos artigos e confissões financeiras. Leia, ria e aprenda a organizar sua vida financeira antes que o banco leve tudo.",
  openGraph: {
    title: "Arquivo de Confissões | Negativado e Feliz",
    description: "Todos os artigos do blog. Finanças com humor, direto ao ponto.",
    images: [
      {
        url: `https://negativadoefeliz.com.br/og?title=Arquivo+de+Confissões&category=Blog`,
        width: 1200,
        height: 630,
        alt: "Arquivo de Confissões — Negativado e Feliz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`https://negativadoefeliz.com.br/og?title=Arquivo+de+Confissões&category=Blog`],
  },
};
```

---

## FALHA 4 — Homepage usando `/hero-bg.png` em vez da OG dinâmica

**O que está errado:** `app/layout.tsx` usa `/hero-bg.png` como OG image da homepage. Funciona, mas é uma foto genérica. A OG dinâmica com o slogan do blog seria mais impactante e consistente com a identidade visual.

**Arquivo a modificar:** `app/layout.tsx`

**Localizar** o bloco `openGraph.images` e atualizar:

```ts
// ANTES:
images: [
  {
    url: "/hero-bg.png",
    width: 1200,
    height: 630,
    alt: "Negativado e Feliz",
  },
],

// DEPOIS:
images: [
  {
    url: "https://negativadoefeliz.com.br/og?title=Porque+alguém+tem+que+rir+das+contas&category=Finanças+com+Humor",
    width: 1200,
    height: 630,
    alt: "Negativado e Feliz — Porque alguém tem que rir das contas",
  },
],
```

**Mesma atualização para o `twitter.images`:**

```ts
// ANTES:
images: ["/hero-bg.png"],

// DEPOIS:
images: ["https://negativadoefeliz.com.br/og?title=Porque+alguém+tem+que+rir+das+contas&category=Finanças+com+Humor"],
```

---

## Resumo das alterações

| # | Arquivo | Ação |
|---|---|---|
| 1 | `app/og/route.tsx` | Substituir arquivo inteiro — carregar Bebas Neue, truncar títulos longos, adicionar padrão de fundo |
| 2 | `app/blog/[slug]/page.tsx` | Adicionar `width`, `height` e `alt` nas imagens OG e Twitter |
| 3 | `app/blog/page.tsx` | Adicionar bloco `openGraph` e `twitter` completo com imagem |
| 4 | `app/layout.tsx` | Trocar `/hero-bg.png` pela URL da OG dinâmica em openGraph e twitter |

## Como testar depois

Após aplicar as correções, testar as imagens geradas abrindo no browser:

- `http://localhost:3000/og?title=Cartão+de+Crédito+é+Vilão&category=Dívidas`
- `http://localhost:3000/og?title=Negativado+e+Feliz&category=Finanças+com+Humor`

A imagem deve aparecer com Bebas Neue, fundo preto, badge vermelho de categoria e o título em branco.

Para testar o preview do WhatsApp antes de publicar, usar o validador oficial do Facebook: `developers.facebook.com/tools/debug` — colar a URL do artigo e verificar se a imagem carrega com as dimensões corretas (1200×630).
