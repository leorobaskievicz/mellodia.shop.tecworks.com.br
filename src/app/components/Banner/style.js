import { Colors } from "@/app/style.constants";

const styleContainer = {
  width: "100vw",
  height: "auto",
  backgroundColor: Colors.white,
  m: 0,
  p: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: Colors.dark,
};

const styleContainerBody = {
  py: 2,
  position: "relative",
};

const CountdownContainer = {
  all: "unset !important",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",
  "& picture": {
    zIndex: 1,
    position: "relative",
  },
};

const CountdownRight = {
  zIndex: 2,
  position: "absolute",
  right: 100,
  top: 0,
  width: "30%",
  height: "100%",
  backgroundColor: "transparent",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "@media (max-width: 900px)": {
    backgroundColor: "transparent",
    position: "absolute",
    height: "auto",
    width: "100%",
    margin: "0px auto",
    objectFit: "contain",
    padding: "0px 10px",
    left: 0,
    bottom: 0,
    top: 250,
    justifyContent: "flex-start",
  },
};

export {
  styleContainer,
  styleContainerBody,
  CountdownContainer,
  CountdownRight,
};
