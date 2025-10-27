"use client";

import { useEffect, useState } from "react";
import { Grid, Typography, Button, Box, useMediaQuery } from "@mui/material";
import { styleContainer, styleContainerBody, styleContainerBodyText } from "./style";
import { getTopHeader, getTopHeaderMobile } from "@/app/lib/funcoes";
import Image from "next/image";

export default function TopHeader({ children }) {
  const [topHeader, setTopHeader] = useState([]);
  const [topHeaderText, setTopHeaderText] = useState([]);

  useEffect(() => {
    getTopHeader().then((data) => {
      setTopHeader(data);
    });
  }, []);

  useEffect(() => {
    getTopHeaderMobile().then((data) => {
      setTopHeaderText(data);
    });
  }, []);

  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Grid container sx={styleContainer}>
      {topHeader && topHeader.length > 0 ? (
        <Grid xs={12} sm={12} md={10} lg={9} xl={8} sx={{ ...styleContainerBody, bgcolor: "transparent", borderBottom: "none" }}>
          <Image
            src={`${
              String(topHeader[0].path_mobile && isMobile ? topHeader[0].path_mobile : topHeader[0].path).indexOf("https://cdn.divacosmeticos") > -1
                ? ""
                : "https://cdn.divacosmeticos.com.br/"
            }${topHeader[0].path_mobile && isMobile ? topHeader[0].path_mobile : topHeader[0].path}`}
            alt={`Slide 0 ${topHeader[0].titulo}`}
            width={1220}
            height={50}
            style={{
              objectFit: "cover",
              width: "100%",
              height: 50,
            }}
            priority
          />
        </Grid>
      ) : topHeaderText && topHeaderText.length > 0 ? (
        <Grid xs={12} sm={12} md={10} lg={9} xl={8} sx={styleContainerBody}>
          <Typography variant="body1" sx={{ ...styleContainerBodyText, px: 2 }}>
            {topHeaderText}
          </Typography>
        </Grid>
      ) : null}
    </Grid>
  );
}
