"use client";
import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import Image from "next/image";

export default function OrderDetailsItem({ item }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          {item.produtoDados?.FOTOS && item.produtoDados?.FOTOS.length > 0 && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100px",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              <Image
                src={`${String(item.produtoDados.FOTOS[0].link).indexOf("https://dricor.cdn.tecworks") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${
                  item.produtoDados.FOTOS[0].link
                }`}
                alt={item.produtoDados.NOME}
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} sm={9}>
          <Typography variant="subtitle1" gutterBottom>
            {item.produtoDados?.NOME}
            {item.ATRIBUTO_VALOR && String(item.ATRIBUTO_VALOR).trim() !== "" && (
              <Typography component="span" variant="body2" color="text.secondary">
                {" "}
                - {item.ATRIBUTO_VALOR}
              </Typography>
            )}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Quantidade
              </Typography>
              <Typography variant="body2">{item.QTD}</Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Preço Unitário
              </Typography>
              <Typography variant="body2">R$ {item.VALOR.toFixed(2).replace(".", ",")}</Typography>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2">R$ {(item.QTD * item.VALOR).toFixed(2).replace(".", ",")}</Typography>
            </Grid>

            {item.DESCONTO > 0 && (
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Desconto
                </Typography>
                <Typography variant="body2" color="error">
                  - R$ {item.DESCONTO.toFixed(2).replace(".", ",")}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ my: 2 }} />
    </Box>
  );
}
