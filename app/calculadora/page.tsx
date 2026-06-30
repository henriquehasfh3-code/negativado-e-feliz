"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Calculator } from "lucide-react";
import { motion } from "framer-motion";

export default function DebtCalculatorPage() {
  const [debtAmount, setDebtAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | "">("");

  const results = useMemo(() => {
    if (!debtAmount || !interestRate || !monthlyPayment) return null;
    if (debtAmount <= 0 || interestRate <= 0 || monthlyPayment <= 0) return null;

    let balance = debtAmount;
    let months = 0;
    let totalInterest = 0;
    const rate = interestRate / 100;
    const history = [];

    // Proteção contra loop infinito (pagamento menor que o juros)
    if (monthlyPayment <= balance * rate) {
      return { error: "O pagamento mensal é menor ou igual aos juros! A dívida nunca será paga." };
    }

    while (balance > 0 && months < 360) {
      const interestForMonth = balance * rate;
      totalInterest += interestForMonth;
      balance += interestForMonth;
      
      const payment = Math.min(monthlyPayment, balance);
      balance -= payment;
      months++;

      if (months <= 12 || months % 12 === 0 || balance <= 0) {
        history.push({ month: months, balance });
      }
    }

    if (months >= 360) {
      return { error: "Dívida demoraria mais de 30 anos para ser paga com esse valor." };
    }

    const totalPaid = debtAmount + totalInterest;

    return {
      months,
      totalInterest,
      totalPaid,
      history,
    };
  }, [debtAmount, interestRate, monthlyPayment]);

  const handleShare = () => {
    if (!results || "error" in results) return;
    
    const formatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
    const formattedDebt = formatter.format(Number(debtAmount));
    const formattedInterest = formatter.format(results.totalInterest);
    
    const shareText = `Minha dívida de ${formattedDebt} vai me custar ${formattedInterest} SÓ DE JUROS 🤡. Calcule a sua (se tiver coragem) no Negativado e Feliz 👉 https://negativadoefeliz.com.br/calculadora`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] pt-12 md:pt-16 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-widest text-[#A0A0A0] hover:text-[#CC0000] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para Home
        </Link>

        <header className="mb-12">
          <div className="inline-block bg-[#CC0000] text-white font-sans text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-sm mb-4">
            Ferramenta
          </div>
          <h1 className="font-heading text-[48px] md:text-[64px] leading-none tracking-wide text-[#F5F5F5] mb-4">
            Calculadora de Dívida
          </h1>
          <p className="font-sans text-lg text-[#A0A0A0] font-light max-w-xl">
            Descubra quanto você vai pagar de juros nessa bola de neve e em quantos meses vai finalmente se livrar dessa maldição.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Formulário */}
          <div className="bg-[#111111] border border-[#333333] rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#CC0000]" />
            <div className="space-y-6">
              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Qual o tamanho da bomba? (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606060] font-bold">R$</span>
                  <input
                    type="number"
                    value={debtAmount}
                    onChange={(e) => setDebtAmount(Number(e.target.value) || "")}
                    placeholder="Ex: 5000"
                    className="w-full bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-[#F5F5F5] pl-12 pr-4 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Juros ao mês (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value) || "")}
                    placeholder="Ex: 14.5"
                    className="w-full bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-[#F5F5F5] px-4 py-3 rounded-lg outline-none transition-colors"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#606060] font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm font-bold uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Quanto você consegue pagar por mês? (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606060] font-bold">R$</span>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value) || "")}
                    placeholder="Ex: 500"
                    className="w-full bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-[#F5F5F5] pl-12 pr-4 py-3 rounded-lg outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="flex flex-col justify-center">
            {(!debtAmount || !interestRate || !monthlyPayment) ? (
              <div className="text-center p-8 border border-dashed border-[#333333] rounded-xl">
                <Calculator className="w-12 h-12 text-[#333333] mx-auto mb-4" />
                <p className="font-sans text-[#606060]">Preencha os dados ao lado para ver o tamanho do estrago.</p>
              </div>
            ) : results && "error" in results ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl p-6 text-center"
              >
                <p className="font-sans text-[#CC0000] font-bold">{results.error}</p>
                <p className="text-sm mt-2 text-[#A0A0A0]">Dica: o pagamento mensal precisa ser maior que os juros que a dívida gera por mês. Negocie essa taxa urgentemente!</p>
              </motion.div>
            ) : results ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-[#111111] border border-[#CC0000]/20 rounded-xl p-6">
                  <h3 className="font-heading text-xl text-[#A0A0A0] mb-1">Tempo de sofrimento:</h3>
                  <div className="font-heading text-4xl text-[#CC0000]">
                    {results.months} {results.months === 1 ? 'mês' : 'meses'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111111] border border-[#333333] rounded-xl p-5">
                    <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#A0A0A0] mb-2">Total Pago</h3>
                    <div className="font-sans text-xl font-bold text-[#F5F5F5]">
                      {formatCurrency(results.totalPaid)}
                    </div>
                  </div>
                  <div className="bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-xl p-5">
                    <h3 className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#CC0000] mb-2">Só de Juros</h3>
                    <div className="font-sans text-xl font-bold text-[#CC0000]">
                      {formatCurrency(results.totalInterest)}
                    </div>
                  </div>
                </div>

                {/* Grafico simples */}
                <div className="mt-8 bg-[#111111] border border-[#333333] rounded-xl p-5">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#A0A0A0] mb-4">Composição da dívida final</h3>
                  <div className="w-full h-8 flex rounded-md overflow-hidden bg-[#1A1A1A]">
                    <div 
                      className="bg-[#333333] h-full" 
                      style={{ width: `${(Number(debtAmount) / results.totalPaid) * 100}%` }}
                      title={`Principal: ${formatCurrency(Number(debtAmount))}`}
                    />
                    <div 
                      className="bg-[#CC0000] h-full" 
                      style={{ width: `${(results.totalInterest / results.totalPaid) * 100}%` }}
                      title={`Juros: ${formatCurrency(results.totalInterest)}`}
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-[11px] font-bold uppercase tracking-wider">
                    <span className="text-[#A0A0A0]">Principal ({(Number(debtAmount) / results.totalPaid * 100).toFixed(0)}%)</span>
                    <span className="text-[#CC0000]">Juros ({(results.totalInterest / results.totalPaid * 100).toFixed(0)}%)</span>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-sans text-sm font-bold uppercase tracking-wider py-4 rounded-lg transition-colors mt-6 shadow-[0_0_20px_rgba(37,211,102,0.2)]"
                >
                  <Share2 className="w-5 h-5" />
                  Chorar no WhatsApp
                </button>
              </motion.div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
