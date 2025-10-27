"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Box, Container, TextField, Button, Typography, Link, InputAdornment, IconButton, CircularProgress, Alert, Grid, Paper, Select, MenuItem } from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { useApp } from "@/app/context/AppContext";
import { Diversos } from "@/app/lib/diversos";
import Api from "@/app/lib/api";
import { supabase } from "@/app/lib/supabaseClient";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

function CadastroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state: stateApp, dispatch } = useApp();
  const api = new Api();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [state, setState] = useState({
    newUser: false,
    redirect: "",
    hidden: true,
    confHidden: true,
    tooltipOpen: true,
    toastOpen: false,
    isLoadingNovo: false,
    novoNome: searchParams.get("nome") ? searchParams.get("nome") : "",
    novoSobrenome: "",
    novoNascimento: "",
    novoCpf: "",
    novoTelefone: "",
    novoCelular: "",
    novoEmail: Diversos.validateEmail(searchParams.get("email")) ? searchParams.get("email") : "",
    novoSenha: "",
    novoConfSenha: "",
    novoCep: "",
    novoRua: "",
    novoNumero: "",
    novoBairro: "",
    novoCidade: "",
    novoEstado: "",
    novoComplemento: "",
    novoCodmun: "",
    novoGoogleId: searchParams.get("googleid") ? searchParams.get("googleid") : "",
    novoAppleId: searchParams.get("appleid") ? searchParams.get("appleid") : "",
    novoHasError: false,
    novoHasErrorTitle: "",
    novoHasErrorMsg: "",
    currentStep: 1,
    email: "",
    username: "",
    password: "",
    checkingEmail: false,
    emailChecked: false,
    newsletter: false,
    phoneMask: "(99) 9999-99999",
    isLoadingCustomer: true,
    customer: null,
    customerHasError: false,
    customerHasErrorTitle: "",
    customerHasErrorMsg: "",
    customerHasSuccess: false,
    customerHasSuccessTitle: "",
    customerHasSuccessMsg: "",
    isLoadingCep: false,
    isLoadingApple: false,
  });

  const setMsg = (type, title, msg, form) => {
    const timeout = 5000;

    if (type === "error") {
      if (form === 1) {
        setState((state) => ({
          ...state,
          customerHasError: true,
          customerHasErrorTitle: title,
          customerHasErrorMsg: msg,
        }));

        setTimeout(() => setState((state) => ({ ...state, customerHasError: false })), timeout);
      } else {
        setState((state) => ({
          ...state,
          novoHasError: true,
          novoHasErrorTitle: title,
          novoHasErrorMsg: msg,
        }));

        setTimeout(() => setState((state) => ({ ...state, novoHasError: false })), timeout);
      }
    } else {
      if (form === 1) {
        setState((state) => ({
          ...state,
          customerHasSuccess: true,
          customerHasSuccessTitle: title,
          customerHasSuccessMsg: msg,
        }));

        setTimeout(() => setState((state) => ({ ...state, customerHasSuccess: false })), timeout);
      } else {
        setState((state) => ({
          ...state,
          novoHasSuccess: true,
          novoHasSuccessTitle: title,
          novoHasSuccessMsg: msg,
        }));

        setTimeout(() => setState((state) => ({ ...state, novoHasSuccess: false })), timeout);
      }
    }
  };

  const getAddressByCep = async (cep = null) => {
    if (!cep) return false;

    setState((state) => ({ ...state, isLoadingCep: true }));

    const param = { cep };

    try {
      const data = await api.post("/shipping/cep", param, true);

      if (data && data.status) {
        setState((state) => ({
          ...state,
          novoRua: data.msg.logradouro,
          novoBairro: data.msg.bairro,
          novoCidade: data.msg.localidade,
          novoEstado: data.msg.uf,
          novoCodmun: data.msg.ibge,
        }));
      }
    } catch (e) {
      console.error(`ERROR: /shipping/cep: ${e}}`);
    } finally {
      setState((state) => ({ ...state, isLoadingCep: false }));
    }

    return true;
  };

  const scrollToRef = () => window.scrollTo(0, 0);

  const validateEmail = () => {
    const timeout = 3000;

    setState((state) => ({ ...state, checkingEmail: true }));

    setTimeout(() => setState((state) => ({ ...state, checkingEmail: false })), timeout);

    setState((state) => ({ ...state, emailChecked: true }));

    setTimeout(() => setState((state) => ({ ...state, emailChecked: false })), 1500);
  };

  const handleLoginGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Erro ao redirecionar login Google", error);
  };

  const handleLoginApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error("Erro ao redirecionar login Apple", error);
  };

  const handleSubmitNovo = async (event) => {
    event.preventDefault();
    let paramNewsletter = {};

    scrollToRef();

    // Validação reCAPTCHA invisível
    if (!executeRecaptcha) {
      setMsg("error", "Atenção", "Sistema de segurança não está pronto. Tente novamente.", 2);
      return;
    }

    let recaptchaToken;
    try {
      recaptchaToken = await executeRecaptcha("signup");
      if (!recaptchaToken) {
        setMsg("error", "Atenção", "Falha na validação de segurança. Tente novamente.", 2);
        return;
      }
    } catch (error) {
      console.error("Erro no reCAPTCHA:", error);
      setMsg("error", "Atenção", "Erro na validação de segurança. Tente novamente.", 2);
      return;
    }

    if (state.currentStep === 1) {
      if ((!state.novoEmail && !state.newUser) || !state.novoSenha) {
        setMsg("error", "Formulário incompleto", `Necessário preencher todos os campos obrigatórios (*) do formulário para continuar.`, 2);
        return;
      }

      if (!Diversos.validateEmail(state.novoEmail)) {
        setMsg("error", "E-mail Inválido", "Por favor, digite um E-mail válido para continuar", 2);
        return;
      }

      if ((!state.novoNome && !state.newUser) || !state.novoCpf || !state.novoCelular) {
        setMsg("error", "Formulário incompleto", `Necessário preencher todos os campos obrigatórios (*) do formulário para continuar.`, 2);
        return;
      }

      if (!Diversos.validateCPF(state.novoCpf)) {
        setMsg("error", "CPF inválido", `Necessário informar um CPF válido para continuar.`, 2);
      }

      if (!state.novoCep || !state.novoRua || !state.novoNumero || !state.novoBairro || !state.novoCidade || !state.novoEstado) {
        setMsg("error", "Formulário incompleto", `Necessário preencher todos os campos obrigatórios (*) do formulário para continuar.`, 2);
        return;
      }

      setState((state) => ({ ...state, novoHasError: false }));
    }

    setState((state) => ({
      ...state,
      novoHasError: false,
      isLoadingNovo: true,
    }));

    const param = {
      email: state.novoEmail,
      senha: state.novoSenha,
      nome: state.novoNome,
      cpf: state.novoCpf,
      nascimento: state.novoNascimento,
      telefone: state.novoTelefone,
      celular: state.novoCelular,
      cep: state.novoCep,
      rua: state.novoRua,
      numero: state.novoNumero,
      bairro: state.novoBairro,
      cidade: state.novoCidade,
      estado: state.novoEstado,
      complemento: state.novoComplemento,
      codmun: state.novoCodmun,
      googleid: state.novoGoogleId,
      appleid: state.novoAppleId,
      recaptchaToken, // Token do reCAPTCHA para validação no backend
    };

    try {
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: param.email,
        password: param.senha,
        options: {
          data: {
            nome: state.novoNome,
            celular: state.novoCelular,
            cpf: state.novoCpf,
          },
        },
      });

      if (signupError) throw new Error(signupError.message);
      param.googleid = signupData.user?.id || null;

      const data = await api.post("/customer", param, true);

      if (!data.status) {
        throw new Error(data.msg);
      } else {
        if (state.newsletter) {
          paramNewsletter = {
            nome: state.novoNome,
            email: state.novoEmail,
            recebeEmail: "S",
            data: new Date(),
          };

          await api.post("/customer/newsletter", paramNewsletter, true);
        }

        dispatch({
          type: "LOGIN",
          payload: {
            codigo: data.msg.codigo,
            nome: data.msg.nome,
            email: data.msg.email,
            cpf: data.msg.cpf,
            status: true,
            avatar: "",
            token: null,
          },
        });

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "sign_up",
          method: "Cadastro",
        });

        if (window && window.fbq) {
          window.fbq("track", "CompleteRegistration");
        }

        setTimeout(() => {
          setState((state) => ({ ...state, redirect: "/" }));
        }, 400);
      }
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", `Não foi possível criar conta. ${e.message}`, 2);
    } finally {
      setState((state) => ({ ...state, isLoadingNovo: false }));
    }
  };

  const toggleShow = (input) => {
    if (input === 1) {
      setState((state) => ({ ...state, hidden: !state.hidden }));
      return;
    }

    setState((state) => ({ ...state, confHidden: !state.confHidden }));
  };

  const _handleCheckCpf = async () => {
    setState((state) => ({ ...state, novoHasError: false }));

    if (Diversos.getnums(state.novoCpf).length === 11 && !Diversos.validateCPF(state.novoCpf)) {
      setMsg("error", "Atenção", "O CPF informado não é válido.", 2);
    } else if (Diversos.validateCPF(state.novoCpf)) {
      const param = {
        field: "cpf",
        value: state.novoCpf,
      };

      try {
        const data = await api.post(`/customer/check-customer`, param, true);

        if (data.status === true) {
          setMsg("error", "Atenção", "O CPF informado já possui um cadastro no site.", 2);
        }
      } catch (e) {
        console.error(e.message);
      }
    }
  };

  useEffect(() => {
    if (stateApp && stateApp.usuario && stateApp.usuario.status === true) {
      setState((state) => ({ ...state, redirect: "/meu-cadastro" }));
    }

    setState((state) => ({ ...state, toastOpen: true }));
  }, []);

  if (state.redirect) {
    router.push(state.redirect);
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
            <Image src={"/logo-branca.png"} alt={`Logo ${process.env.NEXT_PUBLIC_STORE_NAME || 'da loja'}`} width={130} height={50} />
          </Link>
        </Box>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              {`Olá! ${state.newUser ? "Conclua" : "Faça"} seu cadastro ${process.env.NEXT_PUBLIC_STORE_NAME ? `na ${process.env.NEXT_PUBLIC_STORE_NAME}` : 'em nossa loja'}!`}
            </Typography>

            {state.novoHasError && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                <Typography variant="subtitle1">{` - ${state.novoHasErrorTitle} - `}</Typography>
                <Typography>{state.novoHasErrorMsg}</Typography>
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmitNovo} sx={{ width: "100%", mt: 3 }}>
              <Grid container spacing={2}>
                {!state.newUser && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={state.novoEmail}
                      onChange={(event) =>
                        setState((state) => ({
                          ...state,
                          novoEmail: event.target.value,
                        }))
                      }
                      onBlur={validateEmail}
                      required
                      disabled={!!searchParams.get("email")}
                      InputProps={{
                        endAdornment: (state.checkingEmail || state.emailChecked) && (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Senha para login"
                    type={state.hidden ? "password" : "text"}
                    value={state.novoSenha}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoSenha: event.target.value,
                      }))
                    }
                    required
                    inputProps={{
                      minLength: 6,
                      pattern: ".{6,}",
                      title: "A senha deve ter no mínimo 6 caracteres",
                    }}
                    disabled={state.emailChecked}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => toggleShow(1)} edge="end">
                            {state.hidden ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={state.novoNome}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoNome: event.target.value,
                      }))
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CPF"
                    value={state.novoCpf}
                    onChange={(event) => {
                      setState((state) => ({
                        ...state,
                        novoCpf: Diversos.maskCPFString(event.target.value),
                      }));
                      _handleCheckCpf();
                    }}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Celular"
                    value={state.novoCelular}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoCelular: Diversos.maskTelefone(event.target.value),
                      }))
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={state.novoCep}
                    onChange={(event) => {
                      const tmp = Diversos.getnums(event.target.value);
                      if (tmp.length >= 8) {
                        setState((state) => ({
                          ...state,
                          novoCep: Diversos.maskCEP(event.target.value),
                        }));
                        getAddressByCep(event.target.value);
                      } else {
                        setState((state) => ({
                          ...state,
                          novoCep: Diversos.maskCEP(event.target.value),
                        }));
                      }
                    }}
                    disabled={state.isLoadingCep}
                    required
                    InputProps={{
                      endAdornment: state.isLoadingCep && (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Rua"
                    value={state.novoRua}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoRua: event.target.value,
                      }))
                    }
                    disabled={state.isLoadingCep}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Número"
                    value={state.novoNumero}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoNumero: event.target.value,
                      }))
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Complemento"
                    value={state.novoComplemento}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoComplemento: event.target.value,
                      }))
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bairro"
                    value={state.novoBairro}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoBairro: event.target.value,
                      }))
                    }
                    disabled={state.isLoadingCep}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={state.novoCidade}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoCidade: event.target.value,
                      }))
                    }
                    disabled={state.isLoadingCep}
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    select
                    label="Estado"
                    value={state.novoEstado}
                    onChange={(event) =>
                      setState((state) => ({
                        ...state,
                        novoEstado: event.target.value,
                      }))
                    }
                    disabled={state.isLoadingCep}
                    required
                  >
                    <MenuItem value="">Selecione</MenuItem>
                    {Diversos.getUFs().map((uf) => (
                      <MenuItem key={uf.value} value={uf.value}>
                        {uf.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={state.isLoadingNovo}>
                {state.isLoadingNovo ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleLoginGoogle}
                disabled={state.isLoadingGoogle}
                startIcon={state.isLoadingGoogle ? <CircularProgress size={20} /> : <Image src="/google-logo-login.png" width={20} height={20} alt="Google logo" />}
              >
                Cadastrar com o Google
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
                onClick={handleLoginApple}
                disabled={state.isLoadingApple}
                startIcon={state.isLoadingApple ? <CircularProgress size={20} /> : <Image src="/apple-logo-login.png" width={20} height={20} alt="Apple logo" />}
              >
                Cadastrar com sua conta Apple
              </Button>

              <Button fullWidth component={Link} href="/login" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
                Voltar
              </Button>
            </Box>
          </Paper>

          <Typography variant="body1" sx={{ mt: 3 }}>
            Já possui uma conta?{" "}
            <Link href="/login" underline="hover">
              Faça Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default function Cadastro() {
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
      <CadastroContent />
    </GoogleReCaptchaProvider>
  );
}
