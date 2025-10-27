"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, Button, Alert, Snackbar, IconButton } from "@mui/material";
import {
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Lock as LockIcon,
  LocationOn as LocationIcon,
  Favorite as FavoriteIcon,
  QrCode as QrCodeIcon,
  ArrowForward as ArrowForwardIcon,
  Email as EmailIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Api from "@/app/lib/api";
import { useApp } from "@/app/context/AppContext";
import { supabase } from "@/app/lib/supabaseClient";

export default function UserSidebar() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const [state, setState] = useState({
    redirect: null,
    isLoadingCustomer: true,
    customer: null,
    hasError: false,
    hasSuccess: false,
    newsletter: "",
    snackbar: {
      open: false,
      message: "",
      severity: "success",
    },
  });
  const api = new Api();

  const getCustomer = async () => {
    setState((prev) => ({ ...prev, isLoadingCustomer: true }));

    try {
      const data = await api.get(`/customer/${appState.usuario.codigo}`, true);

      if (data.status === false) {
        throw new Error("Cadastro de cliente não localizado.");
      } else {
        setState((prev) => ({ ...prev, customer: data.msg }));
      }
    } catch (e) {
      console.error(e);
      setState((prev) => ({
        ...prev,
        customer: null,
        snackbar: {
          open: true,
          message: e.message,
          severity: "error",
        },
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoadingCustomer: false }));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    dispatch({ type: "LOGOUT" });
    router.push("/");
  };

  const handleNewsletter = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      hasError: false,
      hasSuccess: false,
    }));

    const param = {
      nome: state.customer.nome,
      email: state.customer.email,
      recebeEmail: "S",
    };

    try {
      const data = await api.post("/customer/newsletter", param, true);

      if (!data.status) {
        throw new Error(data.msg);
      } else {
        setState((prev) => ({
          ...prev,
          snackbar: {
            open: true,
            message: "Inscrição feita com sucesso!",
            severity: "success",
          },
        }));
      }
    } catch (e) {
      console.error(e);
      setState((prev) => ({
        ...prev,
        snackbar: {
          open: true,
          message: e.message,
          severity: e.message === "E-mail já cadastrado para receber newsletter" ? "info" : "error",
        },
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleNewsletterEmail = async (event) => {
    event.preventDefault();

    setState((prev) => ({
      ...prev,
      isLoading: true,
      hasError: false,
      hasSuccess: false,
    }));

    if (!state.newsletter) {
      setState((prev) => ({
        ...prev,
        snackbar: {
          open: true,
          message: "Insira um endereço de e-mail válido",
          severity: "error",
        },
      }));
      return;
    }

    const param = {
      nome: state.customer.nome,
      email: state.newsletter,
      recebeEmail: "S",
    };

    try {
      const data = await api.post("/customer/newsletter", param, true);

      if (!data.status) {
        throw new Error(data.msg);
      } else {
        setState((prev) => ({
          ...prev,
          newsletter: "",
          snackbar: {
            open: true,
            message: "Inscrição feita com sucesso!",
            severity: "success",
          },
        }));
      }
    } catch (e) {
      console.error(e);
      setState((prev) => ({
        ...prev,
        snackbar: {
          open: true,
          message: e.message,
          severity: e.message === "E-mail já cadastrado para receber newsletter" ? "info" : "error",
        },
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleCloseSnackbar = () => {
    setState((prev) => ({
      ...prev,
      snackbar: { ...prev.snackbar, open: false },
    }));
  };

  useEffect(() => {
    if (appState.usuario && appState.usuario.codigo) {
      getCustomer();
    }

    if (!appState.usuario || !appState.usuario.codigo) {
      router.push("/login");
    }
  }, [appState.usuario]);

  if (state.redirect) {
    router.push(state.redirect);
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        {state.customer && `Olá ${state.customer.nome}!`}
      </Typography>

      <List>
        <ListItem button component="a" href="/meu-cadastro#meu-perfil">
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Meu Perfil" />
        </ListItem>

        <ListItem button component="a" href="/meus-pedidos">
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Meus Pedidos" />
        </ListItem>

        <ListItem button component="a" href="/atualiza-senha">
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText primary="Reset de Senha" />
        </ListItem>

        <ListItem button component="a" href="/perfil/editar/endereco">
          <ListItemIcon>
            <LocationIcon />
          </ListItemIcon>
          <ListItemText primary="Endereço de Entrega" />
        </ListItem>

        <ListItem button component="a" href="/meu-cadastro#grid-favoritos">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favoritos" />
        </ListItem>

        {/* <ListItem button component="a" href="/meus-cupons">
          <ListItemIcon>
            <QrCodeIcon />
          </ListItemIcon>
          <ListItemText primary="Meus Cupons" />
        </ListItem> */}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Gostaria de receber atualizações, promoções, dicas e muito mais?
        </Typography>
        <Typography variant="body2" gutterBottom>
          Inscreva-se na nossa Newsletter!
        </Typography>

        <Button variant="text" endIcon={<ArrowForwardIcon />} onClick={handleNewsletter} sx={{ mb: 2 }}>
          Usar meu e-mail para inscrição
        </Button>

        <Typography variant="caption" display="block" gutterBottom>
          Ou utilize outro e-mail
        </Typography>

        <Box component="form" onSubmit={handleNewsletterEmail} sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            type="email"
            placeholder="Insira seu e-mail"
            value={state.newsletter}
            onChange={(e) => setState((prev) => ({ ...prev, newsletter: e.target.value }))}
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: "action.active" }} />,
            }}
          />
          <Button type="submit" variant="contained">
            Enviar
          </Button>
        </Box>

        <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
          Ao se cadastrar você concorda em receber comunicação publicitária, com ofertas e novidades, conforme a nossa{" "}
          <a href="/politica-de-privacidade" id="privacy-policy">
            política de privacidade
          </a>
        </Typography>
      </Box>

      <Divider />

      <List>
        <ListItem button component="a" href="/institucional/atendimento">
          <ListItemText primary="Fale Conosco" />
        </ListItem>

        <ListItem button component="a" href="/central-de-relacionamento" onClick={() => dispatch({ type: "SET_PARAM", payload: { faqTab: "trocas" } })}>
          <ListItemText primary="Política de Trocas e Devoluções" />
        </ListItem>

        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItem>
      </List>

      <Snackbar
        open={state.snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={handleCloseSnackbar} severity={state.snackbar.severity} sx={{ width: "100%" }}>
          {state.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
