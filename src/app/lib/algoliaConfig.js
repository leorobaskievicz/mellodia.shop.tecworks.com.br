// Switch global do Algolia.
//
// Por padrão o projeto roda SEM Algolia: busca, departamento, marca, promoção e outlet usam a
// API do backend (que lê o pdvproduimagem com as fotos reais, igual à home), o tracking de
// insights vira no-op e recomendados/similares retornam vazio.
//
// Para reativar o Algolia, defina no .env:
//   NEXT_PUBLIC_USE_ALGOLIA="true"
//
// Precisa do prefixo NEXT_PUBLIC_ porque a flag é lida tanto no servidor (lib/funcoes) quanto
// no cliente (insights no CardProdu/Vitrine/checkout).
export const USE_ALGOLIA = process.env.NEXT_PUBLIC_USE_ALGOLIA === "true";
