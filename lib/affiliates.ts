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
  "plano-de-12-meses-pra-sair-do-vermelho": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "O plano de 12 meses fica mais leve com juro de quem tem garantia",
  },
  "paguei-30-mil-de-divida-ganhando-2500": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Trinta mil fica mais leve com um juro de quem tem garantia",
  },
  "bola-de-neve-ou-avalanche": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Tem um jeito de derreter a bola de neve mais rápido: juro mais baixo",
  },
  "o-erro-que-9-em-10-negativados-cometem": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "O erro número 10: não checar se dava pra pagar menos juro com garantia",
  },
  "liguei-pro-banco-30-dias-seguidos": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Antes de ligar de novo, vale comparar com um juro de quem tem garantia",
  },
  "negociar-a-fatura-sem-chorar": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Outro jeito de negociar: trocar a fatura cara por um juro de garantia",
  },
  "desconto-de-90-por-cento-existe": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Garantia também dá desconto — só que no juro, todo mês",
  },
  "o-que-o-banco-nao-quer-que-voce-saiba": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Uma coisa o banco não oferece de graça: juro de quem tem garantia",
  },
  "como-sair-do-serasa-passo-a-passo": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Um dos degraus pode ser trocar a dívida cara por uma com garantia",
  },
  "minha-divida-caducou-em-5-anos": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Enquanto ela não caduca, dá pra trocar o juro por um bem mais baixo",
  },
  "quanto-tempo-leva-pra-limpar-o-nome": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Enquanto o nome não limpa, o juro pode ficar mais leve",
  },
  "paguei-so-o-minimo-por-um-ano": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Um ano de mínimo dava pra virar um juro bem mais baixo",
  },
  "ser-negativado-o-que-muda-de-verdade": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Uma coisa que dá pra mudar: trocar dívida cara por uma com garantia",
  },
  "divida-com-parente-a-pior-de-todas": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Trocar a dívida do parente por um juro de garantia resolve o Natal",
  },
  "feirao-limpa-nome-vale-a-pena": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Antes do feirão, vale comparar com o juro de quem tem garantia",
  },
  "score-zero-sobrevivencia": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Sobreviver fica mais barato com juro de quem tem garantia",
  },
  "casei-com-divida-como-resolvemos": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Outra saída que existia: trocar o juro caro por um de garantia",
  },
  "pix-parcelado-o-rotativo-de-roupa-nova": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Essa roupa nova de juro também fica mais em conta com garantia",
  },
  "cheque-especial-o-mais-caro-de-todos": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Tem como pagar bem menos que isso: juro de quem tem garantia",
  },
  "nome-sujo-atrapalha-coisas-bizarras": {
    url: "https://lmdee.link/ZFPCpgaVRcMS",
    phrase: "Uma coisa que não atrapalha: conseguir um juro mais baixo com garantia",
  },
};

export function getAffiliateOffer(slug: string): AffiliateOffer | null {
  return AFFILIATE_OFFERS[slug] || null;
}
