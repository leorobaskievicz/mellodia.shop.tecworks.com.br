"use client";

import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid, Box, Card, CardMedia, CardContent, Typography, CardActions, Button, IconButton } from "@mui/material";
import { useRouter } from "next/navigation";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  styleContainerCardLink,
  styleContainerCard,
  styleContainerCardContent,
  styleContainerCardActions,
  styleContainerCardContentTitle,
  styleContainerCardContentSubtitle,
  styleContainerCardPrice,
  styleContainerCardPriceDe,
  styleContainerCardPricePor,
  styleContainerCardPriceParcelado,
  styleContainerCardPriceFrete,
  styleContainerCardPriceDescricao,
  styleBtnAction,
  styleBtnActionIcon,
  styleTagDesconto,
  styleContainerPrecoECompra,
  styleComprarBtn,
} from "./style";
import StarRating from "@/app/components/StarRating";
import { Diversos } from "@/app/lib/diversos";
import { useApp } from "@/app/context/AppContext";
import moment from "moment";
import insights from "@/app/lib/algoliaInsights";

const OptimizedImage = memo(({ src, alt, width, height, className, priority = false, sx = {} }) => (
  <Image
    src={src}
    alt={alt}
    xq
    width={width}
    height={height}
    className={className}
    loading={priority ? "eager" : "lazy"}
    quality={75}
    placeholder="blur"
    sx={sx ? sx : {}}
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLzY3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzb/2wBDAR0dHh4eHRoaHSQtJSEkLzYvLy0vLzY3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzb/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
  />
));

OptimizedImage.displayName = "OptimizedImage";

export default function CardProdu({ children, produ, idx, sx, algoliaReturn, indexPage }) {
  const router = useRouter();
  const { state, dispatch } = useApp();

  if (!produ) {
    return null;
  }

  let preco = produ.PRECO;

  if (
    Number(produ.PREPRO_COMPL) > 0 &&
    Number(produ.PREPRO_COMPL) < Number(produ.PRECO) && 
    moment(produ.INIPRO_COMPL, "DD/MM/YYYY").isValid() &&
    moment(produ.INIPRO_COMPL, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
    moment(produ.FIMPRO_COMPL, "DD/MM/YYYY").isValid() &&
    moment(produ.FIMPRO_COMPL, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD")
  ) {
    preco = Number(produ.PREPRO_COMPL);
  } else if (
    Number(produ.PREPRO) > 0 &&
    Number(produ.PREPRO) < Number(produ.PRECO) &&
    moment(produ.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
    moment(produ.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD")
  ) {
    preco = Number(produ.PREPRO);
  }

  const { maxParcela, parcelas } = Diversos.getParcelas(preco);

  const handleClickFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state.favoritos.includes(produ.CODIGO)) {
      dispatch({ type: "REMOVER_FAVORITO", payload: produ.CODIGO });
    } else {
      dispatch({ type: "ADICIONAR_FAVORITO", payload: produ.CODIGO });
    }
  };

  const handleClickAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let prepro = 0;

    if (
      Number(produ.PREPRO_COMPL) > 0 &&
      Number(produ.PREPRO_COMPL) < Number(produ.PRECO) &&
      moment(produ.INIPRO_COMPL, "DD/MM/YYYY").isValid() &&
      moment(produ.INIPRO_COMPL, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
      moment(produ.FIMPRO_COMPL, "DD/MM/YYYY").isValid() &&
      moment(produ.FIMPRO_COMPL, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD")
    ) {
      prepro = Number(produ.PREPRO_COMPL);
    } else if (
      Number(produ.PREPRO) > 0 &&
      Number(produ.PREPRO) < Number(produ.PRECO) &&
      moment(produ.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
      moment(produ.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD")
    ) {
      prepro = Number(produ.PREPRO);
    }

    if (algoliaReturn && algoliaReturn.queryID) {
      insights("convertedObjectIDsAfterSearch", {
        eventName: "Adicionou produto ao carrinho",
        index: algoliaReturn.index,
        objectIDs: [produ.CODIGO],
        positions: [indexPage],
        queryID: algoliaReturn.queryID,
      });
    }

    dispatch({ type: "ADICIONAR_AO_CARRINHO", payload: { ...produ, PREPRO: prepro, qtd: 1, FOTOS: produ.FOTOS, indexAlgolia: indexPage } });
    dispatch({ type: "SET_CART_OPEN", payload: true });
    Diversos.sendCartData(state.usuario?.codigo, [...state.carrinho, { ...produ, PRODUTO: produ.CODIGO, CODIGO: produ.CODIGO, qtd: 1, qty: 1 }]);
  };

  const calcDesconto = () => {
    let desconto = 0;

    if (Number(produ.PRECO) > Number(preco)) {
      desconto = Number(((produ.PRECO - preco) / produ.PRECO) * 100).toFixed(0);
    }

    return desconto;
  };

  const handleClick = (e) => {
    e.preventDefault();

    if (algoliaReturn && algoliaReturn.queryID) {
      sessionStorage.setItem("algoliaReturn", JSON.stringify({ ...algoliaReturn, indexNaPagina: indexPage }));

      insights("clickedObjectIDsAfterSearch", {
        eventName: "Clicou em produto",
        index: algoliaReturn.index,
        objectIDs: [produ.CODIGO],
        positions: [indexPage],
        queryID: algoliaReturn.queryID,
      });
    }

    // router.push(`/${Diversos.toSeoUrl(produ.NOME)}`);
    window.location.href = `/${Diversos.toSeoUrl(produ.NOME)}`;
  };

  return (
    <Card sx={{ ...styleContainerCard, ...sx }} onClick={handleClick}>
      <IconButton style={{ ...styleBtnAction, left: 10, zIndex: 3 }} size="small" onClick={handleClickFavorite}>
        {state.favoritos.includes(produ.CODIGO) ? <FavoriteIcon style={styleBtnActionIcon} /> : <FavoriteBorderIcon style={styleBtnActionIcon} />}
      </IconButton>

      {calcDesconto() > 0 ? <Typography style={{ ...styleTagDesconto, zIndex: 2 }}>{`-${calcDesconto()}%`}</Typography> : null}

      <Box sx={{ position: "relative", width: "100%", height: "200px", zIndex: 1 }}>
        {!produ.FOTOS || produ.FOTOS.length <= 0 ? (
          <OptimizedImage src="/produto-sem-imagem.png" width={200} height={200} alt={produ.NOME} sx={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <picture>
            <source
              srcSet={`${String(produ.FOTOS[0].link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${
                !produ.FOTOS || produ.FOTOS.length <= 0 ? "produto-sem-imagem.webp" : produ.FOTOS[0].link.replace(/\.[^/.]+$/, ".webp")
              }`}
              type="image/webp"
            />
            <img
              src={`${String(produ.FOTOS[0].link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${
                !produ.FOTOS || produ.FOTOS.length <= 0 ? "produto-sem-imagem.png" : produ.FOTOS[0].link
              }`}
              alt={produ.NOME}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              loading="lazy"
            />
          </picture>
        )}
      </Box>

      <CardContent sx={styleContainerCardContent}>
        {String(produ.NOMESUBGRUPO).trim().toLowerCase() === "desativados" || Number(produ.SUBGRUPO) === 999 && (
          <Button variant="contained" size="small" color="primary" sx={{ p: 0 }}>
            Outlet
          </Button>
        )}

        {Number(preco) === Number(produ.PREPRO_COMPL) && (
          <Button variant="outlined" size="small" color="success" sx={{ py: 0, px: 1 }}>
            Exclusivo Site
          </Button>
        )}

        <Typography variant="h6" component="div" sx={styleContainerCardContentTitle}>
          {Diversos.capitalizeSentece(String(produ.MARCA).toLowerCase())}
        </Typography>
        <Typography variant="h3" sx={styleContainerCardContentSubtitle}>
          {Diversos.capitalizeAllWords(String(produ.NOME).toLowerCase())}
        </Typography>
        <Typography variant="p" sx={{...styleContainerCardContentSubtitle, fontSize: "0.7rem", fontWeight: "500", textAlign: "left" }}>
          Cód.: {String(produ.CODIGO)}
        </Typography>
        <Box sx={{ height: 10 }} />
        <StarRating value={produ.RATIO} />
        <Box sx={{ height: 10 }} />
        <Box sx={styleContainerPrecoECompra}>
          {preco >= Number(produ.PRECO) ? (
            <Box sx={styleContainerCardPrice}>
              {parcelas && parcelas.length > 1 ? (
                <>
                  {/* sx={styleContainerCardPriceParcelado} */}
                  <Typography variant="h6" color="success" sx={{...styleContainerCardPricePor, color: "success.main", fontSize: {xs: "1.0rem", sm: "1.0rem", md: "1.2rem", lg: "1.2rem", xl: "1.2rem"}}}> 
                    {parcelas?.pop()?.labelAbrev}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{...styleContainerCardPriceDe, textDecoration: "none !important"}}>
                    {Diversos.maskPreco(preco)}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" color="primary" sx={styleContainerCardPricePor}>
                  {Diversos.maskPreco(preco)}
                </Typography>
              )}
              
            </Box>
          ) : (
            <Box sx={styleContainerCardPrice}>
              <Typography variant="h6" color="primary" sx={styleContainerCardPriceDe}>
                {Diversos.maskPreco(produ.PRECO)}
              </Typography>
              
              {parcelas && parcelas.length > 1 ? (
                <>
                  <Typography variant="h6" color="primary" sx={{...styleContainerCardPricePor, color: "success.main", fontSize: {xs: "1.0rem", sm: "1.0rem", md: "1.2rem", lg: "1.2rem", xl: "1.2rem"}}}>
                    {parcelas?.pop()?.labelAbrev}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{...styleContainerCardPriceDe, textDecoration: "none !important"}}>
                    {Diversos.maskPreco(preco)}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" color="primary" sx={styleContainerCardPricePor}>
                  {Diversos.maskPreco(preco)}
                </Typography>
              )}
            </Box>
          )}
        </Box>
        {(produ.FRETEGRATIS && produ.FRETEGRATIS === true) || preco >= 99.99 ? (
          <Typography variant="h6" color="primary" sx={styleContainerCardPriceFrete}>
            Frete grátis
          </Typography>
        ) : null}

        <Typography variant="h6" color="primary" sx={styleContainerCardPriceDescricao}>
          {Diversos.capitalizeSentece(String(produ.DESCRICAO1).toLowerCase())}
        </Typography>
      </CardContent>
      {produ.ESTOQUE > 0 ? (
        <Button variant="contained" color="primary" size="small" fullWidth onClick={handleClickAddToCart} sx={{...styleComprarBtn, width: "93%", my: 1, mx: 'auto', height: "35px", position: "absolute", bottom: 0, left: 0, right: 0}}>
          <ShoppingBagOutlinedIcon sx={{fontSize: "1rem", mr: 0.5}} />
          Comprar
        </Button>
      ) : (
        <Button variant="contained" color="secondary" size="small" fullWidth onClick={() => null} sx={{...styleComprarBtn, width: "93%", my: 1, mx: 'auto', height: "35px", position: "absolute", bottom: 0, left: 0, right: 0}} disabled>
          <ShoppingBagOutlinedIcon sx={{fontSize: "1rem", mr: 0.5}} />
          Indisponível
        </Button>
      )}
      
      {/* <CardActions className="styleContainerCardActions" sx={styleContainerCardActions}>
        
        <Button variant="text" color="dark" fullWidth size="small" sx={{ mt: 1 }} onClick={handleClick}>
          Veja mais
        </Button>
      </CardActions> */}
    </Card>
  );
}
