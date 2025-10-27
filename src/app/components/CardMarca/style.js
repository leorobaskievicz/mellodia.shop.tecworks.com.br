import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  height: "auto",
  backgroundColor: Colors.white,
  mx: 0,
  my: 2,
  p: 0,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.dark,
};

const styleContainerContent = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  flexShrink: 0,
  width: 275,
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
  backgroundColor: Colors.primaryLight,
  p: 1,
  mx: 2,
  borderRadius: 2,
  boxShadow: 3,
  flexShrink: 0,
};

const styleContainerCardTitle = {
  mt: 1,
  mb: 2,
  textAlign: "center",
  color: Colors.dark,
  fontSize: 16,
};

const styleContainerCardPrice = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

const styleContainerCardPriceDe = {
  color: Colors.dark,
  fontSize: 12,
  fontWeight: "400",
  textDecoration: "line-through",
  mr: 1,
};

const styleContainerCardPricePor = {
  color: Colors.white,
  fontSize: 16,
  fontWeight: "500",
  textDecoration: "line-throught",
  px: 1.5,
  py: 0.5,
  backgroundColor: Colors.dark,
  borderRadius: 10,
};

const styleContainerContentMsg = {
  fontSize: "0.75rem",
  fontWeight: "400",
  color: Colors.dark,
  textAlign: "center",
  pt: 1.5,
  mb: 1,
};

export {
  styleContainer,
  styleContainerContent,
  styleContainerBody,
  styleContainerCard,
  styleContainerCardTitle,
  styleContainerCardPrice,
  styleContainerCardPricePor,
  styleContainerCardPriceDe,
  styleContainerContentMsg,
};
