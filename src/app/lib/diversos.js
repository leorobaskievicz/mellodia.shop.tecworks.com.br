import moment from "moment";
import crypto from "crypto";
import Api from "./api";

export const Diversos = {
  getUFs: () => {
    // CRIA LISTA DE ESTADOS
    return [
      { value: "0", label: "--" },
      { value: "AC", label: "Acre" },
      { value: "AL", label: "Alagoas" },
      { value: "AP", label: "Amapá" },
      { value: "AM", label: "Amazonas" },
      { value: "BA", label: "Bahia" },
      { value: "CE", label: "Ceará" },
      { value: "DF", label: "Distrito Federal" },
      { value: "ES", label: "Espirito Santo" },
      { value: "GO", label: "Goiás" },
      { value: "MA", label: "Maranhão" },
      { value: "MS", label: "Mato Grosso do Sul" },
      { value: "MT", label: "Mato Grosso" },
      { value: "MG", label: "Minas Gerais" },
      { value: "PA", label: "Pará" },
      { value: "PB", label: "Paraíba" },
      { value: "PR", label: "Paraná" },
      { value: "PE", label: "Pernambuco" },
      { value: "PI", label: "Piauí" },
      { value: "RJ", label: "Rio de Janeiro" },
      { value: "RN", label: "Rio Grande do Norte" },
      { value: "RS", label: "Rio Grande do Sul" },
      { value: "RO", label: "Rondônia" },
      { value: "RR", label: "Roraima" },
      { value: "SC", label: "Santa Catarina" },
      { value: "SP", label: "São Paulo" },
      { value: "SE", label: "Sergipe" },
      { value: "TO", label: "Tocantins" },
    ];
  },

  getSexos: () => {
    return [
      { value: 1, label: "Masculino" },
      { value: 2, label: "Feminino" },
      { value: 3, label: "Não informar" },
    ];
  },

  padding_left: (s, c, n) => {
    if (!s || !c || s.length >= n) {
      return s;
    }
    const max = (n - s.length) / c.length;
    for (let i = 0; i < max; i++) {
      s = c + s;
    }
    return s;
  },

  padding_right: (s, c, n) => {
    if (!s || !c || s.length >= n) {
      return s;
    }
    const max = (n - s.length) / c.length;
    for (let i = 0; i < max; i++) {
      s += c;
    }
    return s;
  },

  getnums: (str) => {
    if (!str) return 0;

    const num = str.toString().replace(/[^0-9]/g, "");
    return num;
  },

  convData: (data) => {
    if (data === "" || data === null) return "// ::";
    // return data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18];
    // return data.substr(8, 2) + "/" + data.substr(5, 2) + "/" + data.substr(0, 4) + "/" + data.substr(11, 2) + ":" + data.substr(14, 2) + ":" + data.substr(17, 2);

    // if ( data.length > 10 )
    //   return data.substr(8, 2) + "/" + data.substr(5, 2) + "/" + data.substr(0, 4) + " " + data.substr(11, 2) + ":" + data.substr(14, 2);
    // else
    return data.substr(8, 2) + "/" + data.substr(5, 2) + "/" + data.substr(0, 4);
  },

  convDataToBD: (data) => {
    if (data === "" || data === null) return "--";
    // return data[8] + data[9] + "/" + data[5] + data[6] + "/" + data[0] + data[1] + data[2] + data[3] + " " + data[11] + data[12] + ":" + data[14] + data[15] + ":" + data[17] + data[18];
    return data.substr(6, 4) + "-" + data.substr(3, 2) + "-" + data.substr(0, 2);
  },

  getDiaSemana: (data) => {
    const auxDate = new Date(data);
    let diaSemana = "";
    switch (auxDate.getDay()) {
      case 0:
        diaSemana = "Domingo";
        break;
      case 1:
        diaSemana = "Segunda";
        break;
      case 2:
        diaSemana = "Terça";
        break;
      case 3:
        diaSemana = "Quarta";
        break;
      case 4:
        diaSemana = "Quinta";
        break;
      case 5:
        diaSemana = "Sexta";
        break;
      case 6:
        diaSemana = "Sábado";
        break;
    }
    return diaSemana;
  },

  number_format: (number, decimals, decPoint, thousandsSep) => {
    number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
    const n = !isFinite(+number) ? 0 : +number;
    const prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    const sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
    const dec = typeof decPoint === "undefined" ? "." : decPoint;
    let s = [""];
    const toFixedFix = function (n, prec) {
      const k = Math.pow(10, prec);
      return "" + (Math.round(n * k) / k).toFixed(prec);
    };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || "").length < prec) {
      s[1] = s[1] || "";
      s[1] += new Array(prec - s[1].length + 1).join("0");
    }
    return s.join(dec);
  },

  validateEmail: (sEmail) => {
    const filter = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (filter.test(sEmail)) return true;
    else return false;
  },

  validateCNPJ: (sCNPJ) => {
    let cnpj = sCNPJ.replace(/[^\d]+/g, "");
    if (cnpj === "") return false;
    if (cnpj.length !== 14) return false;

    // Elimina CNPJs inválidos conhecidos
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  },

  validateCPF: (sCPF) => {
    const cpfValor = sCPF;
    const cpf = cpfValor.replace(/[^\d]+/g, "");
    if (cpf === "") return false;
    // Elimina CPFs invalidos conhecidos
    if (
      cpf.length !== 11 ||
      cpf === "00000000000" ||
      cpf === "11111111111" ||
      cpf === "22222222222" ||
      cpf === "33333333333" ||
      cpf === "44444444444" ||
      cpf === "55555555555" ||
      cpf === "66666666666" ||
      cpf === "77777777777" ||
      cpf === "88888888888" ||
      cpf === "99999999999"
    )
      return false;

    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    return true;
  },

  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  getIdade: (nascimento) => {
    const hoje = new Date();
    // nascimento = new Date($("#dtnascimento").val());
    let diferencaAnos = hoje.getFullYear() - nascimento.getFullYear();
    if (new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()) < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate())) diferencaAnos--;
    return diferencaAnos;
  },

  convPrecoToFloat: (preco) => {
    // let aux = preco.replace(/./g, "");
    // aux = aux.replace(/,/g, ".");
    return parseFloat(preco);
  },

  captalize: (text) => {
    return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
  },

  maskPreco: (text) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(text);
  },

  maskCPFString: (text) => {
    const cpf = String(text).replace(/[^\d]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  },

  maskCNPJString: (text) => {
    const cnpj = String(text).replace(/[^\d]/g, "");
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  },

  maskCPF: () => {
    // let cpf = text.replace(/[^\d]/g, '');
    // return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    return [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/];
  },

  maskCEP: (text) => {
    const cpf = text.replace(/[^\d]/g, "");
    return cpf.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
  },

  maskNascimento: (text) => {
    const tmp = text.replace(/[^\d]/g, "");
    return tmp.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
  },

  maskTelefone: (text) => {
    const tmp = text.replace(/[^\d]/g, "");
    let tmp2 = "";
    if (tmp.length >= 11) tmp2 = tmp.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    else tmp2 = tmp.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return tmp2;
  },

  toSeoUrl: (url) => {
    if (!url) return "";

    return (
      url
        .toString() // Convert to string
        .replace(/\./g, "+") // Replace ampersand
        .normalize("NFD") // Change diacritics
        .replace(/[\u0300-\u036f]/g, "") // Remove illegal characters
        .replace(/\s+/g, "-") // Change whitespace to dashes
        .toLowerCase() // Change to lowercase
        // .replace(/&/g,'-and-')          // Replace ampersand
        .replace(/&/g, "-") // Replace ampersand
        .replace(/[^a-z0-9-+]/g, "-") // Remove anything that is not a letter, number or dash
        .replace(/-+/g, "-") // Remove duplicate dashes
        .replace(/^-*/, "") // Remove starting dashes
        .replace(/-*$/, "")
    ); // Remove trailing dashes
  },

  capitalize: (s) => {
    if (typeof s !== "string") return "";
    const tmp = s.toLowerCase();
    return tmp.charAt(0).toUpperCase() + tmp.slice(1);
  },

  capitalizeAllWords: (s) => {
    if (typeof s !== "string") return "";
    const tmp = s.toLowerCase();
    const aux = tmp.split(" ");
    const aux2 = aux.map((q) => q.charAt(0).toUpperCase() + q.slice(1));
    return aux2.join(" ");
  },

  capitalizeSentece: (s) => {
    if (typeof s !== "string") return "";
    const tmp = s.toLowerCase();
    const aux = tmp.split(".");
    const aux2 = aux.map((q) => (q.charAt(0) !== " " ? q.charAt(0).toUpperCase() + q.slice(1) : q.charAt(1).toUpperCase() + q.slice(2)));
    return aux2.join(".");
  },

  getStatusTitulo: (status) => {
    switch (status) {
      case 1:
        return "Aprovado";
      case 2:
        return "Em Separação";
      case 3:
        return "Em Faturamento";
      case 4:
        return "Aguardando Expedição";
      case 5:
        return "Enviado";
      case 6:
        return "Entregue";
      case 7:
        return "Aguardando Pagamento";
      case 8:
        return "Cancelado";
      default:
        return "";
    }
  },

  getStatusFormapg: (status) => {
    switch (status) {
      case 1:
        return "Cartão de crédito";
      case 2:
        return "Boleto bancário";
      case 3:
        return "Depósito bancário";
      case 4:
        return "PIX";
      default:
        return "";
    }
  },

  freteGratis: (cep) => {
    // const minCep = 80000000;
    // const maxCep = 82999999;

    // if (cep >= minCep && cep <= maxCep) {
    //   return true;
    // }
    return false;
  },

  getParcelas: (valor, fgNaoCobraJuros) => {
    const parcelas = [];

    if (valor <= 50.0) {
      const instalment = valor;
      return {
        instalment,
        parcelas: [
          {
            value: 1,
            label: `1x R$ ${Diversos.number_format(instalment, 2, ",", ".")}`,
            labelAbrev: `1x R$ ${Diversos.number_format(instalment, 2, ",", ".")}`,
            instalment,
          },
        ],
      };
    }

    for (let i = 1; i <= 6; i++) {
      let instalment = Math.floor((valor / i) * 100) / 100;

      // Corrigir última parcela para bater com o total
      let totalParcelado = instalment * i;
      let diferenca = Math.round((valor - totalParcelado) * 100) / 100;

      // Se for a última parcela, ajusta
      if (diferenca !== 0) {
        instalment += diferenca / i;
        instalment = Math.round(instalment * 100) / 100;
      }

      parcelas.push({
        value: i,
        label: `em até ${i}x de R$ ${Diversos.number_format(instalment, 2, ",", ".")} s/ juros`,
        labelAbrev: `em até ${i}x R$ ${Diversos.number_format(instalment, 2, ",", ".")}`,
        instalment,
      });
    }

    return {
      instalment: parcelas[parcelas.length - 1].instalment,
      parcelas,
    };
  },

  resetCart: () => {
    localStorage.removeItem("session_id");
    const session_id = window.crypto.randomUUID();
    localStorage.setItem("session_id", session_id);
  },

  getSessionId: () => {
    let session_id = localStorage.getItem("session_id");

    if (!session_id) {
      session_id = window.crypto.randomUUID();
      localStorage.setItem("session_id", session_id);
    }

    return session_id;
  },

  getCartData: async (cpf, produtos) => {
    // gera ou recupera session_id no localStorage
    let session_id = localStorage.getItem("session_id");

    if (!session_id) {
      session_id = window.crypto.randomUUID();
      localStorage.setItem("session_id", session_id);
    }

    try {
      const response = await new Api().post(
        `/cart/send`,
        {
          cpf: !cpf ? "111.111.111-11" : cpf,
          produtos,
          origem: "site",
          session_id,
        },
        true
      );

      if (!response || !response.status) {
        console.error("Erro ao salvar carrinho:", response?.msg || "Resposta inválida");
        return false;
      }

      if (!response.cart || !response.cart.SESSION_ID) {
        console.error("Carrinho retornado sem SESSION_ID:", response);
        return false;
      }

      return response.cart;
    } catch (error) {
      console.error("Exceção ao salvar carrinho:", error);
      return false;
    }
  },

  sendCartData: (
    cpf,
    produtos,
    formaPagamento = null,
    formaEntrega = null,
    formaEntregaLoja = null,
    cupomDesconto = null,
    desconto = null,
    freteGratis = null,
    vendedor = null
  ) => {
    // gera ou recupera session_id no localStorage
    let session_id = localStorage.getItem("session_id");

    if (!session_id) {
      session_id = window.crypto.randomUUID();
      localStorage.setItem("session_id", session_id);
    }

    new Api()
      .post(
        `/cart/send`,
        {
          cpf: !cpf ? "111.111.111-11" : cpf,
          produtos,
          origem: "site",
          session_id,
          forma_pagamento: formaPagamento,
          forma_entrega: formaEntrega,
          forma_entrega_loja: formaEntregaLoja,
          cupom_desconto: cupomDesconto,
          desconto: desconto,
          frete_gratis: freteGratis,
          vendedor: vendedor,
        },
        true
      )
      .then((response) => {
        if (!response || !response.status) {
          throw new Error("Nao foi possivel sincronizar carrinho (1)");
        } else if (!response.cart || !response.cart.ID) {
          throw new Error(`Carrinho nao gerado`);
        }
      })
      .catch((e) => console.error(`Erro API::Carts (send) => ${e.message}`));
  },

  transmiteLogAcesso: async (pathname, user) => {
    // try {
    //   const api = new Api()
    //   let detectOS = 'SO nao definido'
    //   if (navigator.appVersion.indexOf('Win') !== -1) detectOS = 'Windows'
    //   if (navigator.appVersion.indexOf('Mac') !== -1) detectOS = 'MacOS'
    //   if (navigator.appVersion.indexOf('Linux') !== -1) detectOS = 'Linux'
    //   const paramApi = {
    //     aparelho:
    //       /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    //         navigator.userAgent,
    //       )
    //         ? 'mobile'
    //         : 'desktop',
    //     so: detectOS,
    //     url: pathname,
    //     cpf: user && user.cpf ? user.cpf : '',
    //   }
    //   await api.post('/logacesso', paramApi, true)
    // } catch (e) {
    //   console.log(`Nao foi possivel transmitir log de acesso: ${e.message}`)
    // }
  },

  sellfluxEnvia: async (cliente, status, formapg, produtoNome, produtoCodigo, total, url, removeTags) => {
    try {
      const responseIp = await fetch("https://api.ipify.org?format=json");
      const resultIp = await responseIp.json();

      const payload = {
        name: cliente.nome,
        email: cliente.email,
        phone: cliente.telefone,
        gateway: "Dricor",
        transaction_id: "",
        offer_id: null,
        status,
        payment_date: "",
        url,
        payment_method: formapg,
        expiration_date: moment().add(1, "day").format(),
        product_id: produtoCodigo,
        product_name: produtoNome,
        transaction_value: total,
        ip: resultIp.ip,
        tags: [status],
        remove_tags: !removeTags ? [] : [...removeTags],
      };

      const responseSellflux = await fetch("https://webhook.sellflux.app/webhook/sellflux/lead/43115b06ae231dbfd30364280967ff38", {
        method: "POST", // Método de requisição
        headers: {
          "Content-Type": "application/json", // Especifica o tipo de conteúdo como JSON
        },
        body: JSON.stringify(payload), // Converte o objeto JavaScript para JSON
      });

      const result = await responseSellflux.json();

      return result;
    } catch (e) {
      console.error(e.message);
    }
  },
};
