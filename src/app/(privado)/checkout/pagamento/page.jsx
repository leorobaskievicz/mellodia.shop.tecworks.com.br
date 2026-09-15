"use client";
import Api from "@/app/lib/api";
import { Diversos, PEDIDO_MINIMO } from "@/app/lib/diversos";
import { useApp } from "@/app/context/AppContext";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Typography,
  Alert,
  Radio,
  FormControlLabel,
  Checkbox,
  Container,
  Divider,
  MenuItem,
  Stack,
  Select,
  Autocomplete,
  Skeleton,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CreditCard as CreditCardIcon,
  Pix as PixIcon,
  ReceiptLong as ReceiptLongIcon,
  Info as InfoIcon,
  Login as LoginIcon,
  TwoWheeler as TwoWheelerIcon,
  Store as StoreIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { useSearchParams, redirect, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { LinkOutlined } from "@mui/icons-material";
import { PhoneIphone } from "@mui/icons-material";
import moment from "moment";
import FreteGratisBar from "@/app/components/FreteGratisBar";

const theme = {
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    h6: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 4,
        },
        contained: {
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
          },
        },
      },
    },
  },
};

function CheckoutPagamentoContent(props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const api = new Api();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [modalPopUp, setModalPopUp] = useState(true);
  const [modalLinkPagamento, setModalLinkPagamento] = useState(false);
  const [state, setState] = useState({
    redirect: null,
    isLoading: false,
    hasError: false,
    hasErrorTitle: null,
    hasErrorMsg: null,
    isLargeScreen: false,
    customer: {
      receberNovidades: true,
      salvarEndereco: true,
      codigo: appState.usuario ? appState?.usuario?.codigo : -1,
      nome: appState.usuario ? appState?.usuario?.nome?.split(" ")?.[0] ?? "" : "",
      sobrenome: appState.usuario ? appState?.usuario?.nome?.split(" ")?.pop() ?? "" : "",
      email: appState.usuario ? appState?.usuario?.email ?? "" : "",
      cpf: appState.usuario ? appState?.usuario?.cpf ?? "" : "",
      celular: appState.usuario ? appState?.usuario?.telefone ?? "" : "",
      cep: appState.usuario && appState?.usuario?.codigo ? "" : appState.cep ?? "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
    checkout1: true,
    checkout2: false,
    checkout3: false,
    isLoadingCep: false,
    isLoadingFrete: false,
    hasErrorFrete: false,
    hasErrorTitleFrete: false,
    hasErrorMsgFrete: false,
    freteOpcoes: [],
    freteSelectedCodigo: null,
    freteSelectedNome: null,
    freteSelectedPreco: 0.0,
    freteSelectedPrazo: null,
    codigoDesc: 0,
    valorDesc: 0.0,
    teleValorDesc: 0.0,
    telePercentDesc: 0.0,
    formFormaEntregaLoja: 0,
    formFormaPgtoCodigo: 2,
    formCartaoNumero: null,
    formCartaoNome: null,
    formCartaoValidadeMes: null,
    formCartaoValidadeAno: null,
    formCartaoCvv: null,
    formCartaoCvvSize: null,
    formCartaoBandeira: null,
    formIsLoading: false,
    email: "",
    receberNovidades: false,
    formaPagamento: "boleto",
    instalments: [],
    cartao: {
      numero: "",
      validade: "",
      cvv: "",
      nome: "",
      parcelas: 1,
      usarEnderecoCobranca: false,
    },
    loading: false,
    parcelaSelecionada: 1,
  });

  const handleChangeStepMore = (nextStep) => {
    if (state.checkout1 || nextStep === 2) {
      if (!state.customer || !state.customer.nome || !state.customer.email || !state.customer.cpf) {
        dispatch({
          type: "SET_ALERT",
          payload: {
            open: true,
            severity: "info",
            message: "Para continuar é necessário informar os dados básicos para conclusão da compra.",
          },
        });
      } else {
        Diversos.sellfluxEnvia(
          {
            nome: state.customer.nome,
            email: state.customer.email,
            telefone: state.customer.celular,
          },
          "abandonou-carrinho",
          "",
          appState.carrinho[0].NOME,
          appState.carrinho[0].CODIGO,
          getTotal(),
          "https://www.mellodia.com.br/checkout/pagamento",
        );

        setState((state) => ({ ...state, checkout1: false, checkout2: true }));
      }
    } else if (state.checkout2 || nextStep === 3) {
      if (!state.customer || !state.customer.cep || !state.customer.numero || !state.freteSelectedNome) {
        dispatch({
          type: "SET_ALERT",
          payload: {
            open: true,
            severity: "info",
            message: "Para continuar é necessário informar os dados da entrega.",
          },
        });
      } else {
        setState((state) => ({ ...state, checkout2: false, checkout3: true }));
      }
    }

    return true;
  };

  const handleErrorComunication = () => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  };

  const setMsg = (type, title, msg) => {
    const timeout = 5000;

    handleErrorComunication();

    if (type === "error") {
      setState((prev) => ({
        ...prev,
        formHasError: true,
        formHasErrorTitle: title,
        formHasErrorMsg: msg,
      }));

      setTimeout(() => setState((prev) => ({ ...prev, formHasError: false })), timeout);
    } else {
      setState((prev) => ({
        ...prev,
        formHasSuccess: true,
        formHasSuccessTitle: title,
        formHasSuccessMsg: msg,
      }));

      setTimeout(() => setState((prev) => ({ ...prev, formHasSuccess: false })), timeout);
    }
  };

  const getCartTotal = () => {
    let total = 0.0;

    for (let i = 0; i < appState.carrinho.length; i++) {
      let preco = appState.carrinho[i].PREPRO > 0 && appState.carrinho[i].PREPRO < appState.carrinho[i].PRECO ? appState.carrinho[i].PREPRO : appState.carrinho[i].PRECO;
      total += preco * appState.carrinho[i].qtd;
    }

    return total;
  };

  const getTotal = () => {
    const totalProdutos = getCartTotal();

    const totalFrete = !state.freteSelectedPreco ? 0.0 : state.freteSelectedPreco;

    const totalDesconto = !state.valorDesc ? 0.0 : state.valorDesc;

    const tmpTotal = parseFloat(totalProdutos) + parseFloat(totalFrete) - parseFloat(totalDesconto);

    return tmpTotal;
  };

  const getParcelamentoOptions = () => {
    const total = getTotal();
    if (total < 300) return [{ value: 1, label: `1x de ${Diversos.maskPreco(total)} sem juros` }];
    const options = [];
    for (let i = 1; i <= 6; i++) {
      const valorParcela = total / i;
      if (valorParcela < 200) break;
      options.push({ value: i, label: `${i}x de ${Diversos.maskPreco(valorParcela)} sem juros` });
    }
    return options;
  };

  const getShippingModes = async (cep = null, formaEntregaSelected = null) => {
    let auxCep = cep ? cep : state.customer.cep;

    console.log("[getShippingModes] chamado | auxCep:", auxCep, "| nums length:", String(Diversos.getnums(auxCep)).length);

    if (auxCep && String(Diversos.getnums(auxCep)).length === 8) {
      setState((state) => ({ ...state, isLoadingFrete: true }));

      const produtos = [];

      for (let i = 0; i < appState.carrinho.length; i++) {
        produtos.push({
          codigo: appState.carrinho[i].CODIGO,
          qtd: appState.carrinho[i].qtd,
        });
      }

      try {
        const param = {
          cep: auxCep,
          cidade: state.customer.cidade,
          produtos,
          fgTelevendas: appState.usuario && appState.usuario.vendedor && appState.usuario.vendedor.NOME ? true : false,
        };

        console.log("[Frete] Parâmetros enviados:", JSON.stringify(param, null, 2));

        const data = await api.post(`/shipping/modes/mellodia`, param, true);

        console.log("[Frete] Retorno da API:", JSON.stringify(data, null, 2));

        if (data.status === false) {
          throw new Error("Não foi possível buscar opções de entrega.");
        } else {
          setState((state) => ({
            ...state,
            freteOpcoes: data.msg,
          }));

          if (formaEntregaSelected && data.msg.length > 0) {
            const auxSelected = data.msg.find((f) => String(f.NOME) === String(formaEntregaSelected));

            if (auxSelected && auxSelected.CODIGO) {
              setState((state) => ({
                ...state,
                freteSelectedPreco: auxSelected.PRECO,
                freteSelectedPrazo: auxSelected.PRAZO,
                freteSelectedCodigo: auxSelected.CODIGO,
              }));
            }
          }
        }
      } catch (e) {
        console.error(e);

        setState((state) => ({
          ...state,
          freteOpcoes: [],
          hasErrorFrete: true,
          hasErrorTitleFrete: "Cadastro não localizado",
          hasErrorMsgFrete: e.message,
        }));
      } finally {
        setState((state) => ({ ...state, isLoadingFrete: false }));
      }
    }
  };

  const getCustomer = async () => {
    setState((state) => ({ ...state, isLoadingCustomer: true }));

    try {
      const data = await api.get(`/customer/${appState.usuario.codigo}`, true);

      if (data.status) {
        setState((state) => ({
          ...state,
          customer: {
            ...state.customer,
            email: data.msg.email ?? "",
            cpf: data.msg.cpf ?? "",
            cep: data.msg.cep ?? "",
            rua: data.msg.rua ?? "",
            celular: data.msg.telefone ?? "",
            numero: data.msg.numero ? String(data.msg.numero) : "",
            complemento: data.msg.complemento ?? "",
            bairro: data.msg.bairro ?? "",
            cidade: data.msg.cidade ?? "",
            estado: data.msg.estado ?? "",
            codmun: data.msg.ibge ?? "",
          },
        }));
      }
    } catch (e) {
      console.error(`ERROR: /customer/:id: ${e}`);
    } finally {
      setState((state) => ({ ...state, isLoadingCustomer: false }));
    }
  };

  const getAddressByCep = async () => {
    console.log("[getAddressByCep] cep:", state.customer.cep, "| length:", Diversos.getnums(state.customer.cep).length);
    if (!state.customer.cep || Diversos.getnums(state.customer.cep).length !== 8) return false;

    setState((state) => ({ ...state, isLoadingCep: true }));

    const param = { cep: state.customer.cep };

    try {
      const data = await api.post("/shipping/cep", param, true);

      if (data.status) {
        setState((state) => ({
          ...state,
          customer: {
            ...state.customer,
            rua: data.msg.logradouro,
            bairro: data.msg.bairro,
            cidade: data.msg.localidade,
            estado: data.msg.uf,
            codmun: data.msg.ibge,
          },
        }));
      }
    } catch (e) {
      console.error(`ERROR: /shipping/cep: ${e}`);
    } finally {
      setState((state) => ({ ...state, isLoadingCep: false }));
    }
  };

  const getInstalments = async () => {
    setState((state) => ({ ...state, isLoadingInstalment: true }));

    const codigos = [];

    for (let i = 0; i < appState.carrinho.length; i++) {
      codigos.push(appState.carrinho[i].CODIGO);
    }

    const param = {
      valor: getTotal(),
      produtos: codigos,
    };

    try {
      const data = await api.post(`/order/instalments`, param, true);

      if (!data.status) {
        throw new Error(data.msg);
      } else {
        setState((state) => ({ ...state, instalments: data.msg }));
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }

      setState((state) => ({ ...state, instalments: [] }));
    } finally {
      setState((state) => ({ ...state, isLoadingInstalment: false }));
    }
  };

  const handleCupomDesc = async (cupom = null) => {
    let auxCupom = cupom ? cupom : state.codigoDesc;

    if (!auxCupom) {
      setMsg("error", "Atenção", "Informe o cupom que deseja utilizar");
      return false;
    }

    if (!state.customer.cpf || (!Diversos.validateCPF(state.customer.cpf) && !Diversos.validateCNPJ(state.customer.cpf))) {
      setMsg("error", "Atenção", "Informe seu CPF para validação do cupom");
      return false;
    }

    const produtos = [];

    for (let i = 0; i < appState.carrinho.length; i++) {
      produtos.push({
        codigo: appState.carrinho[i].CODIGO,
        qtd: appState.carrinho[i].qtd,
      });
    }

    const param = {
      id: state.codigoDesc,
      cpf: state.customer.cpf,
      produtos,
    };

    setState((state) => ({ ...state, isLoadingCupom: true }));

    try {
      const data = await api.post(`/cupom/${auxCupom.replace("#", "")}/validate`, param, true);

      if (!data.status) {
        throw new Error(data.msg);
      } else {
        let desconto = 0.0;

        if (data.msg.PERCENTUAL > 0) desconto = (data.msg.PERCENTUAL / 100) * getCartTotal();
        else if (data.msg.VALOR > 0) desconto = data.msg.VALOR;
        else if (data.msg.FGFRETEGRATIS === "S") desconto = state.freteSelectedPreco;

        desconto = Math.trunc(desconto * 100) / 100;

        setState((state) => ({
          ...state,
          cupomDesc: true,
          valorDesc: desconto,
        }));

        getInstalments();
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(e);
      }

      if (e.message.indexOf("E_MISSING_DATABASE_ROW") > -1) {
        setMsg("error", "Atenção", "Cupom não é válido");
      } else {
        setMsg("error", "Atenção", e.message);
      }
    } finally {
      setState((state) => ({ ...state, isLoadingCupom: false }));
    }
  };

  const formatCardNumber = (value) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Adiciona espaços a cada 4 dígitos
    return numbers.replace(/(\d{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setState((state) => ({
      ...state,
      cartao: {
        ...state.cartao,
        numero: formattedValue,
      },
    }));
  };

  const formatCardExpiry = (value) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Limita a 4 dígitos
    const truncated = numbers.slice(0, 4);

    // Adiciona a barra após 2 dígitos
    if (truncated.length > 2) {
      return `${truncated.slice(0, 2)}/${truncated.slice(2)}`;
    }

    return truncated;
  };

  const handleCardExpiryChange = (e) => {
    const formattedValue = formatCardExpiry(e.target.value);
    setState((state) => ({
      ...state,
      cartao: {
        ...state.cartao,
        validade: formattedValue,
      },
    }));
  };

  const handleFormOramento = async (event) => {
    event.preventDefault();

    const confirm = window.confirm("Deseja gravar este pedido como orçamento?");

    if (!confirm) {
      return false;
    }

    // Validação reCAPTCHA invisível
    if (!executeRecaptcha) {
      setMsg("error", "Atenção", "Sistema de segurança não está pronto. Tente novamente.");
      return 0;
    }

    let recaptchaToken;
    try {
      recaptchaToken = await executeRecaptcha("checkout_budget");
      if (!recaptchaToken) {
        setMsg("error", "Atenção", "Falha na validação de segurança. Tente novamente.");
        return 0;
      }
    } catch (error) {
      console.error("Erro no reCAPTCHA:", error);
      setMsg("error", "Atenção", "Erro na validação de segurança. Tente novamente.");
      return 0;
    }

    if (getCartTotal() <= 0) {
      setMsg("error", "Atenção", "Valor total do carrinho inválido.");
      return 0;
    }

    if (getCartTotal() < PEDIDO_MINIMO) {
      setMsg("error", "Pedido mínimo", `O pedido mínimo é de ${Diversos.maskPreco(PEDIDO_MINIMO)} em produtos.`);
      return 0;
    }

    if (appState.carrinho.length <= 0) {
      setMsg("error", "Atenção", "Seu carrinho está vazio.");
      return 0;
    }

    if (!state.freteSelectedNome) {
      setMsg("error", "Atenção", "Opção de entrega não selecionada.");
      return 0;
    }

    if (state.freteSelectedNome === "ENTREGA AGENDADA" && !state.freteSelectedPrazo) {
      setMsg("error", "Atenção", "Seleciona um horário de entrega para seu pedido.");
      return 0;
    }

    if (String(state.freteSelectedNome).toLowerCase().indexOf("retira") > -1 && (!state.formFormaEntregaLoja || Number(state.formFormaEntregaLoja) <= 0)) {
      setMsg("error", "Atenção", "Selecione uma loja para retirar seu pedido.");
      return 0;
    }

    if (!state.customer.cpf || (!Diversos.validateCPF(state.customer.cpf) && !Diversos.validateCNPJ(state.customer.cpf))) {
      setMsg("error", "Atenção", "Por favor informe seu CPF.");
      return 0;
    }

    if (!state.customer.email) {
      setMsg("error", "Atenção", "Por favor informe seu E-MAIL.");
      return 0;
    }

    if (!state.customer.celular) {
      setMsg("error", "Atenção", "Por favor informe seu CELULAR.");
      return 0;
    }

    if (String(state.freteSelectedNome).toLowerCase().indexOf("retira") <= -1) {
      if (!state.customer.rua || !state.customer.numero || !state.customer.cep || !state.customer.cidade) {
        setMsg("error", "Atenção", "Endereço de entrega não é válido.");
        return 0;
      }
    }

    if (![2, 4].includes(state.formFormaPgtoCodigo)) {
      setMsg("error", "Atenção", "Forma de pagamento selecionada não é válida.");
      return 0;
    }

    setState((state) => ({
      ...state,
      formIsLoading: true,
      formHasError: false,
      formHasErrorMsg: null,
    }));

    // Boleto e Pix são sempre à vista.
    const parcelas = 1;

    let desconto = state.valorDesc ? state.valorDesc : 0.0;

    const param = {
      fgNovoLayout: true,
      cliente: state.customer.codigo,
      clienteDados: state.customer,
      fgNovoCliente: true,
      items: [],
      formapg: state.formFormaPgtoCodigo,
      desconto,
      cupom: state.codigoDesc ? state.codigoDesc : null,
      frete: {
        servico: state.freteSelectedNome,
        prazo: state.freteSelectedPrazo,
        valor: state.freteSelectedPreco,
        filial: state.formFormaEntregaLoja,
      },
      total: getTotal(),
      cartao: [
        {
          numero: "",
          validade: "",
          cvv: "",
          salva: false,
          parcelas,
          valor: getTotal(),
        },
      ],
      pagseguroSenderHash: state.pagseguroSenderHash,
      clearSaleSession: state.sessionUsuario,
      pix: null,
      repres: appState && appState.usuario && appState.usuario.vendedor && appState.usuario.vendedor.CODIGO ? appState.usuario.vendedor.CODIGO : state.vendedor,
      recaptchaToken, // Token do reCAPTCHA para validação no backend
    };

    const tmpProdutos = [];

    for (let i = 0; i < appState.carrinho.length; i++) {
      let preco = appState.carrinho[i].PREPRO > 0 && appState.carrinho[i].PREPRO < appState.carrinho[i].PRECO ? appState.carrinho[i].PREPRO : appState.carrinho[i].PRECO;

      tmpProdutos.push({
        codigo: appState.carrinho[i].CODIGO,
        quantidade: appState.carrinho[i].qtd,
        valor: preco,
        complemento: appState.carrinho[i].complemento,
      });
    }

    param.items = tmpProdutos;

    try {
      const data = await api.post("/orcamento", param, true);

      if (data.status !== true) {
        throw new Error(data.msg);
      }

      dispatch({
        type: "SET_CUPOM",
        payload: "",
      });

      setState((state) => ({ ...state, redirect: "/checkout/orcamento?id=" + data.msg.ORCAMENTO }));
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", e.message);
    } finally {
      setState((state) => ({ ...state, formIsLoading: false }));
    }
  };

  const handleForm = async (event) => {
    event.preventDefault();

    let recaptchaToken = null;
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== "desenvolvimento") {
      if (!executeRecaptcha) {
        setMsg("error", "Atenção", "Sistema de segurança não está pronto. Tente novamente.");
        return 0;
      }
      try {
        recaptchaToken = await executeRecaptcha("checkout_budget");
        if (!recaptchaToken) {
          setMsg("error", "Atenção", "Falha na validação de segurança. Tente novamente.");
          return 0;
        }
      } catch (error) {
        console.error("Erro no reCAPTCHA:", error);
        setMsg("error", "Atenção", "Erro na validação de segurança. Tente novamente.");
        return 0;
      }
    }

    if (getCartTotal() <= 0) {
      setMsg("error", "Atenção", "Valor total do carrinho inválido.");
      return 0;
    }

    if (getCartTotal() < PEDIDO_MINIMO) {
      setMsg("error", "Pedido mínimo", `O pedido mínimo é de ${Diversos.maskPreco(PEDIDO_MINIMO)} em produtos.`);
      return 0;
    }

    if (appState.carrinho.length <= 0) {
      setMsg("error", "Atenção", "Seu carrinho está vazio.");
      return 0;
    }

    if (!state.customer.email) {
      setMsg("error", "Atenção", "Por favor informe seu E-MAIL.");
      return 0;
    }

    if (!state.customer.celular) {
      setMsg("error", "Atenção", "Por favor informe seu CELULAR.");
      return 0;
    }

    setState((state) => ({
      ...state,
      formIsLoading: true,
      formHasError: false,
      formHasErrorMsg: null,
    }));

    try {
      // Boleto e Pix são sempre à vista.
        const parcelas = 1;

      let desconto = state.valorDesc ? state.valorDesc : 0.0;

      const param = {
        fgNovoLayout: true,
        cliente: state.customer.codigo,
        clienteDados: state.customer,
        fgNovoCliente: true,
        items: [],
        formapg: state.formFormaPgtoCodigo,
        desconto: desconto ? desconto : 0,
        cupom: state.codigoDesc ? state.codigoDesc : null,
        frete: {
          servico: state.freteSelectedNome,
          prazo: state.freteSelectedPrazo,
          valor: state.freteSelectedPreco,
          filial: state.formFormaEntregaLoja,
        },
        total: getTotal(),
        cartao: [
          {
            numero: "",
            validade: "",
            cvv: "",
            salva: false,
            parcelas,
            valor: getTotal(),
          },
        ],
        pagseguroSenderHash: state.pagseguroSenderHash,
        clearSaleSession: state.sessionUsuario,
        pix: null,
        repres: appState && appState.usuario && appState.usuario.vendedor && appState.usuario.vendedor.CODIGO ? appState.usuario.vendedor.CODIGO : state.vendedor,
        recaptchaToken, // Token do reCAPTCHA para validação no backend
      };

      const tmpProdutos = [];

      for (let i = 0; i < appState.carrinho.length; i++) {
        let preco = appState.carrinho[i].PREPRO > 0 && appState.carrinho[i].PREPRO < appState.carrinho[i].PRECO ? appState.carrinho[i].PREPRO : appState.carrinho[i].PRECO;

        tmpProdutos.push({
          codigo: appState.carrinho[i].CODIGO,
          quantidade: appState.carrinho[i].qtd,
          valor: preco,
          complemento: appState.carrinho[i].complemento,
        });
      }

      param.items = tmpProdutos;

      const linkWhatsApp = Diversos.gerarLinkWhatsApp(param, appState, state);

      window.open(linkWhatsApp, "_blank");

      dispatch({ type: "LIMPAR_CARRINHO" });

      router.push("/");
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", e.message);
    } finally {
      setState((state) => ({ ...state, formIsLoading: false }));
    }
  };

  const handleFormPagamento = async (event) => {
    event.preventDefault();

    let recaptchaToken = null;
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY !== "desenvolvimento") {
      if (!executeRecaptcha) {
        setMsg("error", "Atenção", "Sistema de segurança não está pronto. Tente novamente.");
        return 0;
      }
      try {
        recaptchaToken = await executeRecaptcha("checkout_payment");
        if (!recaptchaToken) {
          setMsg("error", "Atenção", "Falha na validação de segurança. Tente novamente.");
          return 0;
        }
      } catch (error) {
        console.error("Erro no reCAPTCHA:", error);
        setMsg("error", "Atenção", "Erro na validação de segurança. Tente novamente.");
        return 0;
      }
    }

    if (getCartTotal() <= 0) {
      setMsg("error", "Atenção", "Valor total do carrinho inválido.");
      return 0;
    }

    if (getCartTotal() < PEDIDO_MINIMO) {
      setMsg("error", "Pedido mínimo", `O pedido mínimo é de ${Diversos.maskPreco(PEDIDO_MINIMO)} em produtos.`);
      return 0;
    }

    if (appState.carrinho.length <= 0) {
      setMsg("error", "Atenção", "Seu carrinho está vazio.");
      return 0;
    }

    if (!state.freteSelectedNome) {
      setMsg("error", "Atenção", "Opção de entrega não selecionada.");
      return 0;
    }

    if (state.freteSelectedNome === "ENTREGA AGENDADA" && !state.freteSelectedPrazo) {
      setMsg("error", "Atenção", "Seleciona um horário de entrega para seu pedido.");
      return 0;
    }

    if (String(state.freteSelectedNome).toLowerCase().indexOf("retira") > -1 && (!state.formFormaEntregaLoja || Number(state.formFormaEntregaLoja) <= 0)) {
      setMsg("error", "Atenção", "Selecione uma loja para retirar seu pedido.");
      return 0;
    }

    if (!state.customer.cpf || (!Diversos.validateCPF(state.customer.cpf) && !Diversos.validateCNPJ(state.customer.cpf))) {
      setMsg("error", "Atenção", "Por favor informe seu CPF.");
      return 0;
    }

    if (!state.customer.email) {
      setMsg("error", "Atenção", "Por favor informe seu E-MAIL.");
      return 0;
    }

    if (!state.customer.celular) {
      setMsg("error", "Atenção", "Por favor informe seu CELULAR.");
      return 0;
    }

    if (String(state.freteSelectedNome).toLowerCase().indexOf("retira") <= -1) {
      if (!state.customer.rua || !state.customer.numero || !state.customer.cep || !state.customer.cidade) {
        setMsg("error", "Atenção", "Endereço de entrega não é válido.");
        return 0;
      }
    }

    if (![2, 4].includes(state.formFormaPgtoCodigo)) {
      setMsg("error", "Atenção", "Forma de pagamento selecionada não é válida.");
      return 0;
    }


    setState((state) => ({
      ...state,
      formIsLoading: true,
      formHasError: false,
      formHasErrorMsg: null,
    }));

    // Boleto e Pix são sempre à vista.
    const parcelas = 1;

    let desconto = state.valorDesc ? state.valorDesc : 0.0;

    // if (state.formFormaPgtoCodigo === 4) {
    //   desconto += getCartTotal() * 0.03;
    // }

    const param = {
      fgNovoLayout: true,
      cliente: state.customer.codigo,
      clienteDados: state.customer,
      fgNovoCliente: true,
      items: [],
      formapg: state.formFormaPgtoCodigo,
      desconto,
      cupom: state.codigoDesc ? state.codigoDesc : null,
      frete: {
        servico: state.freteSelectedNome,
        prazo: state.freteSelectedPrazo,
        valor: state.freteSelectedPreco,
        filial: state.formFormaEntregaLoja,
      },
      total: getTotal(),
      cartao: [
        {
          numero: "",
          validade: "",
          cvv: "",
          salva: false,
          parcelas,
          valor: getTotal(),
        },
      ],
      pagseguroSenderHash: state.pagseguroSenderHash,
      clearSaleSession: state.sessionUsuario,
      pix: null,
      repres: appState && appState.usuario && appState.usuario.vendedor && appState.usuario.vendedor.CODIGO ? appState.usuario.vendedor.CODIGO : state.vendedor,
      recaptchaToken, // Token do reCAPTCHA para validação no backend
    };

    const tmpProdutos = [];

    for (let i = 0; i < appState.carrinho.length; i++) {
      let preco = appState.carrinho[i].PREPRO > 0 && appState.carrinho[i].PREPRO < appState.carrinho[i].PRECO ? appState.carrinho[i].PREPRO : appState.carrinho[i].PRECO;

      tmpProdutos.push({
        codigo: appState.carrinho[i].CODIGO,
        quantidade: appState.carrinho[i].qtd,
        valor: preco,
        complemento: appState.carrinho[i].complemento,
      });
    }

    param.items = tmpProdutos;

    try {
      const data = await api.post("/order", param, true);

      if (data.status !== true) {
        throw new Error(data.msg);
      } else {
        const tmpProdu = [];

        for (let i = 0; i < data.msg.itens.length; i++) {
          tmpProdu.push({
            produto: data.msg.itens[i].produto,
            valor: data.msg.itens[i].valor,
            qtd: data.msg.itens[i].qtd,
            nome: data.msg.itens[i].nome,
            complemento: data.msg.itens[i].complemento,
          });
        }

        const tmpOrder = {
          pix: data.msg.pix ? data.msg.pix : null,
          cliente: data.msg.cliente,
          lojaDados: data.msg.lojaDados,
          data: data.msg.data,
          status: data.msg.status,
          entrega: data.msg.entrega,
          dtentrega: data.msg.dtentrega,
          frete: data.msg.frete,
          formapg: data.msg.formapg,
          hora: data.msg.hora,
          pedido: data.msg.PEDIDO,
          desconto: data.msg.desconto,
          acrescimo: data.msg.acrescimo,
          boleto_url: data.msg.BOLETO_URL,
          cupom: data.msg.CUPOM,
          itens: tmpProdu,
          cartao: {
            numero: null,
            bandeira: null,
            parcelas,
          },
        };

        // Boleto é emitido na api.tecworks depois que o pedido existe (precisa do
        // número). Falha aqui não desfaz o pedido: o cliente vê o aviso e a loja
        // reemite pelo painel.
        if (state.formFormaPgtoCodigo === 2 && !tmpOrder.boleto_url) {
          try {
            const dataBoleto = await api.post(`/order/boleto/1`, { pedido: data.msg.PEDIDO }, true);

            if (!dataBoleto || !dataBoleto.status || !dataBoleto.msg) {
              throw new Error(dataBoleto && dataBoleto.msg ? dataBoleto.msg : "Não foi possível emitir o boleto.");
            }

            tmpOrder.boleto_url = String(dataBoleto.msg).split(";")[0];
          } catch (eBoleto) {
            console.error("Erro ao emitir boleto:", eBoleto);
            setMsg("warning", "Pedido criado", "Seu pedido foi registrado, mas o boleto não pôde ser emitido agora. Nossa equipe vai enviar o boleto para você.");
          }
        }

        dispatch({
          type: "SET_ULTIMO_PEDIDO",
          payload: tmpOrder,
        });

        dispatch({
          type: "SET_CUPOM",
          payload: "",
        });

        setTimeout(() => {
          setState((state) => ({ ...state, redirect: "/checkout/fim" }));
        }, 200);
      }
    } catch (e) {
      console.error(e);
      setMsg("error", "Atenção", e.message);
    } finally {
      setState((state) => ({ ...state, formIsLoading: false }));
    }
  };

  const renderResumo = () => {
    return (
      <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Typography variant="h6" gutterBottom>
            Resumo do pedido
          </Typography>
          {appState.carrinho.map((item) => (
            <Box
              key={item.CODIGO}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                pb: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 1,
                  overflow: "hidden",
                  flexShrink: 0,
                  bgcolor: "grey.100",
                }}
              >
                <picture>
                  <source
                    srcSet={`${!item.FOTOS || item.FOTOS.length <= 0
                      ? "https://mellodia.shop.cdn.tecworks.com.br/produto-sem-imagem.webp"
                      : String(item.FOTOS[0].link).indexOf("https://mellodia.shop.cdn.tecworks") > -1
                        ? item.FOTOS[0].link.replace(/\.[^/.]+$/, ".webp")
                        : "https://mellodia.shop.cdn.tecworks.com.br/" + item.FOTOS[0].link.replace(/\.[^/.]+$/, ".webp")
                      }`}
                    type="image/webp"
                  />
                  <img
                    src={`${!item.FOTOS || item.FOTOS.length <= 0
                      ? "https://mellodia.shop.cdn.tecworks.com.br/produto-sem-imagem.png"
                      : String(item.FOTOS[0].link).indexOf("https://mellodia.shop.cdn.tecworks") > -1
                        ? item.FOTOS[0].link.replace(/\.[^/.]+$/, ".webp")
                        : "https://mellodia.shop.cdn.tecworks.com.br/" + item.FOTOS[0].link
                      }`}
                    alt={item.NOME}
                    loading="lazy"
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                </picture>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  {item.NOME}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.qtd}x
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
                {Diversos.maskPreco(item.PREPRO > 0 && item.PREPRO < item.PRECO ? item.PREPRO * item.qtd : item.PRECO * item.qtd)}
              </Typography>
            </Box>
          ))}

          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">{Diversos.maskPreco(getCartTotal())}</Typography>
            </Box>

            {/* <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body1">Frete</Typography>
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2 }}>
                {appState.usuario && appState.usuario.codigo && appState.usuario.vendedor && appState.usuario.vendedor.CODIGO && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setState((state) => ({ ...state, freteSelectedPreco: 0, freteGratis: true }));
                      Diversos.sendCartData(
                        appState.usuario?.codigo,
                        appState.carrinho,
                        state.formaPagamento,
                        state.freteSelectedNome,
                        state.formFormaEntregaLoja,
                        state.codigoDesc,
                        state.valorDesc,
                        true,
                        appState.usuario?.vendedor?.CODIGO
                      );
                    }}
                  >
                    Zerar Frete
                  </Button>
                )}

                {appState.usuario && appState.usuario.vendedor && appState.usuario.vendedor.CODIGO ? (
                  <TextField
                    fullWidth
                    placeholder="Frete"
                    label="Frete"
                    variant="outlined"
                    size="small"
                    value={Diversos.maskPreco(state.freteSelectedPreco)}
                    onChange={(e) => setState((state) => ({ ...state, freteSelectedPreco: Diversos.getnums(e.target.value) / 100 }))}
                    sx={{
                      width: "150px",
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "background.paper",
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {!state.freteSelectedNome ? "Calcular" : Diversos.maskPreco(state.freteSelectedPreco)}
                  </Typography>
                )}
              </Box>
            </Box>

            {String(state.freteSelectedNome || "")
              .toLowerCase()
              .indexOf("express") <= -1 &&
              String(state.freteSelectedNome || "")
                .toLowerCase()
                .indexOf("retira") <= -1 && <FreteGratisBar />}

            {state.valorDesc > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" color="success" sx={{ fontWeight: 600 }}>
                  Desconto
                </Typography>
                <Typography variant="body2" color="success" sx={{ fontWeight: 600 }}>
                  -{Diversos.maskPreco(state.valorDesc)}
                </Typography>
              </Box>
            )}

            <TextField
              fullWidth
              placeholder="Cupom de desconto"
              label="Cupom de desconto"
              variant="outlined"
              size="small"
              value={state.codigoDesc || ""}
              disabled={state.isLoadingCupom || state.formIsLoading}
              onChange={(e) => setState((state) => ({ ...state, codigoDesc: e.target.value }))}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.paper",
                },
              }}
              onBlur={() => {
                if (state.codigoDesc) {
                  Diversos.sendCartData(
                    appState.usuario?.codigo,
                    appState.carrinho,
                    state.formaPagamento,
                    state.freteSelectedNome,
                    state.formFormaEntregaLoja,
                    state.codigoDesc,
                    state.valorDesc,
                    state.freteGratis,
                    appState.usuario?.vendedor?.CODIGO
                  );
                }
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => handleCupomDesc()}
                    variant="contained"
                    size="small"
                    disabled={state.isLoadingCupom || state.formIsLoading}
                    sx={{
                      minWidth: "auto",
                      px: 2,
                      ml: 1,
                      height: 32,
                    }}
                  >
                    {state.isLoadingCupom ? <CircularProgress size={16} /> : "Aplicar"}
                  </Button>
                ),
              }}
            />

            {appState.usuario && appState.usuario.codigo && appState.usuario.vendedor && appState.usuario.vendedor.CODIGO && (
              <>
                <Divider />
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Desconto (Tele)
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="% de desconto"
                    label="Desconto %"
                    variant="outlined"
                    size="small"
                    value={state.telePercentDesc}
                    onChange={(e) => {
                      let percentValue = parseInt(Diversos.getnums(e.target.value));

                      if (percentValue > 100) {
                        percentValue = 100;
                      } else if (percentValue < 0) {
                        percentValue = 0;
                      }

                      const descontoTotal = getCartTotal() * (percentValue / 100);

                      setState((state) => ({
                        ...state,
                        telePercentDesc: percentValue,
                        teleValorDesc: Diversos.maskPreco(descontoTotal),
                        valorDesc: descontoTotal,
                      }));

                      Diversos.sendCartData(
                        appState.usuario?.codigo,
                        appState.carrinho,
                        state.formaPagamento,
                        state.freteSelectedNome,
                        state.formFormaEntregaLoja,
                        state.codigoDesc,
                        descontoTotal,
                        state.freteGratis,
                        appState.usuario?.vendedor?.CODIGO
                      );
                    }}
                  />
                  <TextField
                    fullWidth
                    placeholder="R$ de desconto"
                    label="Desconto R$"
                    variant="outlined"
                    size="small"
                    value={state.teleValorDesc}
                    onChange={(e) => {
                      let valorValue = Diversos.getnums(e.target.value) / 100;

                      if (valorValue > getCartTotal()) {
                        valorValue = getCartTotal();
                      } else if (valorValue < 0) {
                        valorValue = 0;
                      }

                      const descontoTotal = valorValue;

                      const percentValue = (descontoTotal / getCartTotal()) * 100;

                      setState((state) => ({
                        ...state,
                        telePercentDesc: percentValue.toFixed(2),
                        teleValorDesc: Diversos.maskPreco(descontoTotal),
                        valorDesc: descontoTotal,
                      }));

                      Diversos.sendCartData(
                        appState.usuario?.codigo,
                        appState.carrinho,
                        state.formaPagamento,
                        state.freteSelectedNome,
                        state.formFormaEntregaLoja,
                        state.codigoDesc,
                        descontoTotal,
                        state.freteGratis,
                        appState.usuario?.vendedor?.CODIGO
                      );
                    }}
                  />
                </Box>
              </>
            )} */}

            <Divider />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary">
                {Diversos.maskPreco(getTotal())}
              </Typography>
            </Box>

            {/* <FormControl fullWidth>
              <InputLabel>Parcelamento</InputLabel>
              <Select
                value={state.parcelaSelecionada}
                onChange={(e) => setState((state) => ({ ...state, parcelaSelecionada: e.target.value }))}
                label="Parcelamento"
                disabled={state.formIsLoading}
              >
                {getParcelamentoOptions().map((op) => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl> */}

            {/* <Paper elevation={0} sx={{ py: 0 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                *** Após a compra, você receberá um e-mail com o link para acompanhar o status do seu pedido.
              </Typography>
            </Paper> */}

            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
              * Pedido mínimo de {Diversos.maskPreco(PEDIDO_MINIMO)} em produtos.
            </Typography>

            {getCartTotal() < PEDIDO_MINIMO && (
              <Alert severity="info">
                Faltam {Diversos.maskPreco(PEDIDO_MINIMO - getCartTotal())} para atingir o pedido mínimo de {Diversos.maskPreco(PEDIDO_MINIMO)}.
              </Alert>
            )}

            <Divider />

            <Button
              variant="contained"
              size="large"
              fullWidth
              // onClick={state.isLargeScreen ? handleForm : () => (window.location.href = "#login-btn-checkout")}
              onClick={handleFormPagamento}
              disabled={state.formIsLoading || getCartTotal() < PEDIDO_MINIMO}
              sx={{
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                bgcolor: "success.main",
                "&:hover": {
                  bgcolor: "success.dark",
                },
                display: {
                  xs: "none",
                  sm: "none",
                  md: "block",
                  lg: "block",
                  xl: "block",
                },
              }}
            >
              {state.formIsLoading ? "Processando, por favor aguarde..." : "Finalizar compra"}
            </Button>

            {appState.usuario && appState.usuario.vendedor && appState.usuario.vendedor.NOME && (
              <Button
                variant="outlined"
                size="large"
                fullWidth
                onClick={handleFormOramento}
                disabled={state.formIsLoading}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  display: {
                    xs: "none",
                    sm: "none",
                    md: "block",
                    lg: "block",
                    xl: "block",
                  },
                }}
              >
                {state.formIsLoading ? "Processando, por favor aguarde..." : "Gravar como Orçamento"}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  };

  useEffect(() => {
    console.log("[CEP useEffect] cep atual:", state.customer.cep);
    getAddressByCep();
  }, [state.customer.cep]);

  useEffect(() => {
    console.log("[RUA useEffect] rua atual:", state.customer.rua);
    getShippingModes();
  }, [state.customer.rua]);

  useEffect(() => {
    if (appState.usuario && appState.usuario.codigo) {
      getCustomer();
    }
  }, [appState.usuario?.codigo]);

  useEffect(() => {
    if (state.freteSelectedNome) {
      handleChangeStepMore(3);

      const itemsList = [];

      appState.carrinho.forEach((produto, index) => {
        itemsList.push({
          item_name: produto.NOME, // Name or ID is required.
          item_id: produto.CODIGO,
          price: produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO,
          quantity: produto.qtd,
        });
      });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_shipping_info",
        ecommerce: {
          currency: "BRL",
          value: state.freteSelectedPreco,
          shipping_tier: state.freteSelectedNome,
          items: itemsList,
        },
      });
    }
  }, [state.freteSelectedNome]);

  useEffect(() => {
    if (Number(state.formFormaPgtoCodigo) === Number(1)) {
      getInstalments();
    }

    const itemsList = [];

    appState.carrinho.forEach((produto, index) => {
      itemsList.push({
        item_name: produto.NOME, // Name or ID is required.
        item_id: produto.CODIGO,
        price: produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO,
        quantity: produto.qtd,
      });
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_payment_info",
      ecommerce: {
        currency: "BRL",
        value: getTotal(),
        payment_type: Number(state.formFormaPgtoCodigo) === Number(2) ? "boleto" : "pix",
        items: itemsList,
      },
    });
  }, [state.formFormaPgtoCodigo]);

  useEffect(() => {
    const handleResize = () => {
      setState((prev) => ({
        ...prev,
        isLargeScreen: window.innerWidth >= 900, // md breakpoint do Material-UI
      }));
    };

    // Inicializa o valor
    handleResize();

    // Adiciona listener para mudanças de tamanho
    window.addEventListener("resize", handleResize);

    // Start um timer de 10 segundos minutos para enviar carrinho para o controle de carrinho abandonado
    setTimeout(() => {
      fetch("https://n8n.www.mellodia.com.br/webhook/abandono-carrinho", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: Diversos.getSessionId(),
        }),
      }).catch((error) => {
        console.error("Erro:", error);
      });
    }, 10 * 1000);

    // Limpa o listener quando o componente é desmontado
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setState((state) => ({
      ...state,
      mdDevice: window.innerWidth <= 992,
    }));

    getInstalments();

    if (appState.linkCarrinho) {
      setState((state) => ({
        ...state,
        formaPagamento: appState.linkCarrinho.formaPagamento,
        formFormaPgtoCodigo: appState.linkCarrinho.formaPagamento === "boleto" ? 2 : 4,
        freteSelectedNome: appState.linkCarrinho.formaEntrega,
        formFormaEntregaLoja: appState.linkCarrinho.formaEntregaLoja,
        codigoDesc: appState.linkCarrinho.cupomDesconto,
        valorDesc: appState.linkCarrinho.desconto,
        freteGratis: appState.linkCarrinho.freteGratis,
        vendedor: appState.linkCarrinho.vendedor,
      }));

      if (Boolean(appState.linkCarrinho.freteGratis)) {
        setState((state) => ({ ...state, freteSelectedPreco: 0, freteGratis: true }));
      }

      if (appState.linkCarrinho.cupomDesconto) {
        handleCupomDesc(appState.linkCarrinho.cupomDesconto);
      }

      setTimeout(() => {
        getShippingModes(appState.linkCarrinho.cep, appState.linkCarrinho.formaEntrega);
      }, 300);

      dispatch({
        type: "UNSET_LINK_CARRINHO",
      });
    }

    if (window && window.dataLayer) {
      const itemList = [];

      appState.carrinho.forEach((produto, index) => {
        itemList.push({
          item_name: produto.NOME, // Name or ID is required.
          item_id: produto.CODIGO,
          price: produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO,
          item_brand: produto.MARCA,
          item_category: produto.NOMEGRUPO,
          index: index,
        });
      });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "BRL",
          value: getTotal(),
          items: itemList,
        },
      });
    }
  }, []);

  if (state.redirect) {
    redirect(state.redirect);
    return <></>;
  }

  if (appState.carrinho.length <= 0) {
    return <></>;
  }

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        py: 4,
        // borderTop: "solid 5px transparent",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "55%",
          height: "100%",
          bgcolor: {
            md: "transparent",
            xs: "transparent",
          },
          zIndex: 0,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "45%",
          height: "100%",
          bgcolor: {
            md: "transparent",
            xs: "transparent",
          },
          zIndex: 0,
        },
      }}
    >
      {state.formHasError && (
        <Alert severity="error" variant="filled" sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 1000 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            ** Atenção **
          </Typography>
          <Typography variant="body2">{state.formHasErrorMsg}</Typography>
        </Alert>
      )}

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            order={{ xs: 2, sm: 2, md: 1 }}
            sx={{
              position: state.isLargeScreen ? "sticky" : "static",
              top: state.isLargeScreen ? 24 : "auto",
            }}
          >
            <Stack spacing={0}>
              <Button
                variant="text"
                size="small"
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ alignSelf: "flex-start", mb: 1, color: "text.secondary" }}
              >
                Voltar
              </Button>

              {/* Entrega — loja B2B: os dados vêm do cadastro e não são editáveis aqui */}
              <Paper elevation={0} sx={{ py: 0 }}>
                <Typography variant="h6" gutterBottom>
                  Dados da Entrega
                </Typography>

                <Alert
                  severity="info"
                  sx={{ mb: 2 }}
                  action={
                    <Button color="inherit" size="small" onClick={() => router.push("/perfil/editar/endereco")}>
                      Alterar endereço
                    </Button>
                  }
                >
                  Estes são os dados do seu cadastro.
                </Alert>

                <Grid container spacing={2}>
                  {[
                    { label: "Cliente", valor: `${state.customer.nome || ""} ${state.customer.sobrenome || ""}`.trim() },
                    { label: "CNPJ", valor: state.customer.cpf },
                    { label: "E-mail", valor: state.customer.email },
                    { label: "Celular", valor: state.customer.celular },
                    { label: "CEP", valor: state.customer.cep },
                    {
                      label: "Endereço",
                      valor: [state.customer.rua, state.customer.numero, state.customer.complemento].filter((p) => p && String(p).trim() !== "").join(", "),
                    },
                    { label: "Bairro", valor: state.customer.bairro },
                    {
                      label: "Cidade / UF",
                      valor: [state.customer.cidade, state.customer.estado].filter((p) => p && String(p).trim() !== "").join(" / "),
                    },
                  ].map((campo) => (
                    <Grid item xs={12} sm={6} key={campo.label}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {campo.label}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {state.isLoadingCustomer ? "..." : campo.valor && String(campo.valor).trim() !== "" ? campo.valor : "—"}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selecione abaixo a forma de entrega
                </Typography>
              </Divider>

              {/* Pagamento  */}
              <Paper elevation={0} sx={{ py: 0 }}>
                <Typography variant="h6" gutterBottom>
                  Forma de Entrega *
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Selecione a forma de entrega que deseja abaixo.
                </Typography>

                {state.isLoadingFrete ? (
                  <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
                ) : !state.customer.cep || Diversos.getnums(state.customer.cep).length !== 8 ? (
                  <Alert severity="info" variant="outlined">
                    Preencha o CEP acima para ver as opções de entrega disponíveis.
                  </Alert>
                ) : state.freteOpcoes.length <= 0 ? (
                  <Alert severity="warning" variant="outlined">
                    Nenhuma opção de entrega disponível para o CEP informado.
                  </Alert>
                ) : (
                  state.freteOpcoes.map((row, index) => (
                    <>
                      <Paper
                        variant="outlined"
                        sx={{
                          mb: 2,
                          p: 2,
                          border: "1px solid",
                          borderColor: state.formaEntrega === row.nome ? "primary.main" : "divider",
                          position: "relative",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        onClick={() => {
                          setState((state) => ({
                            ...state,
                            freteSelectedNome: row.nome,
                            freteSelectedPreco: row.preco,
                            freteSelectedPrazo: row.prazoMax,
                          }));

                          Diversos.sendCartData(
                            appState.usuario?.codigo,
                            appState.carrinho,
                            state.formaPagamento,
                            row.nome,
                            state.formFormaEntregaLoja,
                            state.cupomDesconto,
                            state.valorDesc,
                            state.freteGratis,
                            appState.usuario?.vendedor?.CODIGO
                          );
                        }}
                      >
                        <FormControlLabel
                          value={row.nome}
                          name="freteEntrega"
                          disabled={state.formIsLoading}
                          control={<Radio name="freteEntrega" checked={state.freteSelectedNome === row.nome} />}
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                              {String(row.nome).toLowerCase().indexOf("motoboy") > -1 ? (
                                <TwoWheelerIcon sx={{ mr: 1, color: "text.secondary" }} />
                              ) : String(row.nome).toLowerCase().indexOf("express") > -1 ? (
                                <AccessTimeIcon sx={{ mr: 1, color: "text.secondary" }} />
                              ) : String(row.nome).toLowerCase().indexOf("retira") > -1 ? (
                                <StoreIcon sx={{ mr: 1, color: "text.secondary" }} />
                              ) : (
                                <CreditCardIcon sx={{ mr: 1, color: "text.secondary" }} />
                              )}

                              <Image
                                src={
                                  String(row.nome).toLowerCase().indexOf("motoboy") > -1
                                    ? `/motoboy.svg`
                                    : String(row.nome).toLowerCase().indexOf("express") > -1
                                    ? `/expresso.svg`
                                    : `/retira.svg`
                                }
                                alt={row.nome}
                                width={34}
                                height={34}
                                style={{ marginRight: 10 }}
                              />
                              
                              <Typography sx={{ fontWeight: "bold", fontSize: "0.95rem" }}>{row.nome}</Typography>
                            </Box>
                          }
                        />

                        <Box
                          sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                            textAlign: "right",
                            //mt: 1,
                            // position: "absolute",
                            //right: 10,
                            //top: 10,
                          }}
                        >
                          {String(row.nome).toLowerCase().indexOf("express") > -1 ? (
                            <Typography variant="body2" color="success" sx={{ fontWeight: 700 }}>
                              RECEBA EM ATÉ 2 HORAS
                            </Typography>
                          ) : String(row.prazo).indexOf(moment().format("DD/MM/YYYY")) > -1 && String(row.nome).toLowerCase().indexOf("motoboy") > -1 ? (
                            <Typography variant="body2" color="success" sx={{ fontWeight: 700 }}>
                              {String(row.nome).toLowerCase().indexOf("retira") > -1 ? "RETIRE" : "RECEBA"} AINDA HOJE ATÉ 19h00
                            </Typography>
                          ) : String(row.prazo).indexOf(moment().format("DD/MM/YYYY")) > -1 ? (
                            <Typography variant="body2" color="success" sx={{ fontWeight: 700 }}>
                              {String(row.nome).toLowerCase().indexOf("retira") > -1 ? "RETIRE" : "RECEBA"} AINDA HOJE
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              {row.prazo}
                            </Typography>
                          )}
                          {Number(row.preco) <= 0 && String(row.nome).toLowerCase().indexOf("retira") <= -1 ? (
                            <Typography variant="body2" color="success" sx={{ fontWeight: 700, fontSize: "1.2rem" }}>
                              FRETE GRÁTIS
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                              {Diversos.maskPreco(row.preco)}
                            </Typography>
                          )}
                        </Box>
                      </Paper>
                      {String(row.nome).toLowerCase().indexOf("retira") > -1 && state.freteSelectedNome === row.nome && row.lojas && row.lojas.length > 0 ? (
                        <>
                          <Divider sx={{ my: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Selecione abaixo a loja que deseja retirar seu pedido
                            </Typography>
                          </Divider>
                          {row.lojas.map(
                            (loja) =>
                              loja.fgEstoque && (
                                <Paper
                                  variant="outlined"
                                  sx={{
                                    width: "90%",
                                    ml: "10%",
                                    mb: 1,
                                    px: 2,
                                    py: 1,
                                    border: "1px solid",
                                    borderColor: state.formaEntrega === row.nome ? "primary.main" : "divider",
                                    position: "relative",
                                    height: "auto",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setState((state) => ({ ...state, formFormaEntregaLoja: loja.lojaCodigo }));

                                    Diversos.sendCartData(
                                      appState.usuario?.codigo,
                                      appState.carrinho,
                                      state.formaPagamento,
                                      state.freteSelectedNome,
                                      loja.lojaCodigo,
                                      state.cupomDesconto,
                                      state.valorDesc,
                                      state.freteGratis,
                                      appState.usuario?.vendedor?.CODIGO
                                    );
                                  }}
                                >
                                  <FormControlLabel
                                    value={loja.lojaCodigo}
                                    name="lojaSelected"
                                    control={<Radio name="lojaSelected" checked={state.formFormaEntregaLoja === loja.lojaCodigo} />}
                                    label={
                                      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                                        <Typography variant="subtitle" color="text.secondary" sx={{ fontWeight: 600, fontSize: "1rem" }} key={loja.lojaCodigo}>
                                          {`Loja ${loja.lojaCodigo}`}
                                        </Typography>
                                      </Box>
                                    }
                                  />

                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1,
                                      alignItems: "flex-end",
                                      justifyContent: "center",
                                      mt: 0,
                                    }}
                                  >
                                    <Typography variant="body2" color="text.secondary" textAlign="right" sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
                                      {`${loja.lojaRua}, ${loja.lojaNumero}`}
                                      <br />
                                      {`${loja.lojaBairro} - ${loja.lojaCidade}`}
                                      <br />
                                      {`${Diversos.maskCEP(loja.lojaCep)}`}
                                    </Typography>
                                  </Box>
                                </Paper>
                              )
                          )}
                        </>
                      ) : null}
                    </>
                  ))
                )}
              </Paper>

              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Selecione abaixo a forma de pagamento
                </Typography>
              </Divider>

              {/* Pagamento */}
              <Paper elevation={0} sx={{ py: 0 }}>
                <Typography variant="h6" gutterBottom>
                  Forma de Pagamento *
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Pagamento por boleto bancário ou Pix.
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: state.formFormaPgtoCodigo === 2 ? "primary.main" : "divider",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setState((state) => ({ ...state, formaPagamento: "boleto", formFormaPgtoCodigo: 2 }));

                    Diversos.sendCartData(
                      appState.usuario?.codigo,
                      appState.carrinho,
                      "boleto",
                      state.freteSelectedNome,
                      state.formFormaEntregaLoja,
                      state.cupomDesconto,
                      state.valorDesc,
                      state.freteGratis,
                      appState.usuario?.vendedor?.CODIGO
                    );
                  }}
                >
                  <FormControlLabel
                    value="boleto"
                    disabled={state.formIsLoading}
                    control={<Radio checked={state.formFormaPgtoCodigo === 2} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <ReceiptLongIcon sx={{ mr: 1, color: state.formFormaPgtoCodigo === 2 ? "primary.main" : "text.secondary" }} />
                        <Typography>Boleto bancário</Typography>
                      </Box>
                    }
                  />
                </Paper>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid",
                    borderColor: state.formFormaPgtoCodigo === 4 ? "primary.main" : "divider",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setState((state) => ({ ...state, formaPagamento: "pix", formFormaPgtoCodigo: 4 }));

                    Diversos.sendCartData(
                      appState.usuario?.codigo,
                      appState.carrinho,
                      "pix",
                      state.freteSelectedNome,
                      state.formFormaEntregaLoja,
                      state.cupomDesconto,
                      state.valorDesc,
                      state.freteGratis,
                      appState.usuario?.vendedor?.CODIGO
                    );
                  }}
                >
                  <FormControlLabel
                    value="pix"
                    disabled={state.formIsLoading}
                    control={<Radio checked={state.formFormaPgtoCodigo === 4} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PixIcon sx={{ mr: 1, color: state.formFormaPgtoCodigo === 4 ? "primary.main" : "text.secondary" }} />
                        <Typography>Pix</Typography>
                      </Box>
                    }
                  />
                </Paper>

                {state.formFormaPgtoCodigo === 2 && (
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Alert severity="info" sx={{ fontWeight: 600 }}>
                          O boleto é emitido na próxima tela, com vencimento em 2 dias. O pedido é separado após a confirmação do pagamento.
                        </Alert>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {state.formFormaPgtoCodigo === 4 && (
                  <Box sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Alert severity="info" sx={{ fontWeight: 600 }}>
                          O QrCode do pix será gerado na próxima tela.
                        </Alert>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>

              <Divider sx={{ mt: 5, borderWidth: 0 }} />

              <Paper elevation={0} sx={{ py: 0 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  *** Após a compra, você receberá um e-mail com o link para acompanhar o status do seu pedido.
                </Typography>
              </Paper>
              <Divider sx={{ mt: 5 }} />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleFormPagamento}
                disabled={state.formIsLoading || getCartTotal() < PEDIDO_MINIMO}
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  bgcolor: "success.main",
                  "&:hover": {
                    bgcolor: "success.dark",
                  },
                }}
              >
                {state.formIsLoading ? "Processando, por favor aguarde..." : "Finalizar compra"}
              </Button>

              {appState.usuario && appState.usuario.vendedor && appState.usuario.vendedor.NOME && (
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  onClick={handleFormOramento}
                  disabled={state.formIsLoading}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    mt: 2,
                  }}
                >
                  {state.formIsLoading ? "Processando, por favor aguarde..." : "Gravar como Orçamento"}
                </Button>
              )}
            </Stack>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            order={{ xs: 1, sm: 1, md: 2 }}
            sx={{
              position: { xs: "static", md: "sticky" },
              top: 24,
              height: "fit-content",
              alignSelf: "flex-start",
            }}
          >
            {renderResumo()}
          </Grid>
        </Grid>
      </Container>

      <Modal open={modalLinkPagamento} onClose={() => setModalLinkPagamento(false)} aria-labelledby="modal-identificar-cliente">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-identificar-cliente" variant="h6" component="h2" sx={{ mb: 3 }}>
            Link de pagamento
          </Typography>
          <Typography id="modal-identificar-cliente" variant="body1" sx={{ mb: 3 }}>
            Clique no botão abaixo para copiar o link de pagamento e enviar ao cliente.
          </Typography>
          <TextField
            fullWidth
            label="Link de pagamento"
            variant="outlined"
            value={state.linkPagamento ?? ""}
            name="linkPagamento"
            sx={{ mb: 3 }}
            autoFocus
            disabled
          />
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button size="large" variant="outlined" onClick={() => setModalLinkPagamento(false)} fullWidth>
              Fechar
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={() => {
                navigator.clipboard.writeText(state.linkPagamento);
                setMsg("success", "Link copiado", "Link copiado com sucesso.");
                // setModalLinkPagamento(false);
              }}
              fullWidth
            >
              Copiar link
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal de Loading */}
      <Dialog
        open={state.formIsLoading}
        aria-labelledby="loading-dialog-title"
        aria-describedby="loading-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "400px",
            width: "100%",
            borderRadius: 2,
            p: 3,
          },
        }}
      >
        <DialogContent sx={{ textAlign: "center", p: 3 }}>
          <CircularProgress size={60} sx={{ mb: 3, color: "primary.main" }} />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
            Processando, por favor aguarde...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estamos processando seu pedido, por favor aguarde a mensagem de conclusão
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default function CheckoutPagamento(props) {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; // Chave de teste do Google

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      <CheckoutPagamentoContent {...props} />
    </GoogleReCaptchaProvider>
  );
}
