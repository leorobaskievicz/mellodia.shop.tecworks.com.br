import React from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Link, IconButton } from "@mui/material";
import { Phone as PhoneIcon, LocationOn as LocationIcon, WhatsApp as WhatsAppIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import Image from "next/image";

export default function Lojas() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Nossas Lojas
      </Typography>
      <Typography variant="body1" paragraph>
        {/*
          TODO: As lojas fisicas devem ser configuradas via database ou arquivo de configuracao.
          Estrutura sugerida:
          - Banco de dados com tabela de lojas contendo: nome, endereco, telefone, whatsapp, coordenadas do mapa
          - Ou arquivo JSON em /config/stores.json com a mesma estrutura
          - Buscar dinamicamente os dados e renderizar os cards abaixo
        */}
      </Typography>

      <Grid container spacing={4}>
        {/* As lojas serao carregadas dinamicamente do banco de dados ou arquivo de configuracao */}
      </Grid>
    </Container>
  );
}
