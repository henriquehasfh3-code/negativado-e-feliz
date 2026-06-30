import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Negativado e Feliz",
  description:
    "Manda sua história, seu boleto mais assustador ou só desabafa. A redação do Negativado e Feliz está aqui pra ouvir.",
};

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
