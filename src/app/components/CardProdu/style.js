import { yellow } from "@mui/material/colors";
import { alpha } from "@mui/material";
import { Colors } from "../../style.constants";

const styleContainerCardLink = {
  p: 0,
};

const styleContainerCard = {
  width: {
    xs: "calc(48% - 8px)", // 2 cards por linha
    sm: "calc(33.33% - 8px)", // 3 cards por linha
    md: "calc(25% - 8px)", // 4 cards por linha
    lg: "calc(20% - 8px)", // 5 cards por linha
    xl: "calc(16.66% - 8px)", // 6 cards por linha
  },
  minWidth: {
    xs: 150,
    sm: 150,
    md: 200,
    lg: 200,
    xl: 200,
  }, // Largura mínima para garantir que o card não fique muito estreito
  maxWidth: 300, // Largura máxima do card
  flex: "1 1 auto", // Permite que o card cresça e encolha mantendo proporção
  height: "auto",
  minHeight: 450,
  backgroundColor: Colors.white,
  p: 0,
  pb: "45px",
  mx: 0,
  borderRadius: 1,
  border: `solid 1px ${Colors.secondaryBorder}`,
  boxShadow: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  justifyContent: "flex-start",
  position: "relative",
  "&:hover .styleContainerCardActions": {
    display: "flex",
  },
};

const styleContainerCardContent = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  mt: 0,
  p: 1,
};

const styleContainerCardActions = {
  width: "100%",
  position: "absolute",
  bottom: 0,
  display: "none",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: Colors.white,
};

const styleContainerCardContentTitle = {
  fontWeight: "700",
  fontSize: 15,
  textTransform: "uppercase",
  color: Colors.dark,
  textAlign: "left",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  mt: 1,
  mb: 0,
};

const styleContainerCardContentSubtitle = {
  fontWeight: "500",
  fontSize: 14,
  color: Colors.dark,
  textAlign: "left",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  mb: 1,
};

const styleContainerCardPrice = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  mt: 1,
  mb: 0,
  pb: 0,
  flex: 1,
  minHeight: 60,
};

const styleContainerCardPriceDe = {
  textDecoration: "line-through",
  fontSize: 14,
  fontFamily: "Jost",
  fontWeight: "400",
  color: Colors.dark,
  mr: 1,
};

const styleContainerCardPricePor = {
  fontSize: 18,
  fontWeight: "700",
  fontFamily: "Jost",
  color: Colors.dark,
};

const styleContainerCardPriceParcelado = {
  textDecoration: "normal",
  fontSize: 14,
  fontFamily: "Jost",
  fontWeight: "400",
  color: Colors.dark,
  mt: 0,
  pt: 0,
};

const styleContainerCardPriceFrete = {
  fontSize: 16,
  fontWeight: "700",
  fontFamily: "Jost",
  color: Colors.primary,
};

const styleContainerCardPriceDescricao = {
  textDecoration: "normal",
  fontSize: 14,
  fontFamily: "Jost",
  fontWeight: "400",
  color: Colors.medium,
  mt: 0,
  pt: 0,
  textAlign: "left",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  display: "-webkit-box",
  WebkitLineClamp: 4,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
};

const styleBtnAction = {
  position: "absolute",
  top: 10,
  backgroundColor: Colors.secondary,
  p: 0.7,
};

const styleBtnActionIcon = {
  color: Colors.medium,
  fontSize: 18,
};

const styleTagDesconto = {
  width: 60,
  height: 25,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: 10,
  right: 0,
  px: 2,
  backgroundColor: alpha(yellow[700], 0.7),
  fontSize: 14,
  fontWeight: "700",
  fontFamily: "Jost",
  color: Colors.dark,
  textAlign: "center",
  clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 100%)",
};

const styleCheckbox = {
  position: "absolute",
  top: 10,
  left: 10,
  zIndex: 1,
  color: Colors.primary,
  "&.Mui-checked": {
    color: Colors.primary,
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
};

const styleContainerPrecoECompra = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "space-between",
  mt: 1,
  width: "100%",
};

const styleComprarBtn = {
  width: 45,
  height: 45,
};

export {
  styleContainerCardLink,
  styleContainerCard,
  styleContainerCardContent,
  styleContainerCardActions,
  styleContainerCardContentTitle,
  styleContainerCardContentSubtitle,
  styleContainerCardPrice,
  styleContainerCardPriceDe,
  styleContainerCardPricePor,
  styleContainerCardPriceParcelado,
  styleContainerCardPriceFrete,
  styleContainerCardPriceDescricao,
  styleBtnAction,
  styleBtnActionIcon,
  styleTagDesconto,
  styleCheckbox,
  styleContainerPrecoECompra,
  styleComprarBtn,
};
