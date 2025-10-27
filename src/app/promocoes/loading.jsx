"use client";

import { Box, Container, Skeleton, Grid, Avatar } from "@mui/material";
import Vitrine from "@/app/components/Vitrine";

export default function MarcaLoading() {
  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Breadcrumb Skeleton */}
          <Grid item xs={12}>
            <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
          </Grid>

          {/* Cabeçalho da Marca */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Skeleton variant="circular" width={80} height={80} sx={{ mr: 2 }} />
              <Box>
                <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
            </Box>
          </Grid>

          {/* Produtos Skeleton */}
          <Grid item xs={12}>
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
