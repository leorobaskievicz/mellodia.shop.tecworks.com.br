"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, TextField, Button, Typography, Alert, CircularProgress, Paper, Grid, Skeleton, Autocomplete } from "@mui/material";
import { useApp } from "@/app/context/AppContext";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";

export default function ShippingEdit() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const api = new Api();
  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    hasSuccess: false,
    hasSuccessTitle: "",
    hasSuccessMsg: "",
    isLoadingCustomer: false,
  });

  const getCustomer = async () => {
    setState((state) => ({ ...state, isLoadingCustomer: true }));

    try {
      const data = await api.get(`/customer/${appState.usuario.codigo}`, true);

      if (data.status) {
        setState((state) => ({
          ...state,
          cep: data.msg.cep,
          endereco: data.msg.rua,
          numero: String(data.msg.numero),
          complemento: data.msg.complemento,
          bairro: data.msg.bairro,
          cidade: data.msg.cidade,
          estado: data.msg.estado,
          codmun: data.msg.ibge,
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

  const getAddressByCep = async (cep = null) => {
    if (!cep || Diversos.getnums(cep).length !== 8) return false;

    setState((state) => ({ ...state, isLoadingCep: true }));

    const param = { cep: cep };

    try {
      const data = await api.post("/shipping/cep", param, true);

      if (data.status) {
        setState((state) => ({
          ...state,
          endereco: data.msg.logradouro,
          bairro: data.msg.bairro,
          cidade: data.msg.localidade,
          estado: data.msg.uf,
          codmun: data.msg.ibge,
        }));
      }
    } catch (e) {
      console.error(`ERROR: /shipping/cep: ${e}`);
    } finally {
      setState((state) => ({ ...state, isLoadingCep: false }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!state.cep) {
      setMsg("error", "Atenção", "CEP não informado");
      return false;
    }

    if (!state.endereco) {
      setMsg("error", "Atenção", "Endereço não informado");
      return false;
    }

    if (!state.numero) {
      setMsg("error", "Atenção", "Número não informado");
      return false;
    }

    if (!state.bairro) {
      setMsg("error", "Atenção", "Bairro não informado");
      return false;
    }

    if (!state.cidade) {
      setMsg("error", "Atenção", "Cidade não informada");
      return false;
    }

    if (!state.estado) {
      setMsg("error", "Atenção", "Estado não informado");
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
      cep: state.cep,
      endereco: state.endereco,
      rua: state.endereco,
      numero: state.numero,
      complemento: state.complemento,
      bairro: state.bairro,
      cidade: state.cidade,
      estado: state.estado,
    };

    try {
      const data = await api.put(`/customer/${appState.usuario.codigo}`, param, true);

      if (!data || !data.status) {
        throw new Error(data.msg);
      } else {
        dispatch({
          type: "SET_CEP",
          payload: state.cep,
        });

        setMsg("success", "Sucesso", "Endereço atualizado com sucesso");
        setTimeout(() => router.push("/meu-cadastro"), 2000);
      }
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", `Não foi possível atualizar o endereço. ${e.message}`);
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
          Editar Endereço
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {state.isLoadingCustomer ? (
                <Skeleton variant="text" height={50} />
              ) : (
                <TextField
                  fullWidth
                  label="CEP"
                  value={state.cep}
                  onChange={(event) => {
                    setState((prev) => ({ ...prev, cep: Diversos.maskCEP(event.target.value) }));

                    if (Diversos.getnums(event.target.value).length === 8) {
                      getAddressByCep(event.target.value);
                    }
                  }}
                  disabled={state.isLoadingCep}
                  required
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {state.isLoadingCustomer ? (
                <Skeleton variant="text" height={50} />
              ) : (
                <TextField
                  fullWidth
                  label="Endereço"
                  value={state.endereco}
                  onChange={(event) => setState((prev) => ({ ...prev, endereco: event.target.value }))}
                  required
                  disabled={state.isLoadingCep}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {state.isLoadingCustomer ? (
                <Skeleton variant="text" height={50} />
              ) : (
                <TextField
                  fullWidth
                  label="Número"
                  value={state.numero}
                  onChange={(event) => setState((prev) => ({ ...prev, numero: event.target.value }))}
                  required
                  disabled={state.isLoadingCep}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {state.isLoadingCustomer ? (
                <Skeleton variant="text" height={50} />
              ) : (
                <TextField
                  fullWidth
                  label="Complemento"
                  value={state.complemento}
                  onChange={(event) => setState((prev) => ({ ...prev, complemento: event.target.value }))}
                  disabled={state.isLoadingCep}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {state.isLoadingCustomer ? (
                <Skeleton variant="text" height={50} />
              ) : (
                <TextField
                  fullWidth
                  label="Bairro"
                  value={state.bairro}
                  onChange={(event) => setState((prev) => ({ ...prev, bairro: event.target.value }))}
                  required
                  disabled={state.isLoadingCep}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {state.isLoadingCustomer ? (
                <Skeleton variant="text" height={50} />
              ) : (
                <TextField
                  fullWidth
                  label="Cidade"
                  value={state.cidade}
                  onChange={(event) => setState((prev) => ({ ...prev, cidade: event.target.value }))}
                  required
                  disabled={state.isLoadingCep}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              {state.isLoadingCustomer ? (
                <Skeleton variant="text" height={50} />
              ) : (
                <Autocomplete
                  disabled={state.isLoadingCep}
                  fullWidth
                  options={Diversos.getUFs()}
                  value={Diversos.getUFs()
                    .filter((x) => x.value === state.estado)
                    ?.pop()}
                  onChange={(event, newValue) => setState((prev) => ({ ...prev, estado: newValue }))}
                  renderInput={(params) => <TextField {...params} label="Estado" required />}
                />
              )}
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={state.isLoading || state.isLoadingCep || state.isLoadingCustomer}
            sx={{ mt: 3, mb: 2 }}
          >
            {state.isLoading ? <CircularProgress size={24} color="inherit" /> : "Atualizar Endereço"}
          </Button>

          <Button variant="text" fullWidth onClick={() => router.push("/meu-cadastro")} disabled={state.isLoading}>
            Voltar
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
