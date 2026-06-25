// lib/algoliaInsights.js
import realInsights from "search-insights";
import { USE_ALGOLIA } from "@/app/lib/algoliaConfig";

if (USE_ALGOLIA) {
  realInsights("init", {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY, // diferente da de busca
  });
}

// Quando o Algolia está desativado, vira no-op: todos os call sites (CardProdu, Vitrine,
// ProdutoClient, checkout) continuam chamando insights(...) normalmente, sem efeito e sem erro.
const insights = (...args) => {
  if (!USE_ALGOLIA) {
    return;
  }

  try {
    return realInsights(...args);
  } catch (error) {
    console.error("Algolia insights error:", error);
  }
};

export default insights;
