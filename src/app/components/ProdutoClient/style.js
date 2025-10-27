import { Colors } from "../../style.constants";

const styleContainer = {
  width: "100vw",
  height: "auto",
  backgroundColor: Colors.white,
  m: 0,
  p: 0,
  color: Colors.dark,
};

const styleContainerBody = {
  py: 2,
  mx: "auto",
  position: "relative",
};

const styleContainerBreadcrumb = {
  borderBottom: `solid 2px ${Colors.secondaryBorder}`,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  pl: {
    xs: "1%",
    sm: "1%",
    md: "15%",
    lg: "15%",
    xl: "15%",
  },
  py: 0.65,
};

const styleBtnAction = {
  backgroundColor: Colors.secondary,
  p: 0.7,
};

const styleBtnActionIcon = {
  color: Colors.medium,
  fontSize: 18,
};

export { styleContainer, styleContainerBody, styleContainerBreadcrumb, styleBtnAction, styleBtnActionIcon };
