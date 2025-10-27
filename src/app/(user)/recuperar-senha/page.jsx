"use client";

import React, { useEffect, useState } from "react";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Box, Button, TextField, Typography, Alert, CircularProgress, Container, Paper } from "@mui/material";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/app/lib/supabaseClient";

export default function ResetSenha() {
  const searchParams = useSearchParams();
  const { state: appState } = useApp();
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
  });

  const handleSubmit = async () => {
    if (!state.email) {
      setMsg("error", "Atenção", "Email não informado para recuperação de senha");
      return false;
    }

    if (!Diversos.validateEmail(state.email)) {
      setMsg("error", "Atenção", "Informe um email válido para recuperação de senha");
      return false;
    }

    setState((state) => ({
      ...state,
      isLoading: true,
      hasError: false,
      hasSuccess: false,
    }));

    const param = { login: state.email };

    try {
      // // Tentativa forçada de login para descobrir se email existe
      // const { error } = await supabase.auth.signInWithPassword({
      //   email: state.email,
      //   password: "senha_fake_qualquer",
      // });

      const data = await api.post(`/customer/check-email`, param, true);

      if (!data.status) {
        setMsg("success", "Sucesso", "Enviamos link de recuperação para seu e-mail. Você poderá utilizá-lo para fazer Login!");
      } else if (data.status && !data.supabase_uid) {
        // Email ainda não existe — cadastrar com senha fake
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: state.email,
          password: "SenhaTemp123!",
        });

        if (signupError) throw new Error(signupError.message);
        const googleid = signupData.user?.id || null;

        await api.put(`/customer/${data.codigo}`, { googleid: googleid }, true);
      }

      await supabase.auth.resetPasswordForEmail(state.email, {
        redirectTo: "https://www.divacosmeticos.com.br/atualiza-senha",
      });

      setMsg("success", "Sucesso", "Enviamos link de recuperação para seu e-mail. Você poderá utilizá-lo para fazer Login");

      // const data = await api.post("/customer/reset-senha", param, true);

      // if (!data || !data.status) {
      //   throw new Error(data.msg);
      // } else {
      //   setMsg("success", "Sucesso", "Enviamos uma senha provisória para seu e-mail. Você poderá utilizá-la para fazer Login");
      // }
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", `Não foi possível recuperar senha. ${e.message}`);
    } finally {
      setState((state) => ({ ...state, isLoading: false }));
      setTimeout(() => setState((state) => ({ ...state, redirect: "/login" })), 3000);
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

  useEffect(() => {
    if (appState.user && appState.user.status === true) {
      redirect("/meu-cadastro#trocar-senha");
    }
  }, [appState.user]);

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
      <Container maxWidth="sm">
        <Box sx={{ width: "100%", height: "auto", textAlign: "center", margin: "0px auto", py: 2 }}>
          <Link href="/" style={{ width: "100%", height: "auto", textAlign: "center", margin: "0px auto" }}>
            <Image src={"/logo-branca.png"} alt="Logo Diva" width={130} height={50} />
          </Link>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {state.hasError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {state.hasErrorTitle}
              </Typography>
              <Typography variant="body2">{state.hasErrorMsg}</Typography>
            </Alert>
          )}

          {state.hasSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {state.hasSuccessTitle}
              </Typography>
              <Typography variant="body2">{state.hasSuccessMsg}</Typography>
            </Alert>
          )}

          {state.isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 2,
              }}
            >
              <Typography variant="h5" component="h1">
                Processando recuperação de senha, por favor aguarde...
              </Typography>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Typography variant="h5" component="h1" align="center">
                Recuperação de Senha
              </Typography>

              <Typography variant="body1" align="center" sx={{ mb: 3 }}>
                Insira seu endereço de e-mail e enviaremos a você uma senha temporária.
              </Typography>

              <Box component="form" sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label="Seu Email"
                  type="email"
                  value={state.email}
                  onChange={(event) =>
                    setState((state) => ({
                      ...state,
                      email: event.target.value,
                    }))
                  }
                  sx={{ mb: 3 }}
                />

                <Button variant="contained" color="primary" fullWidth size="large" onClick={handleSubmit} disabled={state.isLoading} sx={{ mb: 2 }}>
                  {state.isLoading ? "Recuperando senha..." : "Recuperar"}
                </Button>

                <Button variant="text" fullWidth onClick={() => setState((state) => ({ ...state, redirect: "/login" }))} disabled={state.isLoading}>
                  Voltar
                </Button>
              </Box>

              <Typography variant="body1" sx={{ mt: 2 }}>
                Voltar para o{" "}
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <Typography component="span" color="primary">
                    Login
                  </Typography>
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
