"use client";

import { Box, Container, Skeleton, Grid, Typography } from "@mui/material";
import Vitrine from "@/app/components/Vitrine";

export default function BuscaLoading() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Breadcrumb Skeleton */}
          <Grid item xs={12}>
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          </Grid>

          {/* Resultados da Busca */}
          <Grid item xs={12}>
            <Box sx={{ mb: 4 }}>
              <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Grid>

          {/* Filtros e Produtos */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 2 }}>
              <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} variant="text" width="80%" height={20} sx={{ mb: 1 }} />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              {[...Array(12)].map((_, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box sx={{ p: 1 }}>
                    <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
