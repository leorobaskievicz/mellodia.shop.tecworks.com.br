"use client";

import { createContext, useContext, useReducer, useEffect, useState } from "react";

const AppContext = createContext();

// Função para verificar se estamos no navegador
const isBrowser = typeof window !== "undefined";

// Função para carregar o estado inicial do localStorage
const loadState = () => {
  if (!isBrowser) return initialState;

  try {
    const serializedState = localStorage.getItem("appState");
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Erro ao carregar estado do localStorage:", err);
    return initialState;
  }
};

// Função para salvar o estado no localStorage
const saveState = (state) => {
  if (!isBrowser) return;

  try {
    // Limita o tamanho do estado para evitar problemas de performance
    const serializedState = JSON.stringify({
      ...state,
      carrinho: state.carrinho.slice(0, 100), // Limita a 100 itens
      favoritos: state.favoritos.slice(0, 100), // Limita a 100 itens
    });

    // Verifica se o tamanho é aceitável para o localStorage
    if (serializedState.length > 5 * 1024 * 1024) {
      // 5MB
      console.warn("Estado muito grande para o localStorage, alguns dados serão truncados");
      return;
    }

    localStorage.setItem("appState", serializedState);
  } catch (err) {
    console.error("Erro ao salvar estado do localStorage:", err);
  }
};

const initialState = {
  carrinho: [],
  favoritos: [],
  ultimoPedido: {},
  usuario: null,
  cep: "",
  cartOpened: false,
  freteSelected: "",
  filtros: {
    ordenacao: "relevance",
    pagina: 1,
    // outros filtros...
  },
  error: null, // Adiciona campo para erros
  roletaOpen: false,
  loading: false, // Adiciona campo para estado de carregamento
  linkCarrinho: null,
};

function reducer(state, action) {
  let newState;

  switch (action.type) {
    case "LOGIN":
      newState = {
        ...state,
        usuario: { ...state.usuario, ...action.payload },
      };
      break;
    case "LOGOUT":
      newState = {
        ...state,
        usuario: null,
      };
      break;
    case "ADICIONAR_FAVORITO":
      newState = {
        ...state,
        favoritos: [...state.favoritos, action.payload],
      };
      break;
    case "REMOVER_FAVORITO":
      newState = {
        ...state,
        favoritos: state.favoritos.filter((item) => Number(item) !== Number(action.payload)),
      };
      break;
    case "ADICIONAR_AO_CARRINHO":
      const itemExistente = state.carrinho.find((item) => Number(item.CODIGO) === Number(action.payload.CODIGO));

      if (itemExistente) {
        newState = {
          ...state,
          carrinho: state.carrinho.map((item) => (Number(item.CODIGO) === Number(action.payload.CODIGO) ? { ...item, qtd: item.qtd + action.payload.qtd } : item)),
        };
      } else {
        newState = {
          ...state,
          carrinho: [...state.carrinho, action.payload],
        };
      }
      break;
    case "REMOVER_DO_CARRINHO":
      newState = {
        ...state,
        carrinho: state.carrinho.filter((item) => Number(item.CODIGO) !== Number(action.payload.CODIGO)),
      };
      break;
    case "ATUALIZAR_CARRINHO":
      newState = {
        ...state,
        carrinho: state.carrinho.map((item) => (Number(item.CODIGO) !== Number(action.payload.CODIGO) ? item : action.payload)),
      };
      break;
    case "ATUALIZAR_FILTROS":
      newState = {
        ...state,
        filtros: {
          ...state.filtros,
          ...action.payload,
        },
      };
      break;
    case "LIMPAR_CARRINHO":
      newState = {
        ...state,
        carrinho: [],
      };
      break;
    case "SETAR_CARRINHO":
      newState = {
        ...state,
        carrinho: action.payload,
      };
      break;
    case "LIMPAR_FAVORITOS":
      newState = {
        ...state,
        favoritos: [],
      };
      break;
    case "SET_CEP":
      newState = {
        ...state,
        cep: action.payload,
      };
      break;
    case "SET_FRETE":
      newState = {
        ...state,
        freteSelected: action.payload,
      };
      break;
    case "SET_CART_OPEN":
      newState = {
        ...state,
        cartOpened: action.payload,
      };
      break;
    case "SET_ULTIMO_PEDIDO":
      newState = {
        ...state,
        ultimoPedido: action.payload,
      };
      break;
    case "UNSET_ULTIMO_PEDIDO":
      newState = {
        ...state,
        ultimoPedido: {},
      };
      break;
    case "INICIALIZAR_ESTADO":
      newState = {
        ...state,
        ...action.payload,
      };
      break;
    case "HANDLE_ROLETA":
      newState = {
        ...state,
        roletaOpen: action.payload,
      };
      break;
    case "SET_LINK_CARRINHO":
      newState = {
        ...state,
        linkCarrinho: action.payload,
      };
      break;
    case "UNSET_LINK_CARRINHO":
      newState = {
        ...state,
        linkCarrinho: null,
      };
      break;
    default:
      return state;
  }

  // Salva o novo estado no localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("appState", JSON.stringify(newState));
  }

  return newState;
}

export function AppProvider({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    setIsClient(true);

    // Carrega o estado do localStorage apenas no cliente
    const savedState = localStorage.getItem("appState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({
          type: "INICIALIZAR_ESTADO",
          payload: parsedState,
        });
      } catch (error) {
        console.error("Erro ao carregar estado do localStorage:", error);
      }
    }
  }, []);

  // Renderiza o conteúdo apenas no cliente para evitar hidratação
  if (!isClient) {
    return null;
  }

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser usado dentro de um AppProvider");
  }
  return context;
}
