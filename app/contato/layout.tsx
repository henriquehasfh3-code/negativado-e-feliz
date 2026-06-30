import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mande seu Boleto | Contato",
  description: "Entre em contato com a redação do Negativado e Feliz e compartilhe sua história de perrengue financeiro.",
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
