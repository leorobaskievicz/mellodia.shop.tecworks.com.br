"use client";

import {
  Grid,
  Typography,
  Box,
  Button,
  Modal,
  TextField,
  CircularProgress,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { styleContainer, styleContainerBody, styleContainerBodyText, styleModal } from "./style";
import { useApp } from "@/app/context/AppContext";
import { Colors } from "@/app/style.constants";
import { Diversos } from "@/app/lib/diversos";
import Api from "@/app/lib/api";
import { useState, useEffect } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { supabase } from "@/app/lib/supabaseClient";
import { deleteUserSupabase } from "@/app/lib/funcoes";
import moment from "moment";

export default function TopHeaderTelevendas() {
  const { state: stateApp, dispatch } = useApp();
  const router = useRouter();
  const [cpfIsLoading, setIsLoading] = useState(false);
  const [isLoadingCadastro, setIsLoadingCadastro] = useState(false);
  const [modalCadastro, setModalCadastro] = useState(false);
  const [open, setOpen] = useState(false);
  const [cpf, setCpf] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    dataNascimento: "",
  });
  const [cepIsLoading, setCepIsLoading] = useState(false);
  const [orcamentosModalOpen, setOrcamentosModalOpen] = useState(false);
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentosPage, setOrcamentosPage] = useState(1);
  const [orcamentosPerPage, setOrcamentosPerPage] = useState(30);
  const [orcamentosLastPage, setOrcamentosLastPage] = useState(1);
  const [orcamentosTotal, setOrcamentosTotal] = useState(0);
  const [orcamentosIsLoading, setOrcamentosIsLoading] = useState(false);
  const [orcamentosHasError, setOrcamentosHasError] = useState(false);
  const [orcamentosFiltroDataInicial, setOrcamentosFiltroDataInicial] = useState(moment().startOf("month"));
  const [orcamentosFiltroDataFinal, setOrcamentosFiltroDataFinal] = useState(moment().endOf("month"));
  const [orcamentosFiltroPesquisa, setOrcamentosFiltroPesquisa] = useState("");
  const [orcamentoSelected, setOrcamentoSelected] = useState({});

  useEffect(() => {
    if (stateApp.usuario?.vendedor?.CODIGO) {
      const api = new Api();
      const fetchOrcamentos = async () => {
        setOrcamentosIsLoading(true);
        try {
          const param = {
            dataInicial: orcamentosFiltroDataInicial.format("YYYY-MM-DD"),
            dataFinal: orcamentosFiltroDataFinal.format("YYYY-MM-DD"),
            filtro: orcamentosFiltroPesquisa,
            page: orcamentosPage,
            perPage: orcamentosPerPage,
          };

          const response = await api.get(`/orcamentos?${new URLSearchParams(param).toString()}`, true);

          if (response.status && response.msg && response.msg.data.length > 0) {
            setOrcamentos(response.msg.data);
            setOrcamentosPage(response.msg.page);
            setOrcamentosPerPage(response.msg.perPage);
            setOrcamentosLastPage(response.msg.lastPage);
            setOrcamentosTotal(response.msg.total);
          } else {
            setOrcamentosHasError(true);
            setOrcamentos([]);
          }
        } catch (e) {
          console.log(e);
          setOrcamentosHasError(true);
          setOrcamentos([]);
        } finally {
          setOrcamentosIsLoading(false);
        }
      };
      fetchOrcamentos();
    }
  }, [orcamentosPerPage, orcamentosPage]);

  const api = new Api();

  const handleOpen = () => setOpen(true);

  const handleClose = (fgLimpaCpf = true) => {
    if (fgLimpaCpf) {
      setCpf("");
    }
    setOpen(false);
  };

  const handleCloseCadastro = () => {
    setModalCadastro(false);
    setCpf("");
    setForm({
      nome: "",
      email: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      dataNascimento: "",
    });
  };

  const handleOpenCadastro = () => setModalCadastro(true);

  const handlePesquisaCep = async () => {
    setCepIsLoading(true);
    try {
      const param = { cep: form.cep };

      const data = await api.post("/shipping/cep", param, true);

      if (data && data.status) {
        setForm((form) => ({
          ...form,
          endereco: data.msg.logradouro,
          bairro: data.msg.bairro,
          cidade: data.msg.localidade,
          estado: data.msg.uf,
          codmun: data.msg.ibge,
        }));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setCepIsLoading(false);
    }
  };

  const handlePesquisar = async () => {
    if (!Diversos.validateCNPJ(cpf) && !Diversos.validateCPF(cpf)) {
      setCpf("");
      toast.error("CPF ou CNPJ inválido, por favor informe um CPF ou CNPJ válido.");
      window.document.querySelector("input[name='cpf']").focus();
      return false;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`/customer/check-cpf`, { value: cpf });

      if (response.status && Number(response.msg.codigo) > 0) {
        Diversos.resetCart();

        dispatch({
          type: "LIMPAR_CARRINHO",
          payload: {},
        });

        const vendedor = stateApp.usuario.vendedor;

        dispatch({
          type: "LOGIN",
          payload: {
            codigo: response.msg.codigo,
            nome: response.msg.nome,
            email: response.msg.email,
            status: true,
            avatar: "",
            token: null,
            vendedor: vendedor,
          },
        });

        Diversos.resetCart();

        setTimeout(() => {
          Diversos.sendCartData(response.msg.codigo, stateApp.carrinho, "", "", "", "", "", "", stateApp.usuario?.vendedor?.CODIGO);
        }, 250);

        toast.success("Cliente localizado com sucesso.");
        handleClose();
      } else {
        handleClose(false);

        setTimeout(() => handleOpenCadastro(), 300);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }

    return true;
  };

  const handleCadastrar = async (e) => {
    e.preventDefault();

    setIsLoadingCadastro(true);

    let signupUserId = null;

    try {
      const param = {
        email: String(form.email).trim().toLowerCase(),
        senha: "123diva899*!",
        nome: form.nome,
        cpf: cpf,
        nascimento: form.dataNascimento,
        telefone: form.telefone,
        celular: form.telefone,
        cep: form.cep,
        rua: form.endereco,
        numero: form.numero,
        bairro: form.bairro,
        cidade: form.cidade,
        estado: form.estado,
        complemento: form.complemento,
        codmun: form.codmun,
        googleid: null,
        appleid: null,
      };

      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: param.email,
        password: param.senha,
        options: {
          data: {
            nome: form.nome,
            celular: form.telefone,
            cpf: cpf,
          },
        },
      });

      signupUserId = signupData.user?.id || null;

      if (signupError) throw new Error(signupError.message);
      param.googleid = signupData.user?.id || null;

      const data = await api.post("/customer", param, true);

      if (!data.status) {
        throw new Error(data.msg);
      }

      const paramNewsletter = {
        nome: form.nome,
        email: form.email,
        recebeEmail: "S",
        data: new Date(),
      };

      await api.post("/customer/newsletter", paramNewsletter, true);

      dispatch({
        type: "LIMPAR_CARRINHO",
        payload: {},
      });

      const vendedor = stateApp.usuario.vendedor;

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
          vendedor: vendedor,
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

      Diversos.resetCart();

      setTimeout(() => {
        Diversos.sendCartData(data.msg.codigo, stateApp.carrinho, "", "", "", "", "", "", stateApp.usuario.vendedor);
      }, 250);

      toast.success("Cliente cadastrado com sucesso.");
      handleCloseCadastro();
    } catch (e) {
      if (signupUserId) {
        await deleteUserSupabase(signupUserId);
      }

      console.log(e);
      toast.error("Não foi possível cadastrar cliente, por favor tente novamente.");
    } finally {
      setIsLoadingCadastro(false);
    }
  };

  const renderModalIndentificarCliente = () => (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-identificar-cliente">
      <Box sx={styleModal}>
        <Typography id="modal-identificar-cliente" variant="h6" component="h2" sx={{ mb: 3 }}>
          Identificar Cliente
        </Typography>
        <Typography id="modal-identificar-cliente" variant="body1" sx={{ mb: 3 }}>
          Informe o CPF do cliente abaixo, após isso o sistema irá fazer login automáticamente ou abrir formulário para cadastro.
        </Typography>
        <TextField
          fullWidth
          label="CPF ou CNPJ"
          variant="outlined"
          value={cpf}
          name="cpf"
          onChange={(e) => {
            if (Diversos.validateCNPJ(e.target.value)) {
              setCpf(Diversos.maskCNPJString(e.target.value));
            } else if (Diversos.validateCPF(e.target.value)) {
              setCpf(Diversos.maskCPFString(e.target.value));
            } else {
              setCpf(e.target.value);
            }
          }}
          sx={{ mb: 3 }}
          inputProps={{ maxLength: 17, style: { textAlign: "center", fontSize: 26 } }}
          onKeyPress={(event) => {
            if (event.key === "Enter" && !cpfIsLoading) {
              handlePesquisar();
            }
          }}
          autoFocus
        />
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button size="large" variant="outlined" onClick={handleClose} fullWidth disabled={cpfIsLoading}>
            Fechar
          </Button>
          <Button size="large" variant="contained" onClick={handlePesquisar} fullWidth disabled={cpfIsLoading}>
            {cpfIsLoading ? <CircularProgress size={20} /> : <SearchIcon sx={{ mr: 1 }} />}
            {cpfIsLoading ? "Pesquisando..." : "Pesquisar"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const renderModalCadastrarCliente = () => (
    <Modal open={modalCadastro} onClose={handleCloseCadastro} aria-labelledby="modal-cadastro-cliente">
      <Box sx={styleModal}>
        <Typography id="modal-cadastro-cliente" variant="h6" component="h2" sx={{ mb: 3 }}>
          Cadastro de Cliente
        </Typography>
        {isLoadingCadastro ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2 }}>
              <CircularProgress sx={{ mb: 2, width: 40, height: 40 }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Cadastrando cliente, aguarde...
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="CPF" variant="outlined" value={cpf} name="cpf" disabled required />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  autoFocus
                  label="Nome"
                  variant="outlined"
                  value={form.nome}
                  name="nome"
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField fullWidth label="Email" variant="outlined" value={form.email} name="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Telefone"
                  variant="outlined"
                  value={form.telefone}
                  name="telefone"
                  onChange={(e) => setForm({ ...form, telefone: Diversos.maskTelefone(e.target.value) })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="CEP"
                  variant="outlined"
                  value={form.cep}
                  name="cep"
                  onChange={(e) => setForm({ ...form, cep: Diversos.maskCEP(e.target.value) })}
                  required
                  disabled={cepIsLoading}
                  inputProps={{
                    maxLength: 10,
                  }}
                  onKeyUp={(event) => {
                    if (event.target.value.length === 10 && !cepIsLoading) {
                      handlePesquisaCep();
                    }
                  }}
                  InputProps={{
                    endAdornment: cepIsLoading ? <CircularProgress size={20} /> : null,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  variant="outlined"
                  value={form.endereco}
                  name="endereco"
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  required
                  disabled={cepIsLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número"
                  variant="outlined"
                  value={form.numero}
                  name="numero"
                  onChange={(e) => setForm({ ...form, numero: e.target.value })}
                  required
                  disabled={cepIsLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} />
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Complemento"
                  variant="outlined"
                  value={form.complemento}
                  name="complemento"
                  onChange={(e) => setForm({ ...form, complemento: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  label="Bairro"
                  variant="outlined"
                  value={form.bairro}
                  name="bairro"
                  onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                  required
                  disabled={cepIsLoading}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Cidade"
                  variant="outlined"
                  value={form.cidade}
                  name="cidade"
                  onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                  required
                  disabled={cepIsLoading}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  options={Diversos.getUFs()}
                  value={Diversos.getUFs().find((uf) => uf.value === form.estado) || null}
                  onChange={(event, newValue) => {
                    setForm({ ...form, estado: newValue ? newValue.value : "" });
                  }}
                  renderInput={(params) => <TextField {...params} label="Estado" required />}
                  fullWidth
                  disabled={cepIsLoading}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
              <Button size="large" variant="outlined" onClick={handleCloseCadastro} fullWidth>
                Fechar
              </Button>
              <Button size="large" variant="contained" onClick={handleCadastrar} fullWidth>
                Cadastrar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );

  const handlePesquisarOrcamentos = async () => {
    setOrcamentosIsLoading(true);
    try {
      const param = {
        dataInicial: orcamentosFiltroDataInicial.format("YYYY-MM-DD"),
        dataFinal: orcamentosFiltroDataFinal.format("YYYY-MM-DD"),
        filtro: orcamentosFiltroPesquisa,
        page: orcamentosPage,
        perPage: orcamentosPerPage,
      };

      const response = await api.get(`/orcamentos?${new URLSearchParams(param).toString()}`, true);

      if (!response.status || !response.msg || response.msg.data.length <= 0) {
        throw new Error(response.msg);
      }

      setOrcamentos(response.msg.data);
      setOrcamentosPage(response.msg.page);
      setOrcamentosPerPage(response.msg.perPage);
      setOrcamentosLastPage(response.msg.lastPage);
      setOrcamentosTotal(response.msg.total);
      setOrcamentosHasError(true);
    } catch (e) {
      console.log(e);
      setOrcamentosHasError(true);
      setOrcamentos([]);
    } finally {
      setOrcamentosIsLoading(false);
    }
  };

  const convertToPedido = async (orcamento) => {
    dispatch({ type: "LIMPAR_CARRINHO" });

    dispatch({ type: "LOGOUT" });

    await new Promise((resolve) => setTimeout(resolve, 400));

    for (let i = 0; i < orcamento.itens.length; i++) {
      const item = orcamento.itens[i];
      const produto = item.produtoDados;

      let prepro = 0;

      if (produto.PREPRO > 0 && produto.PREPRO < produto.PRECO) {
        prepro = produto.PREPRO;
      }

      dispatch({ type: "ADICIONAR_AO_CARRINHO", payload: { ...produto, PRECO: produto.PVENDA, PREPRO: prepro, qtd: item.QTD, FOTOS: produto.FOTOS } });
    }

    dispatch({
      type: "LOGIN",
      payload: {
        ...stateApp.usuario,
        codigo: orcamento.clienteDados.CODIGO,
        nome: orcamento.clienteDados.NOME,
        email: orcamento.clienteDados.EMAIL,
        status: true,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    router.push("/checkout/orcamento");
    return;
  };

  const handleOrcamentosModalOpen = () => {
    setOrcamentosModalOpen(true);
    handlePesquisarOrcamentos();
  };

  const handleOrcamentosModalClose = () => {
    setOrcamentosModalOpen(false);
  };

  const handleOrcamentosPageChange = (event, value) => {
    setOrcamentosPage(value + 1);
  };

  const handleOrcamentosPerPageChange = (event) => {
    setOrcamentosPerPage(event.target.value);
  };

  const renderModalOrcamentos = () => (
    <Modal open={orcamentosModalOpen} onClose={handleOrcamentosModalClose} aria-labelledby="modal-cadastro-orcamentos">
      <Box sx={{ ...styleModal, maxWidth: 1200 }}>
        <Typography id="modal-cadastro-orcamentos" variant="h6" component="h2" sx={{ mb: 3 }}>
          Orçamentos
        </Typography>
        {orcamentosIsLoading ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2 }}>
              <CircularProgress sx={{ mb: 2, width: 40, height: 40 }} />
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Carregando orçamentos, aguarde...
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <>
            <Grid container spacing={2} sx={{ maxHeight: "80vh", height: "auto", overflowY: "auto" }}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Pesquisar por"
                  type="text"
                  variant="outlined"
                  value={orcamentosFiltroPesquisa}
                  onChange={(e) => setOrcamentosFiltroPesquisa(e.target.value)}
                  name="pesquisa"
                  disabled={orcamentosIsLoading}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Data Inicial"
                  type="date"
                  variant="outlined"
                  value={orcamentosFiltroDataInicial.format("YYYY-MM-DD")}
                  onChange={(e) => setOrcamentosFiltroDataInicial(moment(e.target.value))}
                  name="dataInicial"
                  disabled={orcamentosIsLoading}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Data Final"
                  type="date"
                  variant="outlined"
                  value={orcamentosFiltroDataFinal.format("YYYY-MM-DD")}
                  onChange={(e) => setOrcamentosFiltroDataFinal(moment(e.target.value))}
                  name="dataFinal"
                  disabled={orcamentosIsLoading}
                />
              </Grid>
              <Grid item xs={1}>
                <Button variant="text" size="large" onClick={handlePesquisarOrcamentos} fullWidth>
                  <SearchIcon />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: Colors.primary, color: Colors.white }}>Orçamento</TableCell>
                        <TableCell sx={{ backgroundColor: Colors.primary, color: Colors.white }}>Data</TableCell>
                        <TableCell sx={{ backgroundColor: Colors.primary, color: Colors.white }}>Cliente</TableCell>
                        <TableCell sx={{ backgroundColor: Colors.primary, color: Colors.white }}>Valor Total</TableCell>
                        <TableCell sx={{ backgroundColor: Colors.primary, color: Colors.white }}>Total Produtos</TableCell>
                        <TableCell sx={{ backgroundColor: Colors.primary, color: Colors.white }} />
                      </TableRow>
                    </TableHead>
                    {orcamentosIsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <CircularProgress />
                          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                            Carregando orçamentos, aguarde...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : !orcamentos || orcamentos.length <= 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Alert severity="warning">Nenhum orçamento encontrado.</Alert>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableBody>
                        {orcamentos.map((orcamento) => (
                          <TableRow key={orcamento.CODIGO}>
                            <TableCell>{orcamento.ORCAMENTO}</TableCell>
                            <TableCell>{orcamento.DATA}</TableCell>
                            <TableCell>{orcamento?.clienteDados?.NOME || "Não informado"}</TableCell>
                            <TableCell>{Diversos.maskPreco(orcamento.itens.reduce((acc, item) => acc + item.VALOR * item.QTD, 0))}</TableCell>
                            <TableCell>{orcamento.itens.reduce((acc, item) => acc + item.QTD, 0)}</TableCell>
                            <TableCell sx={{ textAlign: "right" }}>
                              <Button variant="text" size="small" onClick={() => setOrcamentoSelected(orcamento)}>
                                <VisibilityIcon />
                              </Button>
                              <Button variant="text" size="small" onClick={() => convertToPedido(orcamento)} title="Converter para pedido">
                                <CurrencyExchangeIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    )}
                    <TableFooter>
                      <TablePagination
                        rowsPerPageOptions={[30, 50, 100]}
                        labelRowsPerPage="Itens por página"
                        labelDisplayedRows={() => `Página ${orcamentosPage} de ${orcamentosLastPage}`}
                        showFirstButton
                        showLastButton
                        onRowsPerPageChange={handleOrcamentosPerPageChange}
                        count={orcamentosTotal}
                        rowsPerPage={orcamentosPerPage}
                        page={orcamentosPage - 1}
                        onPageChange={handleOrcamentosPageChange}
                      />
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
              <Button size="large" variant="outlined" onClick={handleOrcamentosModalClose} fullWidth>
                Fechar
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );

  const handleOrcamentoDetalheModalClose = () => {
    setOrcamentoSelected({});
  };

  const renderModalOrcamentoDetalhe = () => (
    <Modal open={orcamentoSelected && orcamentoSelected.ORCAMENTO} onClose={handleOrcamentoDetalheModalClose} aria-labelledby="modal-cadastro-orcamentos">
      <Box sx={{ ...styleModal, maxWidth: 1200 }}>
        <Typography id="modal-cadastro-orcamentos" variant="h6" component="h2" sx={{ mb: 3 }}>
          Orçamento #{orcamentoSelected.ORCAMENTO}
        </Typography>

        {!orcamentoSelected || !orcamentoSelected.ORCAMENTO ? (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Alert severity="warning">Orçamento não selecionado.</Alert>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2} sx={{ maxHeight: "80vh", height: "auto", overflowY: "auto" }}>
            <Grid item xs={6}>
              <TextField fullWidth label="Data" type="date" variant="outlined" value={moment(orcamentoSelected.DATA, "DD/MM/YYYY").format("YYYY-MM-DD")} name="data" disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Cliente" type="text" variant="outlined" value={orcamentoSelected?.clienteDados?.NOME || ""} name="clienteDados.NOME" disabled />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="CPF/CNPJ" type="text" variant="outlined" value={orcamentoSelected?.clienteDados?.CNPJ || ""} name="clienteDados.CNPJ" disabled />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="E-mail" type="text" variant="outlined" value={orcamentoSelected?.clienteDados?.EMAIL || ""} name="clienteDados.EMAIL" disabled />
            </Grid>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Produto</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Valor Unitário</TableCell>
                      <TableCell>Valor Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orcamentoSelected.itens.map((item, idx) => (
                      <TableRow key={item.CHAVE}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell>{`(${item.PRODUTO}) ${item?.produtoDados?.NOME || ""}`}</TableCell>
                        <TableCell>{item.QTD}</TableCell>
                        <TableCell>{Diversos.maskPreco(item.VALOR)}</TableCell>
                        <TableCell>{Diversos.maskPreco(item.VALOR * item.QTD)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "right", fontWeight: "bold", fontSize: "0.95rem" }}>
                        SubTotal
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: "bold", fontSize: "0.95rem" }}>
                        {Diversos.maskPreco(orcamentoSelected.itens.reduce((acc, item) => acc + item.VALOR * item.QTD, 0))}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "right", fontWeight: "bold", fontSize: "0.95rem" }}>
                        Frete
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: "bold", fontSize: "0.95rem" }}>{Diversos.maskPreco(orcamentoSelected.FRETE)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "right", fontWeight: "bold", fontSize: "0.95rem" }}>
                        Desconto
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: "bold", fontSize: "0.95rem" }}>{Diversos.maskPreco(orcamentoSelected.DESCONTO)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: "right", fontWeight: "bold", fontSize: "1.2rem" }}>
                        Total
                      </TableCell>
                      <TableCell sx={{ textAlign: "left", fontWeight: "bold", fontSize: "1.2rem" }}>
                        {Diversos.maskPreco(orcamentoSelected.itens.reduce((acc, item) => acc + item.VALOR * item.QTD, 0) + orcamentoSelected.FRETE - orcamentoSelected.DESCONTO)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
          <Button size="large" variant="outlined" onClick={handleOrcamentoDetalheModalClose} fullWidth>
            Fechar
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  // Verificação de usuário vendedor
  if (!stateApp.usuario || !stateApp.usuario.vendedor || !stateApp.usuario.vendedor.CODIGO) {
    return null;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <Grid container sx={styleContainer}>
        <Grid xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBody}>
          <Typography variant="body1" sx={{ ...styleContainerBodyText, px: 2 }}>
            Olá bem vindo(a){" "}
            <Typography variant="body1" sx={{ fontWeight: "bold", ml: 2, textTransform: "uppercase" }}>
              {String(stateApp.usuario?.vendedor?.NOME).toUpperCase()}
            </Typography>
          </Typography>
          <Box sx={{ px: 3, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            {String(stateApp.usuario?.vendedor?.CNPJ) !== String(stateApp.usuario?.cpf) && (
              <Button variant="text" sx={{ color: Colors.white }} onClick={handleOpen}>
                Cliente selecionado: {String(stateApp.usuario?.nome).toUpperCase()}
              </Button>
            )}

            <Button variant="outlined" color="secondary" onClick={handleOpen}>
              {String(stateApp.usuario?.vendedor?.CNPJ) !== String(stateApp.usuario?.cpf) ? (
                <>
                  <SyncAltRoundedIcon sx={{ mx: 1 }} /> Trocar Cliente
                </>
              ) : (
                "Identificar Cliente"
              )}
            </Button>

            <Button variant="contained" color="secondary" onClick={handleOrcamentosModalOpen}>
              Orçamentos
            </Button>
          </Box>
        </Grid>
      </Grid>

      {renderModalIndentificarCliente()}
      {renderModalCadastrarCliente()}
      {renderModalOrcamentos()}
      {renderModalOrcamentoDetalhe()}
    </>
  );
}
