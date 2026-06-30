# Plano Final de Implementação
Gerado em: 2026-06-30

7 itens. Ordem de execução recomendada.

---

## ITEM 1 — Texto azul nos artigos (ALTA prioridade)

**Arquivo:** `app/globals.css`

Localizar o bloco `.prose {` e substituir apenas ele (manter todas as regras abaixo como `.prose h2`, `.prose h3`, etc.):

```css
.prose {
  font-family: var(--font-inter), sans-serif;
  font-size: 18px;
  line-height: 1.8;
  color: var(--text-primary);

  --tw-prose-body: #D0D0D0;
  --tw-prose-headings: #F5F5F5;
  --tw-prose-links: #CC0000;
  --tw-prose-bold: #F5F5F5;
  --tw-prose-counters: #A0A0A0;
  --tw-prose-bullets: #CC0000;
  --tw-prose-hr: rgba(204, 0, 0, 0.2);
  --tw-prose-quotes: #A0A0A0;
  --tw-prose-quote-borders: #CC0000;
  --tw-prose-captions: #606060;
  --tw-prose-code: #F5F5F5;
  --tw-prose-pre-code: #F5F5F5;
  --tw-prose-pre-bg: #050505;
  --tw-prose-th-borders: rgba(204, 0, 0, 0.2);
  --tw-prose-td-borders: rgba(204, 0, 0, 0.1);
}
```

---

## ITEM 2 — Remover redes sociais do footer (ALTA prioridade)

**Arquivo:** `components/Footer.tsx`

Remover completamente o bloco `<div className="flex items-center gap-3 mt-2">` que contém os 3 ícones de redes sociais (Twitter, Instagram, YouTube) — linhas 61 a 95.

O bloco a remover começa em:
```tsx
{/* ✅ Redes sociais com ícones inline SVGs robustos */}
<div className="flex items-center gap-3 mt-2">
```
E termina no `</div>` que fecha esse bloco (após o SVG do YouTube).

Não remover nada além desse bloco — o slogan e o logo acima ficam.

---

## ITEM 3 — Substituir Giscus por formulário próprio de comentários

### 3a — Criar `components/CommentForm.tsx`

Componente client com nome (obrigatório), e-mail (opcional) e comentário (obrigatório). Envia para `/api/comentario`. Sem login, sem GitHub.

```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, CheckCircle } from "lucide-react";

interface CommentFormProps {
  postTitle: string;
  postSlug: string;
}

export default function CommentForm({ postTitle, postSlug }: CommentFormProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/comentario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, comentario, postTitle, postSlug }),
      });

      if (!res.ok) throw new Error("Falha ao enviar");
      setSubmitted(true);
    } catch {
      setError("Deu ruim no envio. Tenta de novo, vai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 border-t border-[#CC0000]/20 pt-10">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-[#CC0000]" />
        <h3 className="font-heading text-[28px] text-[#F5F5F5]">
          Deixe seu Desabafo
        </h3>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl px-6 py-5"
        >
          <CheckCircle className="w-5 h-5 text-[#CC0000] flex-shrink-0" />
          <p className="font-sans text-sm text-[#CC0000] font-semibold">
            Desabafo recebido! A redação vai ler isso enquanto paga os próprios boletos.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                Nome <span className="text-[#CC0000]">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome ou apelido"
                required
                className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                E-mail <span className="text-[#606060] font-normal normal-case tracking-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Para respondermos (opcional)"
                className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
              Comentário <span className="text-[#CC0000]">*</span>
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="O que você achou? Tem alguma história parecida?"
              required
              rows={4}
              className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060] resize-none"
            />
          </div>

          {error && (
            <p className="font-sans text-sm text-[#CC0000]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#CC0000] hover:bg-[#8B0000] disabled:opacity-50 text-white font-sans text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? "Enviando..." : "Enviar Comentário"}
          </button>

          <p className="font-sans text-[11px] text-[#606060]">
            Seus dados não são compartilhados. Comentários passam por moderação antes de aparecer no site.
          </p>
        </form>
      )}
    </div>
  );
}
```

---

### 3b — Criar `app/api/comentario/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, comentario, postTitle, postSlug } = await request.json();

    if (!nome || !comentario) {
      return NextResponse.json({ error: "Nome e comentário são obrigatórios" }, { status: 400 });
    }

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        sender: {
          name: "Negativado e Feliz — Comentários",
          email: "noreply@negativadoefeliz.com.br",
        },
        to: [{ email: "henriquehasfh3@gmail.com", name: "Henrique" }],
        subject: `Novo comentário em "${postTitle}"`,
        htmlContent: `
          <h2>Novo comentário no blog</h2>
          <p><strong>Artigo:</strong> ${postTitle}</p>
          <p><strong>Link:</strong> https://negativadoefeliz.com.br/blog/${postSlug}</p>
          <hr/>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email || "não informado"}</p>
          <hr/>
          <blockquote style="border-left: 4px solid #CC0000; padding-left: 16px; color: #333;">
            ${comentario}
          </blockquote>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Comentario API Error]", error);
    return NextResponse.json({ error: "Falha ao enviar comentário" }, { status: 500 });
  }
}
```

---

### 3c — Atualizar `app/blog/[slug]/page.tsx`

**Remover** o import do Giscus:
```ts
// REMOVER:
import GiscusComments from "@/components/GiscusComments";
```

**Adicionar** o import do CommentForm:
```ts
import CommentForm from "@/components/CommentForm";
```

**Substituir** o uso no JSX (linha 268):
```tsx
// ANTES:
<GiscusComments />

// DEPOIS:
<CommentForm postTitle={post.title} postSlug={slug} />
```

---

## ITEM 4 — Formulário de contato sem backend (MÉDIA prioridade)

### 4a — Criar `app/api/contato/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, mensagem, divida } = await request.json();

    if (!nome || !mensagem) {
      return NextResponse.json({ error: "Nome e mensagem são obrigatórios" }, { status: 400 });
    }

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY || "",
      },
      body: JSON.stringify({
        sender: {
          name: "Negativado e Feliz — Contato",
          email: "noreply@negativadoefeliz.com.br",
        },
        to: [{ email: "henriquehasfh3@gmail.com", name: "Henrique" }],
        subject: `Novo desabafo de ${nome}`,
        htmlContent: `
          <h2>Novo contato pelo site</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>E-mail:</strong> ${email || "não informado"}</p>
          <p><strong>Faixa de dívida:</strong> ${divida}</p>
          <hr/>
          <blockquote style="border-left: 4px solid #CC0000; padding-left: 16px; color: #333;">
            ${mensagem}
          </blockquote>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contato API Error]", error);
    return NextResponse.json({ error: "Falha ao enviar" }, { status: 500 });
  }
}
```

### 4b — Atualizar `app/contato/page.tsx`

Adicionar `useState` para cada campo e conectar ao endpoint. O arquivo já é `"use client"`.

**Adicionar estados no topo do componente** (após o `useState` de `submitted`):
```tsx
const [nome, setNome] = useState("");
const [email, setEmail] = useState("");
const [divida, setDivida] = useState("none");
const [mensagem, setMensagem] = useState("");
```

**Substituir o `handleSubmit`:**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/contato", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, divida, mensagem }),
    });
    if (!res.ok) throw new Error("Falha");
    setSubmitted(true);
  } catch {
    alert("Erro ao enviar. Tenta de novo!");
  }
};
```

**Adicionar `value` e `onChange` em cada input/select/textarea do form:**
- Input nome: `value={nome} onChange={(e) => setNome(e.target.value)}`
- Input email: `value={email} onChange={(e) => setEmail(e.target.value)}`
- Select divida: `value={divida} onChange={(e) => setDivida(e.target.value)}`
- Textarea mensagem: `value={mensagem} onChange={(e) => setMensagem(e.target.value)}`

---

## ITEM 5 — Emojis nos títulos do quiz (BAIXA prioridade)

**Arquivo:** `app/quiz/page.tsx` — localizar o objeto `results` (por volta da linha 70):

```ts
// ANTES:
const results: Record<Perfil, { title: string; text: string }> = {
  Calmo: {
    title: "Negativado Calmo 🧘‍♂️",
    text: "Você tá bem, mas podia estar melhor. Pelo menos não surta.",
  },
  Catastrófico: {
    title: "Negativado Catastrófico 💣",
    text: "Houston, temos um problema. Mas ei — pelo menos você é divertido nas histórias de perrengue.",
  },
  Esperançoso: {
    title: "Negativado Esperançoso ✨",
    text: "Você é o tipo que vai dar a volta por cima. Só precisa parar de usar o cartão como reserva de emergência.",
  },
};

// DEPOIS:
const results: Record<Perfil, { title: string; text: string }> = {
  Calmo: {
    title: "Negativado Calmo",
    text: "Você tá bem, mas podia estar melhor. Pelo menos não surta.",
  },
  Catastrófico: {
    title: "Negativado Catastrófico",
    text: "Houston, temos um problema. Mas ei — pelo menos você é divertido nas histórias de perrengue.",
  },
  Esperançoso: {
    title: "Negativado Esperançoso",
    text: "Você é o tipo que vai dar a volta por cima. Só precisa parar de usar o cartão como reserva de emergência.",
  },
};
```

---

## ITEM 6 — Arquivos órfãos no /public (BAIXA prioridade)

Deletar os seguintes arquivos — nenhum é referenciado em nenhum componente:

```
public/file.svg
public/globe.svg
public/next.svg
public/vercel.svg
public/window.svg
public/about.png
```

---

## ITEM 7 — Ícones PWA com tamanho errado (ação manual do usuário)

**Problema:** `public/icon-192.png` e `public/icon-512.png` são o mesmo arquivo (555kb cada). Um ícone de 512px deve ser muito maior que um de 192px.

**Ação:** Abrir `app/icon.png` (o arquivo de 555kb que existe em `app/`) em qualquer editor de imagem e exportar em dois tamanhos:
- Salvar como `public/icon-192.png` → 192×192px
- Salvar como `public/icon-512.png` → 512×512px

Ferramentas gratuitas online: **squoosh.app** (Google) ou **iloveimg.com/resize-image**.

---

## Resumo de todos os arquivos afetados

| Arquivo | Ação |
|---|---|
| `app/globals.css` | Atualizar bloco `.prose {}` com variáveis typography |
| `components/Footer.tsx` | Remover bloco das 3 redes sociais |
| `components/GiscusComments.tsx` | Não mexer (mantém o arquivo, só para de ser usado) |
| `components/CommentForm.tsx` | Criar novo arquivo |
| `app/api/comentario/route.ts` | Criar novo arquivo |
| `app/api/contato/route.ts` | Criar novo arquivo |
| `app/blog/[slug]/page.tsx` | Trocar GiscusComments por CommentForm |
| `app/contato/page.tsx` | Adicionar estados e conectar ao endpoint |
| `app/quiz/page.tsx` | Remover emojis dos títulos de resultado |
| `public/file.svg` + 5 outros | Deletar |
| `public/icon-192.png` + `icon-512.png` | Reexportar nos tamanhos corretos (ação manual) |
