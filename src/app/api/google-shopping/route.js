export async function GET() {
  try {
    const res = await fetch(`https://mellodia.shop.cdn.tecworks.com.br/google-shopping.xml?v=${Date.now()}`);

    if (!res.ok) {
      throw new Error(`Erro ao buscar XML: ${res.status}`);
    }

    return new Response(res.body, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Erro ao processar XML:", error);
    return new Response("Erro ao processar XML", { status: 500 });
  }
}
