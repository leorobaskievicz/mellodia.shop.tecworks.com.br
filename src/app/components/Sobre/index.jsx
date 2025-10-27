import React from "react";
import { Box, Container, Typography, Grid, Paper, Link, List, ListItem, ListItemIcon } from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import Image from "next/image";

export default function Sobre() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Sobre a Diva Cosméticos
      </Typography>
      <Typography variant="body1" paragraph>
        A Diva é uma rede de lojas de cosméticos e salões de beleza que iniciou sua história em 2001. Estamos localizados no centro de Curitiba, Paraná, onde trabalhamos com uma
        diversidade de mais de 100 marcas nacionais e internacionais de produtos e com os melhores preços do mercado.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Image src="/sobre-diva.png" width={1000} height={100} alt="Banner Sobre a Diva" style={{ width: "100%", height: "auto" }} />
      </Box>

      <Typography variant="body1" paragraph>
        Para atender as necessidades das consumidoras em relação aos produtos de beleza, trazemos marcas de qualidade e oferecemos um modelo de negócio em que as lojas e os salões
        estão sempre localizados no mesmo lugar. Nós temos como intuito de nossa rede atender a todas as pessoas com confiança, preços dignos e o mais importante atendê-las
        personalizadamente e respondendo a questões particulares em todas nossas redes socias e por WhatsApp.
      </Typography>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box sx={{ mb: 2 }}>
              <Image src="/missao.png" width={500} height={100} alt="Nossa Missão" style={{ width: "100%", height: "auto" }} />
            </Box>
            <Typography variant="body1">
              A nossa missão é transformar a beleza das pessoas. Levando aos nossos clientes as melhores marcas e serviços, com um atendimento de qualidade e personalizado.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box sx={{ mb: 2 }}>
              <Image src="/visao.png" width={500} height={100} alt="Nossa Visão" style={{ width: "100%", height: "auto" }} />
            </Box>
            <Typography variant="body1">Ser uma empresa reconhecida pela qualidade dos produtos e serviços oferecidos.</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Image src="/nossos-valores.png" width={500} height={100} alt="Nossos Valores" style={{ width: "100%", height: "auto" }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", mt: 2 }}>
              <StarIcon sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Valores
                </Typography>
                <List>
                  <ListItem>Compromisso</ListItem>
                  <ListItem>Satisfação</ListItem>
                  <ListItem>Ética</ListItem>
                  <ListItem>Transparência</ListItem>
                  <ListItem>Respeito</ListItem>
                </List>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Link href="/institucional/lojas" sx={{ textDecoration: "none" }}>
            <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
              <Image src="/conheca-lojas.png" width={500} height={500} alt="Nossas Lojas" style={{ width: "100%", height: "auto" }} />
            </Paper>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
}
