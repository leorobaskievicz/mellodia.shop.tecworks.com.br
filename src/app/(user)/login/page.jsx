// Página de login com layout original + funcionalidade TecWorks API
"use client";

import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Alert, CircularProgress, IconButton, Paper, Container } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useApp } from "@/app/context/AppContext";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { encrypt } from "@/app/lib/encrypt";

function LoginContent(props) {
  const { state: stateApp, dispatch } = useApp();
  const router = useRouter();
  const api = new Api();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [state, setState] = useState({
    returnToCheckout: false,
    redirect: null,
    isLoading: false,
    email: "",
    senha: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    isLoadingTeste: true,
    hidden: true,
    loginStep: 1,
    isLoadingGoogle: false,
    isLoadingFacebook: false,
    isLoadingApple: false,
  });

  const setMsg = (type, title, msg) => {
    const timeout = 5000;
    if (type === "error") {
      setState((state) => ({
        ...state,
        hasError: true,
        hasErrorTitle: title,
        hasErrorMsg: msg,
      }));
      setTimeout(() => setState((state) => ({ ...state, hasError: false })), timeout);
    }
  };

  const handleLoginGoogle = async () => {
    setMsg("error", "Atenção", "Login social não disponível no momento.");
  };

  const handleLoginFacebook = async () => {
    setMsg("error", "Atenção", "Login social não disponível no momento.");
  };

  const handleLoginApple = async () => {
    setMsg("error", "Atenção", "Login social não disponível no momento.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setState((state) => ({
      ...state,
      hasErrorTitle: false,
      hasErrorMsg: "",
    }));

    // Validação reCAPTCHA invisível apenas no step 2 (login com senha)
    let recaptchaToken = null;
    if (state.loginStep === 2) {
      if (!executeRecaptcha) {
        setMsg("error", "Atenção", "Sistema de segurança não está pronto. Tente novamente.");
        return;
      }

      try {
        recaptchaToken = await executeRecaptcha("login");
        if (!recaptchaToken) {
          setMsg("error", "Atenção", "Falha na validação de segurança. Tente novamente.");
          return;
        }
      } catch (error) {
        console.error("Erro no reCAPTCHA:", error);
        setMsg("error", "Atenção", "Erro na validação de segurança. Tente novamente.");
        return;
      }
    }

    if (state.loginStep === 1) {
      if (!state.email) {
        setMsg("error", "Login inválido", "O campo Email não pode ficar em branco");
        setState((state) => ({ ...state, isLoading: false }));
        return;
      }

      if (!Diversos.validateEmail(state.email)) {
        setMsg("error", "E-mail Inválido", "Por favor, digite um E-mail válido para continuar");
        return;
      }

      setState((state) => ({ ...state, isLoading: true }));

      const param = { login: state.email };

      try {
        const data = await api.post(`/customer/check-email`, param, true);

        if (!data.status) {
          throw new Error(data.msg);
        }

        setState((state) => ({
          ...state,
          loginStep: 2,
        }));
      } catch (e) {
        setState((state) => ({
          ...state,
          redirect: `/cadastro?email=${state.email}`,
        }));
      } finally {
        setState((state) => ({ ...state, isLoading: false }));
      }
    } else {
      if (!state.senha) {
        setState((state) => ({ ...state, isLoading: false, loginStep: 1 }));
        setMsg("error", "Login inválido", "O campo Senha não pode ficar em branco");
        return;
      }

      if (!state.email || !state.senha) {
        setMsg("error", "Login inválido", "Preencha todos os campos");
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      setState((s) => ({ ...s, isLoading: true }));

      try {
        const data = await api.post(
          "/customer/login",
          {
            email: state.email,
            senha: state.senha,
            recaptchaToken,
          },
          true
        );

        console.log("Retorno /customer/login:", data);

        if (!data.status) throw new Error("Login inválido");

        Diversos.sendCartData(data.msg.codigo, stateApp.carrinho);

        dispatch({
          type: "LOGIN",
          payload: {
            codigo: data.msg.codigo,
            nome: data.msg.nome,
            email: data.msg.email,
            status: true,
            avatar: "",
            token: null,
            vendedor: data.msg.vendedor,
          },
        });

        const encrypted = encrypt(data.msg);
        document.cookie = `mellodia_user=${encodeURIComponent(encrypted)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;

        setState((state) => ({ ...state, redirect: state.returnToCheckout ? "/checkout/pagamento" : "/" }));

      } catch (err) {
        setMsg("error", "Login inválido", "Tente novamente ou recupere sua senha");
      } finally {
        setState((s) => ({ ...s, isLoading: false }));
      }
    }
  };

  useEffect(() => {
    const getParams = async () => {
      const { params, searchParams } = await props;
      const { error } = await searchParams;

      if (error === "session") {
        setMsg("error", "Atenção", "Sessão inválida");
      }

      if (error === "login") {
        setMsg("error", "Atenção", "Login inválido");
      }

      if (error === "api") {
        setMsg("error", "Atenção", "Sem conexão de internet");
      }
    };

    getParams();

    if (stateApp.usuario?.codigo) {
      setState((state) => ({ ...state, redirect: "/" }));
    }

    const { checkout } = queryString.parse(window.location.search);
    if (checkout) {
      setState((state) => ({ ...state, returnToCheckout: true }));
    }
  }, []);

  useEffect(() => {
    if (state.redirect) {
      router.push(state.redirect);
    }
  }, [state.redirect]);

  return (
    <>
      {state.hasError && (
        <Alert severity="error">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {state.hasErrorTitle}
          </Typography>
          <Typography variant="body2">{state.hasErrorMsg}</Typography>
        </Alert>
      )}

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
          <Box sx={{ width: "100%", textAlign: "center", py: 2 }}>
            <Link href="/">
              <Image src="/logo-branca.png" alt="Logo Diva" width={130} height={50} />
            </Link>
          </Box>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
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
                  Processando login, por favor aguarde...
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
                {state.loginStep === 1 ? (
                  <Typography variant="h5" component="h1" align="center">
                    Olá! Digite seu e-mail para fazer Login ou se Cadastrar
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h5" component="h1" align="center">
                      Bem vindo(a) de volta,
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 1,
                        width: "100%",
                        border: "1px solid #ccc",
                      }}
                    >
                      <PersonIcon />
                      <Typography variant="body1" sx={{ flex: 1 }}>
                        {state.email}
                      </Typography>
                      <IconButton onClick={() => setState((state) => ({ ...state, loginStep: 1 }))}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  </>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", mt: 3 }}>
                  {state.loginStep === 1 ? (
                    <TextField
                      fullWidth
                      label="Seu Email"
                      type="email"
                      value={state.email}
                      onChange={(event) => setState((state) => ({ ...state, email: event.target.value }))}
                      sx={{ mb: 3 }}
                    />
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        label="Sua Senha"
                        type={state.hidden ? "password" : "text"}
                        value={state.senha || ""}
                        onChange={(event) => setState((state) => ({ ...state, senha: event.target.value }))}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleSubmit(event);
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={() => setState((state) => ({ ...state, hidden: !state.hidden }))}>
                              {state.hidden ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          ),
                        }}
                        sx={{ mb: 2 }}
                      />
                      <Link href={`/recuperar-senha?email=${state.email}`} style={{ textDecoration: "none" }}>
                        <Typography variant="body2" color="primary" sx={{ mb: 3 }}>
                          Esqueceu sua senha?
                        </Typography>
                      </Link>
                    </>
                  )}

                  <Button type="submit" variant="contained" fullWidth size="large" sx={{ mb: 3 }} disabled={state.isLoading}>
                    {state.isLoading ? <CircularProgress size={24} /> : state.loginStep === 1 ? "Próximo" : "Entrar"}
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    onClick={handleLoginGoogle}
                    disabled={state.isLoadingGoogle}
                    startIcon={<Image src="/google-logo-login.png" width={20} height={20} alt="Google logo" />}
                  >
                    Fazer login com o Google
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={handleLoginApple}
                    disabled={state.isLoadingApple}
                    startIcon={<Image src="/apple-logo-login.png" width={20} height={20} alt="Apple logo" />}
                  >
                    Fazer login com sua conta Apple
                  </Button>

                  <Button
                    variant="text"
                    fullWidth
                    size="large"
                    onClick={() => router.back()}
                    disabled={state.isLoading}
                    startIcon={<ArrowBackIcon />}
                    sx={{ mt: 2 }}
                  >
                    Voltar
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default function Login(props) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <LoginContent {...props} />
    </GoogleReCaptchaProvider>
  );
}