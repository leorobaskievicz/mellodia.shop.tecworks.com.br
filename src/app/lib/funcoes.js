import Api from "@/app/lib/api";

// Função para buscar banners
async function getBanners(tipo = 1, limit = 1) {
  const myapi = new Api();

  try {
    const result = await myapi.get(`/banners?tipo=${tipo}&limit=${limit}`);

    if (!result || result === null || !result.status || !result.msg) {
      throw new Error(result);
    }

    return result.msg;
  } catch (error) {
    console.log("Erro ao buscar banners:", JSON.stringify(error.message));
    return [];
  }
}

// Função para pesquisar estrutura da Home
async function getHomeEstrutura() {
  const myapi = new Api();

  try {
    const dataEstrutura = null;

    const data = await myapi.get(`/produto/home/estrutura`);

    if (!data || data.status === false) {
      throw new Error(`Nao foi possivel buscar estrutura da Home: ${data}`);
    }

    let homeStruct = data.msg;

    for (let idx = 0; idx < homeStruct.length; idx++) {
      const elem = homeStruct[idx];

      try {
        let result = null;

        // TODO: Temporariamente desativada chamada para /product/maiscomprados
        // (falha DB: "Expected 1 bindings, saw 0"). Preparar para receber
        // esses dados de outra chamada futuramente.
        if (elem.api && elem.api.includes("/product/maiscomprados")) {
          homeStruct[idx].produtos = elem.produtos = [];
          continue;
        }

        if (elem.method === "POST") {
          result = await myapi.post(elem.api, elem.postParam);
        } else {
          result = await myapi.get(elem.api);
        }

        if (!result || !result.status) {
          throw new Error(`Falha ao consumir API (${result.msg})`);
        }

        homeStruct[idx].produtos = result.msg.data;
        elem.produtos = result.msg.data;

        if (dataEstrutura && dataEstrutura.data && dataEstrutura.data[idx]) {
          if (dataEstrutura.data[idx].titulo === homeStruct[idx].titulo) {
            if (dataEstrutura.data[idx].produtos && dataEstrutura.data[idx].produtos) {
              for (let x = 0; x < dataEstrutura.data[idx].produtos.length; x++) {
                if (dataEstrutura.data[idx].produtos[x] && dataEstrutura.data[idx].produtos[x].produtoDados) {
                  homeStruct[idx].produtos = [
                    {
                      ...dataEstrutura.data[idx].produtos[x].produtoDados,
                      destaque_cor: dataEstrutura.data[idx].produtos[x].destaque_cor,
                    },
                    ...homeStruct[idx].produtos,
                  ];
                }
              }
            }
          }
        }
      } catch (e) {
        console.log(`Nao foi possivel buscar produtos ${elem.api} (${elem.method}): ${e.message}`);
        homeStruct[idx].produtos = elem.produtos = [];
      }
    }

    return homeStruct;
  } catch (error) {
    console.log("Erro ao buscar getHomeEstrutura:", error.message);
    return [];
  }
}

// Função para buscar produto pelo nome
async function getProdutoByNome(slug) {
  const myapi = new Api();

  try {
    if (!slug) {
      throw new Error("Slug não fornecido");
    }

    const result = await myapi.get(`/product/${slug}/filter/name`);

    if (!result || !result.status) {
      throw new Error(result?.msg || "Erro ao buscar produto");
    }

    if (!result.msg || !result.msg.CODIGO) {
      throw new Error("Produto não encontrado");
    }

    return result.msg;
  } catch (error) {
    console.log("Erro ao buscar produto:", error.message);
    return null;
  }
}

// Função para buscar produto pelo nome dos departamentos
async function getProdutoByDepartamento(menu1, menu2 = null, menu3 = null, page = 1, perPage = 25, marcas = null, orderBy = "relevancia", filtros = {}, fgTelevendas = false) {
  const myapi = new Api();

  try {
    if (!menu1) {
      throw new Error("Menu1 não fornecido");
    }

    const paramApi = {
      page,
      perPage,
      termo: menu1,
      menu1: menu1,
      menu: menu1,
      orderByParam: orderBy,
      codigos: undefined,
    };

    const result = await myapi.post(`/product/departamento/${page}`, { ...paramApi, page: page });

    if (!result || !result.status || !result.msg) {
      throw new Error("Nenhum produto não localizado");
    }

    return {
      ...result.msg,
      page: page,
      perPage: perPage,
      total: result.msg.total,
      marcas: {},
      departamentos: {},
      preco: {},
      grupo: {},
      lastPage: result.msg.lastPage,
    };
  } catch (error) {
    console.log("Erro ao buscar produtos por departamento:", error.message);
    return {
      total: 0,
      lastPage: 1,
      data: [],
      marcas: [],
    };
  }
}

// Função para buscar produto pela marca
async function getProdutoByMarca(marca, page = 1, perPage = 25, sort = "relevancia", filtros = {}, termo = "", fgTelevendas = false) {
  const myapi = new Api();

  try {
    const paramApi = {
      page,
      perPage,
      termo: marca,
      marca: marca,
      orderByParam: sort === "relevancia" ? "estoque_desc" : sort,
      codigos: undefined,
    };

    const result = await myapi.post(`/product/marca/${page}`, { ...paramApi, page: page });

    if (!result || !result.status || !result.msg) {
      throw new Error("Nenhum produto não localizado");
    }

    return {
      ...result.msg,
      page: page,
      perPage: perPage,
      total: result.msg.total,
      marcas: {},
      departamentos: {},
      preco: {},
      grupo: {},
      lastPage: result.msg.lastPage,
    };
  } catch (error) {
    console.log("Erro ao buscar getProdutoByMarca:", error.message);
    return false;
  }
}

// Função para buscar produto
async function getProdutoBySearch(termo, page = 1, perPage = 25, sort = "relevancia", filtros = {}, fgTelevendas = false) {
  const myapi = new Api();

  try {
    const paramApi = {
      page,
      perPage,
      termo,
      orderByParam: sort === "relevancia" ? "estoque_desc" : sort,
      filterMarca: filtros?.marcas?.length > 0 ? filtros.marcas : undefined,
      filterPreco: filtros?.preco?.length > 0 ? filtros.preco : undefined,
      codigos: undefined,
    };

    const result = await myapi.post(`/product/search-dicionario/${page}`, { ...paramApi, page: page });

    if (!result || !result.status || !result.msg) {
      throw new Error("Nenhum produto não localizado");
    }

    return {
      ...result.msg,
      page: page,
      perPage: perPage,
      total: result.msg.total,
      marcas: {},
      departamentos: {},
      preco: {},
      grupo: {},
      lastPage: result.msg.lastPage,
    };
  } catch (error) {
    console.log("Erro ao buscar getProdutoBySearch:", error.message);
    return false;
  }
}

// Função para buscar menu1 pelo nome
async function getMenu1(slug) {
  const myapi = new Api();

  try {
    const paramMenu1 = { menu1: slug };

    const result = await myapi.post(`/menu/nivel1-search`, paramMenu1);

    if (!result.status || !result.msg) {
      throw new Error("Produto não localizado");
    }

    return result.msg;
  } catch (error) {
    return false;
  }
}

// Função para buscar menu1 e menu2 pelo nome
async function getMenu2(slug, slug2) {
  const myapi = new Api();

  try {
    const paramMenu1 = { menu1: slug, menu2: slug2 };

    const result = await myapi.post(`/menu/nivel2-search`, paramMenu1);

    if (!result.status || !result.msg) {
      throw new Error("Produto não localizado");
    }

    return result.msg;
  } catch (error) {
    return false;
  }
}

// Função para buscar menu1 e menu2 e menu3 pelo nome
async function getMenu3(slug, slug2, slug3) {
  const myapi = new Api();

  try {
    const paramMenu1 = { menu1: slug, menu2: slug2, menu3: slug3 };

    const result = await myapi.post(`/menu/nivel3-search`, paramMenu1);

    if (!result.status || !result.msg) {
      throw new Error("Produto não localizado");
    }

    return result.msg;
  } catch (error) {
    return false;
  }
}

async function getSimilares(menu1 = null, menu2 = null, menu3 = null) {
  const myapi = new Api();

  if (!menu1) {
    return true;
  }

  try {
    const param = { menu1: menu1.CDMENU, menu2: null, menu3: null };

    if (menu2 && menu2.CDMENU) {
      param.menu2 = menu2.CDMENU;

      if (menu3 && menu3.CDMENU) {
        param.menu3 = menu3.CDMENU;
      }
    }

    const data = await myapi.post(`/product/departamento`, param);

    if (!data || data.status === false) {
      throw new Error("Não foi possível buscar produtos similares.");
    } else {
      return data.msg.data;
    }
  } catch (e) {
    console.log(e.message);
    return false;
  }
}

async function getSimilaresMarca(marca = null, menu1 = null, menu2 = null, menu3 = null) {
  const myapi = new Api();

  if (!marca) {
    return true;
  }

  try {
    const param = {
      marca,
      menu1: menu1.CDMENU,
      menu2: null,
      menu3: null,
    };

    if (menu2 && menu2.CDMENU) {
      param.menu2 = menu2.CDMENU;

      if (menu3 && menu3.CDMENU) {
        param.menu3 = menu3.CDMENU;
      }
    }

    const data = await myapi.post(`/product/marca`, param);

    if (!data || data.status === false) {
      throw new Error("Não foi possível buscar marcas similares.");
    } else {
      return data.msg.data;
    }
  } catch (e) {
    return false;
  }
}

async function getKits(produto) {
  const myapi = new Api();

  if (!produto || !produto.CODIGO) {
    return false;
  }

  try {
    const data = await myapi.get(`/product/${produto.CODIGO}/kits`);

    if (!data || !data.status || !data.msg || data.msg.length <= 0) {
      throw new Error(`Nenhum kit localizada`);
    }

    return data.msg;
  } catch (e) {
    console.log(e.message);
    return [];
  }
}

async function getVariacoes(produto) {
  const myapi = new Api();

  if (!produto || !produto.CODIGO) {
    return false;
  }

  try {
    const data = await myapi.get(`/variants-of-product?product=${produto.CODIGO}`);

    if (!data || !data.status || !data.msg || data.msg.length <= 0) {
      throw new Error(`Nenhum variacao localizada`);
    }

    return data.msg;
  } catch (e) {
    console.log(e.message);
    return [];
  }
}

async function getFrete(cep, produtos) {
  const myapi = new Api();

  if (!cep) {
    return false;
  }

  try {
    const myParam = {
      cep: cep,
      produtos: produtos,
    };

    const data = await myapi.post(`/shipping/modes/mellodia`, myParam);

    if (!data || !data.status || !data.msg || data.msg.length <= 0) {
      throw new Error(`Nenhum variacao localizada`);
    }

    return data.msg;
  } catch (e) {
    console.log(e.message);
    return [];
  }
}

async function getDepoimentos(produto) {
  const myapi = new Api();

  try {
    const data = await myapi.get(`/adm/produto/${produto}/depoimentos`, true);

    if (!data || !data.status) {
      throw new Error(data.msg);
    }

    return data.msg;
  } catch (e) {
    console.log(e.message);
    return [];
  }
}

let menusCache = null;
let marcasCache = null;
let lastMenusFetchTime = 0;
let lastMarcasFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

async function getMenus() {
  const now = Date.now();

  if (menusCache && now - lastMenusFetchTime < CACHE_DURATION) {
    return menusCache;
  }

  const myapi = new Api();

  try {
    const responseMenu = await myapi.get(`/menu/resumo`);

    if (!responseMenu || !responseMenu.status || responseMenu.msg.length <= 0) {
      return { menu: [], menuOptions: [] };
    }

    menusCache = responseMenu.msg;
    lastMenusFetchTime = now;
    return menusCache;
  } catch (e) {
    console.log("Erro ao carregar menus:", e.message);
    return { menu: [], menuOptions: [] };
  }
}

async function getMarcas() {
  const now = Date.now();

  if (marcasCache && now - lastMarcasFetchTime < CACHE_DURATION) {
    return marcasCache;
  }

  const myapi = new Api();

  try {
    const data = await myapi.get(`/marcasByProduto`);

    if (!data || !data.status) {
      console.log("Erro ao carregar marcas:", data?.msg || "Resposta inválida");
      return [];
    }

    marcasCache = data.msg || [];
    lastMarcasFetchTime = now;
    return marcasCache;
  } catch (e) {
    console.log("Erro ao carregar marcas:", e.message);
    return [];
  }
}

async function getTopHeader() {
  const myapi = new Api();

  try {
    const responseBanners = await myapi.get("/banners?tipo=8");

    if (!responseBanners || !responseBanners.status) {
      throw new Error(responseBanners.msg);
    }

    return responseBanners.msg;
  } catch (e) {
    console.log(e.message);
    return [];
  }
}

async function getTopHeaderMobile() {
  const myapi = new Api();

  try {
    const data = await myapi.get("/parametro");

    if (!data || !data.status || !data.msg || !data.msg.HEADER_MSG_PROMO) {
      throw new Error(data.msg);
    }

    return data.msg.HEADER_MSG_PROMO;
  } catch (e) {
    return "";
  }
}

// Função dados do pix
async function getPixDetail(pedido = "") {
  const myapi = new Api();

  try {
    const result = await myapi.get(`/order/${pedido}/pix`);

    if (!result || result === null || !result.status || !result.msg) {
      throw new Error(result);
    }

    return result.msg;
  } catch (error) {
    console.log("Erro ao buscar pix:", error.message);
    return false;
  }
}

// Função busca produtos em promocao
async function getProdutoByPromocao(page = 1, perPage = 50, sort = "relevancia", filtros = {}, fgTelevendas = false) {
  const myapi = new Api();

  try {
    const paramApi = {
      page,
      perPage,
      termo: "",
      orderByParam: sort === "relevancia" ? "estoque_desc" : sort,
      codigos: undefined,
    };

    const result = await myapi.post(`/product/promocao/${page}`, { ...paramApi, page: page });

    if (!result || !result.status || !result.msg) {
      throw new Error("Nenhum produto não localizado");
    }

    return {
      ...result.msg,
      page: page,
      perPage: perPage,
      total: result.msg.total,
      marcas: {},
      departamentos: {},
      preco: {},
      grupo: {},
      lastPage: result.msg.lastPage,
    };
  } catch (error) {
    console.log("Erro ao buscar produtos em promoções:", error.message);
    return false;
  }
}

// Função busca produtos de outlet
async function getProdutoBySubgrupo(subgrupo = "999", page = 1, perPage = 50, sort = "relevancia", filtros = {}, fgTelevendas = false) {
  const myapi = new Api();

  try {
    const paramApi = {
      page,
      perPage,
      subgrupo: String(subgrupo),
      termo: "",
      orderByParam: sort === "relevancia" ? "estoque_desc" : sort,
      codigos: undefined,
    };

    const result = await myapi.post(`/product/subgrupo/${page}`, { ...paramApi, page: page });

    if (!result || !result.status || !result.msg) {
      throw new Error("Nenhum produto não localizado");
    }

    return {
      ...result.msg,
      page: page,
      perPage: perPage,
      total: result.msg.total,
      marcas: {},
      departamentos: {},
      preco: {},
      grupo: {},
      lastPage: result.msg.lastPage,
    };
  } catch (error) {
    console.log("Erro ao buscar produtos de outlet:", error.message);
    return false;
  }
}

// Sem motor de recomendação sem Algolia
async function getProdutosRecomendados(codigoProduto) {
  return [];
}

// Sem motor de similares sem Algolia
async function getProdutosSimilares(codigoProduto) {
  return [];
}

async function deleteUserSupabase(userId) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: "DELETE",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ADMIN_KEY,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ADMIN_KEY}`,
      },
    });

    return true;
  } catch (error) {
    console.log("Erro ao deletar usuário:", error.message);
    return false;
  }
}

export {
  getMenus,
  getBanners,
  getHomeEstrutura,
  getProdutoByNome,
  getProdutoByDepartamento,
  getProdutoBySearch,
  getMenu1,
  getMenu2,
  getMenu3,
  getSimilares,
  getSimilaresMarca,
  getKits,
  getVariacoes,
  getFrete,
  getDepoimentos,
  getMarcas,
  getProdutoByMarca,
  getTopHeader,
  getTopHeaderMobile,
  getPixDetail,
  getProdutoByPromocao,
  getProdutoBySubgrupo,
  getProdutosRecomendados,
  getProdutosSimilares,
  deleteUserSupabase,
};