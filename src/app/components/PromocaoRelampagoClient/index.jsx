"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchProdutosRotacao } from "@/app/lib/promocaoRelampago";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import CardProduPromo from "@/app/components/CardProduPromo";
import PromocaoRelampagoCountdown from "@/app/components/PromocaoRelampagoCountdown";
import { styleContainerBody } from "./style";
import { LazyComponent } from "@/app/components/PromocaoRelampagoHome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function PromoRelampagoClient({
  promo,
  initialProdutos,
  intervaloSeg,
  remaining,
  setRemaining,
  data,
  fgShowCountdown,
}) {
  const [produtos, setProdutos] = useState(Array.isArray(initialProdutos) ? initialProdutos : []);
  const tamanho = Number(promo.qtde_por_lote || 50);

  const refresh = useCallback(async () => {
    const items = await fetchProdutosRotacao(promo.id, promo.intervalo_exibicao_min, tamanho);
    if (Array.isArray(items) && items.length) setProdutos(items);
  }, [promo.id, promo.intervalo_exibicao_min, tamanho]);

  return (
    <>
      {produtos.length === 0 && (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="subtitle2" sx={{ mb: 3 }}>
            Nenhum produto encontrado
          </Typography>
        </Box>
      )}

      {fgShowCountdown && (
        <Grid container xs={12} sx={{ ...styleContainerBody, p: 0, m: "0 auto" }}>
          <LazyComponent>
            <PromocaoRelampagoCountdown
              intervaloSeg={intervaloSeg} // segundos para o timer
              remaining={remaining}
              setRemaining={setRemaining}
              refresh={refresh} // callback quando zerar
              onManualRefresh={refresh} // callback para refresh manual
              loading={false} // passa estado de loading
            />
          </LazyComponent>
        </Grid>
      )}

      <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
        {produtos.map((row, idx) => (
          <Grid item xs={6} sm={6} md={4} lg={3} xl={3} sx={{ p: 0 }}>
            <CardProduPromo
              produ={row}
              idx={`produto-${row.CODIGO}`}
              key={`produto-${row.CODIGO}`}
              algoliaReturn={null}
              indexPage={0}
              intervaloSeg={intervaloSeg}
              remaining={remaining}
              setRemaining={setRemaining}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
