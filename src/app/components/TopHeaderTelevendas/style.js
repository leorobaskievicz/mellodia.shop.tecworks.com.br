import { alpha } from "@mui/material/styles";
import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  height: 50,
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
  height: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  py: 0,
  backgroundColor: alpha(Colors.primary, 0.75),
};

const styleContainerBodyText = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  fontSize: 14,
  fontWeight: "600",
  fontFamily: "Jost",
  textAlign: "left",
  py: 0,
  color: Colors.white,
};

const styleModal = {
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
};

export { styleContainer, styleContainerBody, styleContainerBodyText, styleModal };
