import { algoliasearch } from "algoliasearch";
import recommendClient from "@/app/lib/algoliaRecommend";
import Api from "@/app/lib/api";
import { USE_ALGOLIA } from "@/app/lib/algoliaConfig";

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

    if (USE_ALGOLIA && fgTelevendas !== true) {
      const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

      const paramAlgolia = {
        indexName: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`,
        query: ``,
        hitsPerPage: perPage,
        page: page - 1,
        filters: "",
        clickAnalytics: true,
        facets: ["marca", "MENU1_DESCRICAO", "MENU2_DESCRICAO", "MENU3_DESCRICAO", "PRECO", "grupo"], // ✅ Adicionei MENU2 e MENU3
      };

      const tmpFilters = [];

      // 🎯 Filtro de marcas
      if (filtros.marcas && filtros.marcas.length > 0) {
        const marcasFilter = filtros.marcas.map((m) => `marca:"${m.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`(${marcasFilter})`);
      }

      // 🎯 Filtros de Menu - SEM ESPAÇOS EXTRAS
      tmpFilters.push(`MENU1_DESCRICAO:"${menu1.toUpperCase().replace(/"/g, '\\"')}"`);

      if (menu2) {
        tmpFilters.push(`MENU2_DESCRICAO:"${menu2.toUpperCase().replace(/"/g, '\\"')}"`);
      }

      if (menu3) {
        tmpFilters.push(`MENU3_DESCRICAO:"${menu3.toUpperCase().replace(/"/g, '\\"')}"`);
      }

      // 🎯 Filtro de grupos
      if (filtros.grupos && filtros.grupos.length > 0) {
        const gruposFilter = filtros.grupos.map((d) => `grupo:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`(${gruposFilter})`);
      }

      // 🎯 Filtro de preço - CORRIGIDO
      if (filtros.preco && filtros.preco.length > 0) {
        // Se for range de preço
        if (typeof filtros.preco === "string" && filtros.preco.includes("-")) {
          const [min, max] = filtros.preco.split("-").map((p) => p.trim());
          tmpFilters.push(`PRECO:${min} TO ${max}`);
        } else if (Array.isArray(filtros.preco)) {
          // Se for array de valores específicos
          const precoFilter = filtros.preco.map((d) => `PRECO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
          tmpFilters.push(`(${precoFilter})`);
        }
      }

      // ✅ Montagem final do filters
      if (tmpFilters.length > 0) {
        paramAlgolia.filters = tmpFilters.join(" AND ");
      }

      // Debug - vamos ver o que está sendo gerado
      // console.log("🔍 Filtros gerados:", paramAlgolia.filters);
      // console.log("📋 Parâmetros completos:", paramAlgolia);

      // Ordenação
      if (orderBy !== "default" && orderBy !== "relevancia") {
        switch (orderBy) {
          case "preco_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_asc`;
            break;
          case "preco_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_desc`;
            break;
          case "nome_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_asc`;
            break;
          case "nome_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_desc`;
            break;
          case "stock_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-estoque`;
            break;
        }
      }

      const { results } = await searchClient.search({
        requests: [paramAlgolia],
      });

      console.log("[Departamento Algolia] Filtro enviado:", paramAlgolia.filters);
      console.log("[Departamento Algolia] nbHits:", results[0].nbHits);
      console.log("[Departamento Algolia] Facets retornados:", results[0].facets);

      // Debug - vamos ver quantos resultados retornaram
      // console.log("📊 Resultados encontrados:", results[0].nbHits);
      // console.log("🏷️ Facetas disponíveis:", results[0].facets);

      return {
        data: results[0].hits.map((q) => ({
          CODIGO: q.codigo,
          NOME: q.nome,
          PRECO: q.PRECO,
          PREPRO: q.PREPRO,
          INIPRO: q.INIPRO,
          FIMPRO: q.FIMPRO,
          UNID: "UN",
          MARCA: q.marca,
          ESTOQUE: q.ESTOQUE,
          SUBGRUPO: q.subgrupo,
          PESO: 0,
          NOMEGRUPO: q.grupo,
          RATIO: Math.random() * (5 - 3) + 3,
          ESTAEMPROMOCAO: q.ESTA_EM_PROMOCAO === 1,
          DESCRICAO1: q.DESCRICAO1,
          PREPRO_COMPL: q.PREPRO_COMPL || null,
          INIPRO_COMPL: q.INIPRO_COMPL || null,
          FIMPRO_COMPL: q.FIMPRO_COMPL || null,
          FOTOS: [
            {
              id: 1509304,
              link: !q.foto ? "produto-sem-imagem.png" : String(q.foto).replace("https://dhvdsbx58he7g.cloudfront.net/", ""),
              sequencia: 1,
            },
          ],
        })),
        page: page,
        perPage: perPage,
        total: results[0].nbHits,
        marcas: results[0].facets?.marca || {},
        departamentos: results[0].facets?.MENU1_DESCRICAO || {},
        menu2: results[0].facets?.MENU2_DESCRICAO || {}, // ✅ Adicionado
        preco: results[0].facets?.PRECO || {},
        grupo: results[0].facets?.grupo || {},
        lastPage: results[0].nbPages,
      };
    } else {
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
    }

    // const paramApi = {
    //   menu1: menu1,
    //   menu2: menu2,
    //   menu3: menu3,
    //   marcas: typeof marcas === "string" ? marcas.split(",") : marcas,
    //   sort: orderBy,
    //   page: page,
    //   per_page: perPage,
    // };

    // const result = await myapi.post(`/product/departamento/${page}?${queryString.stringify(paramApi)}`, paramApi);

    // if (!result || !result.status) {
    //   throw new Error(result?.msg || "Erro ao buscar produtos");
    // }

    // return {
    //   total: result.msg.total || 0,
    //   lastPage: result.msg.lastPage || 1,
    //   data: result.msg.data || [],
    //   marcas: result.marcas || [],
    // };
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
    if (USE_ALGOLIA && fgTelevendas !== true) {
      const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

      const paramAlgolia = {
        indexName: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`,
        query: ``,
        hitsPerPage: perPage,
        page: page - 1,
        filters: "",
        clickAnalytics: true,
        facets: ["marca", "MENU1_DESCRICAO", "PRECO", "grupo"],
      };

      const tmpFilters = [];

      // // 🎯 Filtro de preço
      // if (filtros.preco) {
      //   const tmpPreco = filtros.preco.split("-").map((p) => p.trim());
      //   if (tmpPreco.length === 2) {
      //     tmpFilters.push(`( PRECO:${tmpPreco[0]} TO ${tmpPreco[1]} )`);
      //   }
      // }

      // 🎯 Filtro de marcas
      tmpFilters.push(`( marca:"${marca.replace(/-/g, " ").replace(/"/g, '\\"')}" )`);

      // 🎯 Filtro de departamentos
      if (filtros.departamentos && filtros.departamentos.length > 0) {
        const departamentos = filtros.departamentos.map((d) => `MENU1_DESCRICAO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${departamentos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.grupos && filtros.grupos.length > 0) {
        const grupos = filtros.grupos.map((d) => `grupo:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${grupos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.preco && filtros.preco.length > 0) {
        const preco = filtros.preco.map((d) => `PRECO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${preco} )`);
      }

      // ✅ Montagem final do filters
      if (tmpFilters.length > 0) {
        paramAlgolia.filters = tmpFilters.join(" AND ");
      }

      if (sort !== "default" && sort !== "relevancia") {
        switch (sort) {
          case "preco_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_asc`;
            break;
          case "preco_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_desc`;
            break;
          case "nome_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_asc`;
            break;
          case "nome_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_desc`;
            break;
          case "stock_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-estoque`;
            break;
        }
      }

      // console.log(paramAlgolia);

      const { results } = await searchClient.search({
        requests: [paramAlgolia],
      });

      return {
        data: results[0].hits.map((q) => ({
          CODIGO: q.codigo,
          NOME: q.nome,
          PRECO: q.PRECO,
          PREPRO: q.PREPRO,
          INIPRO: q.INIPRO,
          FIMPRO: q.FIMPRO,
          UNID: "UN",
          MARCA: q.marca,
          ESTOQUE: q.ESTOQUE,
          SUBGRUPO: q.subgrupo,
          PESO: 0,
          NOMEGRUPO: q.grupo,
          RATIO: Math.random() * (5 - 3) + 3,
          ESTAEMPROMOCAO: q.ESTA_EM_PROMOCAO === 1,
          DESCRICAO1: q.DESCRICAO1,
          PREPRO_COMPL: q.PREPRO_COMPL || null,
          INIPRO_COMPL: q.INIPRO_COMPL || null,
          FIMPRO_COMPL: q.FIMPRO_COMPL || null,
          FOTOS: [
            {
              id: 1509304,
              link: !q.foto ? "produto-sem-imagem.png" : String(q.foto).replace("https://dhvdsbx58he7g.cloudfront.net/", ""),
              sequencia: 1,
            },
          ],
        })),
        page: page,
        perPage: perPage,
        total: results[0].nbHits,
        marcas: results[0].facets.marca,
        departamentos: results[0].facets.MENU1_DESCRICAO,
        preco: results[0].facets.PRECO,
        grupo: results[0].facets.grupo,
        lastPage: results[0].nbPages,
      };
    } else {
      const paramApi = {
        page,
        perPage,
        termo: marca,
        marca: marca,
        orderByParam: sort,
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
    }
  } catch (error) {
    console.log("Erro ao buscar getProdutoByNome:", error.message);
    return false;
  }
}

// Função para buscar produto
async function getProdutoBySearch(termo, page = 1, perPage = 25, sort = "relevancia", filtros = {}, fgTelevendas = false) {
  const myapi = new Api();

  try {
    if (USE_ALGOLIA && fgTelevendas !== true) {
      const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

      const paramAlgolia = {
        indexName: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`,
        query: termo !== "frete-gratis" ? `${termo.replace(/-/g, " ")}` : "",
        hitsPerPage: perPage,
        page: page - 1,
        filters: "",
        clickAnalytics: true,
        facets: ["marca", "MENU1_DESCRICAO", "PRECO", "grupo"],
      };

      const tmpFilters = [];

      if (termo === "frete-gratis") {
        tmpFilters.push(`( PRECO >= 99.99 )`);
      }

      // 🎯 Filtro de marcas
      if (filtros.marcas && filtros.marcas.length > 0) {
        const marcas = filtros.marcas.map((m) => `marca:"${m.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${marcas} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.departamentos && filtros.departamentos.length > 0) {
        const departamentos = filtros.departamentos.map((d) => `MENU1_DESCRICAO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${departamentos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.grupos && filtros.grupos.length > 0) {
        const grupos = filtros.grupos.map((d) => `grupo:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${grupos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.preco && filtros.preco.length > 0) {
        const preco = filtros.preco.map((d) => `PRECO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${preco} )`);
      }

      // ✅ Montagem final do filters
      if (tmpFilters.length > 0) {
        paramAlgolia.filters = tmpFilters.join(" AND ");
      }

      if (sort !== "default" && sort !== "relevancia") {
        switch (sort) {
          case "preco_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_asc`;
            break;
          case "preco_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_desc`;
            break;
          case "nome_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_asc`;
            break;
          case "nome_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_desc`;
            break;
          case "stock_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-estoque`;
            break;
        }
      }

      console.log("[Busca Sort] sort recebido:", sort, "| indexName que será usado:", paramAlgolia.indexName);

      const { results } = await searchClient.search({
        requests: [paramAlgolia],
      });

      console.log("[Algolia] Primeiro hit completo:", JSON.stringify(results[0].hits[0], null, 2));
      console.log("[Algolia] Facets retornados:", JSON.stringify(results[0].facets, null, 2));
      console.log("[Algolia] Params enviados:", paramAlgolia);
      console.log("[Algolia] Todos os hits (estoque):", JSON.stringify(
        results[0].hits.map((q, i) => ({
          i,
          codigo: q.codigo,
          nome: q.nome,
          ESTOQUE: q.ESTOQUE,
          PRECO: q.PRECO,
          PREPRO: q.PREPRO,
        })),
        null,
        2
      ));
      console.log("[Algolia] Facets retornados:", JSON.stringify(results[0].facets, null, 2));

      return {
        data: results[0].hits.map((q) => ({
          CODIGO: q.codigo,
          NOME: q.nome,
          PRECO: q.PRECO,
          PREPRO: q.PREPRO,
          INIPRO: q.INIPRO,
          FIMPRO: q.FIMPRO,
          UNID: "UN",
          REFERENCIA: "",
          MARCA: q.marca,
          ESTOQUE: q.ESTOQUE,
          SUBGRUPO: q.subgrupo,
          PESO: 0,
          NOMEGRUPO: q.grupo,
          RATIO: Math.random() * (5 - 3) + 3,
          ESTAEMPROMOCAO: q.ESTA_EM_PROMOCAO === 1,
          DESCRICAO1: q.DESCRICAO1,
          PREPRO_COMPL: q.PREPRO_COMPL || null,
          INIPRO_COMPL: q.INIPRO_COMPL || null,
          FIMPRO_COMPL: q.FIMPRO_COMPL || null,
          FOTOS: [
            {
              id: 1509304,
              link: !q.foto ? "produto-sem-imagem.png" : String(q.foto).replace("https://mellodia.shop.cdn.com.br/", "").replace("https://dhvdsbx58he7g.cloudfront.net/", ""),
              sequencia: 1,
            },
          ],
        })),
        page: page,
        perPage: perPage,
        total: results[0].nbHits,
        marcas: results[0].facets.marca,
        departamentos: results[0].facets.MENU1_DESCRICAO,
        preco: results[0].facets.PRECO,
        grupo: results[0].facets.grupo,
        lastPage: results[0].nbPages,
        algoliaReturn: { ...results[0], facetsAplicados: paramAlgolia.filters },
      };
    } else {
      const paramApi = {
        page,
        perPage,
        termo,
        orderByParam: sort,
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
    }
  } catch (error) {
    console.log("Erro ao buscar getProdutoByNome:", error.message);
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
    // console.log("Erro ao buscar getMenu1:", error.message);
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
    // console.log("Erro ao buscar getMenu2:", error.message);
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
    // console.log("Erro ao buscar getMenu3:", error.message);
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
      // console.log("Erro ao carregar menus:", responseMenu?.msg || "Resposta inválida");
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
    if (USE_ALGOLIA && fgTelevendas !== true) {
      const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

      const paramAlgolia = {
        indexName: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`,
        query: ``,
        hitsPerPage: perPage,
        page: page - 1,
        filters: "",
        clickAnalytics: true,
        facets: ["marca", "MENU1_DESCRICAO", "PRECO", "grupo"],
      };

      console.log("[getProdutoByPromocao] paramAlgolia inicial:", paramAlgolia);

      const tmpFilters = [];

      // // 🎯 Filtro de preço
      // if (filtros.preco) {
      //   const tmpPreco = filtros.preco.split("-").map((p) => p.trim());
      //   if (tmpPreco.length === 2) {
      //     tmpFilters.push(`( PRECO:${tmpPreco[0]} TO ${tmpPreco[1]} )`);
      //   }
      // }

      // 🎯 Filtro de marcas
      tmpFilters.push(` ESTA_EM_PROMOCAO = 1 `);

      // 🎯 Filtro de marcas
      if (filtros.marcas && filtros.marcas.length > 0) {
        const marcas = filtros.marcas.map((m) => `marca:"${m.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${marcas} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.departamentos && filtros.departamentos.length > 0) {
        const departamentos = filtros.departamentos.map((d) => `MENU1_DESCRICAO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${departamentos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.grupos && filtros.grupos.length > 0) {
        const grupos = filtros.grupos.map((d) => `grupo:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${grupos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.preco && filtros.preco.length > 0) {
        const preco = filtros.preco.map((d) => `PRECO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${preco} )`);
      }

      // ✅ Montagem final do filters
      if (tmpFilters.length > 0) {
        paramAlgolia.filters = tmpFilters.join(" AND ");
      }

      if (sort !== "default" && sort !== "relevancia") {
        switch (sort) {
          case "preco_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_asc`;
            break;
          case "preco_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_desc`;
            break;
          case "nome_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_asc`;
            break;
          case "nome_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_desc`;
            break;
          case "stock_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-estoque`;
            break;
        }
      }

      const { results } = await searchClient.search({
        requests: [paramAlgolia],
      });

      return {
        data: results[0].hits.map((q) => ({
          CODIGO: q.codigo,
          NOME: q.nome,
          PRECO: q.PRECO,
          PREPRO: q.PREPRO,
          INIPRO: q.INIPRO,
          FIMPRO: q.FIMPRO,
          UNID: "UN",
          MARCA: q.marca,
          ESTOQUE: q.ESTOQUE,
          SUBGRUPO: q.subgrupo,
          PESO: 0,
          NOMEGRUPO: q.grupo,
          RATIO: Math.random() * (5 - 3) + 3,
          ESTAEMPROMOCAO: q.ESTA_EM_PROMOCAO === 1,
          DESCRICAO1: q.DESCRICAO1,
          PREPRO_COMPL: q.PREPRO_COMPL || null,
          INIPRO_COMPL: q.INIPRO_COMPL || null,
          FIMPRO_COMPL: q.FIMPRO_COMPL || null,
          FOTOS: [
            {
              id: 1509304,
              link: !q.foto ? "produto-sem-imagem.png" : String(q.foto).replace("https://dhvdsbx58he7g.cloudfront.net/", ""),
              sequencia: 1,
            },
          ],
        })),
        page: page,
        perPage: perPage,
        total: results[0].nbHits,
        marcas: results[0].facets.marca,
        departamentos: results[0].facets.MENU1_DESCRICAO,
        preco: results[0].facets.PRECO,
        grupo: results[0].facets.grupo,
        lastPage: results[0].nbPages,
      };
    } else {
      const paramApi = {
        page,
        perPage,
        termo: "",
        orderByParam: sort,
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
    }
  } catch (error) {
    console.log("Erro ao buscar produtos em promoções:", error.message);
    return false;
  }
}

// Função busca produtos de outlet
async function getProdutoBySubgrupo(subgrupo = "999", page = 1, perPage = 50, sort = "relevancia", filtros = {}, fgTelevendas = false) {
  const myapi = new Api();

  try {
    if (USE_ALGOLIA && fgTelevendas !== true) {
      const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY);

      const paramAlgolia = {
        indexName: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`,
        query: ``,
        hitsPerPage: perPage,
        page: page - 1,
        filters: "",
        clickAnalytics: true,
        facets: ["marca", "MENU1_DESCRICAO", "PRECO", "grupo"],
      };

      const tmpFilters = [];

      // // 🎯 Filtro de preço
      // if (filtros.preco) {
      //   const tmpPreco = filtros.preco.split("-").map((p) => p.trim());
      //   if (tmpPreco.length === 2) {
      //     tmpFilters.push(`( PRECO:${tmpPreco[0]} TO ${tmpPreco[1]} )`);
      //   }
      // }

      // 🎯 Filtro de marcas
      tmpFilters.push(`( subgrupo:"${String(subgrupo).replace(/"/g, '\\"')}" )`);

      // 🎯 Filtro de marcas
      if (filtros.marcas && filtros.marcas.length > 0) {
        const marcas = filtros.marcas.map((m) => `marca:"${m.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${marcas} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.departamentos && filtros.departamentos.length > 0) {
        const departamentos = filtros.departamentos.map((d) => `MENU1_DESCRICAO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${departamentos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.grupos && filtros.grupos.length > 0) {
        const grupos = filtros.grupos.map((d) => `grupo:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${grupos} )`);
      }

      // 🎯 Filtro de departamentos
      if (filtros.preco && filtros.preco.length > 0) {
        const preco = filtros.preco.map((d) => `PRECO:"${d.replace(/"/g, '\\"')}"`).join(" OR ");
        tmpFilters.push(`( ${preco} )`);
      }

      // ✅ Montagem final do filters
      if (tmpFilters.length > 0) {
        paramAlgolia.filters = tmpFilters.join(" AND ");
      }

      if (sort !== "default" && sort !== "relevancia") {
        switch (sort) {
          case "preco_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_asc`;
            break;
          case "preco_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-preco_desc`;
            break;
          case "nome_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_asc`;
            break;
          case "nome_desc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-nome_desc`;
            break;
          case "stock_asc":
            paramAlgolia.indexName = `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}-estoque`;
            break;
        }
      }

      const { results } = await searchClient.search({
        requests: [paramAlgolia],
      });

      return {
        data: results[0].hits.map((q) => ({
          CODIGO: q.codigo,
          NOME: q.nome,
          PRECO: q.PRECO,
          PREPRO: q.PREPRO,
          INIPRO: q.INIPRO,
          FIMPRO: q.FIMPRO,
          UNID: "UN",
          MARCA: q.marca,
          ESTOQUE: q.ESTOQUE,
          SUBGRUPO: q.subgrupo,
          PESO: 0,
          NOMEGRUPO: q.grupo,
          RATIO: Math.random() * (5 - 3) + 3,
          ESTAEMPROMOCAO: q.ESTA_EM_PROMOCAO === 1,
          DESCRICAO1: q.DESCRICAO1,
          PREPRO_COMPL: q.PREPRO_COMPL || null,
          INIPRO_COMPL: q.INIPRO_COMPL || null,
          FIMPRO_COMPL: q.FIMPRO_COMPL || null,
          FOTOS: [
            {
              id: 1509304,
              link: !q.foto ? "produto-sem-imagem.png" : String(q.foto).replace("https://dhvdsbx58he7g.cloudfront.net/", ""),
              sequencia: 1,
            },
          ],
        })),
        page: page,
        perPage: perPage,
        total: results[0].nbHits,
        marcas: results[0].facets.marca,
        departamentos: results[0].facets.MENU1_DESCRICAO,
        preco: results[0].facets.PRECO,
        grupo: results[0].facets.grupo,
        lastPage: results[0].nbPages,
      };
    } else {
      const paramApi = {
        page,
        perPage,
        subgrupo: String(subgrupo),
        termo: "",
        orderByParam: sort,
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
    }
  } catch (error) {
    console.log("Erro ao buscar produtos de outlet:", error.message);
    return false;
  }
}

// Função busca produtos relacionados no Algolia
async function getProdutosRecomendados(codigoProduto) {
  // Sem Algolia não há motor de recomendação; retorna vazio para a seção apenas não renderizar.
  if (!USE_ALGOLIA) {
    return [];
  }

  try {
    const response = await recommendClient.getRecommendations([
      {
        indexName: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`,
        objectID: String(codigoProduto),
        model: "related-products",
        threshold: 50,
        maxRecommendations: 28,
      },
    ]);

    return response.results[0].hits.map((q) => ({
      CODIGO: q.codigo,
      NOME: q.nome,
      PRECO: q.PRECO,
      PREPRO: q.PREPRO,
      INIPRO: q.INIPRO,
      FIMPRO: q.FIMPRO,
      UNID: "UN",
      MARCA: q.marca,
      ESTOQUE: q.ESTOQUE,
      SUBGRUPO: q.subgrupo,
      PESO: 0,
      NOMEGRUPO: q.grupo,
      RATIO: Math.random() * (5 - 3) + 3,
      ESTAEMPROMOCAO: q.ESTA_EM_PROMOCAO === 1,
      DESCRICAO1: q.DESCRICAO1,
      PREPRO_COMPL: q.PREPRO_COMPL || null,
      INIPRO_COMPL: q.INIPRO_COMPL || null,
      FIMPRO_COMPL: q.FIMPRO_COMPL || null,
      FOTOS: [
        {
          id: 1509304,
          link: !q.foto ? "produto-sem-imagem.png" : String(q.foto).replace("https://dhvdsbx58he7g.cloudfront.net/", ""),
          sequencia: 1,
        },
      ],
    }));
  } catch (error) {
    console.log("Erro ao buscar produtos recomendados:", error.message);
    return false;
  }
}

// Função busca produtos similares no Algolia
async function getProdutosSimilares(codigoProduto) {
  // Sem Algolia não há motor de "looking-similar"; retorna vazio para a seção apenas não renderizar.
  if (!USE_ALGOLIA) {
    return [];
  }

  try {
    const response = await recommendClient.getRecommendations([
      {
        indexName: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}`,
        objectID: String(codigoProduto),
        model: "looking-similar",
        threshold: 50,
        maxRecommendations: 28,
      },
    ]);

    return response.results[0].hits.map((q) => ({
      CODIGO: q.codigo,
      NOME: q.nome,
      PRECO: q.PRECO,
      PREPRO: q.PREPRO,
      INIPRO: q.INIPRO,
      FIMPRO: q.FIMPRO,
      UNID: "UN",
      MARCA: q.marca,
      ESTOQUE: q.ESTOQUE,
      SUBGRUPO: q.subgrupo,
      PESO: 0,
      NOMEGRUPO: q.grupo,
      RATIO: Math.random() * (5 - 3) + 3,
      ESTAEMPROMOCAO: q.ESTA_EM_PROMOCAO === 1,
      DESCRICAO1: q.DESCRICAO1,
      PREPRO_COMPL: q.PREPRO_COMPL || null,
      INIPRO_COMPL: q.INIPRO_COMPL || null,
      FIMPRO_COMPL: q.FIMPRO_COMPL || null,
      FOTOS: [
        {
          id: 1509304,
          link: !q.foto ? "produto-sem-imagem.png" : String(q.foto).replace("https://dhvdsbx58he7g.cloudfront.net/", ""),
          sequencia: 1,
        },
      ],
    }));
  } catch (error) {
    console.log("Erro ao buscar produtos recomendados:", error.message);
    return false;
  }
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
