"use client";

import { Typography } from "@mui/material";
import Countdown from "@/app/components/Countdown";
import { useEffect, useMemo } from "react";

export default function PromocaoRelampagoCountdown({
  intervaloSeg,
  remaining,
  setRemaining,
  refresh,
  onManualRefresh,
  loading,
}) {
  // Adicione um botão de refresh manual se desejar
  const handleManualRefresh = () => {
    if (onManualRefresh && !loading) {
      onManualRefresh();
    }
  };

  // contador + rotação automática
  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          // vira o lote aqui
          refresh();
          return intervaloSeg;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [intervaloSeg, refresh]);

  const hhmmss = useMemo(() => {
    const d = Math.floor(remaining / 86400)
      .toString()
      .padStart(2, "0");
    const h = Math.floor(remaining / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((remaining % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(remaining % 60)
      .toString()
      .padStart(2, "0");
    return `${d}d ${h}:${m}:${s}`;
  }, [remaining]);

  return (
    <>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: "600",
          textAlign: "right",
          fontSize: "2.0rem",
          color: "black.400",
          mr: 2,
          mb: 3,
        }}
      >
        Termina em:
      </Typography>
      <Countdown data={new Date(Date.now() + remaining * 1000)} />
    </>
  );
}
