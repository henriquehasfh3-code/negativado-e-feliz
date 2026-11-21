import { HandCoins, ArrowRight } from "lucide-react";
import type { AffiliateOffer } from "@/lib/affiliates";

/**
 * Recomendação de parceiro ligada ao assunto do artigo. Mesmo padrão visual do
 * ForumCta, pra não parecer um banner solto — mas com rótulo "Parceria"
 * visível, porque é link patrocinado.
 */
export default function AffiliateCta({ offer }: { offer: AffiliateOffer }) {
  return (
    <section className="mt-10 rounded-2xl border border-[#CC0000]/25 bg-gradient-to-br from-[#141414] to-[#0d0d0d] p-7 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#CC0000]/12">
          <HandCoins className="h-5 w-5 text-[#CC0000]" />
        </div>

        <div className="min-w-0 flex-1">
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#606060]">
            Parceria
          </span>

          <a
            href={offer.url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="mt-2 flex items-start gap-2 font-heading text-[26px]! leading-tight text-[#F5F5F5] transition-colors hover:text-[#CC0000]"
          >
            {offer.phrase}
            <ArrowRight className="mt-2 h-5 w-5 shrink-0" />
          </a>

          <p className="mt-2.5 font-sans text-[13px] text-[#606060]">
            Empréstimo com garantia de imóvel ou veículo, pela Creditas.
          </p>
        </div>
      </div>
    </section>
  );
}
