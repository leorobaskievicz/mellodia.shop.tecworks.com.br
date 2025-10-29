"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "@/app/context/AppContext";
import Api from "@/app/lib/api";
import { Diversos } from "@/app/lib/diversos";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Typography,
  IconButton,
  Skeleton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  LocalShipping as ShippingIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart as CartIcon,
  OpenInNew as OpenInNewIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  Tag as TagIcon,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import moment from "moment";

const CardPromocaoIphone = ({ show, handleClose, totalCard, ehMobile }) => {
  if (Number(moment().utcOffset("-03:00").format("YYYYMMDD")) < 20250301 || Number(moment().utcOffset("-03:00").format("YYYYMMDD")) > 20250331) {
    return null;
  }

  if (Diversos.checkPromocaoIphone(totalCard) <= -1) {
    return null;
  }

  if (Diversos.checkPromocaoIphone(totalCard) === 0) {
    return (
      <Box className="card m-0" sx={{ width: "100%" }}>
        <Box className="row no-gutters">
          <Box className="col-4">
            <Image
              className="card-img-top"
              src="/popup-iphone-diva.png"
              width={800}
              height={600}
              alt="Promoção iPhone"
              style={{
                height: "auto",
                width: "100%",
              }}
            />
          </Box>
          <Box className="col-8">
            <Box className="card-body p-2">
              <Typography variant="h5" className="card-title">
                Sorteio de um iPhone
              </Typography>
              <Typography variant="body1" className="card-text">
                Nessa compra você concorre a um iPhone 15
              </Typography>
              <LinearProgress variant="determinate" value={100} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="card m-0" sx={{ width: "100%" }}>
      <Box className="row no-gutters">
        <Box className="col-4">
          <Image
            className="card-img-top"
            src="/popup-iphone-diva.png"
            width={800}
            height={600}
            alt="Promoção iPhone"
            style={{
              height: "auto",
              width: "100%",
            }}
          />
        </Box>
        <Box className="col-8">
          <Box className="card-body p-2">
            <Typography variant="h5" className="card-title">
              Sorteio de um iPhone
            </Typography>
            <Typography variant="body1" className="card-text">
              Com mais{" "}
              <Typography component="span" sx={{ fontWeight: 700, fontSize: 18, color: "#5cb85c" }}>
                {Diversos.maskPreco(String(Diversos.checkPromocaoIphone(totalCard)))}
              </Typography>{" "}
              você concorre a um iPhone de Mês da Mulher
            </Typography>
            <LinearProgress variant="determinate" value={Math.round((150 * totalCard) / 100)} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function Checkout(props) {
  const { state: appState, dispatch } = useApp();
  const searchParams = useSearchParams();
  const api = new Api();
  const [showPromo, setShowPromo] = useState(true);
  const [googleParamProdu, setGoogleParamProdu] = useState(searchParams.get("g_id"));
  const [checkoutState, setCheckoutState] = useState({
    redirect: null,
    isLoading: false,
    email: "",
    senha: "",
    hasError: false,
    hasErrorTitle: "",
    hasErrorMsg: "",
    modalDrop: false,
    modalDropItem: null,
    freteOpcoes: [],
    simularFrete: false,
    freteIsLoading: false,
    freteCep: appState && appState.usuario && appState.usuario.cep ? appState.usuario.cep : appState && appState.cep ? appState.cep : "",
    entregaCodigo: null,
    entregaPreco: null,
    entregaPrazo: null,
    entregaNome: null,
    cupomDesc: false,
    codigoDesc: null,
    valorDesc: 0,
    descIsLoading: false,
    entregasMkt: [],
  });

  useEffect(() => {
    if (appState && appState.carrinho && appState.carrinho.length) {
      if (appState && appState.usuario && appState.usuario.codigo) {
        getCustomer();
      } else {
        getShippingModes();
      }
    }

    const tmpItems = [];

    for (let i = 0; i < appState.carrinho.length; i++) {
      tmpItems.push({
        item_name: appState.carrinho[i].NOME,
        item_id: appState.carrinho[i].CODIGO,
        price: appState.carrinho[i].PRECO,
        index: i + 1,
        quantity: appState.carrinho[i].qtd,
      });
    }

    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          items: tmpItems,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Number(googleParamProdu) > Number(0)) {
      getProdu();
    }
  }, [googleParamProdu]);

  const getProdu = async () => {
    if (checkoutState.freteIsLoading) {
      return true;
    }

    setCheckoutState((state) => ({ ...state, freteIsLoading: true }));

    try {
      const data = await api.get(`/product/${googleParamProdu}`, true);

      if (data.status === false || !data.msg || !data.msg.CODIGO) {
        alert("Ops, não localizamos o produto que você está procurando");
      } else if (Number(data.msg.ESTOQUE) <= Number(0) && data.msg.SITETERCEIROS === "S") {
        alert(`Ops, estamos sem estoque do produto ${data.msg.NOME} no momento.`);
      } else {
        let preco = data.msg.PRECO;
        const precoOriginal = data.msg.PRECO;

        if (
          data.msg.PREPRO > 0 &&
          data.msg.PREPRO < data.msg.PRECO &&
          moment(data.msg.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
          moment(data.msg.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD")
        ) {
          preco = data.msg.PREPRO;
        }

        let foto = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PICTURE}/produto-sem-imagem.png`;

        if (data.msg.FOTOS && data.msg.FOTOS.length > 0) {
          foto = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PICTURE}/${data.msg.FOTOS[0].link}`;
        }

        dispatch({
          type: "ADD_CART",
          payload: {
            codigo: data.msg.CODIGO,
            nome: data.msg.NOME,
            priceOrigin: precoOriginal,
            price: preco,
            qty: 1,
            foto,
            estoque: data.msg.ESTOQUE,
            peso: data.msg.PESO,
            parcelado: data.msg.PARCELADO,
          },
        });

        setTimeout(() => {
          if (appState && appState.usuario && appState.usuario.codigo) {
            getCustomer();
          } else {
            getShippingModes();
          }
        }, 350);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckoutState((state) => ({ ...state, freteIsLoading: false }));
    }

    return true;
  };

  const getCustomer = async () => {
    setCheckoutState((state) => ({ ...state, isLoadingCustomer: true }));

    try {
      const data = await api.get(`/customer/${appState.usuario.codigo}`, true);

      if (data.status === false) {
        throw new Error("Cadastro de cliente não localizado.");
      } else {
        dispatch({ type: "SET_CEP", payload: data.msg.cepent });
        setCheckoutState((state) => ({
          ...state,
          customer: data.msg,
          freteCep: data.msg.cepent,
        }));
        getShippingModes();
      }
    } catch (e) {
      console.error(e);

      setCheckoutState((state) => ({
        ...state,
        customer: null,
        hasErrorCustomer: true,
        hasErrorTitleCustomer: "Cadastro não localizado",
        hasErrorMsgCustomer: e.message,
      }));
    } finally {
      setCheckoutState((state) => ({ ...state, isLoadingCustomer: false }));
    }
  };

  const getCartTotal = () => {
    let total = 0.0;
    for (let i = 0; i < appState.carrinho.length; i++) {
      total += appState.carrinho[i].PRECO * appState.carrinho[i].qtd;
    }
    return total;
  };

  const getCartAmount = () => {
    let amount = 0;

    for (let i = 0; i < appState.carrinho.length; i++) {
      amount += 1 * appState.carrinho[i].qtd;
    }

    return amount;
  };

  const handleChange = (event, product) => {
    const diferenca = Number(event.target.value) - Number(product.qtd);

    if (Number(event.target.value) > Number(product.qtd)) {
      let qtdJaAdd = 0;

      if (appState.cart && appState.carrinho) {
        for (let i = 0; i < appState.carrinho.length; i++) {
          if (appState.carrinho[i].CODIGO === product.CODIGO) {
            qtdJaAdd += Number(appState.carrinho[i].qtd);
          }
        }
      }

      if (qtdJaAdd + diferenca > product.ESTOQUE) {
        return false;
      }
    }

    dispatch({
      type: "ATUALIZAR_CARRINHO",
      payload: {
        ...product,
        qtd: event.target.value,
      },
    });

    getShippingModes();
  };

  const handleDropProduto = (item) => {
    if (!item) return;

    setCheckoutState({ ...checkoutState, modalDropItem: item, modalDrop: true });
  };

  const handleModalDropClose = () => {
    setCheckoutState({ ...checkoutState, modalDrop: false, modalDropItem: null });
  };

  const getShippingModes = async () => {
    if (!checkoutState.freteCep) {
      setCheckoutState((state) => ({
        ...state,
        freteIsLoading: false,
        entregaCodigo: null,
        entregaPreco: null,
        entregaPrazo: null,
        entregaNome: null,
      }));

      const tmpProdutos = [];

      for (let i = 0; i < appState.carrinho.length; i++) {
        tmpProdutos.push({ codigo: appState.carrinho[i].CODIGO });
      }

      setCheckoutState((state) => ({
        ...state,
        entregasMkt: [
          {
            fornecedor: -1,
            produtos: tmpProdutos,
          },
        ],
      }));
      return false;
    }

    setCheckoutState((state) => ({
      ...state,
      freteIsLoading: true,
      entregaCodigo: null,
      entregaPreco: null,
      entregaPrazo: null,
      entregaNome: null,
    }));

    const produtos = [];

    for (let i = 0; i < appState.carrinho.length; i++) {
      produtos.push({
        codigo: appState.carrinho[i].CODIGO,
        qtd: appState.carrinho[i].qtd,
      });
    }

    try {
      const param = {
        cep: checkoutState.freteCep,
        produtos,
      };

      const data = await api.post(`/shipping/modes/diva`, param, true);
      console.log(data);
      if (data.status === false) {
        throw new Error("Não foi possível buscar opções de entrega.");
      }

      setCheckoutState((state) => ({
        ...state,
        freteOpcoes: data.msg,
        entregasMkt: data.msg,
      }));

      let hasFreteSelecionado = false;

      if (appState.freteSelected && appState.freteSelected !== "") {
        for (let i = 0; i < data.msg.length && !hasFreteSelecionado; i++) {
          if (data.msg[i].nome === appState.freteSelected) {
            hasFreteSelecionado = true;
          }
        }
      }

      if (hasFreteSelecionado) {
        setCheckoutState((state) => ({ ...state, simularFrete: true }));
        handleChangeFreteModo(appState.freteSelected);
      } else if (data && data.msg && data.msg.length > 0) {
        setCheckoutState((state) => ({ ...state, simularFrete: true }));
        handleChangeFreteModo(data.msg[0].nome);
      }
    } catch (e) {
      console.error(e);

      setCheckoutState((state) => ({
        ...state,
        freteOpcoes: null,
        fretehasError: true,
        freteHasErrorMsg: e.message,
      }));
    } finally {
      setCheckoutState((state) => ({ ...state, freteIsLoading: false }));
    }
  };

  const handleSimularFrete = async () => {
    setCheckoutState((state) => ({
      ...state,
      simularFrete: true,
      freteIsLoading: true,
    }));
    getShippingModes();
  };

  const handleChangeFreteModo = (nome) => {
    if (nome) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null });

      const tmpItems = [];

      for (let i = 0; i < appState.carrinho.length; i++) {
        tmpItems.push({
          item_name: appState.carrinho[i].NOME,
          item_id: appState.carrinho[i].CODIGO,
          price: appState.carrinho[i].PRECO,
          index: i + 1,
          quantity: appState.carrinho[i].qtd,
        });
      }

      window.dataLayer.push({
        event: "add_shipping_info",
        ecommerce: {
          currency: "BRL",
          value: getCartTotal(),
          shipping_tier: nome,
          items: tmpItems,
        },
      });

      dispatch({
        type: "SET_FRETE",
        payload: nome,
      });

      if (checkoutState.freteOpcoes) {
        for (let i = 0; i < checkoutState.freteOpcoes.length; i++) {
          if (checkoutState.freteOpcoes[i].nome === nome) {
            const prazo = checkoutState.freteOpcoes[i].prazoMax ? checkoutState.freteOpcoes[i].prazoMax : checkoutState.freteOpcoes[i].prazo;

            setCheckoutState((state) => ({
              ...state,
              entregaCodigo: checkoutState.freteOpcoes[i].codigo,
              entregaNome: checkoutState.freteOpcoes[i].nome,
              entregaPreco: checkoutState.freteOpcoes[i].preco,
              entregaPrazo: prazo,
            }));

            break;
          }
        }
      }
    }
  };

  const IncreaseItem = (item) => {
    if (item.qtd + 1 <= item.ESTOQUE) {
      dispatch({
        type: "ATUALIZAR_CARRINHO",
        payload: {
          ...item,
          qtd: item.qtd + 1,
        },
      });

      setTimeout(() => getShippingModes(), 100);
    }
  };

  const DecreaseItem = (item) => {
    if (item.qtd - 1 <= 1) {
      dispatch({
        type: "ATUALIZAR_CARRINHO",
        payload: {
          ...item,
          qtd: 1,
        },
      });
    } else {
      dispatch({
        type: "ATUALIZAR_CARRINHO",
        payload: {
          ...item,
          qtd: item.qtd - 1,
        },
      });
    }

    setTimeout(() => getShippingModes(), 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={1} />
        <Grid item xs={12} md={7} sx={{ pr: 4 }}>
          <Box className="checkout-title" sx={{ mb: 3 }}>
            <Typography variant="h1" sx={{ fontSize: "1.4rem", fontWeight: "bold", color: "black" }}>
              Checkout
            </Typography>
            <Typography variant="h2" sx={{ fontSize: "1.2rem", fontWeight: "500", color: "black", mt: 2 }}>
              <CartIcon /> Itens do carrinho ({getCartAmount()})
            </Typography>
          </Box>

          {appState.carrinho.length <= 0 ? (
            <Box className="empty-cart-checkout">
              <Image src="/empty-cart-checkout.svg" alt="Carrinho Vazio" width={200} height={200} />
              <Typography variant="h4">Seu carrinho está vazio.</Typography>
              <Typography variant="body1">Navegue por nossa loja e encontre seus produtos favoritos!</Typography>
              <Link href="/">
                <ArrowBackIcon className="mr-2 text-link" />
                Continuar comprando
              </Link>
            </Box>
          ) : checkoutState.freteIsLoading ? (
            appState.carrinho.map((q, idx) => <Skeleton variant="rectangular" height={50} sx={{ width: "100%", my: 2, borderRadius: "4px" }} />)
          ) : (
            <>
              {appState.carrinho.map((row, index) => {
                let tipoPromo = 0;
                let preco1 = 0;
                const preco2 = 0;
                const preco3 = 0;
                const preco4 = 0;
                const preco5 = 0;
                let precoFinal = 0;

                if (row && row.promo) {
                  if (row.promo.CDPRODU1 && !row.promo.CDPRODU2 && !row.promo.CDPRODU3 && !row.promo.CDPRODU4 && !row.promo.CDPRODU5) {
                    tipoPromo = 1;
                    preco1 = row.promo.CDDESC1 > 0 ? row.PRECO - row.PRECO * (row.promo.CDDESC1 / 100) : row.promo.CDPRECO1;
                    precoFinal = preco1 * row.promo.CDQTD1;
                  } else if (row.promo.CDPRODU1 && row.promo.CDPRODU2 && !row.promo.CDPRODU3 && !row.promo.CDPRODU4 && !row.promo.CDPRODU5) {
                    tipoPromo = 2;
                    preco1 = row.promo.CDDESC1 > 0 ? row.PRECO - row.PRECO * (row.promo.CDDESC1 / 100) : row.promo.CDPRECO1;
                    precoFinal = preco1 * row.promo.CDQTD1;
                  } else if (row.promo.CDPRODU1 && row.promo.CDPRODU2 && row.promo.CDPRODU3 && !row.promo.CDPRODU4 && !row.promo.CDPRODU5) {
                    tipoPromo = 3;
                    preco1 = row.promo.CDDESC1 > 0 ? row.PRECO - row.PRECO * (row.promo.CDDESC1 / 100) : row.promo.CDPRECO1;
                    precoFinal = preco1 * row.promo.CDQTD1;
                  } else if (row.promo.CDPRODU1 && row.promo.CDPRODU2 && row.promo.CDPRODU3 && row.promo.CDPRODU4 && !row.promo.CDPRODU5) {
                    tipoPromo = 4;
                    preco1 = row.promo.CDDESC1 > 0 ? row.PRECO - row.PRECO * (row.promo.CDDESC1 / 100) : row.promo.CDPRECO1;
                    precoFinal = preco1 * row.promo.CDQTD1;
                  } else if (row.promo.CDPRODU1 && row.promo.CDPRODU2 && row.promo.CDPRODU3 && row.promo.CDPRODU4 && row.promo.CDPRODU5) {
                    tipoPromo = 5;
                    preco1 = row.promo.CDDESC1 > 0 ? row.PRECO - row.PRECO * (row.promo.CDDESC1 / 100) : row.promo.CDPRECO1;
                    precoFinal = preco1 * row.promo.CDQTD1;
                  }
                }

                return (
                  <Box
                    key={index}
                    sx={{
                      mb: 4,
                      pb: 4,
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      px: 4,
                    }}
                  >
                    <Image
                      src={`${String(row.FOTOS[0].link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${
                        !row.FOTOS || row.FOTOS.length <= 0 ? "produto-sem-imagem.png" : row.FOTOS[0].link
                      }`}
                      className="compra-img"
                      width={100}
                      height={100}
                      alt={row.NOME}
                      style={{ marginRight: 10 }}
                    />

                    <Box sx={{ flex: 10, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" sx={{ fontSize: "1.0rem", fontWeight: "500", color: "black" }}>
                          <Link href={`/${Diversos.toSeoUrl(row.NOME)}`}>{row.NOME}</Link>
                          {row.promo && row.promo.CDPROMOCAO ? (
                            <>
                              <br />
                              <Typography component="span" className="badge badge-secondary mt-2">
                                Kit promocional
                              </Typography>
                            </>
                          ) : null}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, my: 2, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="body1">R$ {Diversos.number_format(row.PRECO, 2, ",", "")}</Typography>
                        <Box sx={{ ml: 4 }}>
                          <IconButton size="small" onClick={() => DecreaseItem(row)} color="error">
                            <RemoveIcon />
                          </IconButton>
                          <TextField
                            type="number"
                            name="quantidade"
                            size="small"
                            value={row.qtd || ""}
                            onChange={(event) => handleChange(event, row)}
                            inputProps={{
                              min: row.promo && row.promo.CDPROMOCAO && row.qtdPromo && row.qtdPromo > 1 ? row.qtdPromo : 1,
                              max: row.ESTOQUE,
                              step: row.promo && row.promo.CDPROMOCAO && row.qtdPromo && row.qtdPromo > 1 ? row.qtdPromo : 1,
                            }}
                            onKeyDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                            }}
                            sx={{
                              width: "120px",
                              textAlign: "center",
                              border: "1px solid #e0e0e0",
                              borderRadius: "4px",
                            }}
                          />
                          <IconButton size="small" onClick={() => IncreaseItem(row)} color="success">
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                      <Typography variant="h5" sx={{ fontSize: "0.90rem" }}>
                        SUBTOTAL
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: "1.1rem", fontWeight: "bold", my: 0.5 }}>
                        {Diversos.maskPreco(row.PRECO * row.qtd, 2, ",", "")}
                      </Typography>
                      <IconButton size="small" onClick={() => handleDropProduto(row)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </>
          )}
        </Grid>
        <Grid item xs={12} md={3}>
          {!(appState.carrinho.length <= 0) && (
            <Box className="checkout-continue-container">
              <Box className="checkout-continue-wrapper">
                <FormControl fullWidth>
                  <Typography variant="subtitle1">
                    <ShippingIcon sx={{ mr: 1 }} />
                    Simule frete e prazo
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, my: 2 }}>
                    <TextField
                      fullWidth
                      label="CEP"
                      variant="outlined"
                      InputProps={{
                        // inputComponent: InputMask,
                        inputProps: {
                          mask: "99.999-999",
                          maxLength: 10,
                          value: checkoutState.freteCep,
                          onChange: (e) =>
                            setCheckoutState((state) => ({
                              ...state,
                              freteCep: Diversos.maskCEP(Diversos.getnums(e.target.value)),
                            })),
                        },
                      }}
                    />
                    <Button disabled={!checkoutState.freteCep || checkoutState.freteCep.length < 8} onClick={handleSimularFrete} variant="contained" color="primary">
                      Calcular
                    </Button>
                  </Box>
                  <Link
                    href="https://buscacepinter.correios.com.br/app/endereco/index.php?t"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                    style={{ fontSize: 10 }}
                  >
                    Não sei meu CEP <OpenInNewIcon fontSize="small" />
                  </Link>
                </FormControl>

                {checkoutState.freteIsLoading ? (
                  <Box sx={{ width: "100%", textAlign: "center" }}>
                    <Skeleton variant="rectangular" height={20} sx={{ width: "100%", my: 2, borderRadius: "4px" }} />
                    <Skeleton variant="rectangular" height={20} sx={{ width: "100%", my: 2, borderRadius: "4px" }} />
                    <Skeleton variant="rectangular" height={20} sx={{ width: "100%", my: 2, borderRadius: "4px" }} />
                  </Box>
                ) : checkoutState.freteOpcoes !== null && checkoutState.freteOpcoes.length > 0 ? (
                  <FormControl fullWidth>
                    <Select value={checkoutState.entregaNome || ""} onChange={(event) => handleChangeFreteModo(event.target.value)} displayEmpty>
                      <MenuItem value="" disabled>
                        Selecione uma forma de entrega
                      </MenuItem>
                      {checkoutState.freteOpcoes.map((row, index) => (
                        <MenuItem key={index} value={row.nome}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {row.nome}
                            </Typography>
                            <Typography variant="body2">
                              Prazo: {row.prazo} {row.prazoMax ? ` até ${row.prazoMax}` : ""} • Preço: R$ {Diversos.number_format(row.preco, 2, ",", "")}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  checkoutState.simularFrete && (
                    <Typography variant="body1" color="error" sx={{ my: 1 }} textAlign="center">
                      Nenhuma opção encontrada
                    </Typography>
                  )
                )}

                {checkoutState.cupomDesc ? (
                  checkoutState.descIsLoading ? (
                    <Box sx={{ width: "100%", textAlign: "center" }}>
                      <Skeleton variant="rectangular" height={20} sx={{ width: "100%", my: 2, borderRadius: "4px" }} />
                      <Skeleton variant="rectangular" height={20} sx={{ width: "100%", my: 2, borderRadius: "4px" }} />
                    </Box>
                  ) : (
                    <Box className="discount-badge">
                      <Typography variant="caption">{checkoutState.codigoDesc}</Typography>
                    </Box>
                  )
                ) : null}

                <Box className="checkout-partials">
                  <Alert severity="info" sx={{ transform: "scale(0.9)" }}>
                    Caso tenha cupom de desconto, insira na próxima tela.
                  </Alert>
                </Box>

                {CardPromocaoIphone({
                  show: true,
                  handleClose: () => null,
                  totalCard: getCartTotal(),
                  ehMobile: false,
                })}

                <Box sx={{ pb: 1, mb: 1, mt: 4, borderBottom: "1px solid #e0e0e0", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6">SUBTOTAL</Typography>
                  <Typography variant="body1">R$ {Diversos.number_format(getCartTotal(), 2, ",", "")}</Typography>
                </Box>
                {checkoutState.simularFrete && checkoutState.freteOpcoes && (
                  <Box sx={{ pb: 1, mb: 1, borderBottom: "1px solid #e0e0e0", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">FRETE</Typography>
                    <Typography variant="body1">R$ {Diversos.number_format(checkoutState.entregaPreco, 2, ",", "")}</Typography>
                  </Box>
                )}
                {checkoutState.cupomDesc && (
                  <Box sx={{ pb: 1, mb: 1, borderBottom: "1px solid #e0e0e0", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6">DESCONTO</Typography>
                    {checkoutState.valorDesc && checkoutState.valorDesc > 0 ? (
                      <Typography variant="body1">- R$ {Diversos.number_format(checkoutState.valorDesc, 2, ",", "")}</Typography>
                    ) : (
                      <Typography variant="body1">0.00</Typography>
                    )}
                  </Box>
                )}
                <Box sx={{ pb: 1, mb: 1, borderBottom: "1px solid #e0e0e0", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6">TOTAL</Typography>
                  <Typography variant="body1">R$ {Diversos.number_format(getCartTotal() + checkoutState.entregaPreco - checkoutState.valorDesc, 2, ",", "")}</Typography>
                </Box>

                <Button component={Link} href="/checkout/pagamento" className="btn-checkout" variant="contained" color="primary" startIcon={<CartIcon />} fullWidth>
                  Continuar para Pagamento
                </Button>
                <Button component={Link} href="/" target="_self" className="btn-link-action" startIcon={<ArrowBackIcon />} fullWidth sx={{ mt: 2 }}>
                  Continuar comprando
                </Button>
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={1} />
      </Grid>

      <Dialog open={checkoutState.modalDrop} onClose={handleModalDropClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Deseja apagar o produto?</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ textAlign: "left" }}>
            Deseja remover o produto {checkoutState.modalDropItem?.NOME} do carrinho?
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalDropClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              dispatch({
                type: "REMOVER_DO_CARRINHO",
                payload: checkoutState.modalDropItem,
              });
              setCheckoutState((state) => ({ ...state, modalDrop: false }));
              getShippingModes();
            }}
            color="error"
            autoFocus
          >
            Remover
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
