import React from "react";
import { Box, Container, Typography, Link, Paper, Grid } from "@mui/material";
import { Phone as PhoneIcon, LocationOn as LocationIcon, WhatsApp as WhatsAppIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import Image from "next/image";

export default function Saloes() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Nosso Salão
      </Typography>
      <Typography variant="body1" paragraph>
        Nosso salão esta localizado juntamente com as lojas Divas para facilitar aos nossos clientes e oferecer soluções personalizadas de serviços de beleza.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Image src="/nossos-saloes.png" width={1000} height={100} alt="Banner Nossas Saloes" style={{ width: "100%", height: "auto" }} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2}>
            <Box sx={{ height: 300 }}>
              <iframe
                width="100%"
                height="100%"
                src="https://maps.google.com/maps?q=Rua%20XV%20de%20Novembro%2C%20171%20-%20Centro%2C%20Curitiba%20-%20PR%2C%2080020-310&t=&z=19&ie=UTF8&iwloc=&output=embed"
                style={{ border: 0 }}
                allowFullScreen
              />
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Salão
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <WhatsAppIcon sx={{ mr: 1 }} />
                <Link href="https://wa.me/5541987527105" target="_blank" rel="noopener noreferrer">
                  41 98752-7105
                </Link>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Link href="tel:+554130778065">41 3077-8065</Link>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography>End.: XV de Novembro, 155, CEP - 80020310</Typography>
              </Box>
              <Link
                href="https://www.google.com/maps/place/Diva+Cosm%C3%A9ticos/@-25.430662,-49.270552,17z/data=!3m1!4b1!4m5!3m4!1s0x94dcfb38fbe7f17f:0xb8120e528a3799ce!8m2!3d-25.430662!4d-49.270552"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "flex", alignItems: "center" }}
              >
                Ver no mapa
                <ArrowForwardIcon sx={{ ml: 1 }} />
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
