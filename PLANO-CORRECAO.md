# Plano de Correção — Revisão Gemini
Gerado em: 2026-06-29

3 itens a corrigir. Ordem de prioridade: do mais urgente ao menos urgente.

---

## CORREÇÃO 1 — Giscus ativo com placeholders (URGENTE)

**Problema:** `components/GiscusComments.tsx` está sendo renderizado em todos os artigos com valores falsos (`"seu-usuario/seu-repo"`, `"R_kgDOXXXXXX"`). Todo visitante que abre um artigo vê o Giscus tentar carregar, falhar com 404, e exibir erro no iframe.

**Arquivo a modificar:** `app/blog/[slug]/page.tsx`

**Mudança 1 — Remover o import (linha 14):**
```ts
// REMOVER esta linha:
import GiscusComments from "@/components/GiscusComments";
```

**Mudança 2 — Remover o componente do JSX (linha 270):**
```tsx
// REMOVER esta linha de dentro do JSX:
<GiscusComments />
```

**O componente `components/GiscusComments.tsx` NÃO deve ser deletado.** Ele está corretamente implementado e será reativado quando o usuário criar o repositório no GitHub e configurar o Giscus com os IDs reais.

---

## CORREÇÃO 2 — Logs de erro do Notion (CONFIGURAÇÃO, não código)

**Problema:** O arquivo `.env.local` tem `NOTION_TOKEN` e/ou `NOTION_DATABASE_ID` definidos com valores inválidos ou expirados. O código tenta conectar ao Notion, falha, e imprime logs de erro no terminal a cada request.

**Arquivo a modificar:** `.env.local` (na raiz do projeto)

**Ação:** Comentar ou apagar as linhas das variáveis do Notion:
```bash
# ANTES (causando os logs):
NOTION_TOKEN=secret_algumvalor
NOTION_DATABASE_ID=algumid

# DEPOIS (silencia os logs, usa MDX direto):
# NOTION_TOKEN=secret_algumvalor
# NOTION_DATABASE_ID=algumid
```

**Por que funciona:** `lib/notion.ts:86` tem `isNotionConfigured()` que retorna `false` quando essas variáveis estão ausentes. Com isso, `lib/data.ts` pula completamente o Notion e vai direto para os arquivos MDX, sem nenhum log de erro.

**Nenhum arquivo de código precisa ser alterado.**

---

## CORREÇÃO 3 — Título da aba do browser em /salvos (BAIXA PRIORIDADE)

**Problema:** `app/salvos/page.tsx` usa `"use client"` e por isso não pode exportar `metadata`. A aba do navegador mostra a URL em vez de um título descritivo.

**Arquivo a criar:** `app/salvos/layout.tsx`

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artigos Salvos | Negativado e Feliz",
  description: "Seus artigos salvos para ler depois. Porque a gente sempre diz que vai ler depois.",
};

export default function SalvosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

**Por que funciona:** No Next.js App Router, o `layout.tsx` roda no servidor e pode exportar `metadata` normalmente. O `page.tsx` continua como `"use client"` sem precisar mudar nada.

---

## Resumo

| # | Arquivo | Ação | Urgência |
|---|---|---|---|
| 1 | `app/blog/[slug]/page.tsx` | Remover import e uso de `<GiscusComments />` | Urgente |
| 2 | `.env.local` | Comentar `NOTION_TOKEN` e `NOTION_DATABASE_ID` | Alta |
| 3 | `app/salvos/layout.tsx` | Criar arquivo com metadata | Baixa |
