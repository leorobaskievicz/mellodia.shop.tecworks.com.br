"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Grid, Card, CardHeader, CardContent, CardActions, Typography, Button, Box, CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PrintIcon from "@mui/icons-material/Print";
import { useApp } from "@/app/context/AppContext";
import { Diversos } from "@/app/lib/diversos";
import Api from "@/app/lib/api";
import moment from "moment";

export default function CheckoutOrcamento() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orcamentoId = searchParams.get("id");
  const { state: appState, dispatch } = useApp();

  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    mdDevice: false,
    pedido: null,
  });

  useEffect(() => {
    if (orcamentoId && Number(orcamentoId) > 0) {
      const api = new Api();
      const getOrcamento = async () => {
        const data = await api.get(`/orcamento/${orcamentoId}`);

        if (data && data.status && data.msg && data.msg.ORCAMENTO) {
          setState((state) => ({ ...state, pedido: data.msg }));
        }
      };

      getOrcamento();
    }
  }, [orcamentoId]);

  const getSubTotal = () => {
    if (!state.pedido || !state.pedido.itens) return 0;

    let total = 0.0;
    for (let i = 0; i < state.pedido.itens.length; i++) {
      total += parseInt(state.pedido.itens[i].QTD) * parseFloat(state.pedido.itens[i].VALOR);
    }
    return total;
  };

  const handlePrint = () => {
    window.print();
  };

  // Redirect se não tiver ID válido
  if (!orcamentoId || Number(orcamentoId) <= 0) {
    router.push("/");
    return null;
  }

  // Loading state
  if (!state.pedido || !state.pedido.ORCAMENTO) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={7}>
            <Card>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    <Typography variant="h6">Orçamento</Typography>
                  </Box>
                }
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  <CircularProgress />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <style jsx global>{`
        @media print {
          button,
          nav,
          .no-print {
            display: none !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .page-break {
            page-break-before: always;
          }
        }
        @page {
          size: A4;
          margin: 12mm;
        }
      `}</style>

      <Grid container spacing={3} justifyContent="center">
        <Grid className="no-print" item xs={12} lg={7}>
          <Button variant="outlined" fullWidth color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
            Imprimir orçamento
          </Button>
        </Grid>
        <Grid item xs={12} lg={7}>
          <Card className="no-print">
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6">Orçamento</Typography>
                </Box>
              }
            />
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Seu orçamento foi gravado com sucesso!
              </Typography>

              <CheckCircleIcon sx={{ fontSize: 100, color: "success.main", mb: 2 }} />

              <Typography variant="body1" sx={{ mb: 2 }}>
                O número do seu orçamento é:
              </Typography>

              <Typography variant="h3" sx={{ mb: 2 }}>
                {orcamentoId}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AssignmentIcon />
                  <Typography variant="h6">Detalhes do orçamento</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Data {state.pedido.DATA}
                </Typography>
                <Typography variant="body1">Comprador {state.pedido?.clienteDados?.NOME || ""}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Produtos:
                </Typography>
                {state.pedido.itens.map((row, index) => (
                  <Box key={index} sx={{ mb: 2, borderTop: "1px solid #D9D9D9", pt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {`${row.produtoDados?.NOME || ""}`}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Qtde.
                        </Typography>
                        <Typography variant="body1">{row.QTD}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Unid.
                        </Typography>
                        <Typography variant="body1">R$ {Diversos.number_format(row.VALOR, 2, ",", ".")}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                        <Typography variant="body1">R$ {Diversos.number_format(row.VALOR * row.QTD, 2, ",", ".")}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Forma de pagamento:
                    </Typography>
                    <Typography variant="body1">
                      {state.pedido && state.pedido.FORMAPG === 1 ? (
                        <>
                          Cartão de crédito <br />
                          {state.pedido.CONDPA > 0 ? `Parcelado em ${state.pedido.CONDPA}x` : `A vista`}
                        </>
                      ) : (
                        "PIX"
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Forma de entrega:
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Forma:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">{state.pedido.TIPOENTREGA}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Prazo:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">{state.pedido.DTENTREGA}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Preço:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">R$ {Diversos.number_format(state.pedido.FRETE, 2, ",", "")}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {String(state.pedido.TIPOENTREGA).toLowerCase().indexOf("retira") > -1 ? "Endereço de retirada:" : "Endereço de entrega:"}
                    </Typography>
                    <Typography variant="body2">
                      {String(state.pedido.TIPOENTREGA).toLowerCase().indexOf("retira") > -1 ? (
                        <>
                          Loja: {state.pedido.lojaDados.CODIGO} <br />
                          {state.pedido.lojaDados.ENDER}, {state.pedido.lojaDados.NREND} <br />
                          {state.pedido.lojaDados.BAIR} <br />
                          {state.pedido.lojaDados.CIDA} - {state.pedido.lojaDados.ESTA} <br />
                          {state.pedido.lojaDados.CEP}
                        </>
                      ) : (
                        <>
                          {state.pedido.clienteDados.ENDE}, {state.pedido.clienteDados.NREND} <br />
                          {state.pedido.clienteDados.BAIR} <br />
                          {state.pedido.clienteDados.CIDA} - {state.pedido.clienteDados.ESTA} <br />
                          {state.pedido.clienteDados.CEP} <br />
                          {state.pedido.clienteDados.COMPLEMENTO} <br />
                        </>
                      )}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Resumo:
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Subtotal
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" align="right">
                          R$ {Diversos.number_format(getSubTotal(), 2, ",", "")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Frete
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" align="right">
                          R$ {Diversos.number_format(state.pedido.FRETE, 2, ",", "")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Desconto
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" align="right">
                          R$ {Diversos.number_format(state.pedido.DESCONTO, 2, ",", "")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold">
                          TOTAL
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold" align="right">
                          R$ {Diversos.number_format(getSubTotal() + parseFloat(state.pedido.FRETE) - parseFloat(state.pedido.DESCONTO), 2, ",", "")}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions sx={{ justifyContent: "center", p: 2 }}>
              <Button variant="contained" color="primary" startIcon={<ArrowBackIcon />} onClick={() => router.push("/")}>
                Voltar para loja
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} lg={7} className="no-print">
          <Button variant="contained" fullWidth color="primary" startIcon={<PrintIcon />} onClick={handlePrint}>
            Imprimir orçamento
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
