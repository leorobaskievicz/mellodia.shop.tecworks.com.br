"use client";

import { useState } from "react";
import { Grid, Box, Card, CardMedia, CardContent, Typography, CardActions, Button } from "@mui/material";
import {
  styleContainer,
  styleContainerContent,
  styleContainerBody,
  styleContainerCard,
  styleContainerCardTitle,
  styleContainerCardPrice,
  styleContainerCardPricePor,
  styleContainerCardPriceDe,
  styleContainerContentMsg,
} from "./style";

export default function CardMarca({ children, fgBanner }) {
  const produ = {
    img: "https://mellodia.shop.cdn.tecworks.com.br/banner-336-1-2025-02-03T11:56:04-03:00.png",
    nome: "Produto Teste",
    preco: 10.5,
  };

  return (
    <Box sx={styleContainerContent}>
      <Card sx={styleContainerCard}>
        <CardMedia component="img" height="200" image={produ.img} alt={produ.nome} sx={{ objectFit: "cover" }} />
      </Card>
      <Typography variant="h7" sx={styleContainerContentMsg}>
        Ganhe ÓLEO DE BANHO
      </Typography>
    </Box>
  );
}
