import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  height: 30,
  backgroundColor: Colors.secondary,
  borderBottom: `solid ${Colors.secondaryDark} 1px`,
  m: 0,
  p: 0,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.dark,
};

const styleContainerBody = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  py: 0,
};

const styleContainerButton = {
  fontSize: 12,
  fontWeight: "600",
  py: 0,
};

const styleContainerButtonIcon = {
  fontSize: 12,
  marginRight: 5,
  color: Colors.medium,
};

export { styleContainer, styleContainerBody, styleContainerButton, styleContainerButtonIcon };
