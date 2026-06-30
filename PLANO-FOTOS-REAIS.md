# Plano de Implementação — Fotos Reais nas Capas
Gerado em: 2026-06-29

## Contexto

As imagens de capa dos artigos aparecem em dois lugares:
- **Cards do blog** — `components/PostCard.tsx` com `object-cover` em altura de 200px (padrão) ou 280px (destaque)
- **Topo do artigo** — `app/blog/[slug]/page.tsx` com `object-cover` em 320px (mobile) ou 400px (desktop)

O componente usa `fill` + `object-cover`, então a imagem é **sempre cortada para preencher o container**. Fotos em **formato paisagem (horizontal)** funcionam muito melhor que retratos verticais.

---

## Regra de ouro para as fotos

- **Formato:** paisagem (horizontal), proporção 16:9 ou 3:2
- **Tamanho mínimo:** 1200 × 630px
- **Pessoas:** brasileiras ou com aparência latina — o blog é 100% brasileiro
- **Tom:** leve, cotidiano, humor implícito — nada de bancos estéreis ou gráficos de Wall Street
- **Sem texto, logo ou marca** visível na foto
- **Formato do arquivo:** JPG (menor tamanho que PNG para fotos)

---

## Sites para baixar (gratuitos, uso comercial sem atribuição)

| Site | Por que usar |
|---|---|
| **pexels.com** | Melhor seleção de pessoas diversas e latinoamericanas |
| **unsplash.com** | Qualidade altíssima, muitas fotos de cotidiano |
| **pixabay.com** | Grande volume, boa alternativa |

Nos três sites: selecione a maior resolução disponível ao baixar.

---

## As 4 fotos a substituir

`sair-das-dividas.png` já é uma foto real e **não precisa ser trocada**.

---

### FOTO 1 — `cartao-de-credito.png`
**Artigo:** "Cartão de Crédito é Vilão ou Ferramenta?"

**O que mostrar:** pessoa segurando cartão de crédito com expressão preocupada, ou cartão sobre mesa bagunçada com contas. Algo que comunique "decidi usar o cartão e agora estou rindo nervoso".

**Termos de busca em inglês (use no Pexels ou Unsplash):**
- `woman stressed credit card`
- `person holding credit card worried`
- `credit card bills stress`
- `man looking at credit card`

**Termos em português (funciona no Pexels):**
- `cartão de crédito preocupado`
- `pessoa segurando cartão`

**Evitar:** fotos com múltiplos cartões em fundo branco (parece banco), cartões flutuando, efeitos 3D.

**Nome do arquivo a salvar:** `cartao-de-credito.jpg`

---

### FOTO 2 — `score-zero.png`
**Artigo:** "Score 0: um relato de sobrevivência"

**O que mostrar:** pessoa olhando o celular com expressão de choque ou nervosismo. Nada muito dramático — aquela cara de "vi meu score e vim a óbito emocionalmente".

**Termos de busca em inglês:**
- `person shocked looking at phone`
- `woman stressed smartphone`
- `man anxious checking phone`
- `person surprised phone screen`

**Termos em português:**
- `pessoa olhando celular preocupada`
- `mulher chocada com celular`

**Evitar:** fotos de telas de celular com apps visíveis, fotos de mão segurando celular sem rosto.

**Nome do arquivo a salvar:** `score-zero.jpg`

---

### FOTO 3 — `tesouro-direto.png`
**Artigo:** "Tesouro Direto: invista R$30 agora antes de gastar no iFood"

**O que mostrar:** pessoa contando dinheiro em espécie (notas), guardando moedas num pote ou cofrinho, ou expressão de "finalmente tomei uma decisão financeira adulta". Humor de quem está investindo com o que sobrou depois das contas.

**Termos de busca em inglês:**
- `person counting money coins`
- `woman saving coins jar`
- `person piggy bank saving`
- `man counting cash bills`
- `person saving money happy`

**Termos em português:**
- `pessoa guardando dinheiro`
- `mulher contando moedas`
- `homem poupança dinheiro`

**Evitar:** fotos de gráficos de bolsa, celular com app de investimento, executivos em escritório, cédulas de dólar.

**Nome do arquivo a salvar:** `tesouro-direto.jpg`

---

### FOTO 4 — `reserva-emergencia.png`
**Artigo:** "Reserva de Emergência: por que a minha é uma piada"

**O que mostrar:** carteira vazia, pessoa olhando para cofrinho vazio ou com cara de "esse cofrinho virou só decoração". Leveza — não precisa ser dramático, só verdadeiro.

**Termos de busca em inglês:**
- `empty wallet`
- `person empty wallet sad`
- `woman looking empty piggy bank`
- `broke person pocket`
- `empty purse no money`

**Termos em português:**
- `carteira vazia`
- `pessoa sem dinheiro`
- `cofrinho vazio`

**Evitar:** fotos de pessoa chorando intensamente, pessoas em situação de rua, imagens muito dramáticas — o blog é humor, não sofrimento.

**Nome do arquivo a salvar:** `reserva-emergencia.jpg`

---

## Como substituir os arquivos

Após baixar e escolher as fotos, renomeie para os nomes acima e coloque em:

```
public/images/covers/
```

**Os arquivos antigos (`.png`) podem ser deletados** após colocar os novos (`.jpg`). Os frontmatter dos MDX precisam ser atualizados para apontar para `.jpg`.

---

## Atualizar o frontmatter dos MDX

Após trocar as fotos para `.jpg`, atualizar o campo `image` em cada arquivo:

**`content/posts/cartao-de-credito-vilao.mdx`** linha 8:
```yaml
# ANTES:
image: "/images/covers/cartao-de-credito.png"
# DEPOIS:
image: "/images/covers/cartao-de-credito.jpg"
```

**`content/posts/score-zero-sobrevivencia.mdx`** linha 8:
```yaml
# ANTES:
image: "/images/covers/score-zero.png"
# DEPOIS:
image: "/images/covers/score-zero.jpg"
```

**`content/posts/tesouro-direto-30-reais.mdx`** linha 8:
```yaml
# ANTES:
image: "/images/covers/tesouro-direto.png"
# DEPOIS:
image: "/images/covers/tesouro-direto.jpg"
```

**`content/posts/reserva-de-emergencia-piada.mdx`** linha 8:
```yaml
# ANTES:
image: "/images/covers/reserva-emergencia.png"
# DEPOIS:
image: "/images/covers/reserva-emergencia.jpg"
```

**Alternativa mais simples:** manter a extensão `.png` mesmo salvando o arquivo como JPG — o Next.js serve o arquivo pelo nome, não pela extensão real. Nesse caso os frontmatter não precisam mudar.

---

## Dica de mobile

O `PostCard` na listagem do blog em celular mostra as fotos com `h-[200px]` e largura total da tela (`100vw`). Prefira fotos onde o **rosto ou elemento principal está no centro** da imagem — as bordas laterais são cortadas em telas estreitas.
