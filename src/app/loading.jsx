"use client";

import { Box, Skeleton, Grid } from "@mui/material";
import HeaderLoading from "./components/Header/loading";
import NavbarLoading from "./components/Navbar/loading";

export default function Loading() {
  return (
    <>
      <Box sx={{ width: { xs: "100vw", sm: "100vw", md: "80%" }, height: "auto", mx: "auto", my: 2 }}>
        {/* Banner Principal */}
        <Box sx={{ width: "100%", height: 400, mb: 4 }}>
          <Skeleton variant="rectangular" height="100%" animation="wave" sx={{ borderRadius: 1.5 }} />
        </Box>

        {/* Categorias */}
        <Box sx={{ width: "100%", height: 200, mb: 4 }}>
          <Skeleton variant="rectangular" height="100%" animation="wave" sx={{ borderRadius: 1.5 }} />
        </Box>

        {/* Slider de Produtos em Promoção */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} animation="wave" sx={{ borderRadius: 1.5 }} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Banner Horizontal */}
        <Box sx={{ width: "100%", height: 200, mb: 4 }}>
          <Skeleton variant="rectangular" height="100%" animation="wave" />
        </Box>

        {/* Slider de Produtos */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} animation="wave" />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Banner Horizontal */}
        <Box sx={{ width: "100%", height: 200, mb: 4 }}>
          <Skeleton variant="rectangular" height="100%" animation="wave" />
        </Box>

        {/* Slider de Produtos em Promoção */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Skeleton variant="rectangular" height={300} animation="wave" />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Slider de Marcas */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 2 }} animation="wave" />
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={4} sm={3} md={2} key={index}>
                <Skeleton variant="rectangular" height={100} animation="wave" />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Banner de Departamentos */}
        <Box sx={{ width: "100%", height: 200, mb: 4 }}>
          <Skeleton variant="rectangular" height="100%" animation="wave" />
        </Box>

        {/* Banner Horizontal Final */}
        <Box sx={{ width: "100%", height: 200 }}>
          <Skeleton variant="rectangular" height="100%" animation="wave" />
        </Box>
      </Box>
    </>
  );
}
