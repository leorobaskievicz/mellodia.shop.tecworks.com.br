"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, TextField, Button, Typography, Alert, CircularProgress, Paper } from "@mui/material";
import { useApp } from "@/app/context/AppContext";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";

export default function InfoEdit() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const api = new Api();
  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    nome: "",
    cpf: "",
    telefone: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    hasSuccess: false,
    hasSuccessTitle: "",
    hasSuccessMsg: "",
  });

  const getCustomer = async () => {
    setState((state) => ({ ...state, isLoadingCustomer: true }));

    try {
      const data = await api.get(`/customer/${appState.usuario.codigo}`, true);

      if (data.status) {
        setState((state) => ({
          ...state,
          nome: data.msg.nome,
          cpf: data.msg.cpf,
          telefone: data.msg.telefone,
        }));
      }
    } catch (e) {
      console.error(`ERROR: /customer/:id: ${e}`);
    } finally {
      setState((state) => ({ ...state, isLoadingCustomer: false }));
    }
  };

  useEffect(() => {
    if (!appState.usuario || !appState.usuario.codigo) {
      router.push("/login");
      return;
    }

    getCustomer();
  }, [appState.usuario]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!state.nome) {
      setMsg("error", "Atenção", "Nome não informado");
      return false;
    }

    if (!state.cpf) {
      setMsg("error", "Atenção", "CPF não informado");
      return false;
    }

    if (!state.telefone) {
      setMsg("error", "Atenção", "Telefone não informado");
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
      nome: state.nome,
      cpf: state.cpf,
      telefone: state.telefone,
    };

    try {
      const data = await api.put(`/customer/${appState.usuario.codigo}`, param, true);

      if (!data || !data.status) {
        throw new Error(data.msg);
      } else {
        dispatch({
          type: "UPDATE_USER",
          payload: {
            ...appState.usuario,
            nome: state.nome,
            cpf: state.cpf,
            telefone: state.telefone,
          },
        });

        setMsg("success", "Sucesso", "Informações atualizadas com sucesso");
        setTimeout(() => router.push("/meu-cadastro"), 2000);
      }
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", `Não foi possível atualizar as informações. ${e.message}`);
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
          Editar Informações
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
          <TextField fullWidth label="Nome" value={state.nome} onChange={(event) => setState((prev) => ({ ...prev, nome: event.target.value }))} sx={{ mb: 3 }} required />

          <TextField 
            fullWidth 
            label={Diversos.validateCNPJ(state.cpf) ? "CNPJ" : "CPF"} 
            value={state.cpf} 
            onChange={(event) => {
              let cpf = event.target.value;

              if (Diversos.validateCNPJ(cpf)) {
                cpf = Diversos.maskCNPJString(cpf);
              } else if (Diversos.validateCPF(cpf)) {
                cpf = Diversos.maskCPFString(cpf);
              }

              setState((prev) => ({ ...prev, cpf: cpf }));
            }}
            sx={{ mb: 3 }} 
            required 
            inputProps={{ maxLength: 17 }}
          />

          <TextField
            fullWidth
            label="Telefone"
            value={state.telefone}
            onChange={(event) => setState((prev) => ({ ...prev, telefone: Diversos.maskTelefone(event.target.value) }))}
            sx={{ mb: 3 }}
            required
          />

          <Button type="submit" variant="contained" color="primary" fullWidth size="large" disabled={state.isLoading} sx={{ mb: 2 }}>
            {state.isLoading ? <CircularProgress size={24} color="inherit" /> : "Atualizar Informações"}
          </Button>

          <Button variant="text" fullWidth onClick={() => router.push("/meu-cadastro")} disabled={state.isLoading}>
            Voltar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
