"use client";

import { Box, Button, Typography, Stack } from "@mui/material";
import { useState, useEffect } from "react";

export default function ErrorBoundary({ children, fallback }) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const handleError = (event) => {
      setHasError(true);
      setError(event.error);
      setErrorInfo({
        message: event.error?.message,
        stack: event.error?.stack,
      });
    };

    // Adiciona um listener local para erros neste componente
    const element = document.getElementById("error-boundary");
    if (element) {
      element.addEventListener("error", handleError);
      return () => element.removeEventListener("error", handleError);
    }
  }, []);

  if (hasError) {
    if (fallback) {
      return fallback;
    }

    return (
      <Box
        id="error-boundary"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "error.main",
        }}
      >
        <Stack spacing={2} sx={{ maxWidth: 600 }}>
          <Typography variant="h6" color="error">
            Erro no componente
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {error?.message || "Ocorreu um erro ao carregar este componente."}
          </Typography>

          {process.env.NODE_ENV === "development" && errorInfo && (
            <Box
              sx={{
                p: 2,
                bgcolor: "error.light",
                borderRadius: 1,
                textAlign: "left",
                overflow: "auto",
                maxHeight: "200px",
              }}
            >
              <Typography variant="caption" component="pre" sx={{ whiteSpace: "pre-wrap" }}>
                {errorInfo.stack}
              </Typography>
            </Box>
          )}

          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => {
              setHasError(false);
              setError(null);
              setErrorInfo(null);
            }}
          >
            Tentar novamente
          </Button>
        </Stack>
      </Box>
    );
  }

  return <div id="error-boundary">{children}</div>;
}
