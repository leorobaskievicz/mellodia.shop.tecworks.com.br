import { useEffect, useState } from "react";
import { Box, Typography, Button, Modal, Fade, Backdrop, Grid, IconButton } from "@mui/material";
import Image from "next/image";
import CloseIcon from '@mui/icons-material/Close';

export default function PopupIncentivo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const jaViu = localStorage.getItem("popup-roleta-visto");
  
    // Já viu, não registra o listener
    if (jaViu) {
      const ultimaVez = new Date(jaViu);
      const agora = new Date();
      const diffHoras = (agora - ultimaVez) / (1000 * 60 * 60);
      if (diffHoras < 24) return;
    }
  
    const handleExitIntent = (e) => {
      if (e.clientY < 30) {
        localStorage.setItem("popup-roleta-visto", new Date().toISOString()); // <-- SALVA ANTES
        setOpen(true);
        window.removeEventListener("mouseout", handleExitIntent); // <-- REMOVE imediatamente
      }
    };
  
    window.addEventListener("mouseout", handleExitIntent);
  
    return () => {
      window.removeEventListener("mouseout", handleExitIntent);
    };
  }, []);  

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={styles.popup}>
          <Grid container spacing={0} sx={{ width: "100%", height: "100%", p: 0, borderWidth: 0 }}>
            <Grid item xs={12} md={6} sx={{ p: 0, height: {xs: 300, md: 500} }}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  borderTopLeftRadius: { xs: 12, md: 12 },
                  borderTopRightRadius: { xs: 12, md: 0 },
                  borderBottomLeftRadius: { xs: 0, md: 12 },
                  overflow: 'hidden',
                }}
              >
                <Image
                  src="/exit-overlay-1.png"
                  alt="Cupom de Desconto"
                  fill // ocupa 100% da div pai
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", px: {xs: 4, md: 4}, py: {xs: 3, md: 4} }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ textAlign: "center" }}>
                NÃO VÁ EMBORA!
                <br/>
                GARANTA SEU DESCONTO.
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ textAlign: "center", my: 2 }}>
                Use o cupom <strong>QUERODESCONTO</strong> para ganhar <strong>10% de desconto</strong>!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", fontWeight: 700, fontSize: "1.2rem", color: "black", mb: 2 }}>
                Desconto por tempo limitado.
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  my: 2
                }}
              >
                <Box sx={{
                  width: "60%",
                  height: "auto",
                  backgroundColor: "white",
                  color: "primary.main",
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  borderWidth: 3,
                  borderColor: "primary.main",
                  borderStyle: "dotted",
                  py: 1,
                  px: 2
                }}>
                  QUERODESCONTO
                </Box>
                <Button variant="contained" color="primary" onClick={() => {navigator.clipboard.writeText("QUERODESCONTO"); setOpen(false); }} sx={{ px: 4, borderRadius: 2, width: "40%", height: "100%" }}>
                  Copiar
                </Button>
              </Box>
            </Grid>
          </Grid>

          <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", top: {xs: -50, md: -40}, right: {xs: 5, md: -40}, px: 2, width: 45, height: 45, borderRadius: 45, backgroundColor: "background.paper", color: "primary.main", "&:hover": { backgroundColor: "background.paper", color: "primary.main" } }}>
            <CloseIcon/>
          </IconButton>
        </Box>
      </Fade>
    </Modal>
  );
}

const styles = {
  popup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: 3,
    borderWidth: 0,
    borderColor: 'white',
    boxShadow: 24,
    p: 0,
    width: {xs: "100%", md: 900},
    // maxWidth: {xs: "100%", md: 800},
    textAlign: "center",
    outline: "none",                 // <--- Remover o contorno branco de foco
    "&:focus": {
      outline: "none !important",   // <--- Reforça que mesmo ao focar, não exiba nada
    },
    "& *": {
      outline: "none !important",   // <--- Remove de filhos também (caso o foco vá neles)
    },
  },
};
