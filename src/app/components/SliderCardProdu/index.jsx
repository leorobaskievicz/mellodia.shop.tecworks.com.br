"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid, Typography, Button, Box, IconButton, alpha } from "@mui/material";
import { styleContainer, styleContainerBody, styleContainerBodyTitle } from "./style";
import CardProdu from "@/app/components/CardProdu";
import CardProduPromo from "@/app/components/CardProduPromo";
import CardMarca from "@/app/components/CardMarca";
import Banner from "@/app/components/Banner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Colors } from "@/app/style.constants";

export default function SliderCardProdu({ children, title, produtos, link, fgPromo, fgBanner, banners, fgMarcas, bannersLeft, intervaloSeg, remaining, setRemaining }) {
  const containerRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(0);

  useEffect(() => {
    const calculateDots = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const cardWidth = window.innerWidth < 600 ? (window.innerWidth - 32) / 2 : 200;
        const containerWidth = container.offsetWidth;
        const totalCards = produtos.length;
        const cardsPerView = Math.floor(containerWidth / cardWidth);
        const dots = Math.ceil(totalCards / cardsPerView);

        setTotalDots(dots);
      }
    };

    setTimeout(calculateDots, 100);
    window.addEventListener("resize", calculateDots);

    const handleScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const scrollPosition = container.scrollLeft;
        const containerWidth = container.offsetWidth;
        const currentDot = Math.round(scrollPosition / containerWidth);
        setActiveDot(currentDot);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", calculateDots);
      if (containerRef.current) {
        containerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [produtos.length]);

  const scrollToDot = (dotIndex) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const cardWidth = window.innerWidth < 600 ? (window.innerWidth - 32) / 2 : 200;
      const containerWidth = container.offsetWidth;
      const scrollPosition = dotIndex * containerWidth;
      container.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  };

  const startScrolling = (direction) => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      if (direction < 0 && scrollLeft <= 0) {
        return;
      }

      if (direction > 0 && scrollLeft + clientWidth >= scrollWidth) {
        return;
      }

      containerRef.current.scrollBy({ left: direction * 500, behavior: "smooth" });
    }
  };

  const stopScrolling = () => {
    clearInterval(scrollInterval);
  };

  if (!produtos || produtos.length <= 0) {
    return null;
  }

  if (bannersLeft && bannersLeft.length > 0) {
    return (
      <>
        <Grid container sx={[styleContainer, { flexDirection: { xs: "row-reverse", md: "row" } }]}>
          <Grid xs={6} sm={6} md={3} lg={3} xl={3} sx={{ pr: 2, height: 650, display: { xs: "none", md: "flex" } }}>
            <a href={bannersLeft[0].link} target="_self">
              <picture>
                <source
                  srcSet={`${String(bannersLeft[0].path).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${bannersLeft[0].path}`}
                  type="image/webp"
                  style={{ borderRadius: 10, width: "100%", height: 650 }}
                />
                <img
                  src={`${String(bannersLeft[0].path).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${bannersLeft[0].path}`}
                  alt={bannersLeft[0].path}
                  loading="eager"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: 650,
                    maxWidth: "100%",
                    maxHeight: "100%",
                    display: "block",
                    borderRadius: 10,
                  }}
                />
              </picture>
            </a>
          </Grid>
          <Grid xs={12} sm={12} md={7} lg={6} xl={5} container>
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{
                ...styleContainerBody,
                gap: 1.5,
                overflowX: "auto",
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" },
                position: "relative",
              }}
            >
              <IconButton
                onMouseEnter={() => startScrolling(-1)}
                onClick={() => startScrolling(-1)}
                sx={{
                  bgcolor: alpha("#fff", 0.75),
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: { xs: "flex", md: "flex" },
                  zIndex: 1,
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Grid
                ref={containerRef}
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  ...styleContainerBody,
                  gap: 1.5,
                  pl: { xs: 0, md: 1.5 },
                  overflowX: "auto",
                  scrollBehavior: "smooth",
                  "&::-webkit-scrollbar": { display: "none" },
                  position: "relative",
                  pb: 0.5,
                }}
              >
                {produtos.map((src, index) => (
                  <CardProdu produ={src} idx={index} key={`produto-${index}`} sx={{ minWidth: { xs: "calc(50% - 8px)", sm: "calc(50% - 8px)", md: 200, lg: 200, xl: 200 } }} />
                ))}
              </Grid>
              <IconButton
                onMouseEnter={() => startScrolling(1)}
                onClick={() => startScrolling(1)}
                // onMouseLeave={stopScrolling}
                sx={{
                  bgcolor: alpha("#fff", 0.75),
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: { xs: "flex", md: "flex" },
                  zIndex: 1,
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12} sm={12} md={10} lg={9} xl={8}>
          <Banner banners={banners} fgHorizontalSmall />
        </Grid>
      </>
    );
  }

  return (
    <>
      {fgBanner && banners.length > 0 ? (
        <Banner banners={banners} fgDepartamentos />
      ) : (
        <Grid xs={12} sm={12} md={10} lg={9} xl={8} sx={styleContainerBodyTitle}>
          <Typography variant="h3" sx={{ fontSize: "2rem", fontFamily: "Jost", overflow: "hidden" }}>
            {title}
          </Typography>
        </Grid>
      )}

      <Grid container sx={styleContainer}>
        <Grid
          container
          xs={12}
          sm={12}
          md={10}
          lg={9}
          xl={8}
          sx={{
            ...styleContainerBody,
            gap: 1.5,
            px: { xs: 0.5, md: 4 },
            overflowX: "auto",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": { display: "none" },
            position: "relative",
            mb: 2,
          }}
        >
          <IconButton
            onMouseEnter={() => startScrolling(-1)}
            onClick={() => startScrolling(-1)}
            // onMouseLeave={stopScrolling}
            sx={{
              bgcolor: alpha("#fff", 0.75),
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: { xs: "flex", md: "flex" },
              zIndex: 1,
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Grid
            ref={containerRef}
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{
              ...styleContainerBody,
              gap: 1.5,
              pl: { xs: 0, md: 1.5 },
              overflowX: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
              position: "relative",
              pb: 0.5,
            }}
          >
            {fgMarcas ? produtos.map((src, index) => <CardMarca key={`marca-${index}`} />) : null}
            {fgPromo
              ? produtos.map((src, index) => (
                  <Box sx={{ minWidth: { xs: "calc(50% - 8px)", sm: "calc(50% - 8px)", md: 200, lg: 200, xl: 200 } }}>
                    <CardProduPromo
                      produ={src}
                      key={`promo-${index}`}
                      sx={{ minWidth: { xs: "calc(50% - 8px)", sm: "calc(50% - 8px)", md: 200, lg: 200, xl: 200 } }}
                      intervaloSeg={intervaloSeg}
                      remaining={remaining}
                      setRemaining={setRemaining}
                    />
                  </Box>
                ))
              : null}
            {!fgMarcas && !fgPromo
              ? produtos.map((src, index) => (
                  <CardProdu produ={src} idx={index} key={`produto-${index}`} sx={{ minWidth: { xs: "calc(50% - 8px)", sm: "calc(50% - 8px)", md: 200, lg: 200, xl: 200 } }} />
                ))
              : null}
          </Grid>
          <IconButton
            onMouseEnter={() => startScrolling(1)}
            onClick={() => startScrolling(1)}
            // onMouseLeave={stopScrolling}
            sx={{
              bgcolor: alpha("#fff", 0.75),
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              display: { xs: "flex", md: "flex" },
              zIndex: 1,
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* Dots Navigation */}
          {totalDots > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                width: "100%",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 2,
                bgcolor: "transparent",
              }}
            >
              {activeDot > 0 && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#e0e0e0",
                    opacity: 0.5,
                  }}
                />
              )}

              {Array.from({ length: Math.min(3, totalDots) }).map((_, index) => {
                const dotIndex = Math.min(Math.max(activeDot - 1, 0) + index, totalDots - 1);
                return (
                  <Box
                    key={dotIndex}
                    onClick={() => scrollToDot(dotIndex)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: activeDot === dotIndex ? Colors.primary : "#e0e0e0",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: activeDot === dotIndex ? Colors.primary : alpha(Colors.primary, 0.5),
                      },
                    }}
                  />
                );
              })}

              {activeDot < totalDots - 2 && (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "#e0e0e0",
                    opacity: 0.5,
                  }}
                />
              )}
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
}
