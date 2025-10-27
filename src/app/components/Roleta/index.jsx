"use client";

import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { Modal, Box, IconButton, Button, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "@/app/context/AppContext";

const data = [
  { option: "10% OFF" },
  { option: "Frete Grátis" },
  { option: "Desconto R$20" },
  { option: "Brinde Surpresa" },
  { option: "5% OFF" },
  { option: "Ganhe 50 Pontos" },
  { option: "Parabéns!" },
  { option: "Cupom Secreto" },
];

export default function RoletaSorteio() {
  const theme = useTheme();
  const { state, dispatch } = useApp();
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
  };

  const handleClose = () => {
    setMustSpin(false);
    dispatch({ type: "HANDLE_ROLETA", payload: false });
  };

  return (
    <Modal open={state.roletaOpen} onClose={handleClose} sx={{ borderWidth: 0 }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          borderWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 30,
            right: 30,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
          color="secondary"
        >
          <CloseIcon />
        </IconButton>

        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          backgroundColors={[theme.palette.primary.main, theme.palette.secondary.main]}
          textColors={[theme.palette.primary.contrastText, theme.palette.secondary.contrastText]}
          outerBorderColor={theme.palette.divider}
          radiusLineColor={theme.palette.divider}
          onStopSpinning={() => {
            setMustSpin(false);
            alert(`Parabéns! Você ganhou: ${data[prizeNumber].option}`);
          }}
        />

        <Button onClick={handleSpinClick} variant="contained" color="secondary" size="large" sx={{ mt: 4, px: 8, py: 2, color: "primary", fontSize: "1.2rem" }}>
          Girar a Roleta
        </Button>
      </Box>
    </Modal>
  );
}
