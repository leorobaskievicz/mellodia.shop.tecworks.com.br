"use client";

import React, { useEffect, useState } from "react";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";
import { useSearchParams, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, TextField, Typography, Alert, AlertTitle, CircularProgress, Container, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

export default function AtualizaSenha() {
  const searchParams = useSearchParams();
  const api = new Api();
  const router = useRouter();

  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    email: searchParams.get("email") ?? "",
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    hasSuccess: false,
    hasSuccessTitle: "",
    hasSuccessMsg: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.email) {
      setMsg("error", "Atenção", "Informe seu e-mail.");
      return;
    }

    if (!state.senhaAtual) {
      setMsg("error", "Atenção", "Informe a senha temporária recebida por e-mail.");
      return;
    }

    if (!state.novaSenha || state.novaSenha.length < 6) {
      setMsg("error", "Atenção", "A nova senha deve conter pelo menos 6 caracteres.");
      return;
    }

    if (state.novaSenha !== state.confirmarSenha) {
      setMsg("error", "Atenção", "As senhas não coincidem.");
      return;
    }

    setState((state) => ({ ...state, isLoading: true }));

    try {
      const login = await api.post("/customer/login", { email: state.email, senha: state.senhaAtual }, true);

      if (!login.status) throw new Error("E-mail ou senha temporária inválidos.");

      const codigo = login.msg.codigo;

      const troca = await api.put(`/customer/${codigo}/troca-senha`, { senha: state.senhaAtual, senhaNova: state.novaSenha }, true);

      if (!troca.status) throw new Error(troca.msg);

      setMsg("success", "Sucesso", "Senha atualizada com sucesso! Redirecionando para o login...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (e) {
      setMsg("error", "Atenção", e.message);
    } finally {
      setState((state) => ({ ...state, isLoading: false }));
    }
  };

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

  if (state.redirect) {
    redirect(state.redirect);
    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        backgroundImage: "url('/textura-diva.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: 4,
      }}
    >
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Redefinir Senha
          </Typography>

          {state.isLoading && <CircularProgress sx={{ mt: 2 }} />}

          {state.hasError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>{state.hasErrorTitle}</AlertTitle>
              {state.hasErrorMsg}
            </Alert>
          )}

          {state.hasSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>{state.hasSuccessTitle}</AlertTitle>
              {state.hasSuccessMsg}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Seu E-mail"
              type="email"
              value={state.email}
              onChange={(e) => setState((state) => ({ ...state, email: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Senha temporária (recebida por e-mail)"
              type="password"
              value={state.senhaAtual}
              onChange={(e) => setState((state) => ({ ...state, senhaAtual: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Nova Senha"
              type="password"
              value={state.novaSenha}
              onChange={(e) => setState((state) => ({ ...state, novaSenha: e.target.value }))}
              sx={{ mb: 2 }}
              inputProps={{ minLength: 6 }}
            />
            <TextField
              fullWidth
              label="Confirmar Nova Senha"
              type="password"
              value={state.confirmarSenha}
              onChange={(e) => setState((state) => ({ ...state, confirmarSenha: e.target.value }))}
              sx={{ mb: 2 }}
              inputProps={{ minLength: 6 }}
            />
            <Button type="submit" variant="contained" fullWidth disabled={state.isLoading}>
              {state.isLoading ? <CircularProgress size={24} /> : "Atualizar Senha"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
