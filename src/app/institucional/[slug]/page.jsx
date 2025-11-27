"use client";
import { usePathname, redirect } from "next/navigation";
import React, { useState } from "react";
import { Box, Container, Grid, Typography, List, ListItem, ListItemText, Link, Paper, useMediaQuery, useTheme } from "@mui/material";
import { WhatsApp as WhatsAppIcon, Email as EmailIcon, Phone as PhoneIcon, ArrowDownward as ArrowDownIcon } from "@mui/icons-material";
import Sobre from "@/app/components/Sobre";
import Lojas from "@/app/components/Lojas";
import Atendimento from "@/app/components/Atendimento";
import TrabalheConosco from "@/app/components/TrabalheConosco";

export default function Institucional() {
  const pathname = usePathname();

  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    mainPage: pathname === "/institucional/sobre" || pathname === "/institucional",
  });

  if (state.redirect) {
    redirect(state.redirect);
    return null;
  }

  const menuItems = [
    { href: "sobre", label: "Sobre a Dricor" },
    { href: "lojas", label: "Nossas Lojas" },
    // { href: "saloes", label: "Nosso Salão" },
    // { href: "televendas", label: "Televendas" },
    { href: "atendimento", label: "Atendimento" },
    { href: "trabalhe-conosco", label: "Trabalhe conosco" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} lg={3}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <ArrowDownIcon sx={{ mr: 1 }} />
              Institucional
            </Typography>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                  <Link
                    href={item.href}
                    sx={{
                      width: "100%",
                      textDecoration: "none",
                      color: "text.primary",
                      "&:hover": {
                        color: "primary.main",
                      },
                      ...(pathname === `/institucional/${item.href}` && {
                        color: "primary.main",
                        fontWeight: "bold",
                      }),
                    }}
                  >
                    <ListItemText primary={item.label} />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Canais de atendimento
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Link
                href="mailto:vendas@dricor.com.br"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "text.primary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <EmailIcon sx={{ mr: 1 }} />
                Via E-mail
              </Link>
              <Link
                href="https://api.whatsapp.com/send?l=pt&phone=+5541988026971&text=Ol%C3%A1.%20Estou%20fazendo%20contato%20atrav%C3%A9s%20do%20site%20www.dricor.com.br"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "text.primary",
                  "&:hover": { color: "primary.main" },
                }}
              >
                <WhatsAppIcon sx={{ mr: 1 }} />
                Via WhatsApp
              </Link>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Fale Conosco
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                (41) 9 8802-6971
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Segunda à sexta das 9h às 18:00h
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={9}>
          {state.mainPage ? (
            <Sobre />
          ) : pathname === "/institucional/lojas" ? (
            <Lojas />
          ) : // ) : pathname === "/institucional/saloes" ? (
          //   <Saloes />
          // ) : pathname === "/institucional/televendas" ? (
          //   <Televendas />
          pathname === "/institucional/atendimento" ? (
            <Atendimento />
          ) : pathname === "/institucional/trabalhe-conosco" ? (
            <TrabalheConosco />
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
}
