// app/lib/promocaoRelampago.js
import Api from "@/app/lib/api";

function unwrapList(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.rows)) return json.rows;
  return [];
}

export async function fetchPromocaoVigente() {
  const myapi = new Api();
  const result = await myapi.get(`/promocoes-relampago?vigentes=1`);

  if (!result) {
    throw new Error("Erro ao buscar promoção relampago");
  }

  return result.data.shift();
}

export async function fetchProdutosRotacao(promoId, intervaloMin, tamanho) {
  const myapi = new Api();
  const params = new URLSearchParams();
  if (intervaloMin) params.set("intervalo_min", String(intervaloMin));
  if (tamanho) params.set("tamanho", String(tamanho));

  const result = await myapi.get(
    `/promocoes-relampago/${promoId}/produtos/rotacao${params.toString() ? `?${params}` : ""}`
  );

  if (!result) {
    throw new Error("Erro ao buscar produtos da promoção relampago");
  }

  return result
    .filter((p) => p.produtoDados)
    .map((p) => ({
      ...p.produtoDados,
      DESCRICAO1: p.produtoDados.COMPLEMENTO ? p.produtoDados.COMPLEMENTO.DESCRICAO1 : "",
      PREPRO: p.preco_promocional,
      vendas: p.vendas,
      progresso: p.progresso,
    }));
}

// (Opcional) detalhe do produto por código, ajuste conforme sua API
export async function fetchProdutoDetalhe(codigo) {
  const myapi = new Api();
  const result = await myapi.get(`/produtos/${codigo}`);

  if (!result) {
    throw new Error("Erro ao buscar produto da promoção relampago");
  }

  return result;
}

export async function fetchTempoRestante(promoId) {
  const myapi = new Api();
  const result = await myapi.get(`/promocoes-relampago/${promoId}/tempo-restante`);

  if (!result) {
    throw new Error("Erro ao buscar tempo restante");
  }

  return result;
}
