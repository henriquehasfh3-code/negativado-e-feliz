interface AdBannerProps {
  slot?: string;
  format?: "horizontal" | "rectangle" | "vertical" | "auto";
  className?: string;
  label?: string;
}

/**
 * AdBanner — Espaço reservado para anúncios do Google AdSense.
 *
 * Para ativar:
 * 1. Substitua YOUR_ADSENSE_ID no layout.tsx pelo seu ID do AdSense
 * 2. Descomente o script do AdSense no <head>
 * 3. Substitua o conteúdo deste componente pelo código de anúncio real
 *
 * Locais de maior CPM:
 * - Abaixo do header (formato horizontal 728x90)
 * - No meio do artigo (formato retângulo 336x280)
 * - Sidebar (formato vertical 160x600)
 * - Footer (formato horizontal 728x90)
 */
export default function AdBanner({
  slot = "default",
  format = "horizontal",
  className = "",
  label = "Anúncio",
}: AdBannerProps) {
  const dimensions = {
    horizontal: "w-full max-w-[728px] h-[90px]",
    rectangle: "w-full max-w-[336px] h-[280px]",
    vertical: "w-[160px] h-[600px]",
    auto: "w-full min-h-[90px]",
  };

  return (
    <div
      className={`flex justify-center my-6 ${className}`}
      id={`ad-banner-${slot}`}
      aria-label={`Espaço publicitário — ${label}`}
    >
      <div
        className={`
          ${dimensions[format]}
          rounded-lg border border-dashed border-[#CC0000]/20 
          bg-[#111111] 
          flex items-center justify-center
          text-xs text-[#A0A0A0]/60
          select-none
        `}
      >
        {/* 
          ===== CÓDIGO ADSENSE REAL AQUI =====
          
          Exemplo de código AdSense:
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-YOUR_ADSENSE_ID"
            data-ad-slot="YOUR_AD_SLOT"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          
          =====================================
        */}
        <span>{label}</span>
      </div>
    </div>
  );
}
