"use client";

import { Box, Container, Skeleton, Grid } from "@mui/material";
import ProdutoClient from "@/app/components/ProdutoClient";

export default function SlugLoading() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Imagem Principal Skeleton */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
          </Grid>

          {/* Detalhes do Produto Skeleton */}
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" width="80%" height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
          </Grid>

          {/* Características Skeleton */}
          <Grid item xs={12}>
            <Skeleton variant="text" width="30%" height={30} sx={{ mb: 2 }} />
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
