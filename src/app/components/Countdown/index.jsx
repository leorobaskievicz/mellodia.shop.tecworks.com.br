"use client";
import React from "react";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import { Colors } from "@/app/style.constants";
import { Box } from "@mui/material";

export default function Countdown(props) {
  return (
    <Box
      sx={{
        "& .flip-clock":
          props.size === "xs"
            ? {
                "--fcc-digit-font-weight": "700",
                "--fcc-flip-duration": "0.5s",
                "--fcc-digit-block-width": "20px",
                "--fcc-digit-block-height": "30px",
                "--fcc-digit-font-size": "16px",
                "--fcc-label-font-size": "10px",
                "--fcc-background": Colors.primary,
                "--fcc-digit-color": Colors.white,
                "--fcc-label-color": Colors.dark,
                "--fcc-divider-color": "#ffffff",
                "--fcc-digit-block-spacing": "2px",
                "--fcc-separator-size": "4px",
                "--fcc-spacing": "2px",
              }
            : {
                "--fcc-digit-font-weight": "700",
                "--fcc-flip-duration": "0.5s",
                "--fcc-digit-block-width": "60px",
                "--fcc-digit-block-height": "70px",
                "--fcc-digit-font-size": "50px",
                "--fcc-label-font-size": "13px",
                "--fcc-background": Colors.secondary,
                "--fcc-digit-color": Colors.dark,
                "--fcc-label-color": Colors.dark,
                "--fcc-divider-color": "#ffffff",
                "--fcc-digit-block-spacing": "8px",
                "@media (max-width: 600px)": {
                  "--fcc-digit-block-width": "34px",
                  "--fcc-digit-block-height": "40px",
                  "--fcc-digit-font-size": "28px",
                  "--fcc-label-font-size": "9px",
                  "--fcc-spacing": "3px",
                },
              },
        mt: { xs: 1, md: 0 },
        mb: { xs: 1, md: 0 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FlipClockCountdown
        to={props.data}
        renderMap={[false, true, true, true]}
        labels={["Dias", "Horas", "Minutos", "Segundos"]}
        showSeparators={false}
        className="flip-clock"
        dividerStyle={{ color: "white", height: 1 }}
      />
    </Box>
  );
}
