import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz — Qual Negativado Você É?",
  description: "Descubra seu perfil financeiro em 10 perguntas. Do 'Endividado Funcional' ao 'Afogado em Boletos' — onde você se encaixa?",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
