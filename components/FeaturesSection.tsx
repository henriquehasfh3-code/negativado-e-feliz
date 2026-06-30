import { Flame, Receipt, PiggyBank, LifeBuoy } from "lucide-react";

const features = [
  {
    name: "Dívidas Sinceras",
    description:
      "Aprenda a priorizar qual boleto você vai ignorar esse mês com embasamento técnico e sem culpa.",
    icon: Receipt,
  },
  {
    name: "Investimento Realista",
    description:
      "Como fazer 50 reais renderem o suficiente para comprar um dogão no fim do ano.",
    icon: PiggyBank,
  },
  {
    name: "Sobrevivência Pura",
    description:
      "Dicas de quem já teve o nome no Serasa e sobreviveu pra contar a história rindo.",
    icon: LifeBuoy,
  },
  {
    name: "Terapia Financeira",
    description:
      "A gente sabe que o problema não é o cafezinho, é o salário que é baixo mesmo. Tamo junto.",
    icon: Flame,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#0D0D0D] border-y border-[#CC0000]/20">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">

        {/* Título */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-[40px] md:text-[56px] text-[#F5F5F5] tracking-wide uppercase leading-none">
            Por que ler essa{" "}
            {/* ✅ Trocado "desgraça" por algo igualmente impactante */}
            <span className="text-[#CC0000]">bagunça</span>?
          </h2>
          <p className="mt-4 text-lg text-[#A0A0A0] leading-relaxed">
            Esqueça o papinho de acordar às 5 da manhã pra ficar rico. Aqui a
            realidade bate na porta junto com o cobrador.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative p-6 bg-[#111111] rounded-xl border border-[#CC0000]/20 hover:border-[#CC0000]/60 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(204,0,0,0.12)]"
            >
              {/* Ícone */}
              <div className="w-12 h-12 rounded-lg bg-[#1A1A1A] border border-[#CC0000]/20 flex items-center justify-center mb-6 group-hover:bg-[#CC0000] group-hover:border-[#CC0000] transition-all duration-300">
                <feature.icon className="w-6 h-6 text-[#CC0000] group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Nome */}
              <h3 className="font-heading text-xl text-[#F5F5F5] mb-3 tracking-wide uppercase">
                {feature.name}
              </h3>

              {/* Descrição */}
              <p className="font-sans text-sm text-[#A0A0A0] leading-relaxed">
                {feature.description}
              </p>

              {/* Linha decorativa vermelha no hover */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#CC0000] rounded-bl-xl transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
