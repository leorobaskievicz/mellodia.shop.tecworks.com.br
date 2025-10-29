// lib/algoliaInsights.js
import insights from "search-insights";

insights("init", {
  appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  apiKey: process.env.NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY, // diferente da de busca
});

export default insights;
