import { Diversos } from "@/app/lib/diversos";
import { getProdutoByNome } from "@/app/lib/funcoes";
// import ProdutoClient from "@/app/components/ProdutoClient";
import { getMenu1, getMenu2, getMenu3, getSimilares, getSimilaresMarca, getKits, getVariacoes } from "@/app/lib/funcoes";
import moment from "moment";
import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";
import Head from "next/head";

export const LazyProdutoClient = lazy(() => import("@/app/components/ProdutoClient"));

export const LazyComponent = ({ children }) => <Suspense>{children}</Suspense>;

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = params || {};
  if (!slug) return {};

  // bloqueios rápidos iguais aos da page (para evitar I/O desnecessário)
  const isArquivoEstático = slug?.includes(".") && !slug.endsWith(".html");
  const regex = /\.(css|jpg|png|webp|svg)$/i;
  if (isArquivoEstático || regex.test(slug)) return {};

  const produto = await getProdutoByNome(slug);
  if (!produto) {
    // Sem produto => 404 e sem metas
    return {};
  }

  const url = `https://www.mellodia.com.br/${Diversos.toSeoUrl(produto.NOME)}`;
  const image = produto.FOTOS?.[0]?.link
    ? produto.FOTOS[0].link.startsWith("https://mellodia.shop.cdn.tecworks")
      ? produto.FOTOS[0].link
      : `https://mellodia.shop.cdn.tecworks.com.br/${produto.FOTOS[0].link}`
    : "https://www.mellodia.com.br/_next/image?url=%2Fproduto-sem-imagem.png&w=1200&q=90";

  const title = `${produto.NOME} | mellodia`;
  const description = `Melhor oferta de ${produto.NOME} com entrega rápida em todo o Brasil. Aproveite agora!`;
  const price = produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image }],
      siteName: "mellodia",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    // Metas custom que o Metadata API não tem campo dedicado
    other: {
      "og:type": "product",
      "product:price:amount": String(price),
      "product:price:currency": "BRL",
      // se quiser robots específicos por produto, pode por aqui também
    },
  };
}

export default async function Produto(props) {
  const { params } = props;

  const { slug } = params;

  // Bloqueia acesso a arquivos (como .glb, .js, etc.)
  const isArquivoEstático = slug?.includes(".") && !slug.endsWith(".html");

  if (isArquivoEstático) {
    notFound(); // ou pode lançar erro ou redirecionar
  }

  if (!slug) {
    return <></>;
  }

  if (String(slug).split("/").shift().toLocaleLowerCase() === "departamento" || String(slug).split("/").shift().toLocaleLowerCase() === "marca") {
    return <></>;
  }

  const regex = /\.(css|jpg|png|webp|svg)$/i;

  if (regex.test(slug)) {
    return <></>;
  }

  const produto = await getProdutoByNome(slug);

  if (!produto) {
    notFound();
  }

  const menu1 = await getMenu1(produto.COMPLEMENTO?.MENU1);
  const menu2 = await getMenu2(produto.COMPLEMENTO?.MENU1, produto.COMPLEMENTO?.MENU2);
  const menu3 = await getMenu3(produto.COMPLEMENTO?.MENU1, produto.COMPLEMENTO?.MENU2, produto.COMPLEMENTO?.MENU3);
  const similares = await getSimilares(menu1, menu2, menu3);
  const similaresMarcas = await getSimilaresMarca(produto.MARCA, menu1, menu2, menu3);
  const kits = await getKits(produto);
  const variacoes = await getVariacoes(produto);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    url: `https://www.mellodia.com.br/${Diversos.toSeoUrl(produto.NOME)}`,
    name: produto.NOME,
    image: produto.FOTOS.map((q) => `${String(q.link).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? q.link : "https://mellodia.shop.cdn.tecworks.com.br/"}${q.link}`),
    description: `Melhor oferta de ${Diversos.capitalize(produto.NOME)}`,
    sku: produto.CODIGO,
    mpn: produto.REFERENCIA ? produto.REFERENCIA : produto.CODIGO,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "89",
    },
    brand: {
      "@type": "Brand",
      name: produto.MARCA ? produto.MARCA : "Diva",
    },
    review: {},
    offers: {
      "@type": "Offer",
      url: `https://www.mellodia.com.br/${Diversos.toSeoUrl(produto.NOME)}`,
      priceCurrency: "BRL",
      price: produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO,
      priceValidUntil: moment().add(1, "month").format("YYYY-MM-DD"),
      itemCondition: "http://schema.org/NewCondition",
      availability: "http://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "mellodia",
      },
    },
  };

  const title = `${produto.NOME} | mellodia`;
  const description = `Melhor oferta de ${produto.NOME} com entrega rápida em todo o Brasil. Aproveite agora!`;
  const image =
    produto.FOTOS && produto.FOTOS.length > 0 && produto.FOTOS[0].link
      ? produto.FOTOS[0].link.indexOf("https://mellodia.shop.cdn.tecworks") > -1
        ? produto.FOTOS[0].link
        : `https://mellodia.shop.cdn.tecworks.com.br/${produto.FOTOS[0].link}`
      : "https://www.mellodia.com.br/_next/image?url=%2Fproduto-sem-imagem.png&w=256&q=75";
  const url = `https://www.mellodia.com.br/${Diversos.toSeoUrl(produto.NOME)}`;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script type="text/javascript" src="https://s3-sa-east-1.amazonaws.com/assets.standout.com.br/js/script-standout-divacosmeticos.js"></script>

      <LazyComponent>
        <LazyProdutoClient produto={produto} menu1={menu1} menu2={menu2} menu3={menu3} similares={similares} similaresMarcas={similaresMarcas} kits={kits} variacoes={variacoes} />
      </LazyComponent>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
