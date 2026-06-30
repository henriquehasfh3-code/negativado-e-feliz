# Plano de Ação — Fotos Reais + Giscus
Gerado em: 2026-06-30

Ambos os itens dependem de ação manual sua — nenhum exige geração de código novo.

---

## PARTE 1 — Fotos Reais nas Capas

### Onde baixar
**pexels.com** — gratuito, uso comercial, melhor seleção de pessoas latinoamericanas.

### Regras para escolher a foto certa
- Formato **paisagem (horizontal)** — fotos verticais ficam cortadas nos cards do celular
- Tamanho mínimo **1200 × 630px**
- Rosto ou elemento principal no **centro** da foto — as bordas são cortadas em telas pequenas
- Sem texto, logo ou marca visível

---

### As 4 fotos a baixar e substituir

#### 1. `cartao-de-credito`
**Artigo:** Cartão de Crédito é Vilão ou Ferramenta?
**Buscar no Pexels:** `woman stressed credit card` ou `person holding credit card worried`
**Tom:** pessoa segurando cartão com expressão preocupada ou arrependida

#### 2. `score-zero`
**Artigo:** Score 0: um relato de sobrevivência
**Buscar no Pexels:** `person shocked looking at phone` ou `woman anxious smartphone`
**Tom:** pessoa olhando celular com cara de choque ou nervosismo

#### 3. `tesouro-direto`
**Artigo:** Tesouro Direto: invista R$30 agora
**Buscar no Pexels:** `person counting money coins` ou `woman saving coins jar`
**Tom:** pessoa contando dinheiro ou guardando moedas — humor de quem está tentando ser adulto financeiramente

#### 4. `reserva-emergencia`
**Artigo:** Reserva de Emergência: por que a minha é uma piada
**Buscar no Pexels:** `empty wallet` ou `person empty pockets`
**Tom:** carteira vazia, cofrinho vazio — leve, não dramático

---

### Como substituir

1. Baixe a foto no Pexels (botão "Free Download" → maior resolução)
2. Renomeie o arquivo mantendo **exatamente o mesmo nome** com extensão `.png`:
   - `cartao-de-credito.png`
   - `score-zero.png`
   - `tesouro-direto.png`
   - `reserva-emergencia.png`
3. Coloque em `public/images/covers/` substituindo os arquivos antigos
4. Reinicie o servidor — `npm run dev`

`sair-das-dividas.png` já é foto real — **não mexer**.

---

## PARTE 2 — Giscus Comentários

O componente `components/GiscusComments.tsx` está pronto mas desativado (removido do artigo) porque está com valores placeholder. Para ativar de verdade, siga os passos abaixo.

### Pré-requisito: repositório público no GitHub

O Giscus usa o GitHub Discussions para armazenar os comentários. O repositório onde está o código do blog precisa ser **público**.

Se o repositório for privado: vá em **GitHub → repositório → Settings → Danger Zone → Change repository visibility → Public**.

---

### Passo 1 — Habilitar Discussions no repositório

No GitHub, dentro do repositório do projeto:
1. Vá em **Settings**
2. Role até a seção **Features**
3. Marque a caixa **Discussions**
4. Salve

---

### Passo 2 — Instalar o app Giscus no repositório

1. Acesse **github.com/apps/giscus**
2. Clique em **Install**
3. Escolha o repositório do blog
4. Confirme a instalação

---

### Passo 3 — Pegar os IDs reais

1. Acesse **giscus.app**
2. Na seção **Repository**, digite `seu-usuario/seu-repositorio`
3. O site vai validar e mostrar se está tudo certo
4. Em **Discussion Category**, selecione **General** (ou crie uma categoria chamada "Comments")
5. Role até o final — o site vai gerar um bloco `<script>` com todos os atributos preenchidos

Anote os valores:
- `data-repo` → ex: `henriquehasfh3/negativado-e-feliz`
- `data-repo-id` → ex: `R_kgDOABCDEF`
- `data-category` → ex: `General`
- `data-category-id` → ex: `DIC_kwDOABCDEF`

---

### Passo 4 — Atualizar `components/GiscusComments.tsx`

Substituir os 4 valores placeholder pelos reais:

```ts
// ANTES (placeholders):
script.setAttribute("data-repo", "seu-usuario/seu-repo");
script.setAttribute("data-repo-id", "R_kgDOXXXXXX");
script.setAttribute("data-category", "Comments");
script.setAttribute("data-category-id", "DIC_kwDOXXXXXX");

// DEPOIS (seus valores reais do giscus.app):
script.setAttribute("data-repo", "seu-usuario/seu-repositorio");
script.setAttribute("data-repo-id", "R_kgDO...");
script.setAttribute("data-category", "General");
script.setAttribute("data-category-id", "DIC_kwDO...");
```

---

### Passo 5 — Reativar o componente no artigo

**Arquivo:** `app/blog/[slug]/page.tsx`

Adicionar de volta o import e o componente que foram removidos:

```ts
// Adicionar no bloco de imports (junto com os outros):
import GiscusComments from "@/components/GiscusComments";
```

```tsx
// Adicionar após o </div> que fecha o bloco "prose" (corpo do artigo):
<GiscusComments />
```

---

### Resumo dos arquivos a alterar após configurar o Giscus

| Arquivo | Ação |
|---|---|
| `components/GiscusComments.tsx` | Trocar os 4 valores placeholder pelos IDs reais |
| `app/blog/[slug]/page.tsx` | Readicionar o import e `<GiscusComments />` |
