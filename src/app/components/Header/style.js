import { BorderStyle } from "@mui/icons-material";
import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  height: "auto",
  backgroundColor: Colors.white,
  borderBottom: `none`,
  m: 0,
  p: 0,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.dark,
};

const styleContainerBody = {
  width: "100%",
  m: 0,
  px: 0,
  py: 2,
  justifyContent: "space-between",
};

const styleContainerBodySearchbar = {
  px: 0,
};

const styleContainerBodySearchbarInput = {
  backgroundColor: Colors.secondary,
};

const styleContainerRight = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  p: 0,
  m: 0,
};

const styleContainerBodyButton = {
  py: 0,
  px: 0,
  height: "100%",
  // width: "40%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "red",
  BorderStyle: "solid",
};

const styleContainerBodyButtonIcon = {
  fontSize: 24,
  mt: 2.0,
  mr: 0.5,
};

const styleContainerBodyButtonSubtitle = {
  fontSize: 11,
  fontWeight: "400",
  fontFamily: "Jost, sans-serif",
  color: Colors.dark,
  textAlign: "left",
  justifyContent: "flex-end",
  px: 0,
  py: 0,
  lineHeight: 0.5,
};

const styleContainerBodyButtonTitle = {
  fontSize: 15,
  fontWeight: "500",
  fontFamily: "Jost, sans-serif",
  color: Colors.dark,
  textAlign: "left",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  px: 0.3,
  py: 0,
  pt: 0,
  lineHeight: 1.1,
};

export {
  styleContainer,
  styleContainerBody,
  styleContainerBodySearchbar,
  styleContainerBodyButton,
  styleContainerBodyButtonIcon,
  styleContainerBodyButtonSubtitle,
  styleContainerBodyButtonTitle,
  styleContainerBodySearchbarInput,
  styleContainerRight,
};
