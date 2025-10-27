"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, TextField, Button, Typography, Alert, CircularProgress, Paper } from "@mui/material";
import { useApp } from "@/app/context/AppContext";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";

export default function EmailEdit() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const api = new Api();
  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    email: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    hasSuccess: false,
    hasSuccessTitle: "",
    hasSuccessMsg: "",
  });

  useEffect(() => {
    if (!appState.usuario || !appState.usuario.codigo) {
      router.push("/login");
      return;
    }

    setState((prev) => ({
      ...prev,
      email: appState.usuario.email,
    }));
  }, [appState.usuario]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!state.email) {
      setMsg("error", "Atenção", "Email não informado");
      return false;
    }

    if (!Diversos.validateEmail(state.email)) {
      setMsg("error", "Atenção", "Informe um email válido");
      return false;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      hasError: false,
      hasSuccess: false,
    }));

    const param = {
      codigo: appState.usuario.codigo,
      email: state.email,
    };

    try {
      const data = await api.put(`/customer/${appState.usuario.codigo}`, param, true);

      if (!data || !data.status) {
        throw new Error(data.msg);
      } else {
        setMsg("success", "Sucesso", "Email atualizado com sucesso");
        setTimeout(() => router.push("/meu-cadastro"), 2000);
      }
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", `Não foi possível atualizar o email. ${e.message}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const setMsg = (type, title, msg) => {
    const timeout = 5000;

    if (type === "error") {
      setState((prev) => ({
        ...prev,
        hasError: true,
        hasErrorTitle: title,
        hasErrorMsg: msg,
      }));

      setTimeout(() => setState((prev) => ({ ...prev, hasError: false })), timeout);
    } else {
      setState((prev) => ({
        ...prev,
        hasSuccess: true,
        hasSuccessTitle: title,
        hasSuccessMsg: msg,
      }));

      setTimeout(() => setState((prev) => ({ ...prev, hasSuccess: false })), timeout);
    }
  };

  if (state.redirect) {
    router.push(state.redirect);
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Editar Email
        </Typography>

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

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={state.email}
            onChange={(event) => setState((prev) => ({ ...prev, email: event.target.value }))}
            sx={{ mb: 3 }}
            required
          />

          <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={state.isLoading} sx={{ mb: 2 }}>
            {state.isLoading ? <CircularProgress size={24} color="inherit" /> : "Atualizar Email"}
          </Button>

          <Button variant="text" fullWidth onClick={() => router.push("/meu-cadastro")} disabled={state.isLoading}>
            Voltar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
