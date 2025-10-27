// app/promocao-relampago/page.jsx
import { fetchPromocaoVigente, fetchProdutosRotacao, fetchTempoRestante } from "@/app/lib/promocaoRelampago";
import PromoRelampagoClient from "@/app/components/PromocaoRelampagoClient";
import ResponsiveBreadcrumb from "@/app/components/ResponsiveBreadcrumb";
import { Typography, Grid } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { Suspense } from "react";
import { styleContainer, styleContainerBody } from "./style";
import PromocaoRelampagoTitle from "@/app/components/PromocaoRelampagoTitle";
import PromocaoRelampagoCountdown from "@/app/components/PromocaoRelampagoCountdown";

export const LazyComponent = ({ children }) => <Suspense fallback={<div>Carregando...</div>}>{children}</Suspense>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Adicione metadata para SEO
export const metadata = {
  title: "Promoção Relâmpago - Ofertas Especiais",
  description: "Aproveite nossas ofertas relâmpago com produtos em rotação e preços especiais!",
};

export default async function PromocaoRelampagoPage() {
  let promo, produtos, tempoInfo, intervalo, remaining;

  try {
    // Busca a promoção vigente primeiro
    promo = await fetchPromocaoVigente();
  } catch (error) {
    console.error("Erro ao buscar promoção vigente:", error);
    return (
      <Grid container sx={styleContainer}>
        <Grid item xs={12} sx={{ ...styleContainerBody, textAlign: "center", p: 4 }}>
          <WarningIcon sx={{ fontSize: "4.0rem", color: "error.main", mb: 2 }} />
          <Typography variant="h4" color="error" gutterBottom>
            Erro ao carregar promoção
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tente recarregar a página em alguns instantes.
          </Typography>
        </Grid>
      </Grid>
    );
  }

  // Se não há promoção ativa
  if (!promo) {
    return (
      <Grid container sx={styleContainer}>
        <Grid item xs={12} sx={{ ...styleContainerBody, mt: 1, mb: 1, py: 1 }}>
          <ResponsiveBreadcrumb
            paths={[
              { label: "Início", href: "/" },
              { label: "Promoção Relâmpago", href: `/promocao-relampago` },
            ]}
          />
        </Grid>
        <Grid container xs={12} sx={{ ...styleContainerBody, p: 0, m: "0 auto" }}>
          <Grid item xs={12} sx={{ ...styleContainerBody, textAlign: "center", py: 8 }}>
            <WarningIcon sx={{ fontSize: "4.0rem", fontWeight: "600", color: "grey.500", mb: 2 }} />
            <Typography variant="h3" sx={{ textAlign: "center", fontWeight: "600", fontSize: "2rem", mb: 2 }}>
              Nenhuma promoção ativa no momento
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fique atento! Em breve teremos novas ofertas relâmpago para você.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  try {
    intervalo = Number(promo.intervalo_exibicao_min || 120);
    const tamanho = Number(promo.qtde_por_lote || 50);

    // Busca produtos e tempo restante em paralelo
    [produtos, tempoInfo] = await Promise.all([
      fetchProdutosRotacao(promo.id, intervalo, tamanho),
      fetchTempoRestante(promo.id).catch((error) => {
        console.warn("Erro ao buscar tempo restante:", error);
        return null;
      }),
    ]);

    remaining = tempoInfo.segundos_restantes || 0;
  } catch (error) {
    console.error("Erro ao buscar produtos da promoção:", error);
    return (
      <Grid container sx={styleContainer}>
        <Grid item xs={12} sx={{ ...styleContainerBody, mt: 1, mb: 1, py: 1 }}>
          <ResponsiveBreadcrumb
            paths={[
              { label: "Início", href: "/" },
              { label: "Promoção Relâmpago", href: `/promocao-relampago` },
            ]}
          />
        </Grid>
        <Grid container xs={12} sx={{ ...styleContainerBody, p: 0, m: "0 auto" }}>
          <Grid item xs={12} sx={{ ...styleContainerBody, textAlign: "center", py: 8 }}>
            <WarningIcon sx={{ fontSize: "4.0rem", color: "error.main", mb: 2 }} />
            <Typography variant="h4" color="error" gutterBottom>
              Erro ao carregar produtos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Não foi possível carregar os produtos da promoção. Tente novamente.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  // Se não há produtos disponíveis
  if (!produtos || produtos.length === 0) {
    return (
      <Grid container sx={styleContainer}>
        <Grid item xs={12} sx={{ ...styleContainerBody, mt: 1, mb: 1, py: 1 }}>
          <ResponsiveBreadcrumb
            paths={[
              { label: "Início", href: "/" },
              { label: "Promoção Relâmpago", href: `/promocao-relampago` },
            ]}
          />
        </Grid>
        <Grid container xs={12} sx={{ ...styleContainerBody, p: 0, m: "0 auto" }}>
          <Grid item xs={12} sx={{ ...styleContainerBody, textAlign: "center", py: 8 }}>
            <WarningIcon sx={{ fontSize: "4.0rem", fontWeight: "600", color: "warning.main", mb: 2 }} />
            <Typography variant="h4" sx={{ textAlign: "center", fontWeight: "600", fontSize: "2rem", mb: 2 }}>
              {promo.titulo}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum produto disponível no momento
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Os produtos estão sendo atualizados. Aguarde alguns instantes.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  // Renderização principal com produtos
  return (
    <Grid container sx={styleContainer}>
      <Grid item xs={12} sx={{ ...styleContainerBody, mt: 1, mb: 1, py: 1 }}>
        <ResponsiveBreadcrumb
          paths={[
            { label: "Início", href: "/" },
            { label: "Promoção Relâmpago", href: `/promocao-relampago` },
          ]}
        />
      </Grid>

      <Grid container xs={12} sx={{ ...styleContainerBody, p: 0, m: "0 auto" }}>
        <Grid
          item
          xs={12}
          sx={{
            ...styleContainerBody,
            bgcolor: "primary.main",
            borderRadius: 2,
            p: 1,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            mb: 2, // Adiciona margem inferior
          }}
        >
          <PromocaoRelampagoTitle titulo={promo.titulo} />
        </Grid>

        <Grid container xs={12} sx={styleContainerBody}>
          <LazyComponent>
            <PromoRelampagoClient
              promo={promo}
              initialProdutos={produtos}
              initialTempoInfo={tempoInfo}
              intervaloSeg={intervalo * 60}
              remaining={remaining}
              fgShowCountdown={true}
            />
          </LazyComponent>
        </Grid>
      </Grid>
    </Grid>
  );
}
