"use client";

import React, { useEffect, useState } from "react";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";
import { useSearchParams, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, TextField, Typography, Alert, CircularProgress, Container, Paper } from "@mui/material";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AtualizaSenha() {
  const searchParams = useSearchParams();
  const { state: appState, dispatch: appDispatch } = useApp();
  const api = new Api();
  const router = useRouter();

  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    email: searchParams.get("email") ? searchParams.get("email") : "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    hasSuccess: false,
    hasSuccessTitle: "",
    hasSuccessMsg: "",
    mostrarForm: false,
    novaSenha: "",
    confirmarSenha: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.novaSenha || state.novaSenha.length < 6) {
      setMsg("error", "Atenção", "A nova senha deve conter pelo menos 6 caracteres.");
      return;
    }

    if (state.novaSenha !== state.confirmarSenha) {
      setMsg("error", "Atenção", "As senhas não coincidem.");
      return;
    }

    setState((state) => ({ ...state, isLoading: true }));

    const { error } = await supabase.auth.updateUser({ password: state.novaSenha });

    if (error) {
      if (error.code === "same_password") {
        setMsg("error", "Atenção", "A nova senha não pode ser igual à senha atual.");
      } else {
        setMsg("error", "Atenção", error.message);
      }
    } else {
      setMsg("success", "Senha atualizada com sucesso! Redirecionando...");

      if (searchParams.get("redirect") === "pedidos") {
        setTimeout(() => router.push("/meus-pedidos"), 3000);
      } else {
        setTimeout(() => router.push("/"), 3000);
      }
    }

    setState((state) => ({ ...state, isLoading: false }));
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

  useEffect(() => {
    if (!appState.usuario || !appState.usuario.status) {
      const autenticarViaToken = async () => {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error || !session?.user) {
          setMsg("error", "", "Sessão inválida ou expirada. Tente solicitar o link novamente.");
          setState((state) => ({ ...state, isLoading: false }));
          return;
        }

        // Login automático na sua API
        try {
          setState((state) => ({ ...state, isLoading: true }));

          const resp = await api.post(
            "/customer/login-supabase",
            {
              email: session.user.email,
              supabase_uid: session.user.id,
            },
            true
          );

          if (!resp.status) throw new Error(resp.msg);

          appDispatch({
            type: "LOGIN",
            payload: {
              codigo: resp.msg.cliente_id,
              nome: resp.msg.nome,
              email: resp.msg.email,
              status: true,
              avatar: "",
              token: null,
            },
          });

          setState((state) => ({ ...state, mostrarForm: true }));
        } catch (e) {
          setErro("Erro ao validar conta na API: " + e.message);
        } finally {
          setState((state) => ({ ...state, isLoading: false }));
        }
      };

      autenticarViaToken();
    } else if (appState.usuario && appState.usuario.status === true) {
      setState((state) => ({ ...state, mostrarForm: true }));
    }
  }, []);

  // useEffect(() => {
  //   if (appState.usuario && appState.usuario.status === true) {
  //     redirect("/meu-cadastro#trocar-senha");
  //   }
  // }, [appState.usuario]);

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

          {state.mostrarForm && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              {searchParams.get("msg") === "renew" && (
                <Alert severity="warning" sx={{ mb: 4 }}>
                  Sua senha está desatualizada. Por favor, defina uma nova senha.
                </Alert>
              )}

              {state.hasError && (
                <Alert severity="error" sx={{ mb: 4 }}>
                  <AlertTitle>{state.hasErrorTitle}</AlertTitle>
                  {state.hasErrorMsg}
                </Alert>
              )}

              {state.hasSuccess && (
                <Alert severity="success" sx={{ mb: 4 }}>
                  <AlertTitle>{state.hasSuccessTitle}</AlertTitle>
                  {state.hasSuccessMsg}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Nova Senha"
                type="password"
                value={state.novaSenha}
                onChange={(e) => setState((state) => ({ ...state, novaSenha: e.target.value }))}
                sx={{ mb: 2 }}
                inputProps={{
                  minLength: 6,
                  pattern: ".{6,}",
                  title: "A senha deve ter no mínimo 6 caracteres",
                }}
              />
              <TextField
                fullWidth
                label="Confirmar Nova Senha"
                type="password"
                value={state.confirmarSenha}
                onChange={(e) => setState((state) => ({ ...state, confirmarSenha: e.target.value }))}
                sx={{ mb: 2 }}
                inputProps={{
                  minLength: 6,
                  pattern: ".{6,}",
                  title: "A senha deve ter no mínimo 6 caracteres",
                }}
              />
              <Button type="submit" variant="contained" fullWidth disabled={state.isLoading}>
                Atualizar Senha
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
