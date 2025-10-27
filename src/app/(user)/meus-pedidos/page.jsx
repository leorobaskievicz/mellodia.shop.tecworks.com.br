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
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon, ContentCopy as ContentCopyIcon, FireTruck as FireTruckIcon, LocalShipping as LocalShippingIcon } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import OrderDetailsItem from "@/app/components/OrderDetailsItem";
import Paginacao from "@/app/components/Paginacao";
import UserSidebar from "@/app/components/UserSidebar";
import withAuth from "@/app/components/withAuth";
import { getPixDetail } from "@/app/lib/funcoes";

function MeusPedidos() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { state: appState } = useApp();
  const api = new Api();
  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    statusPedido: 0,
    showMore: false,
    pedidoAberto: false,
    modalDetails: false,
    copySuccess: "",
    email: "",
    senha: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    quantity: 1,
    accordionCollapse: false,
    pedidos: [],
    page: searchParams.get("page") || 1,
    total: 1,
    perPage: searchParams.get("perPage") || 1,
    lastPage: 1,
    isLoadingItems: false,
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
    if (!appState.usuario) {
      setState((state) => ({ ...state, redirect: "/login" }));
      return;
    }

    setState({
      ...state,
      isMobile: window.innerWidth <= 992,
    });

    getOrders();
  }, []);

  useEffect(() => {
    getOrders();
  }, [state.statusPedido]);

  useEffect(() => {
    getOrders();
  }, [state.page]);

  const handleChange = (event) => {
    setState((state) => ({ ...state, quantity: event.target.value }));
  };

  const getOrders = async () => {
    setState((state) => ({ ...state, isLoading: true }));

    const param = {
      cliente: appState.usuario.codigo,
      page: state.page,
      perPage: 25,
      status: state.statusPedido,
    };

    try {
      const data = await api.post(`/orders`, param, true);

      if (!data.status) {
        throw new Error(`Nenhum pedido localizado: ${data.msg}`);
      } else {
        setState((state) => ({
          ...state,
          pedidos: data.msg.data.map((row) => ({ ...row })),
          page: data.msg.page,
          perPage: data.msg.perPage,
          lastPage: data.msg.lastPage,
          total: data.msg.total,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
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

  const orderStatus = (s) => {
    if (s === 8) return "pedido-cancelado";
    else if (s === 6) return "pedido-concluido";
    else if (s === 5) return "pedido-enviado";
  };

  const copyToClipboard = (e) => {
    textArea.select();
    document.execCommand("copy");
    e.target.focus();
    setState((state) => ({ ...state, copySuccess: "Copiado!" }));
  };

  const getTotalPedido = (pedido) => {
    let total = 0.0;
    for (let i = 0; i < pedido.itens.length; i++) {
      total += pedido.itens[i].QTD * pedido.itens[i].VALOR;
    }
    return total;
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <UserSidebar />
        </Grid>

        <Grid item xs={12} md={8} lg={9}>
          <Typography variant="h4" component="h2" gutterBottom>
            Meus Pedidos
          </Typography>

          <Select value={String(state.statusPedido)} onChange={(e) => setState({ ...state, statusPedido: e.target.value })} fullWidth sx={{ mb: 3 }}>
            <MenuItem value="0">Todos os Pedidos</MenuItem>
            <MenuItem value="1">Pendente</MenuItem>
            <MenuItem value="2">Aguardando Confirmação</MenuItem>
            <MenuItem value="6">Entregue</MenuItem>
            <MenuItem value="8">Cancelado</MenuItem>
          </Select>

          {state.isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : !state.pedidos || state.pedidos.length < 1 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                0
              </Typography>
              <Image src={"/oil.svg"} alt="Sem Pedidos" width={300} height={250} />
              <Typography variant="h6" gutterBottom>
                Você ainda não fez nenhum pedido
              </Typography>
              <Typography variant="body1">Navegue por nossa loja e encontre seus produtos favoritos</Typography>
            </Paper>
          ) : (
            <>
              {state.pedidos.map((row, index) => (
                <Accordion key={`pedido-${row.PEDIDO}`} sx={{ mb: 2 }} defaultExpanded={true}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    onClick={() =>
                      setState((state) => ({
                        ...state,
                        pedidoAberto: !state.pedidoAberto,
                      }))
                    }
                  >
                    <Typography>Pedido #{row.PEDIDO}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          <strong>Itens:</strong>
                        </Typography>
                        {row.itens.map((row2, index2) => (
                          <Box key={index2} display="flex" alignItems="center" mb={1}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {row2.QTD}x
                            </Typography>
                            <Typography variant="body2">
                              {row2.produtoDados
                                ? `${row2.produtoDados.NOME} ${row2.ATRIBUTO_VALOR && String(row2.ATRIBUTO_VALOR).trim() !== "" ? ` - ${row2.ATRIBUTO_VALOR}` : ""}`
                                : ""}
                            </Typography>
                          </Box>
                        ))}
                        <Typography variant="caption" display="block" textAlign="right">
                          {getOrderItemsAmount(row.itens)} itens
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Data:</strong> {row.DATA}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Valor:</strong> R$ {Diversos.number_format(getSubTotal(row.itens) + row.FRETE - row.DESCONTO + row.ACRESCIMO, 2, ",", "")}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                          <strong>Pagamento:</strong>
                          {row.FORMAPG === 1 ? "Cartão de crédito" : row.FORMAPG === 2 ? "Boleto Bancário" : "PIX"}
                        </Typography>
                        <Typography variant="body2">
                          <strong className={`pedido-status ${orderStatus(row.STATUS)}`}>Status:</strong> {Diversos.getStatusTitulo(row.STATUS)}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        {row.ingressoDados ? (
                          <Button variant="text" href={row.ingressoDados.pdf_link} target="_self" startIcon={<i className="fas fa-print" />}>
                            Imprimir Ingressos
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="text"
                              onClick={() => {
                                setState((state) => ({
                                  ...state,
                                  modalDetails: !state.modalDetails,
                                  pedidoCurrent: row,
                                }));
                              }}
                            >
                              Ver detalhes do pedido
                            </Button>
                            {row && row.baseLinkerOrder && row.baseLinkerOrder.base_linker_url ? (
                              <Link href={row.baseLinkerOrder?.base_linker_url} target="_blank">
                                <Button color="primary" fullWidth variant="contained" sx={{ my: 2 }}>
                                  <LocalShippingIcon sx={{ mr: 1 }} />
                                  Clique aqui para rastrear o pedido
                                </Button>
                              </Link>
                            ) : null}
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
          )}

          <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Paginacao page={state.page} perPage={state.perPage} lastPage={state.lastPage} />
          </Box>
        </Grid>
      </Grid>

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
                      {/* eslint-disable no-nested-ternary */}
                      {state.isLoadingPix ? (
                        <Skeleton height={40} width={200} />
                      ) : state.pedidoCurrent.PIX_CODIGO ? (
                        <TextField
                          value={Number(state.pedidoCurrent.STATUS) === Number(7) ? state.pedidoCurrent.PIX_CODIGO : "Não disponível"}
                          variant="outlined"
                          size="medium"
                          fullWidth
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    navigator.clipboard.writeText(state.pedidoCurrent.PIX_CODIGO);
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

export default withAuth(MeusPedidos);
