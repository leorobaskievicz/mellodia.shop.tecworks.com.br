"use client";
import Api from "@/app/lib/api";
import { useApp } from "@/app/context/AppContext";
import moment from "moment";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Button, Grid, Paper, CircularProgress, IconButton, Divider, TextField } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, ShoppingCart as ShoppingCartIcon } from "@mui/icons-material";
import UserSidebar from "@/app/components/UserSidebar";
import Link from "next/link";
import Image from "next/image";
import withAuth from "@/app/components/withAuth";
import { Diversos } from "@/app/lib/diversos";

function MeuCadastro() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { state: appState, dispatch } = useApp();
  const api = new Api();
  const [state, setState] = useState({
    redirect: null,
    pswHidden: true,
    confHidden: true,
    currentStep: 1,
    pagamento: true,
    produtos: [],
    isLoadingCustomer: true,
    customer: null,
    customerHasError: false,
    customerHasErrorTitle: null,
    customerHasErrorMsg: null,
    customerHasSuccess: false,
    customerHasSuccessTitle: null,
    customerHasSuccessMsg: null,
    isLoadingCep: false,
  });

  useEffect(() => {
    if (appState.usuario) {
      getCustomer();
    }

    getFavorites();
  }, []);

  useEffect(() => {
    getFavorites();
  }, [JSON.stringify(appState.favoritos)]);

  const toggleShow = (input) => {
    if (input === 1) {
      setState((state) => ({ ...state, pswHidden: !state.pswHidden }));
      return;
    }

    setState((state) => ({ ...state, confHidden: !state.confHidden }));
  };

  const getFavorites = async () => {
    if (!appState.favoritos || appState.favoritos.length <= 0) {
      return true;
    }

    setState((state) => ({ ...state, isLoadingProdutos: true }));

    const myparam = {
      codigos: appState.favoritos.map((q) => (typeof q === "object" && q.CODIGO ? q.CODIGO : q)),
    };

    try {
      const data = await api.post(`/product/favoritos/1?${queryString.stringify({ per_page: 50 })}`, myparam, true);

      if (!data.status) {
        throw new Error(`Falha ao buscar produtos`);
      }

      setState((state) => ({
        ...state,
        produtos: data.msg.data,
        produtosLastPage: data.msg.lastPage,
        page: data.msg.page,
        produtosPerPage: data.msg.perPage,
        produtosTotal: data.msg.total,
      }));
    } catch (e) {
      console.error(e);
      setState((state) => ({ ...state, produtos: [] }));
    } finally {
      setState((state) => ({ ...state, isLoadingProdutos: false }));
    }

    return true;
  };

  const getCustomer = async () => {
    setState((state) => ({ ...state, isLoadingCustomer: true }));

    try {
      const data = await api.get(`/customer/${appState.usuario.codigo}`, true);

      if (data.status === false) {
        throw new Error("Cadastro de cliente não localizado.");
      } else {
        setState((state) => ({ ...state, customer: data.msg }));
      }
    } catch (e) {
      console.error(e);

      setState((state) => ({
        ...state,
        customer: null,
        customerHasError: true,
        customerHasErrorTitle: "Cadastro não localizado",
        customerHasErrorMsg: e.message,
      }));
    } finally {
      setState((state) => ({ ...state, isLoadingCustomer: false }));
    }
  };

  const handleAddCart = async (index) => {
    const produto = state.produtos[index];
    let pic = "";

    let preco = produto.PRECO;
    const precoOriginal = produto.PRECO;

    if (produto.PREPRO > 0 && produto.PREPRO < produto.PRECO && moment(produto.INIPRO) <= moment() && moment(produto.FIMPRO) >= moment()) {
      preco = produto.PREPRO;
    }

    if (produto.FOTOS && produto.FOTOS.length > 0) {
      pic = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PICTURE}/${produto.FOTOS[0].link}`;
    } else {
      pic = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PICTURE}/produto-sem-imagem.png`;
    }

    dispatch({
      type: "ADICIONAR_AO_CARRINHO",
      payload: {
        ...produto,
        qtd: 1,
      },
    });

    dispatch({
      type: "SET_CART_OPEN",
      payload: true,
    });
  };

  const clearFavs = () => {
    setState((state) => ({ ...state, produtos: [] }));
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { favorites: [] },
    });
  };

  const removeFav = (index) => {
    dispatch({
      type: "REMOVER_FAVORITO",
      payload: state.produtos[index].CODIGO,
    });
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
            Meu Perfil
          </Typography>

          {state.isLoadingCustomer ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : state.customerHasError ? (
            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" color="error" gutterBottom>
                {state.customerHasErrorTitle}
              </Typography>
              <Typography variant="body1">{state.customerHasErrorMsg}</Typography>
            </Paper>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h5">Dados da conta</Typography>
                  <Link href="/perfil/editar/email" passHref>
                    <IconButton title="Clique para editar">
                      <EditIcon />
                    </IconButton>
                  </Link>
                </Box>

                <Paper elevation={0} sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="E-mail"
                        value={state.customer.email}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Senha"
                        value="******"
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h5">Dados pessoais</Typography>
                  <Link href="/perfil/editar/info" passHref>
                    <IconButton title="Clique para editar">
                      <EditIcon />
                    </IconButton>
                  </Link>
                </Box>

                <Paper elevation={0} sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nome"
                        value={state.customer.nome.split(" ")[0]}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Sobrenome"
                        value={state.customer.nome.split(" ")[1] || ""}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={Diversos.validateCNPJ(state.customer.cpf) ? "CNPJ" : "CPF"}
                        value={state.customer.cpf}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Data de Nascimento"
                        value={state.customer.nascimento}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefone"
                        value={state.customer.celular}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Celular"
                        value={state.customer.telefone || "-"}
                        InputProps={{
                          readOnly: true,
                        }}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Reset de Senha
                </Typography>
                <Button component={Link} href="/atualiza-senha" variant="text" color="primary">
                  Solicitar uma mudança de senha
                </Button>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h5">Endereço de Entrega</Typography>
                  <Link href="/perfil/editar/endereco" passHref>
                    <IconButton title="Clique para editar">
                      <EditIcon />
                    </IconButton>
                  </Link>
                </Box>

                {state.pagamento ? (
                  <Paper elevation={0} sx={{ p: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="CEP"
                          value={state.customer.cep}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Rua"
                          value={state.customer.rua}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Número"
                          value={state.customer.numero}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Bairro"
                          value={state.customer.bairro}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Cidade"
                          value={state.customer.cidade}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Estado"
                          value={state.customer.estado}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Complemento"
                          value={state.customer.complemento || "-"}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ) : (
                  <Paper elevation={0} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Você ainda não cadastrou nenhum endereço de entrega.
                    </Typography>
                    <Button component={Link} href="/editar/endereco" variant="text" color="primary">
                      Cadastrar agora
                    </Button>
                  </Paper>
                )}
              </Box>

              <Box id="grid-favoritos">
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h5">Favoritos</Typography>
                  <Button variant="outlined" color="error" onClick={clearFavs} startIcon={<DeleteIcon />}>
                    Remover Todos
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {state.produtos.map((row, index) => (
                    <Grid item xs={12} key={`fav-${index}`}>
                      <Paper elevation={0} sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Paper elevation={1} sx={{ p: 2, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <Grid item>
                              <IconButton color="error" onClick={() => removeFav(index)} title="Remover dos favoritos">
                                <DeleteIcon />
                              </IconButton>
                            </Grid>
                            <Grid item xs>
                              <Box display="flex" alignItems="center">
                                <Box
                                  sx={{
                                    position: "relative",
                                    width: 80,
                                    height: 80,
                                    mr: 2,
                                  }}
                                >
                                  <Image
                                    src={
                                      row.FOTOS && row.FOTOS.length > 0
                                        ? `${String(row.FOTOS[0].link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://cdn.divacosmeticos.com.br/"}${row.FOTOS[0].link}`
                                        : `https://cdn.divacosmeticos.com.br/produto-sem-imagem.png`
                                    }
                                    alt={row.NOME}
                                    fill
                                    style={{ objectFit: "cover" }}
                                  />
                                </Box>
                                <Box>
                                  <Typography variant="subtitle1">{row.NOME}</Typography>
                                  <Typography variant="body1" color="primary">
                                    R$ {row.PRECO.toFixed(2).replace(".", ",")}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item>
                              <Button variant="contained" color="primary" startIcon={<ShoppingCartIcon />} onClick={() => handleAddCart(index)}>
                                Comprar
                              </Button>
                            </Grid>
                          </Paper>
                        </Grid>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default withAuth(MeuCadastro);
