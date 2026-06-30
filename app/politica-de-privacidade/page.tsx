import { Metadata } from "next";
import { Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Privacidade | Negativado e Feliz",
  description:
    "Política de privacidade do blog Negativado e Feliz. Transparência sobre o uso de dados e cookies para fins de monetização com Google AdSense.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080808] pt-12 md:pt-16 pb-16 px-6">
      <div className="max-w-[720px] mx-auto">

        {/* Cabeçalho */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[#CC0000]/10 border border-[#CC0000]/30 rounded-full mb-6 text-[#CC0000]">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="font-heading text-[48px] md:text-[72px] text-[#F5F5F5] leading-[0.95] mb-4">
            POLÍTICA DE{" "}
            {/* ✅ Removido blood-text */}
            <span className="text-[#CC0000]">PRIVACIDADE</span>
          </h1>
          <p className="font-sans text-sm text-[#A0A0A0] uppercase tracking-widest">
            Termos obrigatórios para o Google AdSense
          </p>
        </header>

        {/* ✅ Conteúdo sem classe prose — estilizado manualmente */}
        <article className="flex flex-col gap-6">

          <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
            A sua privacidade é extremamente importante para nós. Esta política
            descreve como coletamos, usamos e protegemos as suas informações
            pessoais quando você visita o blog{" "}
            <strong className="text-[#F5F5F5]">Negativado e Feliz</strong>.
          </p>

          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              Coleta de Informações
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Coletamos informações pessoais apenas quando você se cadastra em
              nossa newsletter (fornecendo seu endereço de e-mail) ou entra em
              contato conosco voluntariamente através do formulário de contato.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              Uso de Cookies e Google AdSense
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Este blog utiliza cookies para melhorar a experiência do usuário e
              para fins de publicidade. Em especial, o Google AdSense utiliza
              cookies (incluindo o cookie DART) para exibir anúncios relevantes
              baseados em suas visitas anteriores a este e a outros sites na
              internet.
            </p>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed mt-3">
              Os usuários podem optar por desativar o uso do cookie DART
              visitando a política de privacidade da rede de anúncios e conteúdo
              do Google.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              Segurança dos Dados
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Nenhum método de transmissão de dados pela internet ou de
              armazenamento eletrônico é 100% seguro, mas adotamos práticas
              modernas de criptografia (SSL) e segurança de servidores para
              mitigar riscos. Prometemos nunca vender ou compartilhar seu
              endereço de e-mail com terceiros.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              Links para Sites de Terceiros
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Nosso blog contém links para outros sites na internet (como o
              Serasa, o site do Tesouro Nacional, entre outros). Não somos
              responsáveis pelas políticas de privacidade desses sites externos.
              Recomendamos que você leia os termos de cada um deles.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-[28px] text-[#F5F5F5] tracking-wide uppercase mb-3">
              Consentimento e Alterações
            </h2>
            <p className="font-sans text-base text-[#A0A0A0] leading-relaxed">
              Ao utilizar o nosso blog, você concorda com os termos dispostos
              nesta página. Reservamo-nos o direito de atualizar este documento
              periodicamente. Qualquer modificação será publicada nesta mesma
              página.
            </p>
          </div>

          {/* Separador */}
          <div className="border-t border-[#CC0000]/20 pt-6 mt-4">
            <p className="text-center text-[#606060] font-sans text-xs uppercase tracking-widest">
              Última atualização: 29 de junho de 2026.
            </p>
          </div>

        </article>
      </div>
    </div>
  );
}
