import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Declaração de Acessibilidade",
  description:
    "Conheça os recursos de acessibilidade do blog Negativado e Feliz e saiba como reportar dificuldades de navegação.",
};

export default function DeclaracaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
