import { BorderStyle } from "@mui/icons-material";
import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  height: "auto",
  backgroundColor: Colors.white,
  m: 0,
  p: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.dark,
};

const styleContainerBodyTitle = {
  py: 2,
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "nowrap", // Corrigido para evitar quebra de linha
  overflowX: "auto", // Permite rolagem horizontal
  overflowY: "hidden",
  width: "100%", // Garante que o container ocupe a largura total
  whiteSpace: "nowrap", // Evita que os filhos quebrem para a linha de baixo
  scrollbarWidth: "thin", // Para Firefox
  "&::-webkit-scrollbar": {
    height: "6px", // Define a altura da barra de rolagem no Chrome
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#aaa",
    borderRadius: "10px",
  },
};

const styleContainerBody = {
  py: 2,
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "flex-start",
  flexWrap: "nowrap",
  flexGrow: 0,
  flexShrink: 0,
  overflowX: "auto",
  overflowY: "hidden",
  width: "100%",
  whiteSpace: "nowrap",
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // Corrigido para camelCase
  "&::-webkit-scrollbar": {
    display: "none", // Chrome / Safari
  },
};

export { styleContainer, styleContainerBodyTitle, styleContainerBody };
