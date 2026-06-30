# Plano de Crescimento — Negativado e Feliz
Gerado em: 2026-06-29

**REGRA DE OURO:** Tudo neste plano deve ser visualmente bonito no celular. O público é brasileiro, o tráfego é majoritariamente mobile. Mobile first em tudo — layout, tamanho de fonte, áreas clicáveis (mínimo 44px), animações suaves.

O que já existe: share buttons (WhatsApp, Twitter, Pinterest, copiar link), barra de progresso, tempo de leitura, newsletter (fake), AdSense placeholder, animações, JSON-LD, ISR, SEO dinâmico.

O que falta para hypar de verdade — ordenado por impacto no Brasil.

---

## TIER 1 — Impacto máximo, implementável 100% em código

---

### 1. OG Images Dinâmicas por Artigo
**Por que é o mais importante:** Quando alguém compartilha um link no WhatsApp, a imagem de preview é o que faz as pessoas clicarem. Hoje os artigos usam a foto de capa como OG image. Com Next.js `ImageResponse`, você gera uma imagem branded automaticamente para cada artigo — com o título em Bebas Neue gigante, a categoria em vermelho, e o logo "Negativado e Feliz" — sem precisar criar manualmente. Links compartilhados com preview bonito têm 3x mais cliques no WhatsApp.

**Como funciona:** Next.js tem uma API nativa chamada `ImageResponse` que gera imagens PNG via JSX no servidor. Você cria uma rota `app/og/route.tsx` que recebe o título e a categoria como query params e retorna uma imagem 1200×630px renderizada como HTML/CSS.

**Arquivo a criar:** `app/og/route.tsx`

```tsx
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Negativado e Feliz";
  const category = searchParams.get("category") || "Finanças";

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
        }}
      >
        {/* Linha vermelha decorativa */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: "#CC0000" }} />
        
        {/* Badge de categoria */}
        <div style={{
          background: "#CC0000",
          color: "white",
          fontSize: "14px",
          fontWeight: "900",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          padding: "6px 14px",
          marginBottom: "24px",
          alignSelf: "flex-start",
        }}>
          {category}
        </div>

        {/* Título */}
        <div style={{
          fontSize: title.length > 60 ? "52px" : "72px",
          fontWeight: "900",
          color: "#F5F5F5",
          lineHeight: 1,
          textTransform: "uppercase",
          letterSpacing: "0.02em",
          marginBottom: "32px",
        }}>
          {title}
        </div>

        {/* Rodapé com nome do blog */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "32px", height: "3px", background: "#CC0000" }} />
          <div style={{ fontSize: "16px", color: "#A0A0A0", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            negativadoefeliz.com.br
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

**Onde usar:** Em `app/blog/[slug]/page.tsx`, dentro de `generateMetadata()`, trocar a imagem OG de capa estática para a URL dinâmica:

```ts
// ANTES (linha 54):
images: [{ url: post.coverUrl || `${siteUrl}/hero-bg.png` }],

// DEPOIS:
images: [{ url: `${siteUrl}/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category)}` }],
```

---

### 2. Artigos Relacionados no Final do Artigo
**Por que é importante:** `getRelatedPosts()` já existe em `lib/data.ts` mas o artigo não mostra nenhum post relacionado no final. Isso significa que quando alguém termina de ler, o site "acaba" e o usuário fecha a aba. Adicionar 3 cards de artigos relacionados no final aumenta o tempo no site e as pageviews.

**Arquivo a modificar:** `app/blog/[slug]/page.tsx`

**O que adicionar:** Após o bloco `<div className="prose">`, buscar os artigos relacionados e renderizar:

```tsx
// 1. Importar no topo:
import { getPostBySlug, getAllSlugs, getRelatedPosts } from "@/lib/data";
import PostCard from "@/components/PostCard";

// 2. Dentro de ArticlePage(), após buscar o post principal, buscar relacionados:
const relatedPosts = await getRelatedPosts(slug, post.category, 3);

// 3. Renderizar após o </div> do prose, antes do fechamento do max-w container:
{relatedPosts.length > 0 && (
  <section className="mt-20 pt-12 border-t border-[#CC0000]/10">
    <h2 className="font-heading text-[40px] text-[#F5F5F5] mb-8">
      Você também vai gostar
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedPosts.map((related) => (
        <PostCard key={related.slug} post={related} />
      ))}
    </div>
  </section>
)}
```

---

### 3. Newsletter Real com Brevo (Sendinblue)
**Por que é importante:** O formulário de newsletter atual é 100% fake — após 1 segundo exibe "Obrigado!" mas não salva o e-mail em lugar nenhum. Cada e-mail capturado é um leitor que você pode trazer de volta com cada novo artigo. O Brevo tem plano gratuito de até 300 e-mails/dia e API simples.

**Arquivos a criar/modificar:**

**Criar `app/api/newsletter/route.ts`:**
```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        email,
        listIds: [Number(process.env.BREVO_LIST_ID) || 2],
        updateEnabled: true,
      }),
    });

    if (!response.ok && response.status !== 204) {
      const error = await response.json();
      // Contato já existente (código 400 com duplicateParameter) é ok
      if (error.code !== "duplicate_parameter") {
        throw new Error(error.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Newsletter API Error]", error);
    return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 500 });
  }
}
```

**Modificar `components/Footer.tsx`** — trocar o `handleSubmit` simulado por uma chamada real:
```ts
// ANTES:
await new Promise((resolve) => setTimeout(resolve, 1000));
setSubmitted(true);

// DEPOIS:
const res = await fetch("/api/newsletter", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});
if (!res.ok) throw new Error("Falha");
setSubmitted(true);
```

**Variáveis de ambiente a adicionar em `.env.local`:**
```
BREVO_API_KEY=      # chave da API do Brevo (gratuita em brevo.com)
BREVO_LIST_ID=      # ID da lista de contatos criada no painel do Brevo
```

---

### 4. Quiz Viral "Qual tipo de negativado você é?"
**Por que é importante:** Quizzes de personalidade são o conteúdo mais compartilhado no Brasil no WhatsApp e Instagram Stories. Um quiz com humor financeiro ("Você é o Negativado Calmo, o Catastrófico, ou o Esperançoso?") vai circular e trazer tráfego orgânico de graça.

**Arquivo a criar:** `app/quiz/page.tsx`  
**Rota:** `/quiz`

**Estrutura do quiz:**
- 6 perguntas com 3 opções cada
- Cada opção dá pontos para um dos 3 perfis
- Resultado final mostra o perfil predominante com texto humorístico
- Botão "Compartilhar no WhatsApp" com o resultado
- Animação de transição entre perguntas (Framer Motion)

**Perguntas sugeridas:**
```
1. Quando chega o boleto do cartão, você:
   a) Abre com calma e planeja o pagamento — [Calmo]
   b) Fecha o app e finge que não viu — [Catastrófico]
   c) Já esperava, tem dinheiro separado desde ontem — [Esperançoso]

2. Sua reserva de emergência é:
   a) Uns 3 meses de gastos, seguro — [Calmo]
   b) O limite do cartão de crédito — [Catastrófico]
   c) Existe na teoria, na prática sumiu no Pix do churrasco — [Esperançoso]

3. Quando vê uma promoção de 12x sem juros:
   a) Calculo se cabe no orçamento antes de comprar — [Calmo]
   b) Compro tudo na hora, preocupo depois — [Catastrófico]
   c) Sei que é cilada mas compro assim mesmo — [Esperançoso]

4. Seu score no Serasa hoje está:
   a) Acima de 700, tô bem — [Calmo]
   b) Vermelho e travado, nem abro mais o app — [Catastrófico]
   c) Recuperando, de 300 já fui para 450 esse mês — [Esperançoso]

5. A palavra "orçamento" para você é:
   a) Uma planilha que eu realmente uso — [Calmo]
   b) Um conceito de outra dimensão — [Catastrófico]
   c) Já tentei várias vezes, dessa vez vai — [Esperançoso]

6. Quando alguém fala "Tesouro Direto", você:
   a) Já tenho investido há anos — [Calmo]
   b) Acho que é coisa de rico — [Catastrófico]
   c) Quero aprender, só preciso ter dinheiro sobrando primeiro — [Esperançoso]
```

**Resultados:**
- **Negativado Calmo** — "Você tá bem, mas podia estar melhor. Pelo menos não surta."
- **Negativado Catastrófico** — "Houston, temos um problema. Mas ei — pelo menos você é divertido nas histórias de perrengue."
- **Negativado Esperançoso** — "Você é o tipo que vai dar a volta por cima. Só precisa parar de usar o cartão como reserva de emergência."

**Compartilhamento no WhatsApp:**
```ts
const shareText = `Fiz o Quiz do Negativado e Feliz e descobri que sou o ${resultado}! Descobre o seu: negativadoefeliz.com.br/quiz`;
const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
```

---

## TIER 2 — Alto impacto

---

### 5. Calculadora de Dívida Interativa
**Por que:** Ferramentas úteis são compartilhadas. "Minha dívida de R$5.000 no rotativo vai virar R$12.000 em 1 ano" é um número que choca e que as pessoas mandam pro grupo da família.

**Arquivo a criar:** `app/calculadora/page.tsx`  
**Rota:** `/calculadora`

**Campos de entrada:**
- Valor da dívida (R$)
- Taxa de juros ao mês (%)
- Quanto você pode pagar por mês (R$)

**Saídas:**
- Quantos meses para quitar
- Total pago ao final
- Quanto foi de juros
- Gráfico visual simples mostrando a evolução (barras CSS, sem biblioteca de gráficos)

**Botão de compartilhamento:**  
"Minha dívida de R$X vai custar R$Y de juros. Calculei no Negativado e Feliz → [link]"

---

### 6. PWA — Blog Instalável no Celular
**Por que:** 80% do tráfego de blogs brasileiros vem do celular. Tornar o blog instalável cria um ícone na tela inicial do usuário, como um app. Quando têm um novo artigo, eles abrem. Sem depender de rede social.

**Arquivo a criar:** `app/manifest.ts`

```ts
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
```

**Imagens a criar (manualmente):**
- `/public/icon-192.png` — 192×192px
- `/public/icon-512.png` — 512×512px

---

### 7. Índice Flutuante (Table of Contents) nos Artigos
**Por que:** Em artigos longos, um índice com links internos reduz a taxa de rejeição. Leitores sabem o que vem, ficam mais tempo na página.

**Arquivo a criar:** `components/TableOfContents.tsx`  
**Como funciona:** Parsear os headings `##` do conteúdo MDX, gerar uma lista de links com `href="#heading-id"`, mostrar em sidebar fixa no desktop.

**Onde usar:** `app/blog/[slug]/page.tsx` — renderizar ao lado do conteúdo no desktop (requer mudar o layout para 2 colunas quando há artigo longo com mais de 3 seções).

---

### 8. FAQPage Schema nos Artigos
**Por que:** O Google mostra "Perguntas frequentes" diretamente nos resultados de busca para páginas com FAQPage schema. Isso ocupa mais espaço no resultado, aumenta o CTR (cliques), e pode colocar o blog em destaque para perguntas como "como sair das dívidas" sem precisar estar em 1° lugar.

**Como fazer:** Adicionar ao frontmatter do MDX um campo `faq` com perguntas e respostas. No `app/blog/[slug]/page.tsx`, gerar o JSON-LD FAQPage além do Article já existente.

**Exemplo no frontmatter:**
```yaml
faq:
  - pergunta: "Como sair das dívidas rápido?"
    resposta: "Primeiro liste tudo que deve, depois negocie os maiores juros. Não tem atalho, mas tem método."
  - pergunta: "O que é a bola de neve de dívidas?"
    resposta: "Pagar a menor dívida primeiro para ganhar momentum psicológico e ir quitando as maiores."
```

**JSON-LD gerado:**
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Como sair das dívidas?", "acceptedAnswer": { "@type": "Answer", "text": "..." } }
  ]
}
```

---

## TIER 3 — Bom ter

---

### 9. Salvar Artigos para Depois (Bookmarks com localStorage)
**O que:** Botão "Salvar" nos PostCards e no artigo. Lista de salvos em `/salvos`. Tudo em localStorage — sem banco de dados, sem login.

**Por que:** Faz o usuário retornar ao site. "Salvei pra ler depois" é uma promessa que gera visitas futuras.

---

### 10. Comentários via Giscus
**O que:** Sistema de comentários gratuito baseado em GitHub Discussions. Sem banco de dados, sem moderação manual, sem custo.

**Por que:** Comunidade engajada faz as pessoas voltarem. Um comentário de "passei por isso também" viraliza no WhatsApp.

**Como instalar:** Um `<script>` simples no final de cada artigo. Requer que o repositório seja público no GitHub.

**Arquivo a modificar:** `app/blog/[slug]/page.tsx` — criar um componente cliente `GiscusComments` e renderizar no fim do artigo.

---

## Resumo por prioridade

| # | Feature | Impacto | Esforço | Depende de terceiro? |
|---|---|---|---|---|
| 1 | OG Images Dinâmicas | Muito alto | Baixo | Não |
| 2 | Artigos Relacionados | Alto | Muito baixo | Não (já tem backend) |
| 3 | Newsletter Real (Brevo) | Alto | Baixo | Brevo (gratuito) |
| 4 | Quiz Viral | Muito alto | Médio | Não |
| 5 | Calculadora de Dívida | Alto | Médio | Não |
| 6 | PWA Manifest | Médio | Muito baixo | Não |
| 7 | Table of Contents | Médio | Médio | Não |
| 8 | FAQPage Schema | Alto | Baixo | Não |
| 9 | Bookmarks localStorage | Médio | Médio | Não |
| 10 | Comentários Giscus | Médio | Baixo | GitHub público |

---

## Observação: o que NÃO faria agora

- **Web Push Notifications (OneSignal)** — Intrusivo, usuários rejeitam o prompt. Capturar e-mail é mais eficaz no Brasil.
- **Login de usuários** — Aumenta o atrito de entrada, afasta visitantes novos.
- **Gráficos pesados (Chart.js, Recharts)** — Pesam o bundle. Fazer gráficos com CSS/SVG puro é suficiente para a calculadora.
- **AMP** — Descontinuado pelo Google para SEO. Não vale mais o esforço.
