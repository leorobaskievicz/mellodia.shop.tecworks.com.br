"use client";
// import UserSidebar from "@/app/components/UserSidebar";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";
import { useApp } from "@/app/context/AppContext";
import { useSearchParams, usePathname, redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Modal,
  TextField,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Skeleton,
  Paper,
  Grid,
  InputAdornment,
  Alert,
  Divider,
} from "@mui/material";
import { ContentCopy as ContentCopyIcon, LocalShipping as LocalShippingIcon, Search as SearchIcon, Login as LoginIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import OrderDetailsItem from "@/app/components/OrderDetailsItem";
import { getPixDetail } from "@/app/lib/funcoes";

function ConsultaPedidos() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { state: appState } = useApp();
  const api = new Api();
  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    pedidoAberto: false,
    modalDetails: false,
    cpf: "",
    pedidoNumero: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    pedidoCurrent: null,
    pedidoCurrentItems: null,
    isMobile: false,
    isLoadingPix: false,
    pix: null,
  });

  let textArea = React.createRef();

  const getOrderItemsAmount = (itens) => {
    let soma = 0;
    for (let i = 0; i < itens.length; i++) {
      soma += itens[i].QTD;
    }
    return soma;
  };

  useEffect(() => {
    setState({
      ...state,
      isMobile: window.innerWidth <= 992,
    });


    if (appState.usuario) {
      setState((state) => ({ ...state, redirect: "/meus-pedidos" }));
    }
  }, []);

  const getOrder = async () => {

    if (!state.pedidoNumero || !state.cpf) {
      setState((state) => ({ ...state, hasError: true, hasErrorTitle: "Atenção", hasErrorMsg: "Número do pedido e CPF são obrigatórios" }));
      return;
    }

    if (!Diversos.validateCPF(state.cpf)) {
      setState((state) => ({ ...state, hasError: true, hasErrorTitle: "Atenção", hasErrorMsg: "CPF inválido" }));
      return;
    }

    setState((state) => ({ ...state, isLoading: true }));

    try {
      const data = await api.get(`/public/order/${state.pedidoNumero}?cpf=${state.cpf}`, true);

      if (!data.status) {
        throw new Error(`Nenhum pedido localizado: ${data.msg}`);
      }
       
      setState((state) => ({
        ...state,
        pedidoCurrent: data.msg,
        modalDetails: true,
        isLoading: false
      }));
    } catch (e) {
      console.error(e);
      setState((state) => ({ ...state, isLoading: false }));
    }
  };

  const getOrderItems = async (pedido) => {
    setState((state) => ({ ...state, isLoadingItems: true }));

    try {
      const data = await api.get(`/order/${pedido}/items`, true);

      if (data.status === false) {
        throw new Error("Nenhum produto encontrado");
      } else {
        setState((state) => ({
          ...state,
          pedidoCurrentItems: data.msg,
        }));
      }
    } catch (e) {
      console.error(e);
      setState((state) => ({ ...state, pedidoCurrentItems: [] }));
    } finally {
      setState((state) => ({ ...state, isLoadingItems: false }));
    }
  };

  const getPix = async (pedido) => {
    setState((state) => ({ ...state, isLoadingPix: true }));

    try {
      const data = await getPixDetail(pedido);

      if (!data) {
        throw new Error("Nenhum pix encontrado");
      } else {
        setState((state) => ({
          ...state,
          pix: data,
        }));
      }
    } catch (e) {
      setState((state) => ({ ...state, pix: null }));
    } finally {
      setState((state) => ({ ...state, isLoadingPix: false }));
    }
  };

  useEffect(() => {
    if (state.pedidoCurrent) {
      getOrderItems(state.pedidoCurrent.PEDIDO);

      if (Number(state.pedidoCurrent.FORMAPG) === 4) {
        getPix(state.pedidoCurrent.PEDIDO);
      }
    }
  }, [state.pedidoCurrent]);

  const copyToClipboard = (e) => {
    textArea.select();
    document.execCommand("copy");
    e.target.focus();
    setState((state) => ({ ...state, copySuccess: "Copiado!" }));
  };

  const getSubTotal = (itens) => {
    let total = 0.0;
    for (let i = 0; i < itens.length; i++) {
      total += itens[i].QTD * itens[i].VALOR;
    }
    return total;
  };

  if (state.redirect) {
    redirect(state.redirect);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, width: {xs: '100%', md: '70%'}, mx: 'auto' }}>
        <Grid container spacing={3} sx={{ my: 5, p: {xs: 2, md: 7}, borderRadius: 2 }}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Consulta de Pedido
            </Typography>
          </Grid>

          <Grid item xs={12} md={12} lg={12} sx={{ display: "flex", gap: 2, flexDirection: "column", alignItems: "center", justifyContent: "center", mx: 'auto' }}>
            <Button component={Link} href="/meus-pedidos" fullWidth variant="contained" color="primary" disabled={state.isLoading} loading={state.isLoading}>
              <LoginIcon />
              Fazer Login
            </Button>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Divider sx={{ my: 2 }}>
              <Typography variant="h6" component="h2" gutterBottom align="center">
                ou
              </Typography>
            </Divider>
          </Grid>

          {
            state.hasError && (
              <Grid item xs={12} md={12} lg={12}>
                <Alert severity="error">
                  <Typography variant="h6" component="h2" gutterBottom align="left"> {state.hasErrorTitle} </Typography>
                  {state.hasErrorMsg}
                </Alert>
              </Grid>
            )
          }

          {
            !state.hasError && (
              <Grid item xs={12} md={12} lg={12}>
                <Typography component="h6" gutterBottom align="left" sx={{ mb: 2, fontWeight: '500', color: '#666' }}>
                  Informe abaixo o número do pedido e o CPF do comprador para consultar o pedido.
                </Typography>
              </Grid> 
            )
          }


          <Grid item xs={12} md={12} lg={12} sx={{ display: "flex", gap: 2, flexDirection: "column", alignItems: "center", justifyContent: "center", mx: 'auto' }}>
            <TextField label="Número do pedido" value={state.pedidoNumero} onChange={(e) => setState((state) => ({ ...state, pedidoNumero: e.target.value }))} fullWidth  />
            <TextField label="CPF" value={state.cpf} onChange={(e) => setState((state) => ({ ...state, cpf: Diversos.maskCPFString(e.target.value) }))} fullWidth />
            <Button onClick={getOrder} fullWidth variant="contained" color="primary" disabled={state.isLoading} loading={state.isLoading}>
              <SearchIcon />
              Consultar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Modal
        open={state.modalDetails}
        onClose={() =>
          setState((state) => ({
            ...state,
            modalDetails: !state.modalDetails,
            pedidoCurrent: null,
            pedidoCurrentItems: null,
          }))
        }
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: "90vw",
            height: "auto",
            maxHeight: "95vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {!state.pedidoCurrent ? (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Detalhes da compra
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Nenhum pedido selecionado.
              </Typography>
            </>
          ) : (
            <>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Pedido #{state.pedidoCurrent.PEDIDO}
              </Typography>
              <Typography variant="subtitle1">Detalhes da compra</Typography>

              <Box sx={{ mt: 2 }}>
                {state.pedidoCurrent && state.pedidoCurrent.baseLinkerOrder && state.pedidoCurrent.baseLinkerOrder.base_linker_url ? (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Rastreamento do pedido
                    </Typography>

                    <Link href={state?.pedidoCurrent?.baseLinkerOrder?.base_linker_url} target="_blank">
                      <Button color="primary" fullWidth variant="contained" sx={{ my: 2 }}>
                        <LocalShippingIcon sx={{ mr: 1 }} />
                        Clique aqui para rastrear o pedido
                      </Button>
                    </Link>
                  </>
                ) : null}

                <Typography variant="h6" gutterBottom>
                  Dados do pedido
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">
                    <strong>Data:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {state.pedidoCurrent.DATA}
                    <small style={{ color: "#666", margin: "0 4px" }}>•</small>
                    {state.pedidoCurrent.HORA}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">
                    <strong>Forma de pagamento:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {state.pedidoCurrent.FORMAPG === 1 ? "Cartão de crédito" : state.pedidoCurrent.FORMAPG === 2 ? "Boleto Bancário" : "PIX"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2">
                    <strong>Status do pedido:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {Diversos.getStatusTitulo(state.pedidoCurrent.STATUS)}
                  </Typography>
                </Box>

                {state.pedidoCurrent.FORMAPG === 4 && (
                  <>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        <strong>Pix Copia e Cola:</strong>
                      </Typography>
                      {state.isLoadingPix ? (
                        <Skeleton height={40} width={200} />
                      ) : (
                        <TextField
                          value={state.pix?.status === "Gerado" ? state.pix?.qrcode : state.pix?.status === "Concluido" ? "Pix Pago" : "Expirado"}
                          variant="outlined"
                          size="medium"
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    navigator.clipboard.writeText(state.pix?.qrcode);
                                    // Adicionar feedback visual aqui se desejar
                                  }}
                                  edge="end"
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        <strong>Pix QRCode:</strong>
                      </Typography>
                      {state.isLoadingPix ? (
                        <Skeleton height={200} width={200} />
                      ) : state.pix?.status === "Gerado" ? (
                        <Image src={state.pix?.qrcode_image} alt="Pix QRCode" width={200} height={200} />
                      ) : state.pix?.status === "Concluido" ? (
                        <Typography variant="body2">Pix Pago</Typography>
                      ) : (
                        <Typography variant="body2">Expirado</Typography>
                      )}
                    </Box>
                  </>
                )}

                <Box sx={{ my: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Dados da entrega
                  </Typography>

                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body2">
                      <strong>Modo de envio:</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {state.pedidoCurrent.ENTREGA}
                    </Typography>
                  </Box>

                  {state.pedidoCurrent.ENTREGA !== "RETIRA EM LOJA" && (
                    <>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2">
                          <strong>CEP:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {state.pedidoCurrent.clienteDados.cep}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2">
                          <strong>Endereço:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {`${state.pedidoCurrent.clienteDados.rua}, ${state.pedidoCurrent.clienteDados.numero}`}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2">
                          <strong>Bairro:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {state.pedidoCurrent.clienteDados.bairro}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2">
                          <strong>Cidade:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {state.pedidoCurrent.clienteDados.cidade}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2">
                          <strong>UF:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {state.pedidoCurrent.clienteDados.estado}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body2">
                          <strong>Prazo de envio:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {state.pedidoCurrent.DTENTREGA}
                        </Typography>
                      </Box>
                    </>
                  )}

                  {state.pedidoCurrent.CODCORREIO && state.pedidoCurrent.CODCORREIO !== "1" && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Código de Rastreamento:</strong>
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <TextField
                          inputRef={(input) => (textArea = input)}
                          value={state.pedidoCurrent.CODCORREIO}
                          variant="standard"
                          fullWidth
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        {document.queryCommandSupported("copy") && (
                          <Tooltip title={state.copySuccess || "Copiar código"}>
                            <IconButton onClick={copyToClipboard}>
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box sx={{ my: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Produtos
                  </Typography>

                  {state.isLoadingItems ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress />
                    </Box>
                  ) : !state.pedidoCurrent.itens || state.pedidoCurrent.itens.length <= 0 ? (
                    <Typography variant="body2" color="warning">
                      Nenhum produto localizado para este pedido
                    </Typography>
                  ) : (
                    state.pedidoCurrent.itens.map((row, index) => <OrderDetailsItem item={row} key={index} />)
                  )}
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      <strong>Subtotal:</strong>
                    </Typography>
                    <Typography variant="body2">R$ {Diversos.number_format(getSubTotal(state.pedidoCurrent.itens), 2, ",", "")}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      <strong>Frete:</strong>
                    </Typography>
                    <Typography variant="body2">R$ {Diversos.number_format(state.pedidoCurrent.FRETE, 2, ",", "")}</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">
                      <strong>Desconto:</strong>
                    </Typography>
                    <Typography variant="body2">R$ {Diversos.number_format(state.pedidoCurrent.DESCONTO, 2, ",", "")}</Typography>
                  </Box>

                  {Number(state.pedidoCurrent.ACRESCIMO) > 0 && (
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">
                        <strong>Juros Parcelamento:</strong>
                      </Typography>
                      <Typography variant="body2">R$ {Diversos.number_format(state.pedidoCurrent.ACRESCIMO, 2, ",", "")}</Typography>
                    </Box>
                  )}

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="body1">
                      <strong>Total da compra:</strong>
                    </Typography>
                    <Typography variant="body1">
                      R${" "}
                      {Diversos.number_format(
                        getSubTotal(state.pedidoCurrent.itens) + state.pedidoCurrent.FRETE - state.pedidoCurrent.DESCONTO + state.pedidoCurrent.ACRESCIMO,
                        2,
                        ",",
                        ""
                      )}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() =>
                      setState((state) => ({
                        ...state,
                        modalDetails: !state.modalDetails,
                        pedidoCurrent: null,
                        pedidoCurrentItems: null,
                      }))
                    }
                  >
                    Fechar
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default ConsultaPedidos;
