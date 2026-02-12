"use client";

import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import createEmotionCache from "./emotionCache";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff", // Fundo branco
      paper: "#ffffff", // Fundo de cartões/brancos
    },
    primary: {
      main: "#ff8500",
    },
    secondary: {
      main: "#F2F2F2",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body": {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
        },
      },
    },
  },
  typography: {
    allVariants: {
      textTransform: "none", // Corrige o problema
      fontFamily: "Jost, sans-serif",
    },
    fontFamily: "Jost, sans-serif",
  },
});

// Criar cache para Emotion no cliente
const clientSideEmotionCache = createEmotionCache();

export default function ThemeRegistry({ children }) {
  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
