"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 100, color: "error.main" }} />

        <Typography variant="h2" component="h1" sx={{ fontWeight: "bold" }}>
          Página não encontrada
        </Typography>

        <Typography variant="h5" color="text.secondary">
          Desculpe, a página que você está procurando não existe ou foi movida.
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Você pode voltar para a página inicial ou tentar novamente mais tarde.
        </Typography>

        <Button variant="contained" color="primary" size="large" startIcon={<HomeIcon />} onClick={() => router.push("/")} sx={{ mt: 2 }}>
          Voltar para página inicial
        </Button>
      </Box>
    </Container>
  );
}
