import { Box, Skeleton, Grid } from "@mui/material";
import { lazy, Suspense, memo } from "react";
import { getBanners, getHomeEstrutura } from "@/app/lib/funcoes";
import LoadingIndicator from "@/app/components/LoadingIndicator";

// Lazy loading dos componentes
export const LazyBanner = lazy(() => import("@/app/components/Banner"));
export const LazySliderCardBanner = lazy(() => import("@/app/components/SliderCardBanner"));
export const LazyCategorias = lazy(() => import("@/app/components/Categorias"));
export const LazySliderCardProdu = lazy(() => import("@/app/components/SliderCardProdu"));
export const LazyPromocaoRelampagoHome = lazy(() => import("@/app/components/PromocaoRelampagoHome"));

// Componente de Suspense otimizado
export const LazyComponent = memo(({ children }) => <Suspense fallback={<LoadingIndicator />}>{children}</Suspense>);

LazyComponent.displayName = "LazyComponent";

// Componente de loading otimizado
const Loading = memo(() => (
  <Box sx={{ width: { xs: "100vw", sm: "100vw", md: "80%" }, height: "auto", mx: "auto", my: 2 }}>
    {/* Banner Principal */}
    <Box sx={{ width: "100%", height: 400, mb: 4 }}>
      <Skeleton variant="rectangular" height="100%" animation="wave" sx={{ borderRadius: 1.5 }} />
    </Box>

    {/* Categorias */}
    <Box sx={{ width: "100%", height: 200, mb: 4 }}>
      <Skeleton variant="rectangular" height="100%" animation="wave" sx={{ borderRadius: 1.5 }} />
    </Box>

    {/* Slider de Produtos em Promoção */}
    <Box sx={{ width: "100%", mb: 4 }}>
      <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Skeleton variant="rectangular" height={300} animation="wave" sx={{ borderRadius: 1.5 }} />
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Banner Horizontal */}
    <Box sx={{ width: "100%", height: 200, mb: 4 }}>
      <Skeleton variant="rectangular" height="100%" animation="wave" />
    </Box>

    {/* Slider de Produtos */}
    <Box sx={{ width: "100%", mb: 4 }}>
      <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Skeleton variant="rectangular" height={300} animation="wave" />
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Banner Horizontal */}
    <Box sx={{ width: "100%", height: 200, mb: 4 }}>
      <Skeleton variant="rectangular" height="100%" animation="wave" />
    </Box>

    {/* Slider de Produtos em Promoção */}
    <Box sx={{ width: "100%", mb: 4 }}>
      <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Skeleton variant="rectangular" height={300} animation="wave" />
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Slider de Marcas */}
    <Box sx={{ width: "100%", mb: 4 }}>
      <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={4} sm={3} md={2} key={index}>
            <Skeleton variant="rectangular" height={100} animation="wave" />
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Banner de Departamentos */}
    <Box sx={{ width: "100%", height: 200, mb: 4 }}>
      <Skeleton variant="rectangular" height="100%" animation="wave" />
    </Box>

    {/* Banner Horizontal Final */}
    <Box sx={{ width: "100%", height: 200 }}>
      <Skeleton variant="rectangular" height="100%" animation="wave" />
    </Box>
  </Box>
));

Loading.displayName = "Loading";

// Componente que carrega os dados
async function HomeContent() {
  try {
    const [banners, bannersCards, bannersHorizontal, bannersDepartamentos, bannersCardsDescontos, homeStruct] =
      await Promise.all([
        getBanners(1, 10),
        getBanners(52, 10),
        getBanners(50, 10),
        getBanners(3, 10),
        getBanners(53, 10),
        getHomeEstrutura(),
      ]);

    const filteredBanners = banners.filter((banner) => banner.tipo === "1");
    const filteredBannersCards = bannersCards;
    const filteredBannersCardsDescontos = bannersCardsDescontos;
    const firstThreeHorizontalBanners = bannersHorizontal.slice(0, 1);
    const nextThreeHorizontalBanners = bannersHorizontal.slice(1, 2);
    const remainingHorizontalBanners = bannersHorizontal.slice(3);

    return (
      <>
        <LazyComponent>
          <LazyBanner banners={filteredBanners} arrows dots priority />
        </LazyComponent>

        <LazyComponent>
          <LazyCategorias />
        </LazyComponent>

        <LazyComponent>
          {/* <LazySliderCardBanner banners={filteredBannersCards} /> */}
          <LazyPromocaoRelampagoHome />
        </LazyComponent>

        {homeStruct[0] && (
          <LazyComponent>
            <LazySliderCardProdu
              title={homeStruct[0].titulo}
              produtos={homeStruct[0].produtos}
              link={homeStruct[0].link}
            />
          </LazyComponent>
        )}

        <LazyComponent>
          <LazyBanner banners={firstThreeHorizontalBanners} fgHorizontalSmall dots />
        </LazyComponent>

        {homeStruct[1] && (
          <LazyComponent>
            <LazySliderCardProdu
              title={homeStruct[1].titulo}
              produtos={homeStruct[1].produtos}
              link={homeStruct[1].link}
            />
          </LazyComponent>
        )}

        {homeStruct.slice(2, 3).map((section, index) => (
          <LazyComponent key={`section-${index + 2}`}>
            <LazySliderCardProdu
              title={section.titulo}
              produtos={section.produtos}
              link={section.link}
              fgBanner
              banners={section.banners || []}
              bannersLeft={section.bannersLeft || []}
            />
          </LazyComponent>
        ))}

        {homeStruct.slice(3, 4).map((section, index) => (
          <LazyComponent key={`section-${index + 2}`}>
            <LazySliderCardProdu
              title={section.titulo}
              produtos={section.produtos}
              link={section.link}
              fgBanner
              banners={section.banners || []}
              bannersLeft={section.bannersLeft || []}
            />
          </LazyComponent>
        ))}

        <LazyComponent>
          <LazySliderCardBanner banners={filteredBannersCardsDescontos} />
        </LazyComponent>

        {homeStruct.slice(4, 5).map((section, index) => (
          <LazyComponent key={`section-${index + 2}`}>
            <LazySliderCardProdu
              title={section.titulo}
              produtos={section.produtos}
              link={section.link}
              fgBanner
              banners={section.banners || []}
              bannersLeft={section.bannersLeft || []}
            />
          </LazyComponent>
        ))}

        <LazyComponent>
          <LazyBanner banners={nextThreeHorizontalBanners} fgHorizontalSmall dots />
        </LazyComponent>

        {homeStruct.slice(5, 7).map((section, index) => (
          <LazyComponent key={`section-${index + 2}`}>
            <LazySliderCardProdu
              title={section.titulo}
              produtos={section.produtos}
              link={section.link}
              fgBanner
              banners={section.banners || []}
              bannersLeft={section.bannersLeft || []}
            />
          </LazyComponent>
        ))}

        <LazyComponent>
          <LazyBanner banners={bannersDepartamentos} fgDepartamentos />
        </LazyComponent>

        {homeStruct.slice(7).map((section, index) => (
          <LazyComponent key={`section-${index + 2}`}>
            <LazySliderCardProdu
              title={section.titulo}
              produtos={section.produtos}
              link={section.link}
              fgBanner
              banners={section.banners || []}
            />
          </LazyComponent>
        ))}

        <LazyComponent>
          <LazyBanner banners={remainingHorizontalBanners} fgHorizontalSmall dots />
        </LazyComponent>
      </>
    );
  } catch (error) {
    console.error("Erro ao carregar dados da home:", error);
    return <Box>Erro ao carregar conteúdo</Box>;
  }
}

export const revalidate = 300;

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <HomeContent />
    </Suspense>
  );
}
