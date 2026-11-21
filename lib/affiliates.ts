export interface AffiliateOffer {
  url: string;
  phrase: string;
}

// Mapeado por slug do artigo. Um mesmo link pode aparecer em vários artigos
// com frases diferentes, ajustadas ao contexto de cada um.
export const AFFILIATE_OFFERS: Record<string, AffiliateOffer> = {
  "emprestimo-pra-quitar-divida-funciona": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Juro de quem tem garantia é outro departamento — simula o seu em 2 minutos",
  },
  "consignado-salva-ou-afunda": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Tem carro ou casa no seu nome? Isso vale um juro bem mais educado",
  },
  "juros-do-rotativo-a-conta-que-assusta": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Dá pra trocar esse juro assustador por um bem mais manso — olha quanto",
  },
};

export function getAffiliateOffer(slug: string): AffiliateOffer | null {
  return AFFILIATE_OFFERS[slug] || null;
}
