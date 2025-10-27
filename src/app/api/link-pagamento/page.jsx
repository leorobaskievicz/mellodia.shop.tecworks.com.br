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
  const d = searchParams.get("d");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let chamada = false;

    const getCart = async () => {
      if (chamada) return;
      chamada = true;
      setLoading(true);

      try {
        const result = await api.get(`/cart/1?session_id=${d}`);

        if (!result || !result.status) {
          // Tratamento específico de erros
          if (result?.msg?.includes("já foi utilizado")) {
            setErro("Este link já foi utilizado. Solicite um novo link ao vendedor.");
          } else if (result?.msg) {
            setErro(result.msg);
          } else {
            setErro("Link inválido ou expirado. Solicite um novo link ao vendedor.");
          }
          setLoading(false);
          return;
        }

        // Validar dados do carrinho
        if (!result.msg || !result.msg.itens || result.msg.itens.length === 0) {
          setErro("Carrinho vazio ou inválido. Solicite um novo link ao vendedor.");
          setLoading(false);
          return;
        }

        dispatch({
          type: "LIMPAR_CARRINHO",
          payload: {},
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        dispatch({
          type: "LOGOUT",
          payload: {},
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        dispatch({
          type: "LOGIN",
          payload: {
            codigo: result.msg?.clienteDados?.codigo,
            nome: String(result.msg?.clienteDados?.nome || "Cliente").trim(),
            email: result.msg?.clienteDados?.email,
            cpf: result.msg?.clienteDados?.cpf,
            status: true,
            avatar: "",
            token: null,
            vendedor: null,
          },
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        // Usar SETAR_CARRINHO em vez de ADICIONAR_AO_CARRINHO para evitar somar quantidades
        const carrinhoItens = result?.msg?.itens
          .filter((item) => item.produtoDados)
          .map((item) => ({
            ...item.produtoDados,
            ESTOQUE: item.produtoDados.ESTOQUE || item.ESTOQUE,
            qtd: item.QTD,
            PRECO: item.PRECO,
            PREPRO: item.PRECO_PROMOCIONAL,
          }));

        dispatch({
          type: "SETAR_CARRINHO",
          payload: carrinhoItens,
        });

        dispatch({
          type: "SET_LINK_CARRINHO",
          payload: {
            formaPagamento: result.msg.FORMA_PAGAMENTO,
            formaEntrega: result.msg.FORMA_ENTREGA,
            formaEntregaLoja: result.msg.FORMA_ENTREGA_LOJA,
            cupomDesconto: result.msg.CUPOM_DESCONTO,
            desconto: result.msg.DESCONTO,
            freteGratis: result.msg.FRETE_GRATIS,
            vendedor: result.msg.VENDEDOR,
            cep: result.msg?.clienteDados?.cep,
          },
        });

        router.push("/checkout/pagamento");
      } catch (err) {
        console.error("Erro ao recuperar carrinho:", err);

        let mensagemErro = "Não foi possível recuperar o carrinho. ";

        if (err?.response?.data?.msg) {
          mensagemErro = err.response.data.msg;
        } else if (err?.message?.includes("E_MISSING_DATABASE_ROW") || err?.message?.includes("not found")) {
          mensagemErro = "Link inválido ou expirado. Solicite um novo link ao vendedor.";
        } else if (err?.message) {
          mensagemErro += err.message;
        } else {
          mensagemErro += "Tente novamente ou solicite um novo link.";
        }

        setErro(mensagemErro);
      } finally {
        setLoading(false);
      }
    };

    getCart();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        {loading && (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
            <Typography variant="body1" mt={2}>
              Recuperando carrinho...
            </Typography>
          </Box>
        )}

        {!loading && erro && <Alert severity="error">{erro}</Alert>}
      </Paper>
    </Container>
  );
}
