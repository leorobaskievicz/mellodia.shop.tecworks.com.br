"use client";
import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button, Alert, Paper, Grid, CircularProgress } from "@mui/material";
import { WhatsApp as WhatsAppIcon, Facebook as FacebookIcon, Instagram as InstagramIcon } from "@mui/icons-material";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";

export default function TrabalheConosco() {
  const api = new Api();
  const [state, setState] = useState({
    email: "",
    nome: "",
    celular: "",
    file: "",
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

    if (!state.email || !state.nome || !state.mensagem || !state.celular) {
      setMsg("error", "Formulário Incompleto", "Preencha todos os dados do formulário antes de enviar");
      return;
    }

    if (!Diversos.validateEmail(state.email)) {
      setMsg("error", "E-mail Inválido", "Por favor, digite um E-mail válido para continuar");
      return;
    }

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    const fileBase64 = await convertToBase64(state.file);

    const param = {
      email: state.email,
      nome: state.nome,
      mensagem: state.mensagem,
      fone: state.celular,
      file: fileBase64,
      fgCurriculo: true,
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
          celular: "",
          file: "",
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
        Trabalhe Conosco
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Envie seu currículo
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
                label="Celular"
                type="tel"
                value={state.celular}
                onChange={(e) => setState((state) => ({ ...state, celular: Diversos.maskTelefone(e.target.value) }))}
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
              <TextField
                fullWidth
                label="Curriculo"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0]; // Pega o primeiro arquivo selecionado
                  setState((state) => ({ ...state, file: file })); // Salva o arquivo no state
                }}
                margin="normal"
                InputProps={{
                  inputProps: {
                    accept: ".pdf,.doc,.docx",
                  },
                }}
                InputLabelProps={{
                  shrink: true,
                }}
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
      </Grid>
    </Container>
  );
}
