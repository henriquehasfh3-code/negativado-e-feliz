# Revisão do Projeto vs. Plano Original
Gerado em: 2026-06-29

---

## ✅ Implementado corretamente

- **Nome e slogan** — "Negativado e Feliz" / "Porque alguém tem que rir das contas" — `app/layout.tsx`, `components/Footer.tsx`
- **Ícones de caveira removidos** — Skull substituído por TrendingUp, Receipt, etc. — `components/Header.tsx`, `Footer.tsx`, `HeroSection.tsx`, `PostCard.tsx`
- **Sem emoji 💀 no código-fonte** — confirmado via varredura em `**/*.{tsx,ts,mdx}`
- **Palavrões nos textos dos artigos corrigidos** — "desgraça", "inferno", "maldito", "capanga", "burrice" substituídos — `content/posts/`
- **Cores do design system** — #CC0000, #080808, #FFD600, #A0A0A0, #606060 hardcoded inline em todos os componentes
- **Tipografia** — Bebas Neue (`font-heading`) e Inter (`font-sans`) carregando via `next/font/google` — `app/layout.tsx`
- **Dark mode como padrão** — `defaultTheme="dark"` no ThemeProvider — `app/layout.tsx`
- **Toggle dark/light funcional** — botão no Header e mobile drawer — `components/Header.tsx`
- **Plugin `@tailwindcss/typography`** — instalado e referenciado em `app/globals.css` com `@plugin`
- **6 páginas obrigatórias existem e renderizam** — `/`, `/blog`, `/blog/[slug]`, `/sobre`, `/politica-de-privacidade`, `/contato`
- **Página 404 customizada** — `app/not-found.tsx` com humor do blog
- **Política de Privacidade menciona AdSense e cookies** — seção "Uso de Cookies e Google AdSense" com cookie DART — `app/politica-de-privacidade/page.tsx`
- **Espaços reservados AdSense** — script comentado no `<head>` (`app/layout.tsx`), componente `AdBanner` completo com código de exemplo, `AdSenseSlot` inline no meio de cada artigo (`app/blog/[slug]/page.tsx`), banner no topo da listagem (`components/BlogClient.tsx`)
- **Newsletter com feedback visual** — formulário no footer com estado "Cadastrado! Prepare o coração para os boletos." — `components/Footer.tsx`
- **WhatsApp e Twitter/X share buttons** — funcionais com URLs corretas — `components/ShareButtons.tsx`
- **Botão "copiar link"** — com feedback de confirmação — `components/ShareButtons.tsx`
- **Tempo de leitura calculado automaticamente** — via pacote `reading-time` em `lib/posts.ts`, exibido em `PostCard` e na página do artigo
- **Barra de progresso de leitura** — `components/ProgressBar.tsx` fixo no topo — `app/blog/[slug]/page.tsx`
- **Animações Framer Motion** — fade-in, stagger, animação de flutuação no boleto da hero, drawer do menu mobile — múltiplos componentes
- **SEO dinâmico** — `generateMetadata` por página, OpenGraph e Twitter card — `app/blog/[slug]/page.tsx`, demais páginas
- **JSON-LD Article schema** — gerado por artigo — `app/blog/[slug]/page.tsx`
- **ISR configurado** — `export const revalidate = 60` em Home, Blog, e artigo individual
- **Filtro por categoria + busca** — funcional no BlogClient — `components/BlogClient.tsx`
- **TypeScript** — 0 erros (`npx tsc --noEmit` retornou limpo)
- **Formulário de contato com feedback visual** — estado "Desabafo Enviado" com animação — `app/contato/page.tsx`
- **Conteúdo dos artigos** — 5 arquivos MDX com humor brasileiro, sem palavrões graves — `content/posts/`

---

## ⚠️ Parcialmente implementado / inconsistente

- **"desespero" ainda como tag no frontmatter** — `content/posts/como-sair-das-dividas-surtado.mdx` linha 7: `tags: ["dívidas", "nome sujo", "desespero", "serasa"]` — não exibida visualmente de forma proeminente, mas está nos metadados do artigo

- **"pila" ainda no corpo do artigo** — `content/posts/como-sair-das-dividas-surtado.mdx` linha 37: *"quitada por 500 pila num feirão desses"* — gíria regional, não é palavrão, mas foi identificada para substituição na sessão anterior e não foi corrigida

- **"Juros Assassinos" como nome de estratégia** — `content/posts/como-sair-das-dividas-surtado.mdx` linha 28: `## Passo 2: A técnica da "Bola de Neve" ou "Juros Assassinos"` — tom levemente violento, em conflito com o novo posicionamento do plano

- **Imagens de capa — conceito antigo (caveiras) não substituído** — 4 das 5 imagens ainda têm esqueletos/caveiras (ver seção de imagens)

- **Pinterest: utilidade implementada mas botão ausente na UI** — `lib/utils.ts` tem `generateShareUrl("pinterest", ...)` completo, mas `components/ShareButtons.tsx` renderiza apenas WhatsApp, Twitter/X e copiar link — botão Pinterest não aparece para o usuário

- **LinkedIn: mesmo problema do Pinterest** — `generateShareUrl("linkedin", ...)` implementado mas sem botão na UI

- **`shadcn/ui`** — mencionado no plano como parte da stack mas **não instalado**. Apenas `clsx` + `tailwind-merge` foram adicionados (que fazem parte do padrão shadcn mas não os componentes). Nenhum componente do shadcn/ui está em uso

- **`NewsletterForm.tsx`** — componente criado com variantes `inline`, `footer` e `card`, com loading spinner e sucesso animado, mas **não está importado em nenhuma página**. O Footer usa sua própria implementação inline separada. Componente morto — `components/NewsletterForm.tsx`

- **Emoji 🔍 em estado vazio do blog** — `components/BlogClient.tsx` linha 103: `<div className="text-5xl mb-4">🔍</div>` — emoji presente, não é 💀 mas é inconsistente com a política de não usar emojis

- **`categoryColors` com classes dinâmicas** — `lib/utils.ts` linhas 8-18: strings como `"bg-blue-500/20 text-blue-400"` são montadas dinamicamente; se o Tailwind v4 não as encontrar nos templates, não serão geradas no CSS final. Isso pode fazer as badges de categoria ficarem sem cor

- **Next.js versão** — plano diz Next.js 14, projeto usa Next.js **16.2.9**. Funcionalmente compatível, mas diverge do plano original

---

## ❌ Ausente ou quebrado

- **`app/sitemap.ts`** — **ausente** — sem geração automática de `/sitemap.xml`. Impacto: SEO prejudicado, o Google não terá um mapa das páginas. Precisa criar `app/sitemap.ts`

- **`app/robots.ts`** — **ausente** — sem `/robots.txt`. Impacto: crawlers sem orientação sobre o que indexar. Precisa criar `app/robots.ts`

- **Botão Pinterest no `ShareButtons`** — **ausente na UI** — apesar de ter a URL gerada, nenhum botão é renderizado. O plano especifica explicitamente Pinterest como botão obrigatório — `components/ShareButtons.tsx`

- **Favicon / ícone do site** — **ausente** — sem `app/icon.png`, `app/icon.svg`, nem `public/favicon.ico`. O navegador vai exibir o ícone padrão. Impacto visual na aba do browser e em bookmarks

- **`@notionhq/client` e `notion-to-md` no `package.json`** — o **plano original diz explicitamente "NÃO usamos Notion como CMS"**, mas essas dependências estão instaladas (`package.json` linhas 12 e 21). O `lib/notion.ts` é um módulo completo com integração Notion ativa. O `lib/data.ts` usa o Notion como **fonte primária**, com MDX como fallback. Isso é uma inversão do plano: o projeto foi construído com Notion como CMS central, não MDX como CMS central

- **`notion-to-md` instalado mas não usado** — foi substituído pela API nativa `notion.pages.retrieveMarkdown()` mas ainda consta no `package.json` como dependência — peso desnecessário no bundle de dependências

---

## 🖼️ Status das imagens

| Imagem | Usada em | Existe em `/public`? | Compatível com "fotos realistas, humor leve"? |
|---|---|---|---|
| `/hero-bg.png` | `HeroSection.tsx` (fundo), `app/layout.tsx` (OG image) | ✅ Sim | ✅ Imagem genérica de fundo, sem caveira |
| `/logo.png` | `app/blog/[slug]/page.tsx` (JSON-LD schema) | ✅ Sim | ✅ Logo sem caveira (não visível na UI) |
| `/about.png` | **Não usada em nenhum arquivo** | ✅ Sim | ❓ Desconhecido — arquivo órfão |
| `/images/hero-boletos.png` | `components/HeroSection.tsx` | ✅ Sim | ✅ Mesa com boletos, foto realista |
| `/images/about-brasileiro.png` | `app/sobre/page.tsx` | ✅ Sim | ✅ Foto de pessoa brasileira, realista |
| `/images/covers/sair-das-dividas.png` | `content/posts/como-sair-das-dividas-surtado.mdx` | ✅ Sim | ✅ Foto real de mulher no ônibus — **única compatível com novo conceito** |
| `/images/covers/cartao-de-credito.png` | `content/posts/cartao-de-credito-vilao.mdx` | ✅ Sim | ❌ Ilustração com **esqueleto** segurando cartão com rosto de demônio |
| `/images/covers/score-zero.png` | `content/posts/score-zero-sobrevivencia.mdx` | ✅ Sim | ❌ Ilustração com **esqueleto/ceifeiro** ao lado do medidor de score |
| `/images/covers/tesouro-direto.png` | `content/posts/tesouro-direto-30-reais.mdx` | ✅ Sim | ❌ Ilustração com **esqueleto pirata** abrindo baú de tesouros |
| `/images/covers/reserva-emergencia.png` | `content/posts/reserva-de-emergencia-piada.mdx` | ✅ Sim | ⚠️ **Mãos de esqueleto** segurando pote com cofrinho — sem cabeça de caveira, mas ainda é esqueleto |

**Resumo de imagens:** 1 de 5 capas compatíveis com o novo conceito visual. Nenhuma imagem quebrada (todos os arquivos existem). Um arquivo `/public/about.png` existe mas não é referenciado em nenhum arquivo de código — candidato a remoção.

---

## 🐛 Erros de build/TypeScript encontrados

**Nenhum erro encontrado.** `npx tsc --noEmit` retornou sem saída (0 erros, 0 warnings).

O build de produção (`npm run build`) gerou todas as 14 páginas estáticas com sucesso na sessão anterior.

---

## 📋 Resumo executivo

| Categoria | Status |
|---|---|
| Identidade visual e tom | ✅ Implementado (exceto imagens de capa) |
| Stack técnica | ⚠️ Diverge do plano — Notion presente como primário |
| Design system | ✅ Majoritariamente correto |
| Imagens | ❌ 4/5 capas ainda têm esqueletos |
| Páginas obrigatórias | ✅ Todas presentes |
| SEO (sitemap/robots) | ❌ Ausentes |
| AdSense | ✅ Placeholders implementados |
| Newsletter | ✅ Funcional (frontend only) |
| Compartilhamento | ⚠️ Falta Pinterest na UI |
| TypeScript | ✅ Zero erros |
| Conteúdo MDX | ⚠️ Pequenos resquícios ("pila", "desespero" como tag, "Juros Assassinos") |
