"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";

type Perfil = "Calmo" | "Catastrófico" | "Esperançoso";

interface Question {
  title: string;
  options: {
    text: string;
    perfil: Perfil;
  }[];
}

const questions: Question[] = [
  {
    title: "Quando chega o boleto do cartão, você:",
    options: [
      { text: "Abre com calma e planeja o pagamento", perfil: "Calmo" },
      { text: "Fecha o app e finge que não viu", perfil: "Catastrófico" },
      { text: "Já esperava, tem dinheiro separado desde ontem", perfil: "Esperançoso" },
    ],
  },
  {
    title: "Sua reserva de emergência é:",
    options: [
      { text: "Uns 3 meses de gastos, seguro", perfil: "Calmo" },
      { text: "O limite do cartão de crédito", perfil: "Catastrófico" },
      { text: "Existe na teoria, na prática sumiu no Pix do churrasco", perfil: "Esperançoso" },
    ],
  },
  {
    title: "Quando vê uma promoção de 12x sem juros:",
    options: [
      { text: "Calculo se cabe no orçamento antes de comprar", perfil: "Calmo" },
      { text: "Compro tudo na hora, preocupo depois", perfil: "Catastrófico" },
      { text: "Sei que é cilada mas compro assim mesmo", perfil: "Esperançoso" },
    ],
  },
  {
    title: "Seu score no Serasa hoje está:",
    options: [
      { text: "Acima de 700, tô bem", perfil: "Calmo" },
      { text: "Vermelho e travado, nem abro mais o app", perfil: "Catastrófico" },
      { text: "Recuperando, de 300 já fui para 450 esse mês", perfil: "Esperançoso" },
    ],
  },
  {
    title: "A palavra 'orçamento' para você é:",
    options: [
      { text: "Uma planilha que eu realmente uso", perfil: "Calmo" },
      { text: "Um conceito de outra dimensão", perfil: "Catastrófico" },
      { text: "Já tentei várias vezes, dessa vez vai", perfil: "Esperançoso" },
    ],
  },
  {
    title: "Quando alguém fala 'Tesouro Direto', você:",
    options: [
      { text: "Já tenho investido há anos", perfil: "Calmo" },
      { text: "Acho que é coisa de rico", perfil: "Catastrófico" },
      { text: "Quero aprender, só preciso ter dinheiro sobrando primeiro", perfil: "Esperançoso" },
    ],
  },
];

const results: Record<Perfil, { title: string; text: string }> = {
  Calmo: {
    title: "Negativado Calmo",
    text: "Você tá bem, mas podia estar melhor. Pelo menos não surta.",
  },
  Catastrófico: {
    title: "Negativado Catastrófico",
    text: "Houston, temos um problema. Mas ei — pelo menos você é divertido nas histórias de perrengue.",
  },
  Esperançoso: {
    title: "Negativado Esperançoso",
    text: "Você é o tipo que vai dar a volta por cima. Só precisa parar de usar o cartão como reserva de emergência.",
  },
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Perfil, number>>({
    Calmo: 0,
    Catastrófico: 0,
    Esperançoso: 0,
  });
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (perfil: Perfil) => {
    const newScores = { ...scores, [perfil]: scores[perfil] + 1 };
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getWinner = (): Perfil => {
    return (Object.keys(scores) as Perfil[]).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );
  };

  const handleShare = () => {
    const winner = getWinner();
    const shareText = `Fiz o Quiz do Negativado e Feliz e descobri que sou o ${results[winner].title}! Descubra o seu: https://negativadoefeliz.com.br/quiz`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareText
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#CC0000]/10 via-[#080808] to-[#080808] pointer-events-none" />

      <div className="max-w-2xl w-full z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-[#CC0000] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para Home
        </Link>

        <div className="bg-[#111111] border border-[#CC0000]/20 rounded-xl p-8 shadow-[0_16px_64px_rgba(204,0,0,0.1)]">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#CC0000] font-sans text-xs font-bold tracking-widest uppercase">
                      Pergunta {currentQuestion + 1} de {questions.length}
                    </span>
                    <span className="text-[#606060] font-sans text-xs">
                      {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-[#CC0000] h-full"
                      initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                      animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <h2 className="font-heading text-3xl md:text-4xl text-[#F5F5F5] tracking-wide mb-8">
                  {questions[currentQuestion].title}
                </h2>

                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option.perfil)}
                      className="w-full text-left p-4 rounded-lg bg-[#1A1A1A] border border-[#333333] hover:border-[#CC0000] hover:bg-[#CC0000]/5 text-[#F5F5F5] font-sans text-sm md:text-base transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 rounded-full border-2 border-[#333333] group-hover:border-[#CC0000] flex items-center justify-center flex-shrink-0 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-[#CC0000] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {option.text}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center py-8"
              >
                <div className="inline-block bg-[#CC0000] text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-6">
                  Seu Perfil Financeiro
                </div>
                
                <h1 className="font-heading text-4xl md:text-6xl text-[#F5F5F5] mb-6">
                  {results[getWinner()].title}
                </h1>
                
                <p className="font-sans text-lg text-[#A0A0A0] leading-relaxed mb-10 max-w-lg mx-auto">
                  {results[getWinner()].text}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-sans text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-lg transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)]"
                  >
                    <Share2 className="w-5 h-5" />
                    Mandar no WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setScores({ Calmo: 0, Catastrófico: 0, Esperançoso: 0 });
                      setShowResult(false);
                    }}
                    className="bg-[#1A1A1A] hover:bg-[#333333] border border-[#333333] text-[#F5F5F5] font-sans text-sm font-bold uppercase tracking-wider px-8 py-4 rounded-lg transition-colors"
                  >
                    Refazer o Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
