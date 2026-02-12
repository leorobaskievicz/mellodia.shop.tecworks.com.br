"use client";

import { useState } from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import { styleContainer, styleContainerBody, styleContainerButton } from "./style";

export default function Categorias({ children }) {
  const btns = [
    { title: "LINHA PROFISSIONAL", link: "/departamento/profissionais" },
    { title: "SUPER PROMOÇÕES", link: "/promocoes" },
    { title: "BELEZA", link: "/" },
    { title: "DEPILATORIOS", link: "/" },
    { title: "MASCULINO", link: "/" },
  ];

  return (
    <Grid container sx={styleContainer}>
      <Grid xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBody}>
        {btns.map((btn, index) => (
          <Button
            variant="outlined"
            color="primary"
            sx={{
              ...styleContainerButton,
              borderRadius: "20px",
            }}
            key={`categoria-${index}`}
            href={btn.link}
          >
            {btn.title}
          </Button>
        ))}
      </Grid>
    </Grid>
  );
}
