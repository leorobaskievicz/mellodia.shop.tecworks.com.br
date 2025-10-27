import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  minHeight: 30,
  height: "auto",
  backgroundColor: Colors.white,
  m: 0,
  py: 0,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.dark,
  position: "relative",
  top: 0,
  zIndex: 1000,
};

const styleContainerBody = {
  height: "auto",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  py: 0,
  backgroundColor: Colors.primary,
  borderBottom: `solid ${Colors.secondaryDark} 0px`,
  animation: "piscar 3s ease-in-out infinite", // Adiciona a animação
  "@keyframes piscar": {
    "0%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.8,
    },
    "100%": {
      opacity: 1,
    },
  },
};

const styleContainerBodyText = {
  fontSize: 14,
  fontWeight: "600",
  fontFamily: "Jost",
  textAlign: "center",
  py: 0,
  color: Colors.white,
};

export { styleContainer, styleContainerBody, styleContainerBodyText };
