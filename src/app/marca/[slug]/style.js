import { Colors } from "../../style.constants";

const styleContainer = {
  width: { xs: "100%", sm: "100%", md: "90%", lg: "80%", xl: "70%" },
  height: "auto",
  backgroundColor: Colors.white,
  my: 0,
  mx: "auto",
  p: 0,
  color: Colors.dark,
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "space-between",
};

const styleContainerBody = {
  py: 0,
  mx: "auto",
  mt: 2,
  position: "relative",
};

export { styleContainer, styleContainerBody };
