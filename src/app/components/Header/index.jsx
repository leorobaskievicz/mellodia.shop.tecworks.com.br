"use client";

import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Box,
  Popover,
  Paper,
  Backdrop,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  useMediaQuery,
  useTheme,
  Modal,
  ListSubheader,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  styleContainer,
  styleContainerBody,
  styleContainerBodySearchbar,
  styleContainerBodySearchbarInput,
  styleContainerBodyButton,
  styleContainerBodyButtonIcon,
  styleContainerBodyButtonSubtitle,
  styleContainerBodyButtonTitle,
  styleContainerRight,
} from "./style";
import { Colors } from "../../style.constants";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Diversos } from "@/app/lib/diversos";
import { useApp } from "@/app/context/AppContext";
import CartClient from "@/app/components/CartClient";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { supabase } from "@/app/lib/supabaseClient";
import { lazy, Suspense } from "react";

export const LazySliderRoleta = lazy(() => import("@/app/components/Roleta"));

export default function Header({ children, menus = [], marcas = [] }) {
  const theme = useTheme();
  const router = useRouter();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("xl"));
  const { state, dispatch } = useApp();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalCepOpen, setModalCepOpen] = useState(false);
  const [cepInput, setCepInput] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const closeTimer = useRef(null);
  const [openDropDown, setOpenDropDown] = useState(false);

  const handlePopoverMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModalCep = () => {
    setModalCepOpen(true);
    handlePopoverMouseLeave();
  };

  const handleCloseModalCep = () => {
    setModalCepOpen(false);
  };

  const handleCepChange = (event) => {
    setCepInput(Diversos.maskCEP(Diversos.getnums(event.target.value)));
  };

  const handleCepSubmit = () => {
    dispatch({ type: "SET_CEP", payload: cepInput });
    handleCloseModalCep();
  };

  const renderMenuLocalizacao = (fgCloseShow = false) => (
    <Box sx={{ zIndex: 1000, width: 250, height: "auto", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", p: 0 }}>
      {!fgCloseShow ? (
        <IconButton onClick={handlePopoverMouseLeave} secondary size="small" sx={{ position: "absolute", top: 5, right: 5 }}>
          <CloseIcon />
        </IconButton>
      ) : null}
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 0.9 }}>
        <LocationOnIcon sx={{ fontSize: "2.5rem", color: Colors.secondaryDark, mb: 1 }} />
        {state.cep ? (
          <Typography sx={{ fontSize: "1rem", fontFamily: "Jost", fontWeight: "500", color: Colors.dark, textAlign: "center" }}>Ofertas disponíveis para: {state.cep}</Typography>
        ) : (
          <Typography sx={{ fontSize: "1rem", fontFamily: "Jost", fontWeight: "500", color: Colors.dark, textAlign: "center" }}>
            Descubras as melhores ofertas de frete para sua região!
          </Typography>
        )}
      </Box>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", p: 0.9 }}>
        <Button variant="contained" size="medium" color="primary" fullWidth onClick={handleOpenModalCep}>
          {state.cep ? "Alterar CEP" : "Informar CEP"}
        </Button>
      </Box>
    </Box>
  );

  const renderMenuLogin = () => (
    <Box sx={{ zIndex: 1000, width: "100%", height: "auto", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", p: 0 }}>
      {/* <IconButton onClick={handlePopoverMouseLeave} secondary size="small" sx={{ position: "absolute", top: 5, right: 5 }}>
        <CloseIcon />
      </IconButton> */}
      {state.usuario && state.usuario.codigo ? (
        <>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", mt: 1, p: 0.9 }}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              fullWidth
              onClick={async () => {
                await supabase.auth.signOut();
                dispatch({ type: "LOGOUT" });
              }}
            >
              Sair da conta
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              backgroundColor: Colors.secondary,
              borderBottom: `solid 2px ${Colors.secondaryBorder}`,
              borderTop: `solid 2px ${Colors.secondaryBorder}`,
              py: 0,
              px: 0.9,
              mt: 1,
              mb: 0,
            }}
          >
            <Typography variant="title" sx={{ flex: 7, fontSize: "0.9rem", fontFamily: "Jost", fontWeight: "700", color: "#000000", textAlign: "left" }}>
              Olá {state.usuario.nome?.split(" ")[0] || state.usuario.nome}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", mt: 1, p: 0.9 }}>
            <Button variant="contained" size="large" color="primary" fullWidth onClick={() => router.push("/login")}>
              Acessar minha conta
            </Button>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              backgroundColor: Colors.secondary,
              borderBottom: `solid 2px ${Colors.secondaryBorder}`,
              borderTop: `solid 2px ${Colors.secondaryBorder}`,
              p: 0,
              mt: 1,
              mb: 0,
            }}
          >
            <Typography variant="title" sx={{ flex: 7, fontSize: "0.9rem", fontFamily: "Jost", fontWeight: "700", color: "#000000", textAlign: "right" }}>
              Não tem conta?
            </Typography>
            <Button variant="text" size="medium" color="primary" fullWidth sx={{ flex: 5 }} onClick={() => router.push("/cadastro")}>
              Cadastrar.
            </Button>
          </Box>
        </>
      )}
      <List fullWidth sx={{ width: "100%" }}>
        <ListItem disablePadding>
          <ListItemButton size="small" onClick={() => router.push("/meu-cadastro")}>
            <ListItemIcon>
              <PersonOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Dados" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton size="small" onClick={() => router.push("/consulta-pedidos")}>
            <ListItemIcon>
              <ShoppingBagIcon />
            </ListItemIcon>
            <ListItemText primary="Meus Pedidos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton size="small" onClick={() => router.push("/meu-cadastro#grid-favoritos")}>
            <ListItemIcon>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favoritos" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton size="small" onClick={() => router.push("/institucional/atendimento")}>
            <ListItemIcon>
              <PhoneIcon />
            </ListItemIcon>
            <ListItemText primary="Atendimento" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const renderMenuSacola = () => (
    <Box
      sx={{
        width: 450,
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        p: 0,
        zIndex: 1000,
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <IconButton onClick={handlePopoverMouseLeave} secondary size="small" sx={{ position: "absolute", top: 5, right: 5 }}>
        <CloseIcon />
      </IconButton>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          maxHeight: "700px",
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          p: 0.9,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2, ml: 2, textAlign: "left", width: "100%" }}>
          Sua Sacola
        </Typography>
        <CartClient fgMini={true} />
      </Box>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", p: 0.9 }}>
        {state.carrinho && state.carrinho.length > 0 ? (
          <Link href="/checkout/pagamento" style={{ width: "100%" }}>
            <Button variant="contained" size="large" color="primary" fullWidth>
              Finalizar compra
            </Button>
          </Link>
        ) : null}
      </Box>
    </Box>
  );

  useEffect(() => {
    // dispatch({ type: "HANDLE_ROLETA", payload: false });
    // const handleBeforeUnload = () => {
    //   navigator.sendBeacon(
    //     "https://dricor.api.tecworks.com.br/cart/heartbeat",
    //     new Blob([JSON.stringify({ session_id: localStorage.getItem("session_id") })], { type: "application/json" })
    //   );
    // };
    // window.addEventListener("beforeunload", handleBeforeUnload);
    // return () => {
    //   window.removeEventListener("beforeunload", handleBeforeUnload);
    // };
  }, []);

  useEffect(() => {
    router.prefetch("/");
  }, [router]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.href = "/";
    // setIsNavigating(true);

    // router.prefetch("/");

    // router.push("/");
  };

  return (
    <>
      <Suspense>
        <LazySliderRoleta />
      </Suspense>

      <Box className="whats-app-link" sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
        <Tooltip title="Fale conosco pelo WhatsApp (41) 9xxx-xxx" placement="left">
          <Link
            href="https://api.whatsapp.com/send?l=pt&phone=+xxx&text=Ol%C3%A1.%20Estou%20fazendo%20contato%20atrav%C3%A9s%20do%20site%20www.dricor.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconButton color="success" sx={{ backgroundColor: alpha(Colors.white, 0.75), borderRadius: "50%", p: 0 }}>
              <WhatsAppIcon color="success" sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }} />
            </IconButton>
          </Link>
        </Tooltip>
      </Box>

      <Backdrop open={open} sx={{ zIndex: 999, backgroundColor: "rgba(0,0,0,0.5)" }} />

      <Modal open={modalCepOpen} onClose={handleCloseModalCep} aria-labelledby="modal-cep" aria-describedby="modal-cep-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-cep" variant="h6" component="h2" sx={{ mb: 2 }}>
            Informe seu CEP
          </Typography>
          <TextField fullWidth label="CEP" variant="outlined" value={cepInput} onChange={handleCepChange} inputProps={{ maxLength: 9 }} sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleCloseModalCep} variant="outlined">
              Cancelar
            </Button>
            <Button onClick={handleCepSubmit} variant="contained" color="primary">
              Confirmar
            </Button>
          </Box>
        </Box>
      </Modal>

      <Grid
        container
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 998,
          p: {
            xs: 1,
            sm: 1,
            md: 2,
          },
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundColor: "#ffffff",
          mx: "auto",
          width: { xs: "100%", sm: "100%", md: "100%", lg: "90%", xl: "75%" },
        }}
      >
        <IconButton onClick={toggleDrawer(true)} sx={{ display: { xs: "flex", md: "none" }, position: "absolute", left: 20, top: 20 }}>
          <MenuIcon />
        </IconButton>

        <Grid item xs={12} sm={12} md={2} sx={{ textAlign: { xs: "center", sm: "center" }, pr: 0 }}>
          <Link
            href="/"
            onClick={handleLogoClick}
            style={{
              position: "relative",
              display: "inline-block",
              opacity: isNavigating ? 0.7 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            <Image width={110} height={50} src="/logo.png" alt="Logo" className="lazyload" priority={true} loading="eager" />
          </Link>
        </Grid>

        <IconButton
          color="primary"
          onClick={() => dispatch({ type: "SET_CART_OPEN", payload: true })}
          sx={{ display: { xs: "flex", md: "none" }, position: "absolute", right: 20, top: 20 }}
        >
          <ShoppingBagIcon />
        </IconButton>

        <Grid item xs={2} sm={2} sx={{ display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}></Grid>

        <Grid item xs={12} md={5} sx={{ mt: { xs: 1, md: 0 }, px: { xs: 0, md: 0 } }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="O que você procura hoje?"
            value={searchTerm}
            onChange={handleSearch}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                router.push(
                  `/busca/${Diversos.toSeoUrl(event.target.value)}?${state.usuario && state.usuario.vendedor && state.usuario.vendedor.CODIGO ? "fgTelevendas=true" : ""}`,
                );
              }
            }}
            sx={styleContainerBodySearchbarInput}
            size={isSmallScreen ? "small" : "medium"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size={isSmallScreen ? "small" : "medium"}
                    onClick={() =>
                      (window.location.href = `/busca/${Diversos.toSeoUrl(searchTerm)}?${
                        state.usuario && state.usuario.vendedor && state.usuario.vendedor.CODIGO ? "fgTelevendas=true" : ""
                      }`)
                    }
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid
          item
          md={5}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{ position: "relative", flex: 1 }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => {
                setOpenDropDown(false);
              }, 150);
            }}
          >
            <Button
              variant="text"
              fullWidth
              color="primary"
              id="btn-header-localizacao"
              onMouseEnter={() => {
                clearTimeout(closeTimer.current);
                setOpenDropDown("localizacao");
              }}
              sx={{ ...styleContainerBodyButton, justifyContent: "flex-end", mr: 0.5 }}
            >
              <LocationOnIcon sx={styleContainerBodyButtonIcon} />
              <Box sx={{ p: 0 }}>
                {state.cep ? (
                  <Typography sx={styleContainerBodyButtonTitle} component="span">
                    <Typography sx={styleContainerBodyButtonSubtitle}>Enviar para: </Typography>
                    {state.cep}
                  </Typography>
                ) : (
                  <Typography sx={styleContainerBodyButtonTitle} component="span">
                    <Typography sx={styleContainerBodyButtonSubtitle}>Informe sua</Typography>
                    Localização
                  </Typography>
                )}
              </Box>
              <ExpandMoreIcon sx={styleContainerBodyButtonIcon} />
            </Button>
            {openDropDown === "localizacao" ? (
              <Paper elevation={4} sx={{ p: 0, minWidth: 250, zIndex: 1000, position: "absolute", marginBottom: 0, right: 0, overflowX: "hidden" }}>
                {renderMenuLocalizacao()}
              </Paper>
            ) : null}
          </Box>

          <Box
            sx={{ position: "relative", flex: 1 }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => {
                setOpenDropDown(false);
              }, 150);
            }}
          >
            <Button
              variant="text"
              fullWidth
              color="primary"
              sx={{ ...styleContainerBodyButton, mr: 0.5 }}
              id="btn-header-login"
              onMouseEnter={() => {
                clearTimeout(closeTimer.current);
                setOpenDropDown("login");
              }}
            >
              <PersonOutlineIcon sx={styleContainerBodyButtonIcon} />
              {state.usuario && state.usuario.nome && state.usuario.codigo ? (
                <Box sx={{ p: 0 }}>
                  <Typography sx={styleContainerBodyButtonTitle} component="span">
                    <Typography sx={styleContainerBodyButtonSubtitle}>Olá! Bem-vindo(a)</Typography>
                    {state.usuario.nome?.split(" ")[0] || state.usuario.nome}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ p: 0 }}>
                  <Typography sx={styleContainerBodyButtonTitle} component="span">
                    <Typography sx={styleContainerBodyButtonSubtitle}>Olá! Entrar na</Typography>
                    Minha Conta
                  </Typography>
                </Box>
              )}
              <ExpandMoreIcon sx={styleContainerBodyButtonIcon} />
            </Button>
            {openDropDown === "login" ? (
              <Paper elevation={4} sx={{ p: 0, minWidth: 250, zIndex: 1000, position: "absolute", marginBottom: 0, right: 0, overflowX: "hidden" }}>
                {renderMenuLogin()}
              </Paper>
            ) : null}
          </Box>

          <Box
            sx={{ position: "relative", flex: 1 }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => {
                setOpenDropDown(false);
              }, 150);
            }}
          >
            <Button
              variant="text"
              fullWidth
              color="primary"
              id="btn-header-sacola"
              // onMouseEnter={handleMouseEnter}
              onMouseEnter={() => {
                clearTimeout(closeTimer.current);
                setOpenDropDown("sacola");
              }}
              onClick={() => dispatch({ type: "SET_CART_OPEN", payload: true })}
              sx={{ ...styleContainerBodyButton, justifyContent: "flex-start" }}
            >
              <ShoppingBagIcon sx={styleContainerBodyButtonIcon} />
              <Box sx={{ p: 0, alignItems: "center", justifyContent: "center" }}>
                <Typography sx={styleContainerBodyButtonTitle} component="span">
                  <Typography sx={styleContainerBodyButtonSubtitle}>Sua</Typography>
                  Sacola
                </Typography>
              </Box>
              <ExpandMoreIcon sx={styleContainerBodyButtonIcon} />
            </Button>

            {openDropDown === "sacola" ? (
              <Paper elevation={4} sx={{ p: 0, minWidth: 250, zIndex: 1000, position: "absolute", marginBottom: 0, right: 0, overflowX: "hidden" }}>
                {renderMenuSacola()}
              </Paper>
            ) : null}
          </Box>
        </Grid>
      </Grid>

      <Popover
        open={open}
        anchorEl={anchorEl}
        // onClose={handleMouseLeave}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          zIndex: 1000,
          "& .MuiPaper-root": { boxShadow: "none" },
          "& .MuiPopover-paper": {
            transition: "opacity 0.2s ease-in-out",
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
          },
        }}
      >
        <Paper sx={{ p: 0, minWidth: 250 }} id={`popover-${anchorEl?.id}`}>
          {anchorEl && anchorEl.id === "btn-header-localizacao" ? renderMenuLocalizacao() : null}
          {anchorEl && anchorEl.id === "btn-header-login" ? renderMenuLogin() : null}
          {anchorEl && anchorEl.id === "btn-header-sacola" ? renderMenuSacola() : null}
        </Paper>
      </Popover>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: "100%", height: "auto", bgcolor: "primary.main", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", p: 2 }}>
          {state.usuario && state.usuario.codigo ? (
            <>
              <AccountCircleIcon sx={{ fontSize: "2rem", color: "white", mr: 1.5 }} />
              <Typography variant="h6" color="white">
                Olá, {state.usuario.nome?.split(" ")?.[0] || state.usuario.nome}
              </Typography>
              <Button variant="text" color="secondary" onClick={() => dispatch({ type: "LOGOUT" })} sx={{ ml: 2 }}>
                <ExitToAppIcon sx={{ fontSize: "1.5rem", color: "white" }} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" color="secondary" onClick={() => router.push("/login")} fullWidth>
                Entrar
              </Button>
              <Divider sx={{ my: 1 }}>
                <Typography variant="body2" color="white">
                  ou
                </Typography>
              </Divider>
              <Button variant="outlined" color="secondary" onClick={() => router.push("/login")} fullWidth>
                Criar conta
              </Button>
            </>
          )}
        </Box>
        <Box sx={{ width: 300, px: 2, pt: 0, overflowY: "auto", overflowX: "hidden" }}>
          <List>
            <ListSubheader sx={{ p: 1.5, mx: -2, bgcolor: "grey.100" }}>
              <Typography variant="h6" sx={{ fontSize: "0.9rem", fontWeight: "500" }}>
                Departamentos
              </Typography>
            </ListSubheader>

            <ListItem disablePadding key={`menu-mobile-promocoes-2`}>
              <ListItemButton
                key={`submenu-mobile-promocoes-2`}
                onClick={() => {
                  setDrawerOpen(false);
                  router.push(`/promocoes`);
                }}
              >
                <ListItemText primary="Promoções" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding key={`menu-mobile-outlet`}>
              <ListItemButton
                key={`submenu-mobile-outlet`}
                onClick={() => {
                  setDrawerOpen(false);
                  router.push(`/outlet`);
                }}
              >
                <ListItemText primary="Outlet" />
              </ListItemButton>
            </ListItem>

            {menus &&
              menus.length > 0 &&
              menus.map((menu) => (
                <ListItem disablePadding key={`menu-mobile-${Diversos.toSeoUrl(menu.DESCRICAO)}`}>
                  {menu.menu2 && menu.menu2.length > 0 ? (
                    <Accordion sx={{ width: "100%", p: 0 }} elevation={0}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${Diversos.toSeoUrl(menu.DESCRICAO)}-content`}
                        id={`panel-${Diversos.toSeoUrl(menu.DESCRICAO)}-header`}
                      >
                        <ListItemText primary={Diversos.capitalize(String(menu.DESCRICAO).toLowerCase())} />
                      </AccordionSummary>
                      <AccordionDetails>
                        {menu.menu2.map((subItem) => (
                          <ListItemButton
                            key={`submenu-mobile-${Diversos.toSeoUrl(subItem.DESCRICAO)}`}
                            onClick={() => {
                              setDrawerOpen(false);
                              router.push(`/departamento/${Diversos.toSeoUrl(menu.DESCRICAO)}/${Diversos.toSeoUrl(subItem.DESCRICAO)}`);
                            }}
                          >
                            <ListItemText primary={Diversos.capitalize(String(subItem.DESCRICAO).toLowerCase())} />
                          </ListItemButton>
                        ))}
                        <ListItemButton
                          onClick={() => {
                            setDrawerOpen(false);
                            router.push(`/departamento/${Diversos.toSeoUrl(menu.DESCRICAO)}`);
                          }}
                        >
                          <ListItemText primary="Ver todos" />
                        </ListItemButton>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <ListItemButton
                      onClick={() => {
                        setDrawerOpen(false);
                        router.push(`/departamento/${Diversos.toSeoUrl(menu.DESCRICAO)}`);
                      }}
                    >
                      <ListItemText primary={Diversos.capitalize(String(menu.DESCRICAO).toLowerCase())} />
                    </ListItemButton>
                  )}
                </ListItem>
              ))}

            <ListItem disablePadding key={`menu-mobile-marcas`}>
              <Accordion sx={{ width: "100%", p: 0 }} elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-marcas-content`} id={`panel-marcas-header`}>
                  <ListItemText primary="Marcas" />
                </AccordionSummary>
                <AccordionDetails>
                  {marcas.map((subItem) => (
                    <ListItemButton
                      key={`submenu-mobile-${Diversos.toSeoUrl(subItem.marca)}`}
                      onClick={() => {
                        setDrawerOpen(false);
                        router.push(`/marca/${Diversos.toSeoUrl(subItem.marca)}`);
                      }}
                    >
                      <ListItemText primary={Diversos.capitalize(String(subItem.marca).toLowerCase())} />
                    </ListItemButton>
                  ))}
                </AccordionDetails>
              </Accordion>
            </ListItem>

            <ListSubheader sx={{ p: 1.5, mx: -2, bgcolor: "grey.100" }}>
              <Typography variant="h6" sx={{ fontSize: "0.9rem", fontWeight: "500" }}>
                SAC
              </Typography>
            </ListSubheader>

            <ListItem disablePadding>
              <Box sx={{ width: "100%" }}>{renderMenuLocalizacao(true)}</Box>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  router.push("/meu-cadastro");
                }}
              >
                <ListItemIcon>
                  <PersonOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Minha Conta" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  router.push("/consulta-pedidos");
                }}
              >
                <ListItemIcon>
                  <ShoppingBagIcon />
                </ListItemIcon>
                <ListItemText primary="Meus Pedidos" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  dispatch({ type: "SET_CART_OPEN", payload: true });
                }}
              >
                <ListItemIcon>
                  <ShoppingBagIcon />
                </ListItemIcon>
                <ListItemText primary="Sacola" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  router.push("/meu-cadastro#grid-favoritos");
                }}
              >
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="Favoritos" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  router.push("/institucional/atendimento");
                }}
              >
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary="Atendimento" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Drawer anchor="right" open={state.cartOpened} onClose={() => dispatch({ type: "SET_CART_OPEN", payload: false })}>
        <Box sx={{ width: "100%", p: 0 }}>
          <CartClient />
        </Box>
      </Drawer>
    </>
  );
}
