"use client";

import { useState, useEffect } from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import { styleContainer, styleContainerBody, styleContainerButton } from "./style";

export default function Categorias({ children }) {
  const defaultBtns = [
    { title: "LINHA PROFISSIONAL", link: "/departamento/profissionais" },
    { title: "SUPER PROMOÇÕES", link: "/promocoes" },
    { title: "BELEZA", link: "/" },
    { title: "DEPILATORIOS", link: "/" },
    { title: "MASCULINO", link: "/" },
  ];

  const [btns, setBtns] = useState(defaultBtns);

  useEffect(() => {
    // TODO: Substituir pela URL real da API quando disponível
    const API_URL = null;

    if (!API_URL) return;

    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBtns(data);
        }
      })
      .catch(() => {
        // Falhou — mantém os btns padrão
      });
  }, []);

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
