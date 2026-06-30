import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Nossa História (Triste) | Negativado e Feliz",
  description: "Descubra como nasceu o Negativado e Feliz, o blog de finanças mais sincero e quebrado do Brasil.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080808] pt-12 md:pt-16 pb-16 px-6">
      <div className="max-w-[720px] mx-auto">
        {/* Cabeçalho */}
        <header className="text-center mb-12">
          <div className="relative w-full h-[240px] md:h-[320px] rounded-lg overflow-hidden mb-8 shadow-lg shadow-[#CC0000]/20 border border-[#CC0000]/15">
            <Image
              src="/images/about-brasileiro.png"
              alt="Sobre o Negativado e Feliz"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/50 to-transparent" />
          </div>
          <h1 className="font-heading text-[48px] md:text-[72px] text-[#F5F5F5] leading-[0.95] mb-4">
            QUEM DEVE <span className="text-[#CC0000]">TAMBÉM RI</span>
          </h1>
          <p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest">
            A história por trás da tragédia
          </p>
        </header>

        {/* Artigo / Corpo */}
        <article className="flex flex-col gap-6">
          <p className="font-sans text-lg md:text-xl text-[#F5F5F5] font-medium leading-relaxed mb-2">
            O Negativado e Feliz nasceu numa sexta-feira, depois do quinto boleto do mês chegar. Em vez de chorar, resolvemos rir.
          </p>

          <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
            A internet está inundada de jovens coaches de 20 anos que herdaram três apartamentos do avô e agora querem te convencer de que &ldquo;o segredo da riqueza é cortar o cafezinho da tarde e acordar às 5 da manhã para ler sobre fundos imobiliários&rdquo;.
          </p>

          <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
            Com todo respeito ao café e à madrugada, a realidade de quem pega duas conduções lotadas por dia é outra. O salário acaba no dia 12 e os boletos continuam chegando em ritmo de metralhadora até o dia 30. No fim das contas, a gente corre o mês inteiro apenas para ver o extrato bancário parecer a temperatura média do Alasca: totalmente abaixo de zero.
          </p>

          <blockquote className="border-l-4 border-[#CC0000] pl-6 my-6 font-sans text-lg italic text-[#606060]">
            Aqui você aprende sobre finanças sem aquela vibe insuportável de palestrante do LinkedIn. É papo reto, humor leve e dicas reais que funcionam de verdade para quem está no vermelho — que por sinal, é a nossa cor favorita.
          </blockquote>

          <div>
            <h2 className="font-heading text-[32px] text-[#F5F5F5] tracking-wide uppercase mt-8 mb-4">O Que Defendemos</h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Nós não estamos aqui para te julgar por comprar aquela pizza no final de semana mesmo sabendo que o cartão ia estourar. Nós já estivemos lá. Acreditamos que a saúde financeira começa quando a gente para de mentir para nós mesmos e aceita a realidade.
            </p>
          </div>

          <div className="my-4 p-6 bg-[#111111] border border-[#CC0000]/30 rounded-lg">
            <h3 className="font-heading text-2xl text-[#FFD600] tracking-wide mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#FFD600]" /> AVISO LEGAL (E SINCERO)
            </h3>
            <p className="font-sans text-sm text-[#A0A0A0] leading-relaxed mb-0">
              Nenhum dos redatores deste blog é analista certificado pela CVM ou guru financeiro de terno sob medida. Nós somos apenas sobreviventes do sistema de juros rotativos do cartão de crédito. Siga nossas dicas por sua conta e risco (mas elas funcionam).
            </p>
          </div>

          <div>
            <h2 className="font-heading text-[32px] text-[#F5F5F5] tracking-wide uppercase mt-8 mb-4">Nossos Compromissos</h2>
            <ul className="list-disc pl-6 space-y-3 font-sans text-base text-[#A0A0A0]">
              <li><strong className="text-[#F5F5F5]">Zero Glamour:</strong> Não vamos te ensinar a ostentar. Vamos te ensinar a dormir à noite sem medo do telefone tocar com prefixo 011.</li>
              <li><strong className="text-[#F5F5F5]">Foco no que Dói:</strong> Explicamos como funcionam os juros, o Score do Serasa e os bancos sem termos difíceis.</li>
              <li><strong className="text-[#F5F5F5]">Sobrevivência Cultural:</strong> Rir do próprio perrengue é a única forma saudável de não enlouquecer enquanto os juros compostos trabalham contra nós.</li>
            </ul>
          </div>

          <div className="border-t border-[#CC0000]/20 pt-6 mt-8">
            <p className="text-center text-[#606060] font-sans text-xs">
              Lembre-se: nome sujo limpa em 5 anos. Mas o estresse de tentar ser perfeito financeiramente pode acabar com você em 5 meses. Organize-se, devagar e sem surtar.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
