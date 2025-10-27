import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Typography } from "@mui/material";

export default function PromocaoRelampagoTitle({ titulo, subtitulo }) {
  return (
    <>
      <FlashOnIcon
        sx={{
          fontSize: "4.0rem",
          fontWeight: "600",
          pl: 2,
          pt: 1,
          textAlign: { xs: "center", sm: "center", md: "center", lg: "center", xl: "center" },
          color: "yellow",
        }}
      />
      <Typography
        variant="h1"
        color="black"
        sx={{
          fontSize: "1.7rem",
          fontWeight: "600",
          pl: 2,
          pt: 1,
          textAlign: { xs: "center", sm: "center", md: "center", lg: "center", xl: "center" },
          color: "white",
        }}
      >
        {titulo || "Promoção Relâmpago"}
        {subtitulo && (
          <>
            <br />
            <Typography
              variant="subtitle1"
              color="white"
              sx={{ textAlign: "center", fontSize: "1.0rem", fontWeight: "400" }}
            >
              {subtitulo}
            </Typography>
          </>
        )}
      </Typography>
    </>
  );
}
