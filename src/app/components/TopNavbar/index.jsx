"use client";

import { Grid, Typography, Button, Box } from "@mui/material";
import { Favorite, ShoppingBag, Accessibility, WhatsApp } from "@mui/icons-material";
import { styleContainer, styleContainerBody, styleContainerButton, styleContainerButtonIcon } from "./style";
import Link from "next/link";

export default function TopNavbar({ children }) {
  return (
    <Grid container sx={styleContainer}>
      <Grid xs={12} sm={10} md={10} lg={9} xl={6} sx={styleContainerBody}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
          <Button type="text" color="dark" size="small" sx={{ ...styleContainerButton, display: { xs: "none", md: "flex" } }}>
            {/* <Accessibility style={styleContainerButtonIcon} /> */}
            {/* Acessibilidade */}
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
          <Button type="text" color="dark" size="small" sx={{ ...styleContainerButton, display: { xs: "block", md: "flex" } }} component={Link} href="/central-de-relacionamento">
            <WhatsApp style={styleContainerButtonIcon} />
            Precisa de ajuda?
          </Button>

          <Typography sx={{ px: 3 }}>|</Typography>

          <Button type="text" color="dark" size="small" sx={{ ...styleContainerButton, display: { xs: "block", md: "flex" } }} component={Link} href="/consulta-pedidos">
            <ShoppingBag style={styleContainerButtonIcon} />
            Meus Pedidos
          </Button>

          <Button type="text" color="dark" size="small" sx={{ ...styleContainerButton, display: { xs: "block", md: "flex" } }} component={Link} href="/meu-cadastro#grid-favoritos">
            <Favorite style={styleContainerButtonIcon} />
            Favoritos
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
