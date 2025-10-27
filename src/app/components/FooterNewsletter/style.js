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
  alignItems: "stretch",
  justifyContent: "center",
  color: Colors.dark,
};

const styleContainerContent = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  flexShrink: 0,
  // width: 275,
  p: 1,
};

const styleContainerContentItem = {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
};

const styleContainerContentItemTitle = {
  fontSize: "1.0rem",
  fontWeight: "600",
  fontFamily: "Jost",
  color: Colors.dark,
};

const styleContainerContentItemButton = {
  color: Colors.dark,
  flex: 1,
  width: "100%",
  p: 0,
  cursor: "pointer",
};

const styleContainerContentItemListItem = {
  p: 0,
};

export { styleContainer, styleContainerContent, styleContainerContentItem, styleContainerContentItemTitle, styleContainerContentItemButton, styleContainerContentItemListItem };
