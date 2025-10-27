"use client";

import { Grid, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function MiniHeader({ children }) {
  return (
    <Paper elevation={4}>
      <Grid
        container
        sx={{
          p: {
            xs: 1,
            sm: 1,
            md: 2,
          },
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "primary.main",
          mx: "auto",
          width: { xs: "100%", sm: "100%", md: "100%", lg: "100%", xl: "100%" },
          position: "relative",
        }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{ textAlign: { xs: "center", sm: "center" }, pr: 3, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
        >
          <Image
            src="/clearsale-logo.png"
            alt="Site integrado a ClearSale"
            width={100}
            height={27.5}
            style={{
              filter: "brightness(0) invert(1)",
              opacity: 0.9,
              mixBlendMode: "screen",
            }}
          />
          <Link href="/" target="_self" style={{ textDecoration: "none" }}>
            <Image width={110} height={40} src="/logo-branca.png" alt="Logo" className="lazyload" />
          </Link>
          <Image
            src="/google.png"
            alt="Site seguro"
            width={100}
            height={30}
            style={{
              filter: "brightness(0) invert(1)",
              opacity: 0.9,
              mixBlendMode: "screen",
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
