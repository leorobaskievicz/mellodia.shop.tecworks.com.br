"use client";

import { useState, useRef } from "react";
import { Grid, Button, Menu, MenuItem, Box, Paper } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useRouter } from "next/navigation";
import HorizontalScroll from "@/app/components/HorizontalScroll";
import { styleContainer, styleContainerBody, styleContainerButton, styleDropdownButton, styleDropdownMenu } from "./style";
import { Diversos } from "@/app/lib/diversos";
import { useApp } from "@/app/context/AppContext";

export const revalidate = 300;

export default function NavbarClient({ menus = { menu: [] }, marcas = [] }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const { state: stateApp } = useApp();

  const closeTimer = useRef(null);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);

  const handleMenuClick = (event, menu) => {
    setAnchorEl(event.currentTarget);
    setSelectedMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMenu(null);
  };

  const handleMenuItemClick = (path) => {
    handleMenuClose();
    router.push(`${path}?${stateApp.usuario && stateApp.usuario.vendedor && stateApp.usuario.vendedor.CODIGO ? "fgTelevendas=true" : ""}`);
  };

  const handleMouseEnter = (event, menuDescricao) => {
    clearTimeout(closeTimer.current);
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setOpenDropDown(menuDescricao);
  };

  if (!menus?.length) {
    return null;
  }

  return (
    <Grid container sx={{ ...styleContainer, display: { xs: "none", md: "flex" } }}>
      <Grid
        xs={12}
        sm={11}
        md={10}
        lg={9}
        xl={8}
        sx={{
          ...styleContainerBody,
          position: "relative",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          overflow: "hidden",
        }}
        container
      >
        <HorizontalScroll sx={{ p: 0, mx: "auto", width: "100%" }} noPadding>
          <Box
            key="menu-promocoes-1"
            sx={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <Button
              type="text"
              color="dark"
              size="small"
              sx={{ ...styleContainerButton, height: "100%" }}
              onClick={(e) => {
                handleMenuItemClick(`/promocoes`);
              }}
            >
              Promoções
            </Button>
          </Box>

          <Box
            key="menu-outlet-1"
            sx={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <Button
              type="text"
              color="dark"
              size="small"
              sx={{ ...styleContainerButton, height: "100%" }}
              onClick={(e) => {
                handleMenuItemClick(`/outlet`);
              }}
            >
              Outlet
            </Button>
          </Box>

          {menus.map((menu) => (
            <Box
              key={Diversos.toSeoUrl(menu.DESCRICAO)}
              sx={{
                position: "relative",
                display: "inline-block",
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => {
                  setOpenDropDown(false);
                  setButtonRect(null);
                }, 150);
              }}
            >
              <Button
                type="text"
                color="dark"
                size="small"
                sx={{ ...styleContainerButton, height: "100%" }}
                onMouseEnter={(e) => handleMouseEnter(e, menu.DESCRICAO)}
                onClick={(e) => {
                  handleMenuItemClick(`/departamento/${Diversos.toSeoUrl(menu.DESCRICAO)}`);
                }}
              >
                {Diversos.capitalizeAllWords(String(menu.DESCRICAO).toLowerCase())}
              </Button>

              {openDropDown === menu.DESCRICAO && buttonRect && (
                <Box
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                    pointerEvents: "none",
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 0,
                      width: 250,
                      maxHeight: "calc(100vh - 200px)",
                      zIndex: 1000,
                      position: "absolute",
                      top: buttonRect.bottom + window.scrollY,
                      left: buttonRect.left + buttonRect.width / 2,
                      transform: "translateX(-50%)",
                      marginTop: "0px",
                      overflowY: "auto",
                      pointerEvents: "auto",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                        width: 16,
                        height: 16,
                        bgcolor: "background.paper",
                        zIndex: 0,
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1, bgcolor: "background.paper" }}>
                      {menu.menu2?.map((item) => (
                        <MenuItem
                          key={`${item.CDMENU}-${item.DESCRICAO}`}
                          onClick={() => handleMenuItemClick(`/departamento/${Diversos.toSeoUrl(menu.DESCRICAO)}/${Diversos.toSeoUrl(item.DESCRICAO)}`)}
                          sx={styleDropdownButton}
                        >
                          {Diversos.capitalizeAllWords(String(item.DESCRICAO).toLowerCase())}
                        </MenuItem>
                      ))}
                      {menu.menu2?.length > 0 && (
                        <MenuItem
                          key={`${menu.CDMENU}-todos`}
                          onClick={() => handleMenuItemClick(`/departamento/${Diversos.toSeoUrl(menu.DESCRICAO)}`)}
                          sx={{ ...styleDropdownButton, fontSize: "0.9rem", fontWeight: "500" }}
                        >
                          Ver todos {Diversos.capitalizeAllWords(String(menu.DESCRICAO).toLowerCase())}
                        </MenuItem>
                      )}
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          ))}

          {marcas.length > 0 ? (
            <Box
              key="menu-marcas"
              sx={{
                position: "relative",
                display: "inline-block",
                py: 0,
              }}
              onMouseLeave={() => {
                closeTimer.current = setTimeout(() => {
                  setOpenDropDown(false);
                  setButtonRect(null);
                }, 150);
              }}
            >
              <Button type="text" color="dark" size="small" sx={{ ...styleContainerButton, height: "100%", my: 0 }} onMouseEnter={(e) => handleMouseEnter(e, "marcas")}>
                Marcas
              </Button>

              {openDropDown === "marcas" && buttonRect && (
                <Box
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                    pointerEvents: "none",
                  }}
                >
                  <Paper
                    elevation={4}
                    sx={{
                      p: 0,
                      width: 250,
                      maxHeight: "calc(100vh - 200px)",
                      zIndex: 1000,
                      position: "absolute",
                      top: buttonRect.bottom + window.scrollY,
                      left: buttonRect.left + buttonRect.width / 2,
                      transform: "translateX(-50%)",
                      marginTop: "0px",
                      overflowY: "auto",
                      pointerEvents: "auto",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                        width: 16,
                        height: 16,
                        bgcolor: "background.paper",
                        zIndex: 0,
                      },
                      overflowX: "auto",
                      scrollbarWidth: "none", // Firefox
                      msOverflowStyle: "none", // IE and Edge
                      "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari, Opera
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", zIndex: 1, bgcolor: "background.paper" }}>
                      {marcas.map((item, idx) => (
                        <MenuItem key={`${idx}-${item.marca}`} onClick={() => handleMenuItemClick(`/marca/${Diversos.toSeoUrl(item.marca)}`)} sx={styleDropdownButton}>
                          {Diversos.capitalizeAllWords(String(item.marca).toLowerCase())}
                        </MenuItem>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              )}
            </Box>
          ) : null}
        </HorizontalScroll>
      </Grid>
    </Grid>
  );
}
