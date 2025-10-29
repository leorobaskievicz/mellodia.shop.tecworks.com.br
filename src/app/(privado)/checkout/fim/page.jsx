"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, Card, CardHeader, CardContent, CardActions, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useApp } from "@/app/context/AppContext";
import { Diversos } from "@/app/lib/diversos";
import moment from "moment";
import insights from "@/app/lib/algoliaInsights";

export default function CheckoutFim() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    pedido: appState.ultimoPedido,
    mdDevice: false,
    alreadyCopy: false,
  });

  useEffect(() => {
    if (sessionStorage.getItem("algoliaReturn")) {
      const algoliaReturn = JSON.parse(sessionStorage.getItem("algoliaReturn"));
      sessionStorage.removeItem("algoliaReturn");
      insights("convertedObjectIDsAfterSearch", {
        eventName: "Finalizou compra",
        index: algoliaReturn.index,
        objectIDs: appState.carrinho.map((produto) => produto.CODIGO),
        positions: appState.carrinho.map((produto, index) => produto.indexAlgolia || index),
        queryID: algoliaReturn.queryID,
      });
    }

    dispatch({ type: "UNSET_ULTIMO_PEDIDO" });
    dispatch({ type: "LIMPAR_CARRINHO" });

    const tmpItems = [];
    let total = 0;

    for (let i = 0; i < state.pedido.itens.length; i++) {
      tmpItems.push({
        item_name: state.pedido.itens[i].nome,
        item_id: state.pedido.itens[i].produto,
        price: state.pedido.itens[i].valor,
        index: i + 1,
        quantity: state.pedido.itens[i].qtd,
        complemento: state.pedido.itens[i].complemento,
      });

      total += Number(state.pedido.itens[i].qtd) * Number(state.pedido.itens[i].valor);
    }

    total += Number(state.pedido.frete);
    total += Number(state.pedido.acrescimo);
    total -= Number(state.pedido.desconto);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: state.pedido.pedido,
        affiliation: "www.www.dricor.com.br",
        value: !total || total <= 0 || isNaN(total) ? 0.01 : total,
        tax: "0",
        shipping: state.pedido.frete,
        currency: "BRL",
        coupon: state.pedido.cupom,
        items: tmpItems,
      },
    });

    setTimeout(() => {
      Diversos.sendCartData(appState.usuario?.codigo, appState.carrinho);
      session_id = window.crypto.randomUUID();
      localStorage.setItem("session_id", session_id);
    }, 1000);

    setState((prev) => ({ ...prev, mdDevice: window.innerWidth <= 1200 }));

    if (window && window.fbq) {
      window.fbq("track", "Purchase", { value: total, currency: "BRL" });
    }

    const googleProducts = [];

    for (let i = 0; i < state.pedido.itens.length; i++) {
      googleProducts.push({
        gtin: state.pedido.itens[i].produto,
      });
    }

    window.renderOptIn = () => {
      window.gapi.load("surveyoptin", () => {
        window.gapi.surveyoptin.render({
          merchant_id: 723343576,
          order_id: state.pedido.pedido,
          email: state.pedido.cliente.email,
          delivery_country: "BRL",
          estimated_delivery_date: moment(state.pedido.dtentrega, "DD/MM/YYYY").format("YYYY-MM-DD"),
          products: googleProducts,
        });
      });
    };
  }, []);

  const getSubTotal = () => {
    let total = 0.0;

    for (let i = 0; i < state.pedido.itens.length; i++) {
      total += parseInt(state.pedido.itens[i].qtd) * parseFloat(state.pedido.itens[i].valor);
    }

    return total;
  };

  if (state.redirect) {
    return router.push(state.redirect);
  }

  if (!state || !state.pedido || !state.pedido.pedido || state.pedido.pedido <= 1) {
    return router.push("/");
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  <Typography variant="h6">Pedido Confirmado</Typography>
                </Box>
              }
            />
            <CardContent sx={{ textAlign: "center" }}>
              {state.pedido && state.pedido.formapg === 4 && state.pedido.pix && (
                <>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Seu PIX foi gerado com sucesso!
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Valor: {Diversos.maskPreco(state.pedido.pix.valor.toString())}
                    </Typography>
                    <Box component="img" src={state.pedido.pix.qrcode_image} alt="QRCode Pix para pagamento" sx={{ width: 250, height: "auto", mb: 2 }} />
                    <Typography variant="body2">
                      <strong>Pix copia e cola: </strong>
                      {state.pedido.pix.qrcode}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={state.isLoading}
                    onClick={async () => {
                      navigator.clipboard.writeText(state.pedido.pix.qrcode);
                      await new Promise((resolve) => setTimeout(() => resolve(true), 850));
                      setState((prev) => ({ ...prev, alreadyCopy: true }));
                    }}
                    sx={{ mb: 2 }}
                  >
                    {state.alreadyCopy ? (
                      <>
                        <CheckCircleIcon sx={{ mr: 1 }} /> Copiado
                      </>
                    ) : (
                      <>
                        <ContentCopyIcon sx={{ mr: 1 }} /> Copiar Pix
                      </>
                    )}
                  </Button>
                </>
              )}

              <Typography variant="h4" sx={{ mb: 2 }}>
                Seu pedido foi realizado com sucesso!
              </Typography>

              <CheckCircleIcon sx={{ fontSize: 100, color: "success.main", mb: 2 }} />

              <Typography variant="body1" sx={{ mb: 2 }}>
                O número do seu pedido é:
              </Typography>

              <Typography variant="h3" sx={{ mb: 2 }}>
                {state.pedido.pedido}
              </Typography>

              <Typography variant="body1">
                Você receberá uma notificação no e-mail{" "}
                <Typography component="span" sx={{ fontWeight: "bold" }}>
                  {state.pedido.cliente.email}
                </Typography>{" "}
                com todos os detalhes do pedido.
                <br />
                Aguardamos a confirmação do pagamento.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          lg={5}
          sx={{
            position: { xs: "static", md: "sticky" },
            top: 24,
            height: "fit-content",
            alignSelf: "flex-start",
          }}
        >
          <Card>
            <CardHeader
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AssignmentIcon />
                  <Typography variant="h6">Detalhes do pedido</Typography>
                </Box>
              }
            />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  Compra realizada em {state.pedido.data} às {state.pedido.hora}
                </Typography>
                <Typography variant="body1">Comprado por {state.pedido.cliente.nome}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Produtos:
                </Typography>
                {state.pedido.itens.map((row, index) => (
                  <Box key={index} sx={{ mb: 2, borderTop: "1px solid #D9D9D9", pt: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {`${row.nome} ${row.complemento && String(row.complemento).trim() !== "" ? ` - ${row.complemento}` : ""}`}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Qtde.
                        </Typography>
                        <Typography variant="body1">{row.qtd}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Unid.
                        </Typography>
                        <Typography variant="body1">R$ {Diversos.number_format(row.valor, 2, ",", ".")}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Total
                        </Typography>
                        <Typography variant="body1">R$ {Diversos.number_format(row.valor * row.qtd, 2, ",", ".")}</Typography>
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
                      {state.pedido && state.pedido.formapg === 1 ? (
                        <>
                          Cartão de crédito <br />
                          {state.pedido.cartao.bandeira} (final ...{state.pedido.cartao.numero}) <br />
                          {state.pedido.cartao.parcelas && state.pedido.cartao.parcelas > 0 ? `Parcelado em ${state.pedido.cartao.parcelas}x` : `A vista`}
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
                        <Typography variant="body2">{state.pedido.entrega}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Prazo:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">{state.pedido.dtentrega}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body2" color="text.secondary">
                          Preço:
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="body2">R$ {Diversos.number_format(state.pedido.frete, 2, ",", "")}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      {String(state.pedido.entrega).toLowerCase().indexOf("retira") > -1 ? "Endereço de retirada:" : "Endereço de entrega:"}
                    </Typography>
                    <Typography variant="body2">
                      {String(state.pedido.entrega).toLowerCase().indexOf("retira") > -1 ? (
                        <>
                          {state.pedido.lojaDados.ENDER}, {state.pedido.lojaDados.NREND}, <br />
                          {state.pedido.lojaDados.BAIR} <br />
                          {state.pedido.lojaDados.CIDA} - {state.pedido.lojaDados.ESTA} <br />
                          {state.pedido.lojaDados.CEP}
                        </>
                      ) : (
                        <>
                          {state.pedido.cliente.rua}, {state.pedido.cliente.numero}, <br />
                          {state.pedido.cliente.complemento} <br />
                          {state.pedido.cliente.bairro} <br />
                          {state.pedido.cliente.cidade} - {state.pedido.cliente.estado} <br />
                          {state.pedido.cliente.cep}
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
                          R$ {Diversos.number_format(state.pedido.frete, 2, ",", "")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Desconto
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" align="right">
                          R$ {Diversos.number_format(state.pedido.desconto, 2, ",", "")}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold">
                          TOTAL
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold" align="right">
                          R$ {Diversos.number_format(getSubTotal() + parseFloat(state.pedido.frete) - parseFloat(state.pedido.desconto), 2, ",", "")}
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
      </Grid>
    </Box>
  );
}
