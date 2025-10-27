// Página de callback do Supabase, aprimorada
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";
import Api from "@/app/lib/api";
import { useApp } from "@/app/context/AppContext";
import { Container, Typography, CircularProgress, Box, Alert, TextField, Button, Paper } from "@mui/material";
import { Diversos } from "@/app/lib/diversos";

export default function AuthCallback() {
  const { dispatch, state: stateApp } = useApp();
  const router = useRouter();
  const api = new Api();
  const searchParams = useSearchParams();
  const redirectParam = searchParams?.get("redirect") || "/";

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ nome: "", cpf: "" });
  const [supabaseData, setSupabaseData] = useState(null);

  useEffect(() => {
    let chamada = false;

    const finalizeLogin = async () => {
      if (chamada) return;
      chamada = true;
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setErro("Sessão inválida ou expirada.");
        setLoading(false);
        return;
      }

      const { user } = session;

      const email = user.email;
      const nome = user.user_metadata.full_name;
      const uid = user.id;

      if (!formData.nome) {
        setFormData({ ...formData, nome });
      }

      try {
        const result = await api.post("/customer/login-supabase", { email, supabase_uid: uid, nome });

        if (result.status) {
          if (result.msg.novoCadastro || !result.msg.cpf || !Diversos.validateCPF(result.msg.cpf)) {
            setSupabaseData({ email, uid, nome });
            setFormVisible(true);
          } else {
            dispatch({
              type: "LOGIN",
              payload: {
                codigo: result.msg.cliente_id,
                nome: result.msg.nome,
                email: result.msg.email,
                status: true,
                avatar: "",
                token: null,
                vendedor: result.msg.vendedor,
              },
            });

            Diversos.sendCartData(result.msg.cliente_id, stateApp.carrinho);

            router.push(redirectParam === "pedidos" ? "/meus-pedidos" : "/");
          }
        } else {
          setErro("Não foi possível validar sua conta. Tente novamente mais tarde.");
        }
      } catch (err) {
        console.error(err);
        setErro("Erro na comunicação com a API. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    finalizeLogin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    if (!formData.nome || !formData.cpf || formData.cpf.length < 14) {
      setErro("Preencha todos os campos corretamente.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/customer", {
        email: supabaseData.email,
        googleid: supabaseData.uid,
        nome: formData.nome,
        cpf: formData.cpf,
      });

      if (response.status) {
        dispatch({
          type: "LOGIN",
          payload: {
            codigo: response.msg.codigo,
            nome: response.msg.nome,
            email: response.msg.email,
            status: true,
            avatar: "",
            token: null,
            vendedor: response.msg.vendedor,
          },
        });
        router.push(redirectParam === "pedidos" ? "/meus-pedidos" : "/");
      } else {
        setErro(response.msg);
      }
    } catch (e) {
      setErro("Erro ao cadastrar usuário. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        {loading && (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Conectando com sua conta...
            </Typography>
          </Box>
        )}

        {!loading && erro && <Alert severity="error">{erro}</Alert>}

        {formVisible && (
          <Box component="form" onSubmit={handleSubmit} mt={2} mb={4}>
            <Typography variant="h6" gutterBottom>
              Conclua seu cadastro
            </Typography>

            <TextField label="Nome completo" fullWidth value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} sx={{ mb: 2 }} required />

            <TextField
              label="CPF"
              fullWidth
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: Diversos.maskCPFString(e.target.value) })}
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 14 }}
              required
            />

            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              Finalizar Cadastro
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
