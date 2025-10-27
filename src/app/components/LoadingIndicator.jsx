import { Box, CircularProgress } from "@mui/material";
import { memo } from "react";

const LoadingIndicator = memo(
  () => null
  // <Box
  //   sx={{
  //     position: "fixed",
  //     top: 0,
  //     left: 0,
  //     right: 0,
  //     bottom: 0,
  //     display: "flex",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     backgroundColor: "rgba(255, 255, 255, 0.7)",
  //     zIndex: 9999,
  //   }}
  // >
  //   <CircularProgress />
  // </Box>
);

LoadingIndicator.displayName = "LoadingIndicator";

export default LoadingIndicator;
