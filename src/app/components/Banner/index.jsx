// Banner.jsx
"use client";

import React, { memo } from "react";
import { useTheme, useMediaQuery, Grid, Box, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Countdown from "@/app/components/Countdown";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { styleContainer, styleContainerBody, CountdownContainer, CountdownRight } from "./style";
import { Colors } from "@/app/style.constants";
import moment from "moment";
import Link from "next/link";

const Banner = memo(({ banners, fgHorizontalSmall, fgCards, fgDepartamentos, arrows = true, dots, priority }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let height = 425;
  let slidesPerView = 1;
  let spaceBetween = 5;

  if (fgCards) {
    height = 335;
    slidesPerView = 6;
    spaceBetween = 16;
  } else if (fgDepartamentos) {
    height = isMobile ? 200 : 425;
  } else if (fgHorizontalSmall) {
    height = isMobile ? 60 : 145;
  } else if (isMobile) {
    height = 400;
  }

  const breakpoints = fgCards
    ? {
        0: { slidesPerView: "auto", spaceBetween: 1 },
        576: { slidesPerView: "auto", spaceBetween: 1 },
        768: { slidesPerView: 3, spaceBetween: 1 },
        992: { slidesPerView: 4, spaceBetween: 16 },
        1200: { slidesPerView: 6, spaceBetween: 16 },
      }
    : { 0: { slidesPerView: 1, spaceBetween } };

  if (!banners || banners.length === 0) return null;

  return (
    <Grid container sx={styleContainer}>
      <Grid xs={12} sm={12} md={10} lg={9} xl={8} sx={styleContainerBody}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "auto",
            overflow: "hidden",
            "& .swiper-button-prev, & .swiper-button-next": {
              color: Colors.secondary, // roxo Diva
            },
            "& .swiper-pagination-bullet": {
              backgroundColor: "#e0e0e0",
              opacity: 1,
            },
            "& .swiper-pagination-bullet-active": {
              backgroundColor: Colors.primary,
            },
            "&. .swiper-wrapper": fgCards
              ? {
                  scrollSnapType: "none",
                }
              : undefined,
          }}
        >
          <Swiper
            modules={[Navigation, Pagination]}
            pagination={dots || isMobile ? true : false}
            navigation={isMobile ? false : arrows}
            loop={true}
            freeMode={
              fgCards
                ? {
                    enabled: true,
                    momentum: true,
                    momentumRatio: 1,
                    momentumBounce: false,
                    sticky: false,
                    bounds: true,
                  }
                : undefined
            }
            resistance={true}
            resistanceRatio={0.5}
            watchOverflow={true}
            preventInteractionOnTransition={true}
            lazy={true}
            slidesPerView={slidesPerView}
            mousewheel={true}
            autoHeight={true}
            spaceBetween={spaceBetween}
            breakpoints={breakpoints}
            style={{
              width: "100%",
              height: "100%",
              paddingBottom: 40,
            }}
          >
            {banners.map((src, index) => {
              const rawPath = src.path_mobile && isMobile ? src.path_mobile : src.path;
              const webpPath = rawPath.replace(/\.[^/.]+$/, ".webp");
              const pngPath = rawPath.replace(/\.[^/.]+$/, ".png");
              const gifPath = rawPath.replace(/\.[^/.]+$/, ".gif");
              const imageAlt = `Slide ${index} ${src.titulo}`;

              if (src.countdown_final) {
                return (
                  <SwiperSlide
                    key={index}
                    style={{
                      width: fgCards ? "222px" : "100%",
                      minWidth: fgCards ? "222px" : "100%",
                      maxWidth: fgCards ? "222px" : "100%",
                      flex: fgCards ? "0 0 auto" : "1 1 auto",
                      margin: isMobile && fgCards ? "0 5px" : "0",
                    }}
                  >
                    <Box
                      component={src.link && src.link !== "#" ? "a" : "div"}
                      href={src.link}
                      sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 1.5,
                        overflow: "hidden",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <Box style={CountdownContainer}>
                        {rawPath.includes(".gif") ? (
                          <img
                            src={`${String(gifPath).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${gifPath}`}
                            alt={imageAlt}
                            loading={index === 0 || priority ? "eager" : "lazy"}
                            style={{
                              objectFit: fgHorizontalSmall ? "contain" : "cover",
                              width: "100%",
                              height: "100%",
                              maxWidth: "100%",
                              maxHeight: "100%",
                              display: "block",
                              borderRadius: 10,
                            }}
                          />
                        ) : (
                          <picture>
                            <source
                              srcSet={`${String(webpPath).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${webpPath}`}
                              type="image/webp"
                              style={{ borderRadius: 10 }}
                            />
                            <img
                              src={`${String(pngPath).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${pngPath}`}
                              alt={imageAlt}
                              loading={index === 0 || priority ? "eager" : "lazy"}
                              style={{
                                objectFit: fgHorizontalSmall ? "contain" : "cover",
                                width: "100%",
                                height: "100%",
                                maxWidth: "100%",
                                maxHeight: "100%",
                                display: "block",
                                borderRadius: 10,
                              }}
                            />
                          </picture>
                        )}
                        <Box
                          sx={{
                            ...CountdownRight,
                            [theme.breakpoints.down("sm")]: {
                              position: "static",
                              width: "100%",
                              height: "auto",
                              margin: "-120px 0 0 0px",
                              padding: 0,
                              left: "unset",
                              right: "unset",
                              top: "unset",
                              bottom: "unset",
                              transform: "none",
                              alignItems: "center",
                              justifyContent: "center",
                            },
                          }}
                        >
                          <Countdown data={moment(src.countdown_final).toDate()} />
                          <Link href={src.link} target="_self" title="Aproveitar Oferta">
                            <Button
                              color="secondary"
                              size="large"
                              variant="contained"
                              sx={{
                                mt: { xs: 0, md: 2 },
                                px: { xs: 3, md: 5 },
                                fontSize: { xs: "0.8rem", md: "1.4rem" },
                                width: { xs: "100%", md: "auto" },
                              }}
                            >
                              Aproveitar Oferta
                            </Button>
                          </Link>
                        </Box>
                      </Box>
                    </Box>
                  </SwiperSlide>
                );
              }

              return (
                <SwiperSlide
                  key={index}
                  style={{
                    width: fgCards ? "222px" : "100%",
                    minWidth: fgCards ? "222px" : "100%",
                    maxWidth: fgCards ? "222px" : "100%",
                    flex: fgCards ? "0 0 auto" : "1 1 auto",
                    margin: isMobile && fgCards ? "0 5px" : "0",
                  }}
                >
                  <Box
                    component={src.link && src.link !== "#" ? "a" : "div"}
                    href={src.link}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 1.5,
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {rawPath.includes(".gif") ? (
                      <img
                        src={`${String(gifPath).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${gifPath}`}
                        alt={imageAlt}
                        loading={index === 0 || priority ? "eager" : "lazy"}
                        style={{
                          objectFit: fgHorizontalSmall ? "contain" : "cover",
                          width: "100%",
                          height: "100%",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          display: "block",
                          borderRadius: 10,
                        }}
                      />
                    ) : (
                      <picture>
                        <source
                          srcSet={`${String(webpPath).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${webpPath}`}
                          type="image/webp"
                          style={{ borderRadius: 10 }}
                        />
                        <img
                          src={`${String(pngPath).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${pngPath}`}
                          alt={imageAlt}
                          loading={index === 0 || priority ? "eager" : "lazy"}
                          style={{
                            objectFit: fgHorizontalSmall ? "contain" : "cover",
                            width: "100%",
                            height: "100%",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            display: "block",
                            borderRadius: 10,
                          }}
                        />
                      </picture>
                    )}
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>
      </Grid>
    </Grid>
  );
});

Banner.displayName = "Banner";

export default Banner;
