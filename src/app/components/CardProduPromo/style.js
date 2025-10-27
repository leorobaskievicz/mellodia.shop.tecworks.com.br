import { Colors } from "@/app/style.constants";
import { alpha } from "@mui/material/styles";
import { yellow } from "@mui/material/colors";

const styleContainerContent = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  flexShrink: 0,
  width: "100%",
  maxWidth: "100%",
  height: "100%",
};

const styleContainerBody = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  overflowX: "auto",
  overflowY: "hidden",
};

const styleContainerCard = {
  position: "relative",
  backgroundColor: "transparent",
  p: 1,
  mx: 0,
  borderRadius: 2,
  boxShadow: 3,
  flexShrink: 0,
  maxWidth: "100%",
  width: "100%",
  height: "calc(100% - 30px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
};

const styleContainerCardTitle = {
  width: "100%",
  height: "auto",
  mt: 1,
  mb: 2,
  textAlign: "center",
  color: Colors.dark,
  fontSize: 13,
  fontWeight: "bold",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
  lineHeight: 1.2,
};

const styleContainerCardPrice = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
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
  color: Colors.medium,
  mr: 1,
};

const styleContainerCardPricePor = {
  fontSize: 18,
  fontWeight: "700",
  fontFamily: "Jost",
  color: Colors.primary,
};

const styleContainerContentMsg = {
  fontSize: "0.75rem",
  fontWeight: "400",
  color: Colors.dark,
  textAlign: "center",
  pt: 1.5,
  mb: 1,
};

const styleTextoVendas = {
  textAlign: "center",
  fontSize: 12,
  fontWeight: "bold",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  whiteSpace: "normal",
  lineHeight: 1.2,
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
  width: 80,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: 10,
  right: 0,
  px: 0,
  backgroundColor: alpha(yellow[700], 0.9),
  fontSize: 18,
  fontWeight: "700",
  fontFamily: "Jost",
  color: Colors.dark,
  textAlign: "right",
  clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 20% 100%, 0% 100%)",
};

export {
  styleContainerContent,
  styleContainerBody,
  styleContainerCard,
  styleContainerCardTitle,
  styleContainerCardPrice,
  styleContainerCardPricePor,
  styleContainerCardPriceDe,
  styleContainerContentMsg,
  styleTextoVendas,
  styleBtnAction,
  styleBtnActionIcon,
  styleTagDesconto,
};
