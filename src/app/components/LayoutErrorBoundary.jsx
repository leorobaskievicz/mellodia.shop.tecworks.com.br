"use client";

import React from "react";
import { Box, Container, Typography, Paper, Button, Divider, useTheme } from "@mui/material";
import { Colors } from "@/app/style.constants";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Erro capturado pelo ErrorBoundary:", error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            py: 4,
            px: 2,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={3}
              sx={{
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: 2,
                bgcolor: Colors.white,
                border: `1px solid ${Colors.secondaryBorder}`,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  color: "primary.main",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontFamily: "Jost",
                }}
              >
                Ops! Algo deu errado
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  mb: 4,
                  textAlign: "center",
                  fontFamily: "Jost",
                }}
              >
                Desculpe, encontramos um problema inesperado.
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  width: "100%",
                  mb: 4,
                  bgcolor: "error.light",
                  borderColor: "error.main",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color="error.dark"
                  sx={{
                    fontWeight: "medium",
                    fontFamily: "Jost",
                  }}
                >
                  {this.state.error?.message || "Erro desconhecido"}
                </Typography>
                {process.env.NODE_ENV === "development" && (
                  <Box
                    component="pre"
                    sx={{
                      mt: 2,
                      p: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      fontSize: "0.75rem",
                      color: "error.dark",
                      overflow: "auto",
                      maxHeight: "200px",
                      fontFamily: "monospace",
                    }}
                  >
                    {this.state.error?.stack}
                  </Box>
                )}
              </Paper>

              <Divider sx={{ width: "100%", mb: 4 }} />

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  width: "100%",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleRefresh}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontFamily: "Jost",
                    fontWeight: 500,
                  }}
                >
                  Tentar novamente
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={this.handleGoHome}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontFamily: "Jost",
                    fontWeight: 500,
                  }}
                >
                  Voltar para o início
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
