"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme, useMediaQuery } from "@mui/material";
import { Grid, Typography, Button, Box, IconButton, alpha } from "@mui/material";
import { styleContainer, styleContainerBody, styleContainerBodyTitle } from "./style";
import CardProdu from "@/app/components/CardProdu";
import CardProduPromo from "@/app/components/CardProduPromo";
import CardMarca from "@/app/components/CardMarca";
import Banner from "@/app/components/Banner";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Colors } from "@/app/style.constants";

export default function SliderCardBanner({ children, banners }) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const containerRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(0);

  const fgHorizontalSmall = false;
  const priority = false;

  useEffect(() => {
    const calculateDots = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const cardWidth = window.innerWidth < 600 ? (window.innerWidth - 32) / 2 : 200;
        const containerWidth = container.offsetWidth;
        const totalCards = banners.length;
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
  }, [banners.length]);

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

  if (!banners || banners.length <= 0) {
    return null;
  }

  return (
    <>
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
              justifyContent: isMobile ? "flex-start" : "flex-start",
              gap: 0,
              pl: { xs: 0, md: 1.5 },
              overflowX: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
              position: "relative",
              pb: 0.5,
            }}
          >
            {banners.length > 0
              ? banners.map((src, index) => {
                  const rawPath = src.path_mobile && isMobile ? src.path_mobile : src.path;
                  const webpPath = rawPath.replace(/\.[^/.]+$/, ".webp");
                  const pngPath = rawPath.replace(/\.[^/.]+$/, ".png");
                  const gifPath = rawPath.replace(/\.[^/.]+$/, ".gif");
                  const imageAlt = `Slide ${index} ${src.titulo}`;

                  return (
                    <Box sx={{ width: 222, height: 335, borderRadius: 1.5, p: 0 }} component={src.link && src.link !== "#" ? "a" : "div"} href={src.link}>
                      <Image
                        src={`${String(webpPath).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${webpPath}`}
                        alt={imageAlt}
                        width={222}
                        height={330}
                        style={{ borderRadius: 10 }}
                      />
                    </Box>
                  );
                })
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
