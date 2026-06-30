# Plano — Notificações Push com OneSignal
Gerado em: 2026-06-30

Quando você publicar um artigo novo, todos os inscritos recebem notificação direto no celular — sem precisar de e-mail, sem login.

---

## PASSO 1 — Criar conta no OneSignal (ação manual sua)

1. Acesse **onesignal.com** → "Start for Free"
2. Crie um novo app: botão **"New App / Website"**
3. Nome do app: `Negativado e Feliz`
4. Clique em **"Web"**
5. Em "Integration", escolha **"Custom Code"**
6. Preencha:
   - **Site Name:** Negativado e Feliz
   - **Site URL:** `https://negativadoefeliz.com.br`
   - **Auto-prompt:** desmarque (vamos usar nosso próprio botão)
7. Clique em **"Save & Continue"**
8. O OneSignal vai exibir seu **App ID** — um código no formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. Guarde esse código.

---

## PASSO 2 — Criar `public/OneSignalSDKWorker.js`

O OneSignal precisa de um arquivo de Service Worker na raiz do site. Criar o arquivo com exatamente esse conteúdo:

```js
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
```

**Arquivo:** `public/OneSignalSDKWorker.js`

---

## PASSO 3 — Adicionar o SDK ao `app/layout.tsx`

### 3a — Adicionar o import do Script no topo

```ts
import Script from "next/script";
```

### 3b — Adicionar os dois scripts dentro do `<body>`, antes do fechamento `</body>`

Colocar após `<ScrollToTop />` e antes de `</ThemeProvider>`:

```tsx
{/* OneSignal Push Notifications */}
<Script
  src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
  strategy="lazyOnload"
/>
<Script id="onesignal-init" strategy="lazyOnload">
  {`
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(async function(OneSignal) {
      await OneSignal.init({
        appId: "SEU_APP_ID_AQUI",
        notifyButton: { enable: false },
        allowLocalhostAsSecureOrigin: true,
      });
    });
  `}
</Script>
```

**Substituir `"SEU_APP_ID_AQUI"` pelo App ID real obtido no Passo 1.**

`notifyButton: { enable: false }` desativa o botão flutuante padrão do OneSignal (usaremos nosso próprio ícone no header).

---

## PASSO 4 — Criar `components/NotificationBell.tsx`

Botão com ícone de sino que abre o prompt nativo do navegador para pedir permissão.

```tsx
"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";

declare global {
  interface Window {
    OneSignalDeferred: any[];
  }
}

export default function NotificationBell() {
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator
    ) {
      setSupported(true);
      if (Notification.permission === "granted") {
        setSubscribed(true);
      }
    }
  }, []);

  const handleClick = () => {
    if (!supported || subscribed) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        await OneSignal.Slidedown.promptPush();
        const optedIn = OneSignal.User.PushSubscription.optedIn;
        if (optedIn) setSubscribed(true);
      } catch (e) {
        console.error("[OneSignal]", e);
      }
    });
  };

  if (!supported) return null;

  return (
    <button
      onClick={handleClick}
      title={subscribed ? "Notificações ativas" : "Ativar notificações de novos artigos"}
      aria-label={subscribed ? "Notificações ativas" : "Ativar notificações"}
      className={`p-2 rounded-full transition-colors ${
        subscribed
          ? "text-[#CC0000] cursor-default"
          : "text-[#A0A0A0] hover:text-[#F5F5F5]"
      }`}
    >
      <Bell
        className="w-[22px] h-[22px]"
        fill={subscribed ? "#CC0000" : "none"}
      />
    </button>
  );
}
```

---

## PASSO 5 — Adicionar o sino ao `components/Header.tsx`

### 5a — Adicionar o import

```ts
import NotificationBell from "@/components/NotificationBell";
```

### 5b — Desktop: adicionar entre o botão de tema e o botão "Assinar"

Localizar o bloco `<div className="hidden md:flex items-center gap-4 z-[10000]">` (linha 131) e adicionar `<NotificationBell />` entre o botão de tema e o Link "Assinar":

```tsx
{/* Ações Desktop */}
<div className="hidden md:flex items-center gap-4 z-[10000]">
  {mounted && (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
      aria-label="Alternar tema"
    >
      {theme === "dark" ? (
        <Sun className="w-[24px] h-[24px]" />
      ) : (
        <Moon className="w-[24px] h-[24px]" />
      )}
    </button>
  )}

  {/* NOVO: sino de notificações */}
  <NotificationBell />

  <Link
    href="#newsletter"
    className="font-sans text-[13px] font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#8B0000] text-white px-4 py-2 rounded-[4px] transition-colors duration-200"
  >
    Assinar
  </Link>
</div>
```

### 5c — Mobile: adicionar no drawer acima do botão "Assinar"

Localizar `<motion.div variants={drawerLinkVariants} className="flex flex-col gap-4">` (linha 225) e adicionar o botão de notificação:

```tsx
<motion.div variants={drawerLinkVariants} className="flex flex-col gap-4">
  {/* NOVO: botão de notificações no mobile */}
  <NotificationBellMobile />

  <Link
    href="#newsletter"
    onClick={() => setMobileMenuOpen(false)}
    className="w-full font-sans text-center text-[15px] font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#8B0000] text-white py-4 rounded-[4px] shadow-lg transition-colors"
  >
    Assinar
  </Link>
</motion.div>
```

Para o mobile, criar um componente inline dentro do próprio `Header.tsx` (pois precisa de `"use client"` que o Header já tem) ou importar uma variação do `NotificationBell` com estilo mobile. A versão mais simples é criar uma função local no Header:

```tsx
// Dentro de Header.tsx, após os imports, antes do export default:
function NotificationBellMobile() {
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setSupported(true);
      if (Notification.permission === "granted") setSubscribed(true);
    }
  }, []);

  const handleClick = () => {
    if (!supported || subscribed) return;
    (window.OneSignalDeferred = window.OneSignalDeferred || []).push(async (OneSignal: any) => {
      try {
        await OneSignal.Slidedown.promptPush();
        if (OneSignal.User.PushSubscription.optedIn) setSubscribed(true);
      } catch {}
    });
  };

  if (!supported) return null;

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 font-sans text-[15px] font-bold uppercase tracking-wider border border-[#CC0000]/30 hover:border-[#CC0000] text-[#A0A0A0] hover:text-[#F5F5F5] py-4 rounded-[4px] transition-colors"
    >
      <Bell className="w-5 h-5" fill={subscribed ? "#CC0000" : "none"} />
      {subscribed ? "Notificações ativas" : "Ativar notificações"}
    </button>
  );
}
```

E adicionar o import do `Bell` ao bloco de imports existente do Header:
```ts
import { TrendingUp, Sun, Moon, Bell } from "lucide-react";
```

---

## PASSO 6 — Como enviar notificação quando publicar artigo (sem código)

1. Acesse **app.onesignal.com** → seu app → **"New Push"**
2. Preencha:
   - **Title:** Negativado e Feliz
   - **Message:** o título do artigo
   - **Launch URL:** `https://negativadoefeliz.com.br/blog/slug-do-artigo`
   - **Image:** URL da capa do artigo (opcional)
3. Clique em **"Send to All Subscribers"** → **"Send Now"**

Todos os inscritos recebem a notificação instantaneamente.

---

## Resumo dos arquivos afetados

| Arquivo | Ação |
|---|---|
| `public/OneSignalSDKWorker.js` | Criar (1 linha) |
| `app/layout.tsx` | Adicionar import Script + 2 blocos Script |
| `components/NotificationBell.tsx` | Criar (componente do sino para desktop) |
| `components/Header.tsx` | Adicionar import Bell, NotificationBellMobile inline, e os dois usos |

---

## Compatibilidade

| Plataforma | Funciona? |
|---|---|
| Android Chrome | Sim — prompt nativo, notificação no celular |
| Desktop Chrome / Edge / Firefox | Sim |
| iOS Safari | Só se o site for adicionado à tela inicial (PWA). O blog já tem manifest configurado. |
| iOS Safari sem PWA | Não — limitação do sistema iOS |
