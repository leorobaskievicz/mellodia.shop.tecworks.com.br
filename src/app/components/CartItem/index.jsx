"use client";
import React, { useContext, useState, memo, useCallback } from "react";
import Image from "next/image";
import { Diversos } from "@/app/lib/diversos";
import { Box, Button, Grid, Typography, TextField, IconButton, Badge } from "@mui/material";
import { Delete as DeleteIcon, Remove as RemoveIcon, Add as AddIcon } from "@mui/icons-material";
// import swal from "sweetalert";
import { useApp } from "@/app/context/AppContext";

// Componente de imagem otimizado
const OptimizedImage = memo(({ src, alt, width, height, className, priority = false }) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    loading={priority ? "eager" : "lazy"}
    quality={75}
    placeholder="blur"
    style={{ objectFit: "cover", maxWidth: "100%", maxHeight: "100%" }}
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLzY3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzb/2wBDAR0dHh4eHRoaHSQtJSEkLzYvLy0vLzY3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzb/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
  />
));

OptimizedImage.displayName = "OptimizedImage";

const CartItem = memo((props) => {
  const { state: stateApp, dispatch: dispatchApp } = useApp();
  const [quantity, setQuantity] = useState(props.item.qtd);

  const handleQuantityChange = useCallback(
    (event) => {
      const newQuantity = parseInt(event.target.value);
      if (!isNaN(newQuantity) && newQuantity > 0) {
        setQuantity(newQuantity);
        dispatchApp({
          type: "ATUALIZAR_CARRINHO",
          payload: {
            ...props.item,
            qtd: newQuantity,
          },
        });
      }
    },
    [props.item, dispatchApp]
  );

  const handleIncrement = useCallback(() => {
    if (quantity + 1 <= Number(props.item.ESTOQUE)) {
      setQuantity(quantity + 1);
      dispatchApp({
        type: "ATUALIZAR_CARRINHO",
        payload: {
          ...props.item,
          qtd: quantity + 1,
        },
      });

      setTimeout(() => {
        Diversos.sendCartData(stateApp.usuario?.codigo, stateApp.carrinho);
      }, 1000);
    }
  }, [quantity, props.item, dispatchApp]);

  const handleDecrement = useCallback(() => {
    if (quantity - 1 > 0) {
      setQuantity(quantity - 1);
      dispatchApp({
        type: "ATUALIZAR_CARRINHO",
        payload: {
          ...props.item,
          qtd: quantity - 1,
        },
      });

      setTimeout(() => {
        Diversos.sendCartData(stateApp.usuario?.codigo, stateApp.carrinho);
      }, 1000);
    }
  }, [quantity, props.item, dispatchApp]);

  const handleRemove = useCallback(() => {
    dispatchApp({
      type: "REMOVER_DO_CARRINHO",
      payload: props.item,
    });

    setTimeout(() => {
      Diversos.sendCartData(stateApp.usuario?.codigo, stateApp.carrinho);
    }, 1000);

    if (window && window.dataLayer) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "remove_from_cart",
        ecommerce: {
          items: [
            {
              item_name: props.item.NOME, // Name or ID is required.
              item_id: props.item.CODIGO,
              quantity: props.item.qtd,
            },
          ],
        },
      });
    }
  }, [props.item, dispatchApp]);

  let tipoPromo = 0;
  let preco1 = 0;
  const preco2 = 0;
  const preco3 = 0;
  const preco4 = 0;
  const preco5 = 0;
  let precoFinal = 0;

  if (props.item && props.item.promo) {
    if (props.item.promo.CDPRODU1 && !props.item.promo.CDPRODU2 && !props.item.promo.CDPRODU3 && !props.item.promo.CDPRODU4 && !props.item.promo.CDPRODU5) {
      tipoPromo = 1;
      preco1 = props.item.promo.CDDESC1 > 0 ? props.item.PRECO - props.item.PRECO * (props.item.promo.CDDESC1 / 100) : props.item.promo.CDPRECO1;
      precoFinal = preco1 * props.item.promo.CDQTD1;
    } else if (props.item.promo.CDPRODU1 && props.item.promo.CDPRODU2 && !props.item.promo.CDPRODU3 && !props.item.promo.CDPRODU4 && !props.item.promo.CDPRODU5) {
      tipoPromo = 2;
      preco1 = props.item.promo.CDDESC1 > 0 ? props.item.PRECO - props.item.PRECO * (props.item.promo.CDDESC1 / 100) : props.item.promo.CDPRECO1;
      precoFinal = preco1 * props.item.promo.CDQTD1;
    } else if (props.item.promo.CDPRODU1 && props.item.promo.CDPRODU2 && props.item.promo.CDPRODU3 && !props.item.promo.CDPRODU4 && !props.item.promo.CDPRODU5) {
      tipoPromo = 3;
      preco1 = props.item.promo.CDDESC1 > 0 ? props.item.PRECO - props.item.PRECO * (props.item.promo.CDDESC1 / 100) : props.item.promo.CDPRECO1;
      precoFinal = preco1 * props.item.promo.CDQTD1;
    } else if (props.item.promo.CDPRODU1 && props.item.promo.CDPRODU2 && props.item.promo.CDPRODU3 && props.item.promo.CDPRODU4 && !props.item.promo.CDPRODU5) {
      tipoPromo = 4;
      preco1 = props.item.promo.CDDESC1 > 0 ? props.item.PRECO - props.item.PRECO * (props.item.promo.CDDESC1 / 100) : props.item.promo.CDPRECO1;
      precoFinal = preco1 * props.item.promo.CDQTD1;
    } else if (props.item.promo.CDPRODU1 && props.item.promo.CDPRODU2 && props.item.promo.CDPRODU3 && props.item.promo.CDPRODU4 && props.item.promo.CDPRODU5) {
      tipoPromo = 5;
      preco1 = props.item.promo.CDDESC1 > 0 ? props.item.PRECO - props.item.PRECO * (props.item.promo.CDDESC1 / 100) : props.item.promo.CDPRECO1;
      precoFinal = preco1 * props.item.promo.CDQTD1;
    }
  }

  return (
    <Box>
      <Grid container className="cart-item-container" sx={{ mx: 0, px: 0, width: "100%" }}>
        <Grid item xs={3} className="cart-item-img-container">
          <Box sx={{ position: "relative", pr: 1 }}>
            <picture>
              <source
                srcSet={`${
                  !props.item.FOTOS || props.item.FOTOS.length <= 0
                    ? "https://dricor.cdn.tecworks.com.br/produto-sem-imagem.webp"
                    : String(props.item.FOTOS[0].link).indexOf("https://dricor.cdn.tecworks") > -1
                    ? props.item.FOTOS[0].link.replace(/\.[^/.]+$/, ".webp")
                    : "https://dricor.cdn.tecworks.com.br/" + props.item.FOTOS[0].link.replace(/\.[^/.]+$/, ".webp")
                }`}
                type="image/webp"
              />
              <img
                src={`${
                  !props.item.FOTOS || props.item.FOTOS.length <= 0
                    ? "https://dricor.cdn.tecworks.com.br/produto-sem-imagem.png"
                    : String(props.item.FOTOS[0].link).indexOf("https://dricor.cdn.tecworks") > -1
                    ? props.item.FOTOS[0].link.replace(/\.[^/.]+$/, ".webp")
                    : "https://dricor.cdn.tecworks.com.br/" + props.item.FOTOS[0].link
                }`}
                alt={props.item.NOME}
                loading="lazy"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  maxWidth: "100%",
                }}
              />
            </picture>
          </Box>
        </Grid>

        <Grid item xs={9} sx={{ pl: 1.25, textAlign: "left" }}>
          <Box sx={{ mx: 0 }}>
            <Typography variant="body1" className="cart-item-name" sx={{ fontSize: "14px", fontWeight: "bold", color: "#000", textAlign: "left" }}>
              {props.item.NOME}
              <small>{props.item.complemento}</small>
            </Typography>
            {/* {props.item.promo && props.item.promo.CDPROMOCAO && (
              <Badge color="secondary" sx={{ mt: 1 }}>
                Kit promocional
              </Badge>
            )} */}
          </Box>
          <Grid container sx={{ mx: 0 }}>
            <Grid item xs={3}>
              <Typography variant="caption" component="span">
                SKU:
              </Typography>
              <Typography variant="body2" className="cart-item-price">
                {props.item.CODIGO}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body2" className="cart-item-price">
                {props.item.PRECO && props.item.PRECO > props.item.PREPRO && props.item.PREPRO > 0 ? (
                  <>
                    <Typography variant="caption" component="span">
                      De R$ {Diversos.number_format(props.item.PRECO, 2, ",", "")}
                    </Typography>
                    <br />
                    Por R$ {Diversos.number_format(props.item.PREPRO, 2, ",", "")}
                  </>
                ) : (
                  `R$ ${Diversos.number_format(props.item.PRECO, 2, ",", "")} `
                )}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <IconButton color="error" title="Excluir item do carrinho" className="cart-item-remove" onClick={handleRemove}>
                <DeleteIcon className="cart-item-action" title="Excluir item" />
              </IconButton>
            </Grid>
          </Grid>
          <Box sx={{ mx: "auto", width: "75%", mt: 1 }}>
            <Box className="cart-item-actions">
              <Box className="cart-item-actions-update">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton size="small" onClick={handleDecrement} sx={{ mr: 1 }} color="error">
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    type="number"
                    size="small"
                    value={quantity}
                    onChange={handleQuantityChange}
                    inputProps={{
                      min: 1,
                      max: props.item.ESTOQUE,
                      step: 1,
                    }}
                    onKeyDown={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    sx={{
                      width: "90px",
                      fontSize: "12px",
                      "& input": {
                        textAlign: "center",
                        py: 0.5,
                      },
                    }}
                  />
                  <IconButton size="small" onClick={handleIncrement} sx={{ ml: 1 }} color="success">
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: "1px solid #dee2e6", my: 2 }} />
    </Box>
  );
});

CartItem.displayName = "CartItem";

export default CartItem;
