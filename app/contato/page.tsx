"use client";
import { Mail, Send } from "lucide-react";
import { useState } from "react";


export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <div className="min-h-screen bg-[#080808] pt-12 md:pt-16 pb-16 px-6">
      <div className="max-w-[720px] mx-auto">
        {/* Cabeçalho */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full mb-6 text-[#CC0000]">
            <Mail className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-[48px] md:text-[72px] text-[#F5F5F5] leading-[0.95] mb-4">
            FALE COM A <span className="text-[#CC0000] drop-shadow-md">REDAÇÃO</span>
          </h1>
          <p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest">
            Mande sua reclamação ou seu boleto mais assustador
          </p>
        </header>

        {/* Formulário Estilizado */}
        <div className="bg-[#111111]/80 backdrop-blur-md p-8 rounded-xl border border-[#CC0000]/20 shadow-lg shadow-[#CC0000]/20">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-16 h-16 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full flex items-center justify-center text-[#CC0000] mb-2">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl text-[#F5F5F5] uppercase tracking-wide">Desabafo Enviado</h3>
              <p className="font-sans text-[#A0A0A0] max-w-sm">Nossa equipe vai ler sua tristeza enquanto chora pagando os próprios boletos. Obrigado por compartilhar!</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 font-sans text-[11px] font-bold uppercase tracking-wider border border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white px-6 py-2.5 rounded-[4px] transition-colors"
              >
                Enviar outro (mais trágico)
              </button>
            </div>
          ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                  Seu Nome (ou codinome devedor)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pobre Lindo"
                  className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3.5 rounded-[4px] focus:outline-none transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="Ex: devedor@boletos.com"
                  className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3.5 rounded-[4px] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                Qual o valor da sua maior dívida? (Opcional)
              </label>
              <select className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3.5 rounded-[4px] focus:outline-none transition-colors">
                <option value="none">Ainda estou no azul (sortudo)</option>
                <option value="under-5k">Até R$ 5.000 (iniciante)</option>
                <option value="5k-20k">De R$ 5.000 a R$ 20.000 (intermediário)</option>
                <option value="over-20k">Mais de R$ 20.000 (profissional do Serasa)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#606060]">
                Sua História ou Desabafo
              </label>
              <textarea
                rows={5}
                placeholder="Conte para nós como você foi parar no vermelho..."
                className="bg-[#1A1A1A] border border-[#333333] focus:border-[#CC0000] text-sm text-[#F5F5F5] px-4 py-3.5 rounded-[4px] focus:outline-none transition-colors resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 font-sans text-[13px] font-bold uppercase tracking-wider bg-[#CC0000] hover:bg-[#8B0000] text-white py-4 rounded-[4px] transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
              ENVIAR DESABAFO
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}
