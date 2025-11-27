"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Diversos } from "@/app/lib/diversos";
import { Box, Button, IconButton, DialogTitle, DialogContent, Badge, Container, LinearProgress, Typography, Grid } from "@mui/material";
import { green } from "@mui/material/colors";
import { Close as CloseIcon } from "@mui/icons-material";
import { useApp } from "@/app/context/AppContext";
import CartItem from "@/app/components/CartItem";
import moment from "moment";
import FreteGratisBar from "@/app/components/FreteGratisBar";

const CardPromocaoIphone = ({ show, handleClose, totalCard, ehMobile }) => {
  if (Number(moment().utcOffset("-03:00").format("YYYYMMDD")) < 20250301 || Number(moment().utcOffset("-03:00").format("YYYYMMDD")) > 20250331) {
    return null;
  }

  if (Diversos.checkPromocaoIphone(totalCard) <= -1) {
    return null;
  }

  if (Diversos.checkPromocaoIphone(totalCard) === 0) {
    return (
      <Box className="card m-0" sx={{ width: "90%" }}>
        <Grid container>
          <Grid item xs={4}>
            <Image
              className="card-img-top"
              src="/popup-iphone-diva.png"
              width={800}
              height={600}
              alt="Promoção iPhone"
              style={{
                height: "auto",
                width: "100%",
              }}
            />
          </Grid>
          <Grid item xs={8}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" component="h5">
                Sorteio de um iPhone
              </Typography>
              <Typography variant="body1">Nessa compra você concorre a um iPhone 15</Typography>
              <LinearProgress variant="determinate" value={100} color="success" />
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box className="card m-0" sx={{ width: "90%" }}>
      <Grid container>
        <Grid item xs={4}>
          <Image
            className="card-img-top"
            src="/popup-iphone-diva.png"
            width={800}
            height={600}
            alt="Promoção iPhone"
            style={{
              height: "auto",
              width: "100%",
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h5">
              Sorteio de um iPhone
            </Typography>
            <Typography variant="body1">
              Com mais{" "}
              <Box component="span" sx={{ fontWeight: 700, fontSize: 18, color: "#5cb85c" }}>
                {Diversos.maskPreco(String(Diversos.checkPromocaoIphone(totalCard)))}
              </Box>{" "}
              você concorre a um iPhone de Mês da Mulher
            </Typography>
            <LinearProgress variant="determinate" value={Math.round((150 * totalCard) / 100)} color="success" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function CartClient(props) {
  const router = useRouter();
  const { state: stateApp, dispatch: dispatchApp } = useApp();
  const [state, setState] = useState({
    redirect: null,
  });

  const getCartTotal = () => {
    let total = 0.0;

    for (let i = 0; i < stateApp.carrinho.length; i++) {
      let preco = stateApp.carrinho[i].PRECO;

      if (Number(stateApp.carrinho[i].PREPRO) > 0 && Number(stateApp.carrinho[i].PREPRO) < Number(stateApp.carrinho[i].PRECO)) {
        preco = Number(stateApp.carrinho[i].PREPRO);
      }

      total += preco * stateApp.carrinho[i].qtd;
    }

    return total;
  };

  const getCartAmount = () => {
    let amount = 0;

    for (let i = 0; i < stateApp.carrinho.length; i++) {
      amount += 1 * stateApp.carrinho[i].qtd;
    }

    return amount;
  };

  const handleCheckout = () => {
    dispatchApp({ type: "SET_CART_OPEN", payload: false });

    if (window && window.fbq) {
      window.fbq("track", "InitiateCheckout");
    }

    router.push(`/checkout/pagamento`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {!props.fgMini && (
        <>
          <IconButton color="secondary" onClick={() => dispatchApp({ type: "SET_CART_OPEN", payload: false })} sx={{ position: "absolute", top: 5, right: 5 }}>
            <CloseIcon />
          </IconButton>
          <DialogTitle className="cart-header" sx={{ width: "100%", bgcolor: "primary.main" }}>
            <Typography variant="h6" component="div" className="cart-title" color="white">
              Minha Cesta <Badge badgeContent={getCartAmount()} color="secondary" sx={{ ml: 2, mt: -0.5 }} />
            </Typography>
          </DialogTitle>
        </>
      )}

      <DialogContent className="cart-content" sx={{ width: "100%" }}>
        {!stateApp.carrinho || stateApp.carrinho.length <= 0 ? (
          <Box className="empty-cart">
            <Typography variant="h4" className="empty-cart-title">
              Seu carrinho está vazio
            </Typography>
            <Typography variant="body1" className="empty-cart-text">
              Navegue por nossa loja e encontre seus produtos favoritos!
            </Typography>
            <Button variant="contained" color="primary" className="btn-secondary-action cart-keep-shopping" onClick={() => dispatchApp({ type: "SET_CART_OPEN", payload: false })}>
              Continuar comprando
            </Button>
          </Box>
        ) : (
          <>
            <Box
              className="cart-populated"
              sx={{
                width: "100%",
                px: 0,
                width: "100%",
                height: "auto",
                maxHeight: { xs: "calc(100vh - 375px)", sm: "calc(100vh - 375px)", md: "calc(100vh - 300px)" },
                overflowY: "auto",
                overflowX: "hidden",
                position: "relative",
                mt: 2,
                scrollBehavior: "smooth",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {stateApp.carrinho.map((row, index) => (
                <CartItem item={row} key={index} />
              ))}
            </Box>

            <Container className="cart-continue-container">
              <Grid container spacing={2}>
                {/* <Grid item xs={12}>
                  {CardPromocaoIphone({
                    show: true,
                    handleClose: () => null,
                    totalCard: getCartTotal(),
                    ehMobile: false,
                  })}
                </Grid> */}

                <Grid item xs={12}>
                  <Box sx={{ width: "100%", textAlign: "center" }}>
                    <Typography variant="h5" className="partial-total">
                      SUBTOTAL:{" "}
                      <Box component="span" sx={{ fontWeight: "bold" }}>
                        R$ {Diversos.number_format(getCartTotal(), 2, ",", "")}
                      </Box>
                    </Typography>
                  </Box>
                </Grid>

                {!props.fgMini && (
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      width: "100%",
                      position: "absolute",
                      bottom: 10,
                      left: 10,
                      right: 10,
                    }}
                  >
                    {/* <Grid item xs={12}>
                      <FreteGratisBar />
                    </Grid> */}

                    <Grid item xs={12} md={6}>
                      <Button variant="outlined" fullWidth size="large" className="cart-btn-checkout-back" onClick={() => dispatchApp({ type: "SET_CART_OPEN", payload: false })}>
                        Continuar comprando
                      </Button>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Button variant="contained" color="primary" fullWidth size="large" className="cart-btn-checkout" onClick={handleCheckout}>
                        FINALIZAR COMPRA
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Container>
          </>
        )}
      </DialogContent>
    </Box>
  );
}
