"use client";

import { useState, useMemo } from "react";
import { Grid, Box, Card, CardMedia, CardContent, Typography, CardActions, Button, LinearProgress, IconButton } from "@mui/material";
import {
  styleContainerContent,
  styleContainerCard,
  styleContainerCardTitle,
  styleContainerCardPrice,
  styleContainerCardPricePor,
  styleContainerCardPriceDe,
  styleContainerContentMsg,
  styleBtnAction,
  styleBtnActionIcon,
  styleTagDesconto,
} from "./style";
import { Colors } from "@/app/style.constants";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarRating from "@/app/components/StarRating";
import { Diversos } from "@/app/lib/diversos";
import { useApp } from "@/app/context/AppContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import Countdown from "@/app/components/Countdown";
import moment from "moment";

export default function CardProduPromo({ produ, intervaloSeg, remaining, setRemaining, data, sx }) {
  const { state, dispatch } = useApp();

  // Cria uma data fixa baseada no tempo restante para evitar recálculos
  const dataCountdown = useMemo(() => {
    if (!remaining || remaining <= 0) return new Date(Date.now() + 1000);
    return new Date(Date.now() + remaining * 1000);
  }, [remaining]);

  const handleClickAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch({ type: "ADICIONAR_AO_CARRINHO", payload: { ...produ, qtd: 1, FOTOS: produ.FOTOS } });
    dispatch({ type: "SET_CART_OPEN", payload: true });
    Diversos.sendCartData(state.usuario?.codigo, [...state.carrinho, { ...produ, PRODUTO: produ.CODIGO, CODIGO: produ.CODIGO, qtd: 1, qty: 1 }]);
  };

  const handleClickFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state.favoritos.includes(produ.CODIGO)) {
      dispatch({ type: "REMOVER_FAVORITO", payload: produ.CODIGO });
    } else {
      dispatch({ type: "ADICIONAR_FAVORITO", payload: produ.CODIGO });
    }
  };

  const handleClickShare = async (e) => {
    e.preventDefault();

    let preco = produ.PREPRO > 0 && produ.PREPRO < produ.PRECO ? produ.PREPRO : produ.PRECO;

    if (window.navigator.share) {
      try {
        await window.navigator.share({
          title: Diversos.capitalizeAllWords(produ.NOME) || window.document.title,
          text:
            `Confira essa super promoção ${Number(produ.PRECO) !== Number(preco) ? `de ${Diversos.maskPreco(produ.PRECO)}` : ""} por ${Diversos.maskPreco(preco)} na mellodia` ||
            "Confira este link!",
          url: window.location.href,
        });
      } catch (error) {
        // Usuário cancelou ou houve erro
        console.log("Erro ao compartilhar:", error);
      }
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = `/${Diversos.toSeoUrl(produ.NOME)}`;
  };

  const calcDesconto = () => {
    let desconto = 0;

    if (Number(produ.PRECO) > Number(produ.PREPRO)) {
      desconto = Number(((produ.PRECO - produ.PREPRO) / produ.PRECO) * 100).toFixed(0);
    }

    return desconto;
  };

  return (
    <Box sx={{ ...styleContainerContent, ...sx }}>
      <Card sx={styleContainerCard} onClick={handleClick}>
        <Box style={{ ...styleBtnAction, left: 10, top: 7, zIndex: 3, backgroundColor: "transparent" }}>
          <StarRating value={5} size="small" />
        </Box>

        <IconButton style={{ ...styleBtnAction, left: 10, top: 35, zIndex: 3 }} size="small" onClick={handleClickShare}>
          <ShareOutlinedIcon style={styleBtnActionIcon} />
        </IconButton>

        <IconButton style={{ ...styleBtnAction, left: 50, top: 35, zIndex: 3 }} size="small" onClick={handleClickFavorite}>
          {state.favoritos.includes(produ.CODIGO) ? <FavoriteIcon style={styleBtnActionIcon} /> : <FavoriteBorderIcon style={styleBtnActionIcon} />}
        </IconButton>

        {calcDesconto() > 0 ? <Typography style={{ ...styleTagDesconto, zIndex: 100 }}>{`-${calcDesconto()}%`}</Typography> : null}

        <CardMedia
          component="img"
          height="200"
          image={
            !produ.FOTOS || produ.FOTOS.length <= 0
              ? "/produto-sem-imagem.png"
              : `${String(produ.FOTOS[0].link).indexOf("https://mellodia.shop.cdn.tecworks") > -1 ? "" : "https://mellodia.shop.cdn.tecworks.com.br/"}${
                  !produ.FOTOS || produ.FOTOS.length <= 0 ? "produto-sem-imagem.png" : produ.FOTOS[0].link
                }`
          }
          alt={produ.NOME}
          sx={{ objectFit: "contain", backgroundColor: "white", mt: 5 }}
        />

        <CardContent sx={{ width: "100%", p: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={styleContainerCardTitle}>
            {produ.NOME}
          </Typography>
          <Box sx={styleContainerCardPrice}>
            <Typography variant="h6" color="primary" sx={styleContainerCardPriceDe}>
              R$ {produ.PRECO.toFixed(2)}
            </Typography>
            <Typography variant="h6" color="primary" sx={styleContainerCardPricePor}>
              R$ {Number(produ.PREPRO).toFixed(2)}
            </Typography>
          </Box>
        </CardContent>

        <Box sx={{ width: "100%", mb: 0, mt: 0, py: 0, px: 1, position: "relative" }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(produ.progresso * (produ.vendas / 100), 80) || 0}
            sx={{
              height: 25,
              borderRadius: 9,
              backgroundColor: "#EEEEEE",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#FF2800",
                borderRadius: 9,
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "black",
              fontSize: 10,
              fontWeight: 600,
              //textShadow: "0 1px 2px rgba(0,0,0,0.8)",
              letterSpacing: 0.2,
              zIndex: 1,
            }}
          >
            {produ.vendas || 185} VENDAS
          </Typography>
        </Box>

        <Box sx={{ width: "100%", mb: 0, mt: 1, py: 0, px: 1, position: "relative" }}>{/*<Countdown data={dataCountdown} size="xs" />*/}</Box>

        <CardActions sx={{ width: "100%", flexDirection: "column" }}>
          <Button variant="contained" color="success" fullWidth onClick={handleClickAddToCart}>
            <ShoppingCartIcon />
            Comprar
          </Button>
        </CardActions>
      </Card>

      <Typography variant="h7" sx={styleContainerContentMsg}>
        Válido enquanto durarem os estoques
      </Typography>
    </Box>
  );
}
