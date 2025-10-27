import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  height: "auto",
  backgroundColor: Colors.white,
  m: 0,
  p: 0,
  display: {
    xs: "none",
    sm: "none",
    md: "flex",
  },
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.dark,
};

const styleContainerBody = {
  py: 2,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: { xs: "flex-start", sm: "flex-start", md: "center" },
  flexWrap: "nowrap",
  overflowX: "auto",
  width: "100%",
  maxWidth: "100vw",
};

const styleContainerButton = {
  width: "calc(calc(100% / 6) - 10) - 5",
  minWidth: 120,
  borderRadius: 10,
  mx: 0.5,
  fontSize: "0.9rem",
};

export { styleContainer, styleContainerBody, styleContainerButton };
