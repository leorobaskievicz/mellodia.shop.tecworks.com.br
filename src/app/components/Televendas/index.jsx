import React from "react";
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon } from "@mui/material";
import { Phone as PhoneIcon, WhatsApp as WhatsAppIcon, Check as CheckIcon } from "@mui/icons-material";
import Image from "next/image";

export default function Televendas() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Televendas
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box sx={{ mb: 2 }}>
              <Image src="/televendas.png" width={30} height={30} alt="Televendas" style={{ width: 30, height: "auto" }} />
            </Box>
            <Typography variant="body1" paragraph>
              Nossa equipe de televendas está pronta para atender você de segunda a sexta-feira, das 9h às 18h, e aos sábados, das 8h às 12h.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">(41) 2170-7272</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <WhatsAppIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1">(41) 98753-3683</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Vantagens do Televendas
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <Typography variant="body1">Atendimento personalizado</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <Typography variant="body1">Orientação sobre produtos</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <Typography variant="body1">Facilidade na compra</Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <Typography variant="body1">Entrega em todo o Brasil</Typography>
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
