"use client";

import { Grid, Skeleton, Box } from "@mui/material";
import { Colors } from "@/app/style.constants";

export default function HeaderLoading() {
  return (
    <Grid
      container
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 998,
        p: {
          xs: 1,
          sm: 1,
          md: 2,
        },
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "#ffffff",
        mx: "auto",
        width: { xs: "100%", sm: "100%", md: "100%", lg: "90%", xl: "75%" },
      }}
    >
      {/* Logo Skeleton */}
      <Grid item xs={12} sm={12} md={2} sx={{ textAlign: { xs: "center", sm: "center" }, pr: 0 }}>
        <Skeleton variant="rectangular" width={110} height={50} />
      </Grid>

      {/* Search Bar Skeleton */}
      <Grid item xs={12} md={5} sx={{ mt: { xs: 1, md: 0 }, px: { xs: 0, md: 0 } }}>
        <Skeleton variant="rectangular" height={56} />
      </Grid>

      {/* Right Menu Skeleton */}
      <Grid
        item
        md={5}
        sx={{
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          gap: 1,
        }}
      >
        {/* Location Button Skeleton */}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rectangular" height={40} />
        </Box>

        {/* Login Button Skeleton */}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rectangular" height={40} />
        </Box>

        {/* Cart Button Skeleton */}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="rectangular" height={40} />
        </Box>
      </Grid>
    </Grid>
  );
}
