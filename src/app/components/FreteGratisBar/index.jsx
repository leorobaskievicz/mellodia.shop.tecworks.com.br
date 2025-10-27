"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, LinearProgress, Typography } from "@mui/material";
import { useApp } from "@/app/context/AppContext";

export default function FreteGratisBar(props) {
  const { state: stateApp, dispatch: dispatchApp } = useApp();

  const getCartTotal = () => {
    let total = 0.0;

    for (let i = 0; i < stateApp.carrinho.length; i++) {
      let preco = stateApp.carrinho[i].PRECO;

      if (Number(stateApp.carrinho[i].PREPRO) > 0 && Number(stateApp.carrinho[i].PREPRO) < Number(stateApp.carrinho[i].PRECO)) {
        preco = Number(stateApp.carrinho[i].PREPRO);
      }

      total += preco * stateApp.carrinho[i].qtd;
    }

    return total;
  };

  const FRETE_GRATIS_MINIMO = 99.0;
  const subtotal = getCartTotal(); // ← esse valor viria do seu carrinho

  const progresso = Math.min((subtotal / FRETE_GRATIS_MINIMO) * 100, 100);
  const falta = (FRETE_GRATIS_MINIMO - subtotal).toFixed(2);
  const atingiu = subtotal >= FRETE_GRATIS_MINIMO;

  return (
    <Box 
      elevation={3}
      sx={{ 
        my: 2,
        px: 3, 
        pb: 2, 
        borderLeftWidth: 5, 
        borderLeftColor: "success.main", 
        borderLeftStyle: "solid",
        borderRadius: 1, 
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="success.main" sx={{ fontWeight: 700, fontSize: 18, m: 0 }}>
        Frete Grátis
      </Typography>

      <Typography variant="body2" gutterBottom sx={{ fontWeight: 500, fontSize: 16, m: 0 }}>
        {atingiu
          ? "Parabéns! Você ganhou frete grátis! 🎉"
          : `Faltam R$ ${falta.replace('.', ',')} para ganhar frete grátis!`}
      </Typography>

      <LinearProgress
        animation={true}
        color="success"
        variant="determinate"
        value={progresso}
        sx={{
          height: 15,
          borderRadius: 5,
          mt: 1,
        }}
      />
    </Box>
  );
}
