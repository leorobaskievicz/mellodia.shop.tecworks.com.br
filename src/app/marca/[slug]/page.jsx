import { Diversos } from "@/app/lib/diversos";
import { getProdutoByMarca } from "@/app/lib/funcoes";
import Paginacao from "@/app/components/Paginacao";
import Ordenacao from "@/app/components/Ordenacao";
import ResponsiveBreadcrumb from "@/app/components/ResponsiveBreadcrumb";
import { Typography, Grid, Paper, Divider, Box, TextField, InputAdornment, IconButton } from "@mui/material";
import { styleContainer, styleContainerBody } from "./style";
import moment from "moment";
import { lazy, Suspense } from "react";
import { headers } from "next/headers";
import Facets from "@/app/components/Facets";

export const LazyVitrine = lazy(() => import("@/app/components/Vitrine"));
export const LazyComponent = ({ children }) => <Suspense>{children}</Suspense>;

export const revalidate = 300;

function getPerPageFromUserAgent(userAgent) {
  if (!userAgent) return 50;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);

  if (isMobile) return 40; // 2 produtos por linha x 5 linhas
  if (isTablet) return 45; // 3 produtos por linha x 5 linhas
  return 50; // 5 produtos por linha x 5 linhas
}

export default async function Marca(props) {
  const { params, searchParams } = await props;
  const { slug } = await params;
  const {
    page: pageParam,
    perPage: perPageParam,
    sort: sortParam,
    marcas: marcasParam,
    departamentos: departamentosParam,
    grupos: gruposParam,
    preco: precoParam,
    fgTelevendas: fgTelevendasParam,
  } = await searchParams;
  const headersList = await headers();
  const userAgent = headersList.get("user-agent");

  const page = pageParam ? Number(pageParam) : 1;
  const perPage = perPageParam ? Number(perPageParam) : getPerPageFromUserAgent(userAgent);
  const sort = sortParam ? sortParam : "relevancia";

  if (!slug) {
    return <></>;
  }

  const regex = /\.(css|jpg|png|webp|svg)$/i;

  if (regex.test(slug)) {
    return <></>;
  }

  const {
    total,
    lastPage,
    data: produtos,
    marcas,
    departamentos,
    grupo,
    preco,
    algoliaReturn,
  } = await getProdutoByMarca(
    slug,
    page,
    perPage,
    sort,
    {
      marcas: typeof marcasParam === "string" ? [marcasParam] : marcasParam,
      departamentos: typeof departamentosParam === "string" ? [departamentosParam] : departamentosParam,
      grupos: typeof gruposParam === "string" ? [gruposParam] : gruposParam,
      preco: typeof precoParam === "string" ? [precoParam] : precoParam,
    },
    Boolean(fgTelevendasParam)
  );

  if (!produtos) {
    return <h1>Nenhum produto localizado</h1>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    url: `https://www.dricor.com.br/${Diversos.toSeoUrl(slug)}`,
    name: produtos?.[0]?.NOME,
    image: produtos?.[0]?.FOTOS.map((q) => `${String(q.link).indexOf("https://dricor.cdn.tecworks") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${q.link}`),
    description: `Melhor oferta de ${Diversos.capitalize(slug)}`,
    sku: produtos?.[0]?.CODIGO,
    mpn: produtos?.[0]?.REFERENCIA ? produtos?.[0]?.REFERENCIA : produtos?.[0]?.CODIGO,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "89",
    },
    brand: {
      "@type": "Brand",
      name: produtos?.[0]?.MARCA ? produtos?.[0]?.MARCA : "Dricor",
    },
    review: {},
    offers: {
      "@type": "Offer",
      url: "",
      priceCurrency: "BRL",
      price: produtos?.[0]?.PREPRO > 0 && produtos?.[0]?.PREPRO < produtos?.[0]?.PRECO ? produtos?.[0]?.PREPRO : produtos?.[0]?.PRECO,
      priceValidUntil: moment().add(1, "month").format("YYYY-MM-DD"),
      itemCondition: "http://schema.org/NewCondition",
      availability: "http://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Dricor",
      },
    },
  };

  return (
    <>
      <Grid container sx={styleContainer}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, mt: 1, mb: 1, py: 1 }}>
          <ResponsiveBreadcrumb
            paths={[
              { label: "Início", href: "/" },
              { label: Diversos.capitalizeAllWords(slug), href: `/departamento/${slug}` },
            ]}
          />
        </Grid>

        <Facets marcas={marcas} departamentos={departamentos} sort={sort} grupos={grupo} preco={preco} />

        <Grid container xs={12} sm={12} md={10} lg={10} xl={10} sx={{ ...styleContainerBody, p: 0, m: 0 }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBody}>
            <Typography
              variant="h1"
              color="black"
              sx={{ fontSize: "1.7rem", fontWeight: "600", pl: 2, pt: 1, textAlign: { xs: "center", sm: "center", md: "left", lg: "left", xl: "left" } }}
            >
              {produtos && produtos.length > 0 ? Diversos.capitalizeAllWords(produtos[0].MARCA) : Diversos.capitalizeAllWords(slug)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBody}>
            <Typography variant="h4" color="black" sx={{ fontSize: "1.3rem", fontWeight: "400", textAlign: "center" }}>
              Todos os produtos
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, px: 1, mt: 1 }}>
            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                p: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="span" color="black" sx={{ fontSize: "0.95rem", fontWeight: "400", width: "100%", textAlign: "left" }}>
                Total de{" "}
                <Typography variant="span" color="black" sx={{ fontSize: "0.95rem", fontWeight: "600" }}>
                  {total}
                </Typography>{" "}
                produtos
              </Typography>
              <Ordenacao ordem={sort} sx={{ justifyContent: "flex-start", width: "auto", mr: 2.5 }} />
            </Paper>
          </Grid>

          <Grid container xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBody}>
            <LazyComponent>
              <LazyVitrine produtos={produtos} title={Diversos.capitalizeAllWords(slug)} algoliaReturn={algoliaReturn} page={"marca"} />
            </LazyComponent>
          </Grid>

          <Grid container xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, alignItems: "center", justifyContent: "center" }}>
            <Paginacao page={page} perPage={perPage} lastPage={lastPage} />
          </Grid>
        </Grid>
      </Grid>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
