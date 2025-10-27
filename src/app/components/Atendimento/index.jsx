"use client";
import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button, Alert, Paper, Grid, CircularProgress } from "@mui/material";
import { WhatsApp as WhatsAppIcon, Facebook as FacebookIcon, Instagram as InstagramIcon } from "@mui/icons-material";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";

export default function Atendimento() {
  const api = new Api();
  const [state, setState] = useState({
    email: "",
    nome: "",
    mensagem: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    hasSuccess: false,
    hasSuccessTitle: "",
    hasSuccessMsg: "",
    isLoading: false,
  });

  const setMsg = async (type, title, msg) => {
    const timeout = 5000;

    if (type === "error") {
      setState((state) => ({
        ...state,
        hasError: true,
        hasErrorTitle: title,
        hasErrorMsg: msg,
      }));

      setTimeout(() => setState((state) => ({ ...state, hasError: false })), timeout);
    } else {
      setState((state) => ({
        ...state,
        hasSuccess: true,
        hasSuccessTitle: title,
        hasSuccessMsg: msg,
      }));

      setTimeout(() => setState((state) => ({ ...state, hasSuccess: false })), timeout);
    }
  };

  const handleContact = async (event) => {
    event.preventDefault();

    if (!state.email || !state.nome || !state.mensagem) {
      setMsg("error", "Formulário Incompleto", "Preencha todos os dados do formulário antes de enviar");
      return;
    }

    if (!Diversos.validateEmail(state.email)) {
      setMsg("error", "E-mail Inválido", "Por favor, digite um E-mail válido para continuar");
      return;
    }

    const param = {
      email: state.email,
      nome: state.nome,
      mensagem: state.mensagem,
    };

    setState((state) => ({ ...state, isLoading: true }));

    try {
      const data = await api.post("/contact", param, true);

      if (!data.status) {
        throw new Error(data.msg);
      } else {
        setMsg("success", "Sucesso", "Mensagem enviada com sucesso.");
        setState((state) => ({
          ...state,
          email: "",
          nome: "",
          mensagem: "",
        }));
      }
    } catch (e) {
      console.error(e);
      setMsg("error", "Erro", "Ocorreu um erro ao enviar a mensagem.");
    } finally {
      setState((state) => ({ ...state, isLoading: false }));
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Atendimento
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Entre em Contato
            </Typography>
            <form onSubmit={handleContact}>
              <TextField fullWidth label="Nome" value={state.nome} onChange={(e) => setState((state) => ({ ...state, nome: e.target.value }))} margin="normal" required />
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={state.email}
                onChange={(e) => setState((state) => ({ ...state, email: e.target.value }))}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Mensagem"
                multiline
                rows={4}
                value={state.mensagem}
                onChange={(e) => setState((state) => ({ ...state, mensagem: e.target.value }))}
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" color="primary" disabled={state.isLoading} sx={{ mt: 2 }}>
                {state.isLoading ? <CircularProgress size={24} /> : "Enviar Mensagem"}
              </Button>
            </form>

            {state.hasError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">{state.hasErrorTitle}</Typography>
                <Typography variant="body2">{state.hasErrorMsg}</Typography>
              </Alert>
            )}

            {state.hasSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">{state.hasSuccessTitle}</Typography>
                <Typography variant="body2">{state.hasSuccessMsg}</Typography>
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nossos Canais
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {process.env.NEXT_PUBLIC_WHATSAPP_URL && (
                <Button
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  href={process.env.NEXT_PUBLIC_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </Button>
              )}
              {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
                <Button variant="outlined" startIcon={<FacebookIcon />} href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                  Facebook
                </Button>
              )}
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <Button variant="outlined" startIcon={<InstagramIcon />} href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
