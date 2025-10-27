import { Colors } from "../../style.constants";

export const styleContainer = {
  width: "100%",
  backgroundColor: Colors.white,
  borderBottom: `1px solid ${Colors.secondaryBorder}`,
  py: 0,
};

export const styleContainerBody = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  flexWrap: "nowrap",
  gap: 1,
  py: 0,
  mx: "auto",
  overflowX: "auto",
};

export const styleContainerButton = {
  color: Colors.dark,
  fontSize: "0.9rem",
  fontWeight: "500",
  fontFamily: "Jost",
  textTransform: "none",
  px: 2,
  py: 1,
  "&:hover": {
    backgroundColor: Colors.light,
  },
};

export const styleDropdownButton = {
  ...styleContainerButton,
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};

export const styleDropdownMenu = {
  "& .MuiPaper-root": {
    mt: 1,
    minWidth: 200,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
  },
  "& .MuiMenuItem-root": {
    fontSize: "0.9rem",
    fontWeight: "400",
    fontFamily: "Jost",
    py: 1,
    px: 2,
    color: Colors.dark,
    "&:hover": {
      backgroundColor: Colors.light,
    },
  },
};
