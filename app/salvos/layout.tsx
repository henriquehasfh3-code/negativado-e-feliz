import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artigos Salvos | Negativado e Feliz",
  description: "Seus artigos salvos para ler depois. Porque a gente sempre diz que vai ler depois.",
};

export default function SalvosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
