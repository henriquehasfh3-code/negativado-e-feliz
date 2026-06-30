# Plano — Quiz em 2 Fases com Captura de E-mail
Gerado em: 2026-06-30

## Fluxo completo

```
[Tela de Nome]
      ↓
[Fase 1 — 6 perguntas → Perfil financeiro]
      ↓
[Tela de transição — mostra o perfil, botão "Continuar"]
      ↓
[Fase 2 — 4 perguntas → Diagnóstico da situação]
      ↓
[Resultado Final — Plano de 3 Passos personalizado]
      ↓
[Captura de e-mail — "Receba seu plano completo"]
```

---

## Arquivo único alterado: `app/quiz/page.tsx`

Substituir o conteúdo **inteiro** do arquivo pelo código abaixo.

---

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Share2, CheckCircle } from "lucide-react";

// ─── TIPOS ───────────────────────────────────────────────────────────────────

type Perfil = "Calmo" | "Catastrófico" | "Esperançoso";
type Tela = "nome" | "fase1" | "resultado1" | "fase2" | "resultadofinal";

interface Question {
  title: string;
  options: { text: string; perfil: Perfil }[];
}

interface Phase2Question {
  title: string;
  key: "divida" | "renda" | "tipoDivida" | "renegociacao";
  options: { text: string; value: string }[];
}

interface Phase2Answers {
  divida: string;
  renda: string;
  tipoDivida: string;
  renegociacao: string;
}

// ─── PERGUNTAS FASE 1 ────────────────────────────────────────────────────────

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

// ─── RESULTADO FASE 1 ────────────────────────────────────────────────────────

const perfis: Record<Perfil, { title: string; text: string }> = {
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

// ─── PERGUNTAS FASE 2 ────────────────────────────────────────────────────────

const phase2Questions: Phase2Question[] = [
  {
    title: "Qual é o total aproximado das suas dívidas hoje?",
    key: "divida",
    options: [
      { text: "Até R$5.000", value: "baixa" },
      { text: "Entre R$5.000 e R$20.000", value: "media" },
      { text: "Entre R$20.000 e R$50.000", value: "alta" },
      { text: "Acima de R$50.000", value: "critica" },
    ],
  },
  {
    title: "Você tem renda mensal estável?",
    key: "renda",
    options: [
      { text: "Sim, e ainda sobra alguma coisa", value: "folga" },
      { text: "Sim, mas chega justo ou faltando", value: "apertado" },
      { text: "Renda irregular (freelancer, bico, autônomo)", value: "irregular" },
      { text: "Estou sem renda no momento", value: "semRenda" },
    ],
  },
  {
    title: "Qual é a sua maior dívida?",
    key: "tipoDivida",
    options: [
      { text: "Cartão de crédito", value: "cartao" },
      { text: "Banco ou financeira", value: "banco" },
      { text: "Cheque especial", value: "cheque" },
      { text: "Contas básicas atrasadas (luz, água, aluguel)", value: "basicas" },
    ],
  },
  {
    title: "Você já tentou renegociar suas dívidas?",
    key: "renegociacao",
    options: [
      { text: "Nunca tentei, não sei por onde começar", value: "nunca" },
      { text: "Tentei mas não consegui acordo", value: "tentou" },
      { text: "Já renegociei uma parte", value: "parcial" },
      { text: "Estou esperando o Desenrola ou feirão", value: "aguardando" },
    ],
  },
];

// ─── GERADOR DO PLANO DE 3 PASSOS ────────────────────────────────────────────

function getActionPlan(perfil: Perfil, answers: Phase2Answers) {
  const { divida, renda, tipoDivida, renegociacao } = answers;

  // Passo 1 — ação imediata baseada no tipo de dívida + status de renegociação
  let passo1 = "";
  if (tipoDivida === "cheque") {
    passo1 = "Zere o cheque especial primeiro — é a maior taxa do mercado, acima de 400% ao ano. Qualquer dinheiro que entrar vai direto para ele.";
  } else if (tipoDivida === "basicas") {
    passo1 = "Priorize luz e água — o corte acontece em dias. Ligue hoje mesmo e peça parcelamento. Eles quase sempre aceitam.";
  } else if (tipoDivida === "cartao" && renegociacao === "nunca") {
    passo1 = "Ligue agora para a central do cartão e peça a taxa de parcelamento da fatura. Nunca pague só o mínimo — o rotativo cobra mais de 400% ao ano.";
  } else if (tipoDivida === "cartao" && (renegociacao === "tentou" || renegociacao === "aguardando")) {
    passo1 = "Acesse o Serasa Limpa Nome (limpanome.serasa.com.br) — lá você renegocia o cartão com desconto de até 90% nos juros, sem sair de casa.";
  } else if (tipoDivida === "banco" && renegociacao === "nunca") {
    passo1 = "Entre no site ou app do banco e procure a seção de 'renegociação de dívidas'. Os bancos preferem receber menos do que não receber nada — use isso a seu favor.";
  } else if (renegociacao === "parcial") {
    passo1 = "Você já começou o caminho certo. Agora renegocie as dívidas que faltam usando o mesmo argumento: 'posso pagar X à vista ou X em Y parcelas'.";
  } else {
    passo1 = "Liste todas as suas dívidas em um papel: credor, valor total, taxa de juros. Só enxergando o tamanho real do problema você consegue atacar na ordem certa.";
  }

  // Passo 2 — estabilização financeira baseada na renda + nível de dívida
  let passo2 = "";
  if (renda === "semRenda") {
    passo2 = "Registre-se no Cadastro Único pelo CRAS da sua cidade para acessar programas sociais enquanto busca renda. Sem renda, qualquer plano de dívidas é inviável — resolver a renda é o passo 2.";
  } else if (renda === "irregular") {
    passo2 = "Toda vez que receber, separe 20% antes de gastar qualquer coisa. Crie uma conta separada só para isso. Renda irregular exige disciplina nos dias bons para aguentar os dias ruins.";
  } else if (renda === "apertado" && (divida === "alta" || divida === "critica")) {
    passo2 = "Corte um gasto fixo essa semana — só um. Streaming, delivery, plano de celular mais caro. Pequenos cortes somados criam a margem que você precisa para renegociar.";
  } else if (renda === "apertado" && (divida === "baixa" || divida === "media")) {
    passo2 = "Com dívida nesse tamanho e renda existindo, você consegue sair em menos de 12 meses. Priorize as dívidas menores primeiro para ganhar fôlego psicológico e liberar uma parcela por vez.";
  } else if (renda === "folga") {
    passo2 = "Você tem vantagem: sobra dinheiro. Use isso agora para quitar as dívidas maiores. Cada real de juros que você para de pagar é um real que fica no seu bolso.";
  } else {
    passo2 = "Anote todos os gastos por 30 dias — até o cafezinho. Só enxergando para onde o dinheiro vai você consegue redirecionar para pagar as dívidas.";
  }

  // Passo 3 — próximo passo baseado no perfil + artigo do blog
  const artigosPorPerfil: Record<Perfil, { texto: string; slug: string; label: string }> = {
    Catastrófico: {
      texto: "Você precisa de um plano concreto para sair das dívidas. Comece por aqui:",
      slug: "sair-das-dividas",
      label: "Como Sair das Dívidas — Guia Prático",
    },
    Esperançoso: {
      texto: "Você tem disposição, agora precisa de estratégia. Entenda como o cartão funciona contra você:",
      slug: "cartao-de-credito",
      label: "Cartão de Crédito: Vilão ou Ferramenta?",
    },
    Calmo: {
      texto: "Você tem controle — agora é hora de fazer o dinheiro trabalhar por você:",
      slug: "tesouro-direto",
      label: "Tesouro Direto: Invista R$30 Agora",
    },
  };

  return { passo1, passo2, artigo: artigosPorPerfil[perfil] };
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function QuizPage() {
  const [tela, setTela] = useState<Tela>("nome");
  const [nome, setNome] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<Perfil, number>>({
    Calmo: 0,
    Catastrófico: 0,
    Esperançoso: 0,
  });
  const [phase2Index, setPhase2Index] = useState(0);
  const [phase2Answers, setPhase2Answers] = useState<Phase2Answers>({
    divida: "",
    renda: "",
    tipoDivida: "",
    renegociacao: "",
  });
  const [emailCapture, setEmailCapture] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const getWinner = (): Perfil =>
    (Object.keys(scores) as Perfil[]).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    );

  const handlePhase1Answer = (perfil: Perfil) => {
    const newScores = { ...scores, [perfil]: scores[perfil] + 1 };
    setScores(newScores);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTela("resultado1");
    }
  };

  const handlePhase2Answer = (key: keyof Phase2Answers, value: string) => {
    const newAnswers = { ...phase2Answers, [key]: value };
    setPhase2Answers(newAnswers);
    if (phase2Index < phase2Questions.length - 1) {
      setPhase2Index(phase2Index + 1);
    } else {
      setTela("resultadofinal");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCapture }),
      });
      setEmailSent(true);
    } catch {
      setEmailSent(true);
    }
  };

  const handleShare = () => {
    const winner = getWinner();
    const shareText = `Fiz o Quiz do Negativado e Feliz e descobri que sou um ${perfis[winner].title}! Descubra qual negativado você é: https://negativadoefeliz.com.br/quiz`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleRestart = () => {
    setTela("nome");
    setNome("");
    setCurrentQuestion(0);
    setScores({ Calmo: 0, Catastrófico: 0, Esperançoso: 0 });
    setPhase2Index(0);
    setPhase2Answers({ divida: "", renda: "", tipoDivida: "", renegociacao: "" });
    setEmailCapture("");
    setEmailSent(false);
  };

  const winner = tela === "resultadofinal" || tela === "resultado1" ? getWinner() : "Catastrófico";
  const plan = tela === "resultadofinal" ? getActionPlan(winner, phase2Answers) : null;

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6 relative overflow-hidden">
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

            {/* ── TELA DE NOME ─────────────────────────────────────── */}
            {tela === "nome" && (
              <motion.div
                key="nome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-block bg-[#CC0000] text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-6">
                    Quiz Financeiro em 2 Fases
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl text-[#F5F5F5] tracking-wide mb-3">
                    Qual Negativado Você É?
                  </h2>
                  <p className="font-sans text-sm text-[#A0A0A0]">
                    10 perguntas para descobrir seu perfil e montar seu plano de saída das dívidas
                  </p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (nome.trim()) setTela("fase1");
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-2">
                    <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                      Primeiro, como você se chama?
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome ou apelido"
                      required
                      autoFocus
                      className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-[#F5F5F5] text-base px-4 py-4 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#CC0000] hover:bg-[#8B0000] text-white font-sans text-sm font-bold uppercase tracking-wider py-4 rounded-lg transition-colors"
                  >
                    Começar o Quiz
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── FASE 1 — PERGUNTAS ───────────────────────────────── */}
            {tela === "fase1" && (
              <motion.div
                key={`fase1-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#CC0000] font-sans text-xs font-bold tracking-widest uppercase">
                      Fase 1 · Pergunta {currentQuestion + 1} de {questions.length}
                    </span>
                    <span className="text-[#606060] font-sans text-xs">
                      {Math.round(((currentQuestion + 1) / questions.length) * 50)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-[#CC0000] h-full"
                      initial={{ width: `${(currentQuestion / questions.length) * 50}%` }}
                      animate={{ width: `${((currentQuestion + 1) / questions.length) * 50}%` }}
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
                      onClick={() => handlePhase1Answer(option.perfil)}
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
            )}

            {/* ── RESULTADO FASE 1 (transição) ─────────────────────── */}
            {tela === "resultado1" && (
              <motion.div
                key="resultado1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center py-6"
              >
                <div className="inline-block bg-[#CC0000] text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-4">
                  Fase 1 Concluída
                </div>

                <p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest mb-2">
                  {nome}, você é um...
                </p>
                <h1 className="font-heading text-4xl md:text-6xl text-[#F5F5F5] mb-4">
                  {perfis[getWinner()].title}
                </h1>
                <p className="font-sans text-base text-[#A0A0A0] leading-relaxed mb-10 max-w-lg mx-auto">
                  {perfis[getWinner()].text}
                </p>

                <div className="bg-[#1A1A1A] border border-[#CC0000]/20 rounded-xl p-6 mb-8 text-left">
                  <p className="font-sans text-sm text-[#CC0000] font-bold uppercase tracking-wider mb-2">
                    Fase 2 — Diagnóstico Financeiro
                  </p>
                  <p className="font-sans text-sm text-[#A0A0A0]">
                    Mais 4 perguntas rápidas sobre sua situação real. Com isso, vamos montar um plano de 3 passos personalizado só para você.
                  </p>
                </div>

                <button
                  onClick={() => setTela("fase2")}
                  className="w-full bg-[#CC0000] hover:bg-[#8B0000] text-white font-sans text-sm font-bold uppercase tracking-wider py-4 rounded-lg transition-colors"
                >
                  Ver meu Plano de Saída das Dívidas →
                </button>
              </motion.div>
            )}

            {/* ── FASE 2 — PERGUNTAS ───────────────────────────────── */}
            {tela === "fase2" && (
              <motion.div
                key={`fase2-${phase2Index}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#CC0000] font-sans text-xs font-bold tracking-widest uppercase">
                      Fase 2 · Pergunta {phase2Index + 1} de {phase2Questions.length}
                    </span>
                    <span className="text-[#606060] font-sans text-xs">
                      {50 + Math.round(((phase2Index + 1) / phase2Questions.length) * 50)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-[#CC0000] h-full"
                      initial={{ width: `${50 + (phase2Index / phase2Questions.length) * 50}%` }}
                      animate={{ width: `${50 + ((phase2Index + 1) / phase2Questions.length) * 50}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <h2 className="font-heading text-3xl md:text-4xl text-[#F5F5F5] tracking-wide mb-8">
                  {phase2Questions[phase2Index].title}
                </h2>

                <div className="space-y-4">
                  {phase2Questions[phase2Index].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePhase2Answer(phase2Questions[phase2Index].key, option.value)}
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
            )}

            {/* ── RESULTADO FINAL — PLANO DE 3 PASSOS ─────────────── */}
            {tela === "resultadofinal" && plan && (
              <motion.div
                key="resultadofinal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="text-center mb-8">
                  <div className="inline-block bg-[#CC0000] text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-sm mb-4">
                    Seu Plano Personalizado
                  </div>
                  <p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest mb-1">
                    {nome}, como {perfis[winner].title}...
                  </p>
                  <h1 className="font-heading text-3xl md:text-5xl text-[#F5F5F5]">
                    Seu Plano de 3 Passos
                  </h1>
                </div>

                {/* Passos */}
                <div className="space-y-4 mb-8">
                  {[
                    { num: 1, label: "Ação imediata", texto: plan.passo1 },
                    { num: 2, label: "Estabilize suas finanças", texto: plan.passo2 },
                    { num: 3, label: "Próximo passo", texto: plan.artigo.texto },
                  ].map((passo) => (
                    <div
                      key={passo.num}
                      className="flex gap-4 bg-[#1A1A1A] border border-[#CC0000]/20 rounded-xl p-5"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#CC0000] flex items-center justify-center font-heading text-white text-lg">
                        {passo.num}
                      </div>
                      <div>
                        <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#CC0000] mb-1">
                          {passo.label}
                        </p>
                        <p className="font-sans text-sm text-[#D0D0D0] leading-relaxed">
                          {passo.texto}
                          {passo.num === 3 && (
                            <>
                              {" "}
                              <Link
                                href={`/blog/${plan.artigo.slug}`}
                                className="text-[#CC0000] hover:underline font-bold"
                              >
                                {plan.artigo.label} →
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-sans text-sm font-bold uppercase tracking-wider px-6 py-4 rounded-lg transition-colors flex-1"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartilhar no WhatsApp
                  </button>
                  <button
                    onClick={handleRestart}
                    className="bg-[#1A1A1A] hover:bg-[#333333] border border-[#333333] text-[#F5F5F5] font-sans text-sm font-bold uppercase tracking-wider px-6 py-4 rounded-lg transition-colors"
                  >
                    Refazer
                  </button>
                </div>

                {/* Captura de e-mail */}
                <div className="border-t border-[#CC0000]/20 pt-8">
                  {emailSent ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl px-5 py-4"
                    >
                      <CheckCircle className="w-5 h-5 text-[#CC0000] flex-shrink-0" />
                      <p className="font-sans text-sm text-[#CC0000] font-semibold">
                        Plano enviado! Confere sua caixa de entrada.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <p className="font-sans text-sm font-bold text-[#F5F5F5] mb-1">
                        Quer receber seu plano completo por e-mail?
                      </p>
                      <p className="font-sans text-xs text-[#606060] mb-4">
                        Dicas personalizadas para o perfil {perfis[winner].title} direto na sua caixa de entrada.
                      </p>
                      <form onSubmit={handleEmailSubmit} className="flex gap-3">
                        <input
                          type="email"
                          value={emailCapture}
                          onChange={(e) => setEmailCapture(e.target.value)}
                          placeholder="seu@email.com"
                          required
                          className="flex-1 bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3 rounded-lg focus:outline-none transition-colors placeholder:text-[#606060]"
                        />
                        <button
                          type="submit"
                          className="bg-[#CC0000] hover:bg-[#8B0000] text-white font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Receber
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
```
