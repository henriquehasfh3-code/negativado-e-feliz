import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CookieBanner from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://negativadoefeliz.com.br"),
  title: {
    default: "Negativado e Feliz | Porque alguém tem que rir das contas",
    template: "%s | Negativado e Feliz",
  },
  description:
    "O blog que fala de finanças com humor negro, pra você que tá no vermelho mas não perde a piada. Dicas de como sair das dívidas sem surtar.",
  keywords: [
    "finanças pessoais",
    "dívidas",
    "humor negro financeiro",
    "score baixo",
    "como sair das dívidas",
    "nome sujo",
    "negativado",
    "dinheiro",
  ],
  authors: [{ name: "Negativado e Feliz" }],
  creator: "Negativado e Feliz",
  publisher: "Negativado e Feliz",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://negativadoefeliz.com.br",
    siteName: "Negativado e Feliz",
    title: "Negativado e Feliz | Porque alguém tem que rir das contas",
    description:
      "O blog que fala de finanças com humor negro, pra você que tá no vermelho mas não perde a piada.",
    images: [
      {
        url: "https://negativadoefeliz.com.br/og?title=Porque+alguém+tem+que+rir+das+contas&category=Finanças+com+Humor",
        width: 1200,
        height: 630,
        alt: "Negativado e Feliz — Porque alguém tem que rir das contas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Negativado e Feliz",
    description:
      "Finanças com humor pesado e direto ao ponto. Pra quem tá no vermelho mas não perde a piada.",
    images: ["https://negativadoefeliz.com.br/og?title=Porque+alguém+tem+que+rir+das+contas&category=Finanças+com+Humor"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning
      className={`${inter.variable} ${bebas.variable} h-full antialiased`}
    >
      <head>
        {/* AdSense — substitua YOUR_ADSENSE_ID quando tiver aprovação */}
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID"
          crossOrigin="anonymous"
        /> */}
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Header />
          <main className="flex-1">
            <div className="h-[56px] md:h-[64px]" aria-hidden="true" />
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <CookieBanner />

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
        </ThemeProvider>
      </body>
    </html>
  );
}
