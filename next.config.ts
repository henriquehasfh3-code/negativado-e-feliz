import type { NextConfig } from "next";

// Pares de artigos que cobriam o mesmo tema (lote genérico de 30/06/2026
// duplicando um artigo com voz própria publicado em outra data). As páginas
// perdedoras foram despublicadas no Notion; o redirect consolida qualquer
// link ou cache que ainda apontar pro slug antigo no artigo que ficou.
const DUPLICATE_ARTICLE_REDIRECTS: [string, string][] = [
  ["divida-com-parente", "divida-com-parente-a-pior-de-todas"],
  ["nome-limpo-prazo", "quanto-tempo-leva-pra-limpar-o-nome"],
  ["negociar-com-desconto", "liguei-pro-banco-30-dias-seguidos"],
  ["negociar-fatura", "negociar-a-fatura-sem-chorar"],
  ["emprestimo-consignado", "consignado-salva-ou-afunda"],
  ["bola-de-neve-avalanche", "bola-de-neve-ou-avalanche"],
  ["sair-do-serasa", "como-sair-do-serasa-passo-a-passo"],
  ["negativado-o-que-muda", "ser-negativado-o-que-muda-de-verdade"],
  ["cashback-milhas", "cashback-e-milhas-vale-a-pena"],
  ["limite-nao-e-salario", "limite-do-cartao-nao-e-salario"],
  ["parcelar-ou-vista", "parcelar-ou-pagar-a-vista"],
  ["juros-rotativo", "juros-do-rotativo-a-conta-que-assusta"],
  ["usar-cartao-controle", "usar-cartao-sem-virar-refem"],
  ["cartao-vilao", "o-cartao-nao-e-o-vilao"],
  ["carteira-longo-prazo", "carteira-de-longo-prazo-e-esquecer"],
  ["rebalanceamento", "rebalanceamento-o-ajuste-que-ninguem-faz"],
  ["carteira-salario-minimo", "carteira-com-um-salario-minimo"],
  ["diversificacao", "diversificacao-pra-quem-tem-pouco"],
  ["perfil-de-investidor", "perfil-de-investidor-o-que-o-banco-esconde"],
  ["primeira-carteira", "primeira-carteira-em-4-passos"],
  ["erros-de-principiante", "7-erros-de-principiante-em-investimento"],
  ["investimento-automatico", "investimento-automatico-se-roubar-antes"],
  ["mito-precisa-ser-rico", "precisa-ser-rico-pra-investir"],
  ["acoes-iniciantes", "acoes-pra-iniciante-sem-economes"],
  ["fundos-imobiliarios", "fundos-imobiliarios-com-100-reais"],
  ["renda-fixa", "renda-fixa-explicada-sem-economes"],
  ["cdb-banco-digital", "cdb-de-banco-digital-e-seguro"],
  ["reserva-de-emergencia", "reserva-de-emergencia-piada"],
  ["metas-realistas", "metas-financeiras-pra-quem-ja-falhou"],
  ["aniversario-natal-ipva", "dezembro-natal-e-ipva"],
  ["regra-50-30-20", "regra-50-30-20-na-vida-real"],
  ["planilha-baguncada", "sua-planilha-e-complicada-demais"],
  ["salario-acaba-mas-o-mes-fica", "o-salario-acaba-dia-15"],
  ["hobby-em-grana", "transformar-hobby-em-grana"],
  ["apps-de-entrega", "app-de-entrega-quanto-sobra"],
  ["freelancer-horas-vagas", "freelancer-sem-portfolio"],
  ["renda-extra-exausto", "renda-extra-pra-quem-chega-destruido"],
];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  async redirects() {
    return DUPLICATE_ARTICLE_REDIRECTS.map(([from, to]) => ({
      source: `/blog/${from}`,
      destination: `/blog/${to}`,
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "www.notion.so" },
      { protocol: "https", hostname: "images.unsplash.com" },
      // Precisa das DUAS formas: as capas dos artigos apontam para www (que é
      // o endereço que resolve em DNS hoje), mas o apex fica autorizado para o
      // caso do registro A ser criado depois. Sem www aqui, o next/image
      // rejeita a imagem e derruba a página inteira.
      { protocol: "https", hostname: "negativadoefeliz.com.br" },
      { protocol: "https", hostname: "www.negativadoefeliz.com.br" },
    ],
  },
};

export default nextConfig;
