import { Accessibility } from "lucide-react";

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-screen bg-[#080808] pt-12 md:pt-16 pb-16 px-6">
      <div className="max-w-[720px] mx-auto">

        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full mb-6 text-[#CC0000]">
            <Accessibility className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-[48px] md:text-[72px] text-[#F5F5F5] leading-[0.95] mb-4">
            DECLARAÇÃO DE{" "}
            <span className="text-[#CC0000]">ACESSIBILIDADE</span>
          </h1>
          <p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest">
            Porque todo mundo merece ler sobre dívidas — inclusive quem tem dificuldades
          </p>
        </header>

        <article className="flex flex-col gap-8">

          <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
            O blog <strong className="text-[#F5F5F5]">Negativado e Feliz</strong>{" "}
            (negativadoefeliz.com.br) está comprometido em garantir a acessibilidade
            digital para todas as pessoas, independentemente de deficiência ou limitação.
            Estamos continuamente melhorando a experiência do usuário e aplicando os
            padrões de acessibilidade relevantes.
          </p>

          {/* 1 */}
          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              1. Padrão Técnico Adotado
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Este site busca conformidade com as{" "}
              <strong className="text-[#F5F5F5]">
                Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1, nível AA
              </strong>
              , publicadas pelo W3C (World Wide Web Consortium). O nível AA cobre a
              maioria das barreiras de acessibilidade para pessoas com deficiências
              visuais, auditivas, motoras e cognitivas.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              2. Recursos de Acessibilidade Disponíveis
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed mb-4">
              Este site oferece um{" "}
              <strong className="text-[#F5F5F5]">widget de acessibilidade</strong>{" "}
              acessível pelo botão fixo no canto inferior direito da tela (ícone de
              pessoa com braços abertos). As opções disponíveis são:
            </p>
            <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-3 list-none">
              {[
                { recurso: "Tamanho do texto", desc: "Aumenta o tamanho da fonte em 3 níveis (normal, grande e extra grande) para facilitar a leitura." },
                { recurso: "Alto contraste", desc: "Aumenta o contraste visual da página para auxiliar pessoas com baixa visão." },
                { recurso: "Escala de cinza", desc: "Remove as cores da página, útil para pessoas com daltonismo." },
                { recurso: "Pausar animações", desc: "Desativa todas as animações e transições, reduzindo estímulos visuais para pessoas com sensibilidade ao movimento." },
                { recurso: "Espaçamento de texto", desc: "Aumenta o espaçamento entre letras, palavras e linhas para facilitar a leitura de pessoas com dislexia." },
                { recurso: "Destacar links", desc: "Adiciona contorno visual em todos os links da página, facilitando a identificação dos elementos clicáveis." },
              ].map((item) => (
                <li key={item.recurso} className="flex gap-3">
                  <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
                  <span>
                    <strong className="text-[#F5F5F5]">{item.recurso}:</strong>{" "}
                    {item.desc}
                  </span>
                </li>
              ))}
            </ul>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed mt-4">
              Todas as preferências são salvas localmente no seu dispositivo e
              respeitadas nas próximas visitas.
            </p>
          </div>

          {/* 3 */}
          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              3. Medidas Técnicas Implementadas
            </h2>
            <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-3 list-none">
              {[
                "Navegação completa por teclado em todos os componentes interativos.",
                "Atributos ARIA (role, aria-label, aria-expanded, aria-checked) em todos os controles.",
                "Texto alternativo em todas as imagens de conteúdo.",
                "Estrutura semântica com uso correto de H1, H2, H3 e landmarks HTML5.",
                "Contraste de cor mínimo de 4.5:1 para texto normal (WCAG 2.1 AA).",
                "Indicadores de foco visíveis em todos os elementos interativos.",
                "Suporte a leitores de tela (NVDA, VoiceOver, JAWS).",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              4. Limitações Conhecidas
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed mb-4">
              Embora nos esforcemos para garantir a acessibilidade de todo o conteúdo,
              algumas limitações podem existir:
            </p>
            <ul className="font-sans text-base text-[#A0A0A0] leading-relaxed space-y-3 list-none">
              {[
                "Conteúdo gerado por terceiros (comentários de usuários) pode não atender a todos os critérios de acessibilidade.",
                "Alguns conteúdos em PDF ou documentos externos vinculados podem não estar totalmente acessíveis.",
                "Vídeos incorporados de plataformas externas podem não ter legendas em todos os casos.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#CC0000] mt-1 flex-shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              5. Feedback e Contato
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Encontrou alguma barreira de acessibilidade neste site? Queremos saber.
              Entre em contato pelo{" "}
              <a href="/contato" className="text-[#CC0000] hover:underline">
                formulário de contato
              </a>{" "}
              ou pelo e-mail{" "}
              <strong className="text-[#F5F5F5]">henriquehasfh3@gmail.com</strong>.
              Descreva o problema encontrado, a página onde ocorreu e o dispositivo ou
              leitor de tela utilizado. Respondemos em até{" "}
              <strong className="text-[#F5F5F5]">5 dias úteis</strong>.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              6. Órgão de Supervisão
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Em caso de resposta insatisfatória, você pode acionar a{" "}
              <strong className="text-[#F5F5F5]">
                Secretaria Nacional dos Direitos da Pessoa com Deficiência (SNDPD)
              </strong>{" "}
              ou o{" "}
              <strong className="text-[#F5F5F5]">
                Ministério da Gestão e da Inovação em Serviços Públicos
              </strong>
              , conforme a Lei Brasileira de Inclusão (Lei nº 13.146/2015).
            </p>
          </div>

          <div className="border-t border-[#CC0000]/20 pt-6 mt-2">
            <p className="text-center text-[#606060] font-sans text-xs uppercase tracking-widest">
              Última revisão: 02 de julho de 2026.
            </p>
          </div>

        </article>
      </div>
    </div>
  );
}
