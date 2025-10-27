import { Colors } from "@/app/style.constants";

export const styleContainer = {
  display: "flex",
  overflowX: "auto",
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE and Edge
  "&::-webkit-scrollbar": {
    display: "none", // Chrome, Safari, Opera
  },
  gap: 1,
  px: 1,
  py: 1,
  position: "relative",
  minHeight: "48px", // Altura mínima para garantir espaço para os botões
};

export const styleScrollButton = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: Colors.white,
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
  zIndex: 2,
  width: "32px",
  height: "32px",
  minWidth: "32px",
  "&:hover": {
    backgroundColor: Colors.light,
  },
  "&.left": {
    left: "-16px",
  },
  "&.right": {
    right: "-16px",
  },
  "& .MuiSvgIcon-root": {
    color: Colors.primary,
    fontSize: "1.5rem",
  },
};

export const styleContainerBody = {
  py: 2,
  position: "relative",
};
