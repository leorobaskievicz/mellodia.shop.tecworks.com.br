import { recommendClient } from "@algolia/recommend";

const client = recommendClient(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_RECOMMEND_API_KEY);

export default client;
