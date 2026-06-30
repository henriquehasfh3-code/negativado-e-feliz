# Plano — Correções Finais
Gerado em: 2026-06-30

---

## CORREÇÃO 1 — ShareButtons flutuando no meio do artigo

**Causa:** O sidebar de compartilhamento usa `left-[calc(50%-480px)]` para se posicionar à esquerda do artigo. O problema é que quando o sumário (TableOfContents) aparece na direita, o artigo de 720px + o sumário de 256px + o gap de 64px formam um bloco de 1040px — que empurra o artigo para a esquerda e faz o sidebar colidir com o texto.

**Arquivo:** `components/ShareButtons.tsx` linha 43

```tsx
// ANTES:
<aside className="hidden xl:flex fixed left-[calc(50%-480px)] top-[240px] flex-col gap-4 z-40 items-center justify-center p-2 bg-[#111111]/80 backdrop-blur-xl border border-[#CC0000]/20 rounded-full shadow-lg shadow-[#CC0000]/20">

// DEPOIS:
<aside className="hidden xl:flex fixed left-4 top-[240px] flex-col gap-4 z-40 items-center justify-center p-2 bg-[#111111]/80 backdrop-blur-xl border border-[#CC0000]/20 rounded-full shadow-lg shadow-[#CC0000]/20">
```

Trocar `left-[calc(50%-480px)]` por `left-4` — cola o sidebar na borda esquerda da tela, onde sempre tem espaço independente do tamanho da tela ou do sumário.

---

## CORREÇÃO 2 — Formulário de contato não envia e-mail

**Causa:** O remetente está configurado como `noreply@negativadoefeliz.com.br`. O Brevo bloqueia envios de domínios personalizados que não foram verificados com registros DNS. O e-mail é aceito pelo código mas rejeitado silenciosamente pelo Brevo antes de chegar na sua caixa.

O mesmo problema existe em `app/api/comentario/route.ts`.

**Correção em `app/api/contato/route.ts` linha 19:**

```ts
// ANTES:
sender: {
  name: "Negativado e Feliz — Contato",
  email: "noreply@negativadoefeliz.com.br",
},

// DEPOIS:
sender: {
  name: "Negativado e Feliz — Contato",
  email: "henriquehasfh3@gmail.com",
},
```

**Correção em `app/api/comentario/route.ts` — mesma troca:**

```ts
// ANTES:
sender: {
  name: "Negativado e Feliz — Comentários",
  email: "noreply@negativadoefeliz.com.br",
},

// DEPOIS:
sender: {
  name: "Negativado e Feliz — Comentários",
  email: "henriquehasfh3@gmail.com",
},
```

**Mesmo problema existe em `app/api/newsletter/route.ts` — verificar e aplicar a mesma troca se o remetente estiver usando o domínio personalizado.**

---

## CORREÇÃO 3 — Política de Privacidade (LGPD)

A página atual foca apenas no Google AdSense e não cobre os requisitos da Lei 13.709/2018 (LGPD). Precisa informar: quem controla os dados, por que são coletados, quais terceiros recebem, quanto tempo são guardados e como o usuário pode pedir exclusão.

**Arquivo:** `app/politica-de-privacidade/page.tsx`

Substituir o conteúdo do `<article>` (linhas 31 a 113) pelo seguinte:

```tsx
<article className="flex flex-col gap-8">

  <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
    Esta Política de Privacidade descreve como o blog{" "}
    <strong className="text-[#F5F5F5]">Negativado e Feliz</strong>{" "}
    (negativadoefeliz.com.br) coleta, usa e protege seus dados pessoais, em
    conformidade com a <strong className="text-[#F5F5F5]">Lei Geral de Proteção de Dados — LGPD (Lei 13.709/2018)</strong>.
  </p>

  {/* 1 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      1. Quem é o Controlador dos Dados
    </h2>
    <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
      O controlador responsável pelo tratamento dos seus dados é o blog
      Negativado e Feliz, operado de forma independente e com sede no Brasil.
      Para qualquer dúvida ou solicitação relacionada aos seus dados, entre em
      contato pelo formulário em{" "}
      <a href="/contato" className="text-[#CC0000] hover:underline">
        negativadoefeliz.com.br/contato
      </a>{" "}
      ou pelo e-mail{" "}
      <strong className="text-[#F5F5F5]">henriquehasfh3@gmail.com</strong>.
    </p>
  </div>

  {/* 2 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      2. Quais Dados Coletamos
    </h2>
    <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-2 list-none">
      {[
        { dado: "Nome ou apelido", motivo: "Fornecido voluntariamente no quiz, formulário de contato ou comentários." },
        { dado: "Endereço de e-mail", motivo: "Fornecido voluntariamente ao assinar a newsletter, enviar contato ou participar do quiz." },
        { dado: "Conteúdo de mensagens", motivo: "Mensagens enviadas pelo formulário de contato ou comentários nos artigos." },
        { dado: "Dados de navegação (cookies)", motivo: "Preferência de tema (escuro/claro), artigos salvos — armazenados localmente no seu dispositivo." },
        { dado: "Dados de push notification", motivo: "Identificador anônimo do dispositivo, se você optar por receber notificações via OneSignal." },
      ].map((item) => (
        <li key={item.dado} className="flex gap-3">
          <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
          <span>
            <strong className="text-[#F5F5F5]">{item.dado}:</strong>{" "}
            {item.motivo}
          </span>
        </li>
      ))}
    </ul>
  </div>

  {/* 3 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      3. Para Que Usamos seus Dados
    </h2>
    <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-2 list-none">
      {[
        "Enviar a newsletter com novos artigos e conteúdos do blog (somente se você assinou).",
        "Responder mensagens enviadas pelo formulário de contato.",
        "Receber e moderar comentários nos artigos.",
        "Enviar notificações push sobre novos artigos (somente se você autorizou).",
        "Exibir anúncios relevantes via Google AdSense (quando ativado).",
        "Melhorar a experiência de navegação com preferências salvas localmente.",
      ].map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* 4 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      4. Com Quem Compartilhamos
    </h2>
    <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-2 list-none">
      {[
        { empresa: "Brevo (ex-Sendinblue)", uso: "Armazena e-mails de assinantes da newsletter e envia os e-mails transacionais de contato e comentários. Política: brevo.com/legal/privacypolicy" },
        { empresa: "OneSignal", uso: "Gerencia as assinaturas de notificações push. Armazena identificadores anônimos de dispositivo. Política: onesignal.com/privacy_policy" },
        { empresa: "Google AdSense", uso: "Exibe anúncios personalizados com base no perfil de navegação (quando ativo). Política: policies.google.com/privacy" },
        { empresa: "Vercel", uso: "Hospedagem do site. Pode registrar logs de acesso (IP, data/hora) por razões de segurança." },
      ].map((item) => (
        <li key={item.empresa} className="flex gap-3">
          <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
          <span>
            <strong className="text-[#F5F5F5]">{item.empresa}:</strong>{" "}
            {item.uso}
          </span>
        </li>
      ))}
    </ul>
    <p className="font-sans text-sm text-[#A0A0A0] leading-relaxed mt-4">
      Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins comerciais além dos listados acima.
    </p>
  </div>

  {/* 5 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      5. Por Quanto Tempo Guardamos
    </h2>
    <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-2 list-none">
      {[
        "E-mails de newsletter: mantidos até você cancelar a inscrição.",
        "Mensagens de contato e comentários: mantidos por até 2 anos ou até você solicitar exclusão.",
        "Dados de notificação push: mantidos até você revogar a permissão no navegador.",
        "Preferências de navegação (tema, salvos): armazenados localmente no seu dispositivo, sem prazo — você pode limpar a qualquer momento pelo navegador.",
      ].map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* 6 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      6. Seus Direitos (LGPD Art. 18)
    </h2>
    <p className="font-sans text-base text-[#A0A0A0] leading-relaxed mb-4">
      Como titular dos dados, você tem direito a:
    </p>
    <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-2 list-none">
      {[
        "Confirmar se tratamos seus dados pessoais.",
        "Acessar os dados que temos sobre você.",
        "Corrigir dados incompletos ou desatualizados.",
        "Solicitar a exclusão dos seus dados.",
        "Revogar o consentimento a qualquer momento (ex: cancelar a newsletter).",
        "Portabilidade dos seus dados para outro serviço.",
      ].map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
    <p className="font-sans text-base text-[#A0A0A0] leading-relaxed mt-4">
      Para exercer qualquer um desses direitos, entre em contato pelo{" "}
      <a href="/contato" className="text-[#CC0000] hover:underline">
        formulário de contato
      </a>{" "}
      ou por e-mail em{" "}
      <strong className="text-[#F5F5F5]">henriquehasfh3@gmail.com</strong>.
      Respondemos em até 15 dias úteis.
    </p>
  </div>

  {/* 7 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      7. Cookies e Consentimento
    </h2>
    <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
      Utilizamos cookies essenciais (preferência de tema e artigos salvos) que
      funcionam apenas no seu dispositivo e não rastreiam você. Cookies de
      publicidade (Google AdSense) e analytics são ativados somente após seu
      consentimento pelo banner exibido na primeira visita. Você pode revogar o
      consentimento a qualquer momento limpando os dados do site nas configurações
      do seu navegador.
    </p>
  </div>

  {/* 8 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      8. Segurança
    </h2>
    <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
      O site utiliza HTTPS com certificado SSL. Não armazenamos senhas nem dados
      financeiros. Os dados de e-mail são armazenados na Brevo, que segue os
      padrões GDPR/LGPD. Nenhum sistema é 100% seguro, mas adotamos as melhores
      práticas disponíveis.
    </p>
  </div>

  {/* 9 */}
  <div>
    <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
      9. Alterações nesta Política
    </h2>
    <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
      Podemos atualizar esta política periodicamente. Alterações relevantes serão
      comunicadas por e-mail aos assinantes da newsletter. A data da última
      atualização aparece sempre no rodapé desta página.
    </p>
  </div>

  {/* Rodapé */}
  <div className="border-t border-[#CC0000]/20 pt-6 mt-2">
    <p className="text-center text-[#606060] font-sans text-xs uppercase tracking-widest">
      Última atualização: 30 de junho de 2026.
    </p>
  </div>

</article>
```

Também atualizar o subtítulo do cabeçalho (linha 26):
```tsx
// ANTES:
<p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest">
  Termos obrigatórios para o Google AdSense
</p>

// DEPOIS:
<p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest">
  Em conformidade com a LGPD — Lei 13.709/2018
</p>
```

---

## Resumo

| # | Arquivo | Mudança |
|---|---|---|
| 1 | `components/ShareButtons.tsx` | `left-[calc(50%-480px)]` → `left-4` |
| 2 | `app/api/contato/route.ts` | sender email → `henriquehasfh3@gmail.com` |
| 3 | `app/api/comentario/route.ts` | sender email → `henriquehasfh3@gmail.com` |
| 4 | `app/api/newsletter/route.ts` | verificar sender e aplicar mesma correção se necessário |
| 5 | `app/politica-de-privacidade/page.tsx` | substituir conteúdo do article + atualizar subtítulo |
