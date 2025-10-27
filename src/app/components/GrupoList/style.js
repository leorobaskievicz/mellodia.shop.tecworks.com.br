import { Colors } from "../../style.constants";

export const styleGruposList = {
  width: "100%",
  maxHeight: 500,
  overflow: "auto",
  p: 0,
  m: 0,
  overflowX: "auto",
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE and Edge
  "&::-webkit-scrollbar": {
    display: "none", // Chrome, Safari, Opera
  },
};

export const styleGruposListItem = {
  width: "100%",
  py: 0.2,
  px: 0,
  borderBottom: `1px solid ${Colors.secondaryBorder}`,
  "&:last-child": {
    borderBottom: "none",
  },
  "&:hover": {
    backgroundColor: Colors.light,
  },
};

export const styleGruposCheckbox = {
  color: Colors.primary,
  p: 0.5,
  mr: 1,
  "&.Mui-checked": {
    color: Colors.primary,
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
};

export const styleGruposContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  pr: 1,
};

export const styleGruposBadge = {
  "& .MuiBadge-badge": {
    border: `1px solid ${Colors.primary}`,
    color: Colors.primary,
    backgroundColor: "transparent",
    minWidth: 24,
    height: 24,
    padding: "0 6px",
    borderRadius: 12,
    fontSize: "0.75rem",
  },
};
