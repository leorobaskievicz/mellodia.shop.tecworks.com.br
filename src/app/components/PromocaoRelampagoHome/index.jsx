"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Grid, Button, CircularProgress } from "@mui/material";
import { fetchPromocaoVigente, fetchProdutosRotacao, fetchTempoRestante } from "@/app/lib/promocaoRelampago";
import { styleContainer, styleContainerBody } from "./style";
import PromocaoRelampagoTitle from "@/app/components/PromocaoRelampagoTitle";
import PromocaoRelampagoCountdown from "@/app/components/PromocaoRelampagoCountdown";
import SliderCardProdu from "@/app/components/SliderCardProdu";

export const LazyComponent = ({ children }) => <Suspense fallback={null}>{children}</Suspense>;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PromocaoRelampagoHome() {
  const DEFAULT_MIN = 180;

  const [promo, setPromo] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guarde o intervalo em MINUTOS para a API
  const [intervaloMin, setIntervaloMin] = useState(DEFAULT_MIN);
  const [tamanho, setTamanho] = useState(50);

  // Use segundos só para a contagem regressiva
  const intervaloSeg = intervaloMin * 60;
  const [remaining, setRemaining] = useState(intervaloSeg);

  // Função para sincronizar o tempo restante com o servidor
  const syncTempoRestante = useCallback(async () => {
    if (!promo?.id) return;

    try {
      const tempoInfo = await fetchTempoRestante(promo.id);
      const segundosRestantes = tempoInfo.segundos_restantes || 0;

      // Atualiza o tempo restante com o valor real do servidor
      setRemaining(segundosRestantes);

      console.log(`Tempo sincronizado: ${segundosRestantes}s restantes`);
    } catch (e) {
      console.warn("Erro ao sincronizar tempo restante:", e);
      // Em caso de erro, mantém o countdown local
    }
  }, [promo?.id]);

  // Carrega promoção vigente
  useEffect(() => {
    let aborted = false;

    const loadPromo = async () => {
      try {
        setLoading(true);
        setError(null);

        const p = await fetchPromocaoVigente();
        if (aborted || !p) return;

        setPromo(p);
        setIntervaloMin(Number(p?.intervalo_exibicao_min ?? DEFAULT_MIN));
        setTamanho(Number(p?.qtde_por_lote ?? 50));
      } catch (e) {
        console.error("Erro carregando promoção", e);
        setError("Erro ao carregar promoção");
      } finally {
        setLoading(false);
      }
    };

    loadPromo();

    return () => {
      aborted = true;
    };
  }, []);

  // Busca/rota o lote de produtos E sincroniza o tempo
  const refresh = useCallback(
    async (forceRefresh = false) => {
      if (!promo?.id) return;

      try {
        setLoading(true);
        setError(null);

        // Busca produtos e tempo restante em paralelo
        const [items, tempoInfo] = await Promise.all([
          fetchProdutosRotacao(promo.id, intervaloMin, tamanho, forceRefresh),
          fetchTempoRestante(promo.id).catch((e) => {
            console.warn("Erro ao buscar tempo restante:", e);
            return { segundos_restantes: intervaloSeg };
          }),
        ]);

        setProdutos(Array.isArray(items) ? items : []);

        // Só atualiza o tempo se for uma diferença significativa ou se for forceRefresh
        const segundosRestantes = tempoInfo.segundos_restantes || intervaloSeg;
        const diferenca = Math.abs(remaining - segundosRestantes);

        if (forceRefresh || diferenca > 30) {
          console.log(`Refresh: atualizando tempo ${remaining}s -> ${segundosRestantes}s (diferença: ${diferenca}s)`);
          setRemaining(segundosRestantes);
        } else {
          console.log(`Refresh: mantendo tempo atual ${remaining}s (diferença: ${diferenca}s)`);
        }

        console.log(`Produtos atualizados. Próxima rotação em ${segundosRestantes}s`);
      } catch (e) {
        console.error("Erro carregando produtos", e);
        setError("Erro ao carregar produtos");
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    },
    [promo?.id, intervaloMin, tamanho, intervaloSeg, remaining]
  );

  // Busca inicial quando tivermos promo/params
  useEffect(() => {
    if (promo?.id) {
      refresh();
    }
  }, [promo?.id, refresh]);

  /*
  // Sincronização periódica do tempo (a cada 30 segundos)
  useEffect(() => {
    if (!promo?.id) return;

    const syncInterval = setInterval(() => {
      syncTempoRestante();
    }, 30000); // 30 segundos

    return () => clearInterval(syncInterval);
  }, [promo?.id, syncTempoRestante]);
  */

  // Callback para quando o countdown chegar a zero
  const onCountdownFinish = useCallback(() => {
    console.log("Countdown finalizado - atualizando produtos...");
    refresh(); // Não força refresh pois o cache já deve ter expirado
  }, [refresh]);

  // Callback para refresh manual (força atualização do cache)
  const onManualRefresh = useCallback(() => {
    console.log("Refresh manual solicitado...");
    refresh(true); // Força refresh do cache
  }, [refresh]);

  // Loading state
  if (loading && !promo) {
    return (
      <Grid container sx={styleContainer}>
        <Grid container xs={12} sx={{ ...styleContainerBody, justifyContent: "center", alignItems: "center", textAlign: "center", p: 4 }}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  // Error state
  if (error && !promo) {
    return (
      <Grid container sx={styleContainer}>
        <Grid container xs={12} sx={{ ...styleContainerBody, textAlign: "center", p: 4 }}>
          {error}
        </Grid>
      </Grid>
    );
  }

  // No promo
  if (!promo) return null;

  // No products
  if (produtos.length === 0 && !loading) return null;

  return (
    <Grid container sx={styleContainer}>
      <Grid container xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, p: 0, m: "0 auto" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            ...styleContainerBody,
            bgcolor: "primary.main",
            borderRadius: 2,
            p: 1,
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.9,
            },
          }}
          onClick={() => {
            window.location.href = "/promocao-relampago";
          }}
        >
          <PromocaoRelampagoTitle titulo={promo.titulo} subtitulo="Ver mais" />
        </Grid>

        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            ...styleContainerBody,
            p: 0,
            m: "10px auto 0px auto",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.9,
            },
          }}
          onClick={() => {
            window.location.href = "/promocao-relampago";
          }}
        >
          <LazyComponent>
            <PromocaoRelampagoCountdown
              intervaloSeg={intervaloSeg} // segundos para o timer
              remaining={remaining}
              setRemaining={setRemaining}
              refresh={onCountdownFinish} // callback quando zerar
              onManualRefresh={onManualRefresh} // callback para refresh manual
              loading={loading} // passa estado de loading
            />
          </LazyComponent>
        </Grid>

        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{
            ...styleContainerBody,
            p: 0,
            m: "-10px auto 0px auto",
            alignItems: "center",
            justifyContent: "center",
            mt: 0,
          }}
        >
          <LazyComponent>
            <SliderCardProdu
              title=""
              produtos={produtos}
              link="/promocao-relampago"
              banners={[]}
              bannersLeft={[]}
              fgPromo={true}
              loading={loading} // passa loading para o slider se necessário
              intervaloSeg={intervaloSeg} // segundos para o timer
              remaining={remaining}
              setRemaining={setRemaining}
            />
          </LazyComponent>
        </Grid>
      </Grid>
    </Grid>
  );
}
