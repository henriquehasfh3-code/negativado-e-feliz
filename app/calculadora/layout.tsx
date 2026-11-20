import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Dívida",
  description: "Calcule quanto tempo vai levar para quitar sua dívida e quanto de juros você vai pagar. Sem ilusão, só matemática.",
  alternates: { canonical: "/calculadora" },
};

export default function CalculadoraLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
