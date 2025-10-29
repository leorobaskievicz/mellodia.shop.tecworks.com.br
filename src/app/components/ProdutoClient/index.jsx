"use client";

import { useState, useEffect, memo, useMemo, useCallback, useRef } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  ImageList,
  ImageListItem,
  Breadcrumbs,
  useMediaQuery,
  Table,
  TableRow,
  TableCell,
  Tooltip,
  CircularProgress,
  TextField,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
  IconButton,
  TableContainer,
  TableHead,
  TableBody,
  Paper,
  Divider
} from "@mui/material";
import dynamic from "next/dynamic";
import { grey, green } from "@mui/material/colors";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MopedIcon from '@mui/icons-material/Moped';
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FireTruckIcon from "@mui/icons-material/FireTruck";
import Link from "next/link";
import { lazy } from "react";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import Image from "next/image";
import moment from "moment";
import { Diversos } from "@/app/lib/diversos";
import { getFrete, getProdutosRecomendados, getProdutosSimilares } from "@/app/lib/funcoes";
import StarRating from "@/app/components/StarRating";
import ResponsiveBreadcrumb from "@/app/components/ResponsiveBreadcrumb";
import { styleContainer, styleContainerBody, styleContainerBreadcrumb, styleBtnAction, styleBtnActionIcon } from "./style";
import { useApp } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import ZoomImage from "@/app/components/ZoomImage";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


// import Comentario from "@/app/components/Comentarios";
const Comentario = dynamic(() => import("@/app/components/Comentarios"), { ssr: false });

const LazySliderCardProdu = lazy(() => import("@/app/components/SliderCardProdu"));

// Componente de imagem otimizado
const OptimizedImage = memo(({ src, alt, width, height, className, priority = false, sx = {} }) => (
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
    className={className}
    loading={priority ? "eager" : "lazy"}
    quality={75}
    placeholder="blur"
    style={sx ? sx : {}}
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLzY3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzb/2wBDAR0dHh4eHRoaHSQtJSEkLzYvLy0vLzY3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzb/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
  />
));

OptimizedImage.displayName = "OptimizedImage";

// Componente de Link otimizado
const OptimizedLink = memo(({ href, children, className, onClick }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      if (onClick) onClick(e);

      setIsLoading(true);

      // Pré-carrega a página antes de navegar
      router.prefetch(href);

      // Navegação com feedback visual
      const startTime = performance.now();
      router.push(href).then(() => {
        const endTime = performance.now();
        console.log(`Navegação concluída em ${endTime - startTime}ms`);
        setIsLoading(false);
      });
    },
    [href, onClick, router]
  );

  return (
    <>
      <Link href={href} className={className} onClick={handleClick} prefetch={true}>
        {children}
      </Link>
      {isLoading && <LoadingIndicator />}
    </>
  );
});

OptimizedLink.displayName = "OptimizedLink";

// Componente de características
const Caracteristicas = memo(({ produto }) => {
  return (
    <Table dense size="small" sx={{ mx: "auto", width: "95%", mt: 3 }}>
      <TableRow>
        {produto.MENU1_NOME ? (
          <TableCell colSpan={2}>
            <strong style={{ marginRight: 10 }}>Categoria</strong>
            <span>
              <OptimizedLink href={`/departamento/${Diversos.toSeoUrl(produto.MENU1_NOME)}`}>{Diversos.capitalize(produto.MENU1_NOME)}</OptimizedLink>
              {produto.MENU2_NOME ? (
                <OptimizedLink href={`/departamento/${Diversos.toSeoUrl(produto.MENU1_NOME)}/${Diversos.toSeoUrl(produto.MENU2_NOME)}`}>
                  {` / ${Diversos.capitalize(produto.MENU2_NOME)}`}
                </OptimizedLink>
              ) : null}
              {produto.MENU3_NOME ? (
                <OptimizedLink href={`/departamento/${Diversos.toSeoUrl(produto.MENU1_NOME)}/${Diversos.toSeoUrl(produto.MENU2_NOME)}/${Diversos.toSeoUrl(produto.MENU3_NOME)}`}>
                  {` / ${Diversos.capitalize(produto.MENU3_NOME)}`}
                </OptimizedLink>
              ) : null}
            </span>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        {produto.MARCA ? (
          <TableCell>
            <strong style={{ marginRight: 10 }}>Marca</strong>
            <span>
              <OptimizedLink href={`/marca/${Diversos.toSeoUrl(produto.MARCA)}`}>{Diversos.capitalize(produto.MARCA)}</OptimizedLink>
            </span>
          </TableCell>
        ) : null}
        {produto.NOMEGRUPO ? (
          <TableCell>
            <strong style={{ marginRight: 10 }}>Categoria</strong>
            <span>{`${Diversos.capitalize(produto.NOMEGRUPO)}`}</span>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        {produto.SUBGRUPO ? (
          <TableCell>
            <strong style={{ marginRight: 10 }}>Sub-Categoria</strong>
            <span>{`${Diversos.capitalize(produto.SUBGRUPO)}`}</span>
          </TableCell>
        ) : null}
        {produto.BARRA ? (
          <TableCell>
            <strong style={{ marginRight: 10 }}>EAN</strong>
            <span>{`${produto.BARRA}`}</span>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        {produto.NCM ? (
          <TableCell>
            <strong style={{ marginRight: 10 }}>NCM</strong>
            <span>{`${produto.NCM}`}</span>
          </TableCell>
        ) : null}
        {produto.PESO ? (
          <TableCell>
            <strong style={{ marginRight: 10 }}>Peso</strong>
            <span>{`${Math.round(Number(produto.PESO) * 1000)}g`}</span>
          </TableCell>
        ) : null}
      </TableRow>
      <TableRow>
        {produto.CODIGO ? (
          <TableCell colSpan={2}>
            <strong style={{ marginRight: 10 }}>Código</strong>
            <span>{`${produto.CODIGO}`}</span>
          </TableCell>
        ) : null}
      </TableRow>
    </Table>
  );
});

Caracteristicas.displayName = "Caracteristicas";

const renderKits = (produto, kits) => {
  return (
    <Box sx={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", mt: 1, scrollBehavior: "smooth", "&::-webkit-scrollbar": { display: "none" } }}>
      {kits.length > 0 ? (
        <>
          {kits.length === 1 && Number(kits[0].PRODUTO) === Number(produto.CODIGO) ? (
            <span className="variacao-title">Compre também individual</span>
          ) : (
            <span className="variacao-title">Compre também nos kits</span>
          )}
          <hr />
          <Box
            sx={{
              width: "auto",
              maxWidth: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexWrap: "no-wrap",
              overflowX: "auto",
              scrollBehavior: "smooth",
              "&::-webkit-scrollbar": { display: "none" },
            }}
            id="kits-container"
          >
            {kits.length === 1 && Number(kits[0].PRODUTO) === Number(produto.CODIGO)
              ? kits[0].itens.map((q, idx) =>
                  !q.itemDados ? null : (
                    <Tooltip key={`variacao-${idx}`} title={q.itemDados?.NOME} arrow placement="top">
                      <a href={`/${Diversos.toSeoUrl(q.itemDados?.NOME)}`} target="_self">
                        <div className="variacao-btn">
                          <OptimizedImage
                            src={
                              q.itemDados && q.itemDados.FOTOS && q.itemDados.FOTOS.length > 0
                                ? `${String(q.itemDados.FOTOS[0].link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${
                                    q.itemDados.FOTOS[0].link
                                  }`
                                : `https://dricor.cdn.tecworks.com.br/produto-sem-foto.png`
                            }
                            width={700}
                            height={700}
                            alt={q.itemDados?.NOME}
                            className="variacao-btn-img"
                          />
                          <hr />

                          {
                            Number(q.itemDados?.PREPRO_COMPL) > 0 && 
                            Number(q.itemDados?.PREPRO_COMPL) < Number(q.itemDados?.PRECO) &&
                            moment(q.itemDados?.INIPRO_COMPL, "DD/MM/YYYY").isValid() &&
                            moment(q.itemDados?.INIPRO_COMPL, "DD/MM/YYYY").isSameOrBefore(moment()) &&
                            moment(q.itemDados?.FIMPRO_COMPL, "DD/MM/YYYY").isValid() &&
                            moment(q.itemDados?.FIMPRO_COMPL, "DD/MM/YYYY").isSameOrAfter(moment())
                          ? (
                            <div className="variacao-btn-price">
                              <span>{Diversos.maskPreco(Number(q.itemDados?.PRECO).toFixed(2))}</span>
                              {Diversos.maskPreco(Number(q.itemDados?.PREPRO_COMPL).toFixed(2))}
                              {Diversos.getParcelas(q.itemDados?.PREPRO_COMPL, false).parcelas.length > 1 && (
                                <p className="variacao-btn-price-installment">{Diversos.getParcelas(q.itemDados?.PREPRO_COMPL, false).parcelas.pop().label} </p>
                              )}
                            </div>
                          ) : 
                          Number(q.itemDados?.PREPRO) > 0 && 
                          Number(q.itemDados?.PREPRO) < Number(q.itemDados?.PRECO) &&
                          moment(q.itemDados?.INIPRO, "DD/MM/YYYY").isValid() &&
                          moment(q.itemDados?.INIPRO, "DD/MM/YYYY").isSameOrBefore(moment()) &&
                          moment(q.itemDados?.FIMPRO, "DD/MM/YYYY").isValid() &&
                          moment(q.itemDados?.FIMPRO, "DD/MM/YYYY").isSameOrAfter(moment())
                          ? (
                            <div className="variacao-btn-price">
                              <span>{Diversos.maskPreco(Number(q.itemDados?.PRECO).toFixed(2))}</span>
                              {Diversos.maskPreco(Number(q.itemDados?.PREPRO).toFixed(2))}
                              {Diversos.getParcelas(q.itemDados?.PREPRO, false).parcelas.length > 1 && (
                                <p className="variacao-btn-price-installment">{Diversos.getParcelas(q.itemDados?.PREPRO, false).parcelas.pop().label} </p>
                              )}
                            </div>
                          ) : (
                            <div className="variacao-btn-price">
                              {Diversos.maskPreco(Number(q.itemDados?.PRECO).toFixed(2))}
                              {Diversos.getParcelas(q.itemDados?.PRECO, false).parcelas.length > 1 && (
                                <p className="variacao-btn-price-installment">{Diversos.getParcelas(q.itemDados?.PRECO, false).parcelas.pop().label.replace("Ou até", "Ou")} </p>
                              )}
                            </div>
                          )}
                        </div>
                      </a>
                    </Tooltip>
                  )
                )
              : kits.map((q, idx) => (
                  <Tooltip key={`variacao-${idx}`} placement="top" arrow title={q.produtoDados?.NOME}>
                    <a href={`/${Diversos.toSeoUrl(q.produtoDados?.NOME)}`} target="_self">
                      <div className="variacao-btn">
                        <OptimizedImage
                          src={`${String(q.produtoDados.FOTOS[0].link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${
                            q.produtoDados.FOTOS[0].link
                          }`}
                          width={700}
                          height={700}
                          alt={q.produtoDados?.NOME}
                          className="variacao-btn-img"
                        />
                        <hr />

                        {Number(q.produtoDados?.PREPRO) > 0 && Number(q.produtoDados?.PREPRO) < Number(q.produtoDados?.PRECO) ? (
                          <div className="variacao-btn-price">
                            <span>{Diversos.maskPreco(Number(q.produtoDados?.PRECO).toFixed(2))}</span>
                            {Diversos.maskPreco(Number(q.produtoDados?.PREPRO).toFixed(2))}
                            {Diversos.getParcelas(q.produtoDados?.PREPRO, false).parcelas.length > 1 && (
                              <p className="variacao-btn-price-installment">{Diversos.getParcelas(q.produtoDados?.PREPRO, false).parcelas.pop().label} </p>
                            )}
                          </div>
                        ) : (
                          <div className="variacao-btn-price">
                            {Diversos.maskPreco(Number(q.produtoDados?.PRECO).toFixed(2))}
                            {Diversos.getParcelas(q.produtoDados?.PRECO, false).parcelas.length > 1 && (
                              <p className="variacao-btn-price-installment">{Diversos.getParcelas(q.produtoDados?.PRECO, false).parcelas.pop().label.replace("Ou até", "Ou")} </p>
                            )}
                          </div>
                        )}
                      </div>
                    </a>
                  </Tooltip>
                ))}
          </Box>
        </>
      ) : null}
    </Box>
  );
};

const renderVariacoes = (produto, variacoes, setSelectedImage, setSelectedVariacao, selectedVariacao) => {
  return (
    <Box sx={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", mt: 1 }}>
      {variacoes && variacoes.variants && variacoes.variants.length > 0 ? (
        <>
          <Typography variant="h6" component="div" gutterBottom color="primary">
            Escolha uma das opções de {Diversos.capitalize(variacoes.variants[0].variants[0].attribute_name)}:
          </Typography>
          <Box sx={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", gap: 2, overflowX: "auto", py: 1 }}>
            {variacoes.variants.map((aux, auxIdx) =>
              aux.variants.map((item, idx) => {
                const hasImage = !!item.image;
                return (
                  <Tooltip key={`tooltip-variacao-${idx}`} title={item.attribute_value} arrow>
                    <Box
                      key={`variacao-${idx}`}
                      sx={{
                        width: 80,
                        height: 80,
                        border: Number(selectedVariacao) === Number(item.id) ? "3px solid primary.main" : "2px solid #e0e0e0",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        backgroundColor: "#fff",
                        cursor: hasImage ? "pointer" : "default",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxShadow: 1,
                        ":hover": {
                          borderColor: "primary.main",
                          boxShadow: 3,
                        },
                        mx: 0,
                      }}
                      onClick={() => {
                        if (hasImage && setSelectedImage && item.image) {
                          setSelectedImage(item.image);
                          setSelectedVariacao(item.id);
                        }
                      }}
                    >
                      {hasImage ? (
                        <OptimizedImage
                          src={`https://dricor.cdn.tecworks.com.br/${item.image}`}
                          width={48}
                          height={48}
                          alt={item.attribute_value}
                          style={{ objectFit: "contain", maxWidth: 48, maxHeight: 48 }}
                        />
                      ) : (
                        <Typography variant="body2" component="div" color="primary" sx={{ textAlign: "center", px: 1 }}>
                          {item.attribute_value}
                        </Typography>
                      )}
                    </Box>
                  </Tooltip>
                );
              })
            )}
          </Box>
        </>
      ) : null}
    </Box>
  );
};

const renderCardFrete = (cep, setCep, fretes, calcularFrete, freteIsLoading) => {

  // REGRAS PARA O EXPRESSO
  const dataAtu = moment().utcOffset("-03:00");
  const dataLimMin = moment().utcOffset("-03:00").set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  const dataLimMax = moment().utcOffset("-03:00").set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
  const diffMinTotal = dataLimMax.diff(dataAtu, "minutes");
  const diffHoras = Math.floor(diffMinTotal / 60);
  const diffMinutos = diffMinTotal % 60;
  const fgDentroHorario = dataAtu.isBetween(dataLimMin, dataLimMax, null, '[)');
  const fgDiaUtil = !['sat', 'sun'].includes(dataAtu.format("ddd").toLowerCase());
  const fgMostraEntreExpressa = fgDentroHorario && fgDiaUtil;

  // REGRAS DO MOTOBOY
  const dataHoje = moment().utcOffset("-03:00");
  const diaSemana = dataHoje.isoWeekday(); // 1 = segunda, 7 = domingo
  let textoEntrega = "Receba amanhã!";
  let textoSub = "Comprando agora você recebe seu pedido amanhã!";

  if (diaSemana === 5 || diaSemana === 6) {
    // Sexta (5) ou Sábado (6)
    textoEntrega = "Receba na segunda-feira!";
    textoSub = "Comprando agora você recebe seu pedido na segunda-feira!";
  } else if (diaSemana === 7) {
    // Domingo (7)
    textoEntrega = "Receba amanhã!";
    textoSub = "Comprando agora você recebe seu pedido amanhã!";
  }

  return (
    <>
      {
        fgMostraEntreExpressa ? (
          <Box sx={{ position: "relative", width: "100%", height: 70, mt: 1, mb: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderWidth: 1, borderStyle: "solid", borderColor: green[800], borderRadius: 1, p: 1 }}>
            <Typography variant="body2" component="p" gutterBottom sx={{ fontSize: "1.45rem", py: 0, my: 0, fontWeight: "700", color: green[800], textAlign: "center" }}>
              Receba em 2 horas!
            </Typography>
            <Typography variant="body2" component="p" gutterBottom sx={{ fontSize: "1.0rem", py: 0, my: 0, fontWeight: "400", color: grey[700], textAlign: "center", mb: 0 }}>
              {`Comprando dentro das próximas ${diffHoras}h ${diffMinutos}min`}
            </Typography>
            <RocketLaunchIcon sx={{ fontSize: "2.2rem", color: green[800], position: "absolute", top: 15, right: 15 }} />
          </Box>
        ) : (
          <Box sx={{ position: "relative", width: "100%", height: 70, mt: 1, mb: 2, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderWidth: 1, borderStyle: "solid", borderColor: green[800], borderRadius: 1, p: 1 }}>
            <Typography variant="body2" component="p" gutterBottom sx={{ fontSize: "1.45rem", py: 0, my: 0, fontWeight: "700", color: green[800], textAlign: "center" }}>
              {textoEntrega}
              <Typography variant="body2" component="p" gutterBottom sx={{ fontSize: "1.0rem", py: 0, my: 0, fontWeight: "400", color: grey[700], textAlign: "center", mb: 0 }}>
                {textoSub}
              </Typography>
            </Typography>
            <MopedIcon sx={{ fontSize: "2.2rem", color: green[800], position: "absolute", top: 15, right: 15 }} />
          </Box>
        )
      }
      <Card sx={{ width: "100%", mx: "auto", mt: 0, p: 0, pl: 1.5, textAlign: "center" }}>
        <CardContent sx={{ width: "100%", p: 0 }}>
          <Typography variant="h6" component="div" gutterBottom>
            <FireTruckIcon sx={{ mr: 1 }} />
            Simule seu Frete
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Digite seu CEP para calcular o valor do frete.
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 4, justifyContent: "center" }}>
            <TextField label="Digite seu CEP" variant="outlined" size="small" value={cep} onChange={(e) => setCep(e.target.value)} sx={{ width: "60%" }} />
            <Button variant="contained" onClick={calcularFrete} type="button">
              Calcular
            </Button>
          </Box>
          {freteIsLoading ? (
            <CircularProgress color="primary" size={24} />
          ) : (
            fretes &&
            fretes.length > 0 &&
            fretes.map((row, idx) => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderBottomWidth: idx === fretes.length - 1 ? 0 : 1,
                  borderBottomStyle: "solid",
                  borderBottomColor: grey[400],
                }}
              >
                <Typography variant="body2" sx={{ flex: 6, textAlign: "left", fontWeight: "bold", fontSize: 12, fontFamily: "Jost", color: "primary" }}>
                  {row.nome}
                </Typography>
                <Box
                  sx={{
                    flex: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "normal", fontSize: 12, fontFamily: "Jost", color: "black" }}>
                    {`Receba até:`}
                  </Typography>
                  {
                    moment().format("DD/MM/YYYY") === row.prazo
                    ? <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "700", fontSize: 14, fontFamily: "Jost", color: "green" }}>{String(row.nome).toLowerCase().indexOf('retira') > -1 ? "RETIRE" : "RECEBA"} AINDA HOJE</Typography>
                    : <Typography variant="body2" sx={{ textAlign: "center", fontWeight: "normal", fontSize: 12, fontFamily: "Jost", color: "black" }}>
                      {row.prazo}
                    </Typography>
                  }
                </Box>
                <Box
                  sx={{
                    flex: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="body2" sx={{ textAlign: "right", fontWeight: "normal", fontSize: 12, fontFamily: "Jost", color: "black" }}>
                    {`Valor:`}
                  </Typography>
                  {Number(row.preco) <= 0 ? (
                    <Typography variant="body2" sx={{ textAlign: "right", fontWeight: "bold", fontSize: 14, fontFamily: "Jost", color: "green" }}>
                      Grátis
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ textAlign: "right", fontWeight: "normal", fontSize: 12, fontFamily: "Jost", color: "black" }}>
                      {Diversos.maskPreco(row.preco)}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
};

const renderCardBeneficios = () => {
  return (
    <>
      <Card sx={{ width: "100%", mx: "auto", mt: 2, p: 1.5, textAlign: "center", backgroundColor: grey[100] }}>
        <CardContent sx={{ width: "100%", p: 0 }}>
          <Typography variant="h6" component="div" gutterBottom sx={{ fontSize: "1.5rem", fontWeight: "700", color: grey[600] }}>
            Benefícios Diva Para Você
          </Typography>
          <Box className="blink" sx={{ width: "100%", borderRadius: 1, backgroundColor: "primary.main", height: 45, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" component="p" gutterBottom sx={{ fontSize: "1.0rem", fontWeight: "500", color: "white", textAlign: "center" }}>
              GANHE FRETE GRÁTIS ACIMA DE R$ 99
            </Typography>
          </Box>
          <Typography variant="body2" component="div" gutterBottom sx={{ fontSize: "0.8rem", fontWeight: "500", color: grey[600], my: 1, pl: 0.5, textAlign: "left" }}>
            Válido para Sul e Sudeste.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: '100%', borderColor: "primary.main", borderWidth: 1, borderStyle: "dotted", borderRadius: 1, height: 42, backgroundColor: "white" }}>
              <Typography variant="body2" component="div" gutterBottom sx={{ fontSize: "1.0rem", fontWeight: "500", color: "primary.main", textAlign: "center", textTransform: "uppercase" }}>
                CUPOM: DIVABRINDE
              </Typography>
            </Box>
            <Button variant="contained" color="primary" size="large">Copiar</Button>
          </Box>
          <Typography variant="body2" component="div" gutterBottom sx={{ fontSize: "0.8rem", fontWeight: "500", color: grey[600], my: 1, pl: 0.5, textAlign: "left" }}>
            Cupom válido em sua 1ª compra.
          </Typography>
          <Typography variant="h6" component="div" gutterBottom sx={{ fontSize: "1.6rem", fontWeight: "700", color: grey[600] }}>
            BRINDE SURPRESA
          </Typography>
          <Image src="/christmas-min.png" alt="Brinde Surpresa" width={100} height={100} />
          <Typography variant="body2" component="div" gutterBottom sx={{ fontSize: "1.1rem", fontWeight: "500", color: grey[600], my: 1, pl: 0.5, textAlign: "center" }}>
            Esta compra te dá um brinde surpresa!
          </Typography>
          <Typography variant="body2" component="div" gutterBottom sx={{ fontSize: "1.1rem", fontWeight: "500", color: grey[600], mt: 1, mb: 0, textAlign: "center" }}>
            Válido por transação.
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

const ProdutoClient = memo(({ children, produto, menu1, menu2, menu3, similares, similaresMarcas, kits, variacoes }) => {
  if (!produto || !produto.CODIGO) {
    return null;
  }

  const { state: stateContext, dispatch: dispatchContext } = useApp();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedImage, setSelectedImage] = useState(produto && produto.FOTOS && produto.FOTOS.length > 0 ? produto.FOTOS[0].link : "");
  const comprarRef = useRef(null);
  const comprarMobileRef = useRef(null);
  const [state, setState] = useState({
    menu1: menu1,
    menu2: menu2,
    menu3: menu3,
    showFixedButton: false,
    favHover: false,
    activeIndex: 0,
    email: "",
    notifyHasError: false,
    notifyHasErrorMsg: "",
    notifyHasSuccess: false,
    notifyHasSuccessMsg: "",
    notifyIsLoading: false,
    freteCep: stateContext.cep ? stateContext.cep : "",
    freteIsLoading: false,
    freteHasError: false,
    freteHasErrorMsg: "",
    freteData: [],
    infoOpen: false,
    estoqueModal: false,
    quantity: 1,
    similarIsLoading: false,
    similarData: similares,
    similarHasError: false,
    similarHasErrorMsg: false,
    similarMarcaIsLoading: false,
    similarMarcaData: similaresMarcas,
    similarMarcaHasError: false,
    similarMarcaHasErrorMsg: false,
    variacoesIsLoading: false,
    variacoes: variacoes,
    variacaoSelected: "",
    kitsIsLoading: false,
    kits: kits,
    depoimentosIsLoading: false,
    depoimentos: [],
    estoques: [],
    estoquesIsLoading: false,
    algoliaReturn: null,
    recommendData: [],
    recommendIsLoading: false,
    similarData: [],
    similarIsLoading: false,
  });
  const [selectedVariacao, setSelectedVariacao] = useState(-1);
  const [hasScroll, setHasScroll] = useState(false);
  const [btnComprarFixedHide, setBtnComprarFixedHide] = useState(false);

  const handleAddCart = useCallback(() => {
    const variacaoSelecionada = variacoes?.variants?.[0]?.variants?.find((x) => x.id === selectedVariacao);
    let fotos = produto.FOTOS;

    if (variacaoSelecionada && variacaoSelecionada.id) {
      fotos = [{ link: variacaoSelecionada.image }];
    }

    console.log(produto);

    let prepro = 0;

    if (
      produto.COMPLEMENTO && 
      Number(produto.COMPLEMENTO.PRECO) > 0 &&
      Number(produto.COMPLEMENTO.PRECO) < Number(produto.PRECO) &&
      moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").isValid() &&
      moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
      moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").isValid() &&
      moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD")
    ) {
      prepro = Number(produto.COMPLEMENTO.PRECO);
    } else if (
      Number(produto.PREPRO) > 0 &&
      Number(produto.PREPRO) < Number(produto.PRECO) &&
      moment(produto.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
      moment(produto.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD")
    ) {
      prepro = Number(produto.PREPRO);
    }

    dispatchContext({
      type: "ADICIONAR_AO_CARRINHO",
      payload: {
        ...produto,
        PREPRO: prepro,
        qtd: 1,
        FOTOS: fotos,
        complemento: variacaoSelecionada && variacaoSelecionada.id ? `${variacaoSelecionada.attribute_name}: ${variacaoSelecionada.attribute_value}` : null,
        indexAlgolia: state.algoliaReturn?.indexNaPagina || 0,
      },
    });

    dispatchContext({
      type: "SET_CART_OPEN",
      payload: true,
    });

    Diversos.sendCartData(stateContext.usuario?.codigo, [...stateContext.carrinho, { ...produto, PRODUTO: produto.CODIGO, CODIGO: produto.CODIGO, qtd: 1, qty: 1 }]);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: [
          {
            item_name: produto.NOME, // Name or ID is required.
            item_id: produto.CODIGO,
            price: produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO,
            item_brand: produto.MARCA,
            item_category: produto.NOMEGRUPO,
            quantity: 1,
          },
        ],
      },
    });

    if (window && window.fbq) {
      window.fbq("track", "AddToCart");
    }

    if (state.algoliaReturn && state.algoliaReturn.queryID) {
      insights("convertedObjectIDsAfterSearch", {
        eventName: "Adicionou produto ao carrinho",
        index: state.algoliaReturn.index,
        objectIDs: [produto.CODIGO],
        positions: [state.algoliaReturn.indexNaPagina || 0],
        queryID: state.algoliaReturn.queryID,
      });
    }
  }, [produto, dispatchContext]);

  const getShippingModes = useCallback(
    (tmpCep = null) => {
      setState((state) => ({
        ...state,
        freteIsLoading: true,
      }));
      getFrete(tmpCep !== null ? tmpCep : state.freteCep, [
        {
          codigo: produto.CODIGO,
          qtd: 1,
        },
      ])
        .then((data) => {
          setState((state) => ({ ...state, freteData: data }));
        })
        .catch((error) => {
          console.error("Erro ao calcular frete:", error);
          setState((state) => ({
            ...state,
            freteData: [],
            freteHasError: true,
            freteHasErrorMsg: error.message,
          }));
        })
        .finally(() => {
          setState((state) => ({
            ...state,
            freteIsLoading: false,
          }));
        });
    },
    [produto.CODIGO, state.freteCep]
  );

  const getRecommend = useCallback(async () => {
    setState((state) => ({ ...state, recommendIsLoading: true }));

    try {
      const response = await getProdutosRecomendados(produto.CODIGO);

      setState((state) => ({
        ...state,
        recommendData: response,
        recommendIsLoading: false,
      }));
    } catch (error) {
      console.error("Não foi possível carregar recomendações:", error);

      setState((state) => ({
        ...state,
        recommendData: [],
        recommendIsLoading: false,
      }));
    }
  }, [produto.CODIGO]);

  const getSimilar = useCallback(async () => {
    setState((state) => ({ ...state, similarIsLoading: true }));

    try {
      const response = await getProdutosSimilares(produto.CODIGO);

      setState((state) => ({
        ...state,
        similarData: response,
        similarIsLoading: false,
      }));
    } catch (error) {
      console.error("Não foi possível carregar produtos similares:", error);

      setState((state) => ({
        ...state,
        similarData: [],
        similarIsLoading: false,
      }));
    }
  }, [produto.CODIGO]);

  const handleClickFavorite = useCallback(
    (e) => {
      e.preventDefault();
      if (stateContext.favoritos.includes(produto.CODIGO)) {
        dispatchContext({ type: "REMOVER_FAVORITO", payload: produto.CODIGO });
      } else {
        dispatchContext({ type: "ADICIONAR_FAVORITO", payload: produto.CODIGO });
      }
    },
    [produto.CODIGO, stateContext.favoritos, dispatchContext]
  );

  const handleClickShare = async (e) => {
    e.preventDefault();

    let preco = produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO;

    if (window.navigator.share) {
      try {
        await window.navigator.share({
          title: Diversos.capitalizeAllWords(produto.NOME) || window.document.title,
          text:
            `Confira essa super promoção ${Number(produto.PRECO) !== Number(preco) ? `de ${Diversos.maskPreco(produto.PRECO)}` : ""} por ${Diversos.maskPreco(
              preco
            )} na Dricor` || "Confira este link!",
          url: window.location.href,
        });
      } catch (error) {
        // Usuário cancelou ou houve erro
        console.log("Erro ao compartilhar:", error);
      }
    } else {
      alert("O compartilhamento nativo não é suportado neste navegador.");
    }
  };

  useEffect(() => {
    // handleDepoimentos();

    if (stateContext.cep) {
      getShippingModes(stateContext.cep);
    }
  }, [getShippingModes, stateContext.cep]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isAnyVisible = entries.some((entry) => entry.isIntersecting);
        setState((state) => ({ ...state, showFixedButton: !isAnyVisible }));
      },
      {
        root: null,
        threshold: 0.1,
      }
    );
  
    if (comprarRef.current) observer.observe(comprarRef.current);
    if (comprarMobileRef.current) observer.observe(comprarMobileRef.current);
  
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Evita o scroll vertical da página
    const container = document.getElementById('kits-container');

    if (container) {
      container.addEventListener('wheel', (e) => {
        // Apenas se houver conteúdo scrollável horizontal
        if (e.deltaY !== 0) {
          e.preventDefault(); // Evita o scroll vertical da página
          container.scrollLeft += e.deltaY;
        }
      });
    }

    if (window && window.dataLayer) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          items: [
            {
              item_name: produto.NOME, // Name or ID is required.
              item_id: produto.CODIGO,
              price: produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO,
              item_brand: produto.MARCA,
              item_category: produto.NOMEGRUPO,
            },
          ],
        },
      });
    }

    if (sessionStorage.getItem("algoliaReturn")) {
      setState((state) => ({ ...state, algoliaReturn: JSON.parse(sessionStorage.getItem("algoliaReturn")) }));
      // sessionStorage.removeItem("algoliaReturn"); --> Deixa pra limpar somente no final da compra
    }

    const buscaEstoqueLojas = async () => {
      setState((state) => ({ ...state, estoquesIsLoading: true }));
      const response = await fetch(`https://dricor.api.tecworks.com.br/admloja/produto/estoque?produto=${produto.CODIGO}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
        },
      });
      const data = await response.json();
      setState((state) => ({ ...state, estoques: !data || !data.msg || !data.msg.ESTOQUES ? [] : data.msg.ESTOQUES, estoquesIsLoading: false }));
      return data;
    };

    if (stateContext.usuario && stateContext.usuario.codigo && stateContext.usuario.vendedor && stateContext.usuario.vendedor.CODIGO) {
      buscaEstoqueLojas();
    }

    getRecommend();
    getSimilar();
  }, []);

  const breadcrumbPaths = useMemo(
    () => [
      { label: "Início", href: "/" },
      { label: Diversos.capitalizeAllWords(produto.MENU1_NOME), href: `/departamento/${Diversos.toSeoUrl(produto.MENU1_NOME)}` },
      !produto.MENU2_NOME
        ? null
        : { label: Diversos.capitalizeAllWords(produto.MENU2_NOME), href: `/departamento/${Diversos.toSeoUrl(produto.MENU1_NOME)}/${Diversos.toSeoUrl(produto.MENU2_NOME)}` },
      !produto.MENU3_NOME
        ? null
        : {
            label: Diversos.capitalizeAllWords(produto.MENU3_NOME),
            href: `/departamento/${Diversos.toSeoUrl(produto.MENU1_NOME)}/${Diversos.toSeoUrl(produto.MENU2_NOME)}/${Diversos.toSeoUrl(produto.MENU3_NOME)}`,
          },
      { label: Diversos.capitalizeAllWords(produto.NOME), href: `/${Diversos.toSeoUrl(produto.NOME)}` },
    ],
    [produto]
  );

  const breakpoints = { 0: { slidesPerView: 1, spaceBetween: 5 } };
  const spaceBetween = 5;
  const slidesPerView = 1;

  return (
    <>
      <Grid container sx={styleContainer}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBreadcrumb}>
          <ResponsiveBreadcrumb paths={breadcrumbPaths} />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          xl={5}
          sx={{
            px: 1,
            py: 3,
            display: { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" },
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <Typography color="dark" textAlign="center" variant="h1" fontFamily="Jost" fontWeight="600" fontSize="1.5rem">
            {produto.NOME}
          </Typography>
        </Grid>

        <Grid container xs={12} sm={10} md={9} lg={9} xl={8} sx={styleContainerBody}>
          <Grid item xs={12} sm={12} md={7} lg={7} xl={7}>
            <Box display="flex" gap={2} sx={{ width: "100%", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
              {/* Lista de miniaturas */}
              <ImageList cols={1} rowHeight={100} sx={{ overflow: "hidden", width: 100, display: { xs: "none", sm: "none", md: "block", lg: "block", xl: "block" } }}>
                {produto.FOTOS.map((item, index) => (
                  <ImageListItem
                    key={index}
                    onClick={() => {
                      setSelectedImage(item.link);
                      setSelectedVariacao(-1);
                    }}
                    sx={{ cursor: "pointer", mb: 4 }}
                  >
                    <picture>
                      <source
                        srcSet={`${String(item.link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${item.link.replace(
                          /\.[^/.]+$/,
                          ".webp"
                        )}`}
                        type="image/webp"
                      />
                      <img
                        src={`${String(item.link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${item.link}`}
                        alt={produto.NOME}
                        loading="lazy"
                        style={{ maxWidth: "100%" }}
                      />
                    </picture>
                  </ImageListItem>
                ))}
              </ImageList>

              {/* Imagem principal destacada */}
              <Box component="div" sx={{ width: "100%", display: {xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex"}, alignItems: "center", justifyContent: "center", p: 5 }}>
                {!produto.FOTOS || produto.FOTOS.length <= 0 ? (
                  <OptimizedImage
                    src="/produto-sem-imagem.png"
                    width={400}
                    height={400}
                    alt={produto.NOME}
                    sx={{ width: "80%", height: "auto", maxWidth: "100%", maxHeight: 600, objectFit: "contain" }}
                  />
                ) : (
                  <>
                    {!isMobile ? (
                      <ZoomImage
                        src={
                          selectedVariacao
                            ? `${String(selectedImage).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${selectedImage}`
                            : `${String(selectedImage).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${selectedImage.replace(
                                /\.[^/.]+$/,
                                ".webp"
                              )}`
                        }
                        alt={produto.NOME}
                      />
                    ) : (
                      <picture>
                        <source
                          srcSet={`${String(selectedImage).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${selectedImage.replace(
                            /\.[^/.]+$/,
                            ".webp"
                          )}`}
                          type="image/webp"
                        />
                        <img
                          src={`${String(selectedImage).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${selectedImage}`}
                          alt={produto.NOME}
                          loading="lazy"
                          style={{
                            height: "auto",
                            maxHeight: 800,
                            objectFit: "contain",
                            maxWidth: "100%",
                          }}
                        />
                      </picture>
                    )}
                  </>
                )}
              </Box>

              <Box component="div" sx={{ backgroundColor: "transparent", width: "100%", display: {xs: "block", sm: "block", md: "none", lg: "none", xl: "none"}, alignItems: "center", justifyContent: "center", py: 5, px: 0  }}>
                <Swiper
                  navigation={{
                    nextEl: ".slider-custom-next",
                    prevEl: ".slider-custom-prev"
                  }}
                  modules={[Navigation, Pagination]}
                  pagination={true}
                  loop={false}
                  freeMode={undefined}
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
                  style={{ width: "100%", height: "100%", paddingBottom: 40, backgroundColor: "transparent" }}
                >
                    {produto.FOTOS.map((item, index) => (
                      <SwiperSlide
                      key={index}
                      style={{
                        width: "100%",
                        minWidth: "100%",
                        maxWidth: "100%",
                        flex: "1 1 auto",
                        margin: "0",
                        backgroundColor: "transparent"
                      }}
                    >
                      <Box
                        component={item.link && item.link !== "#" ? "a" : "div"}
                        href={item.link}
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 1.5,
                          overflow: "hidden",
                          backgroundColor: "transparent"
                        }}
                      >
                        <picture style={{ width: "100%", maxWidth: 500, height: "auto", objectFit: "contain" }}>
                          <source
                            srcSet={`${String(item.link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${item.link.replace(
                              /\.[^/.]+$/,
                              ".webp"
                            )}`}
                            type="image/webp"
                          />
                          <img
                            src={`${String(item.link).indexOf("https://cdn.divacosmeticos") > -1 ? "" : "https://dricor.cdn.tecworks.com.br/"}${item.link}`}
                            alt={produto.NOME}
                            loading="lazy"
                            style={{
                              height: "auto",
                              maxHeight: 800,
                              objectFit: "contain",
                              maxWidth: "100%",
                            }}
                          />
                        </picture>
                      </Box>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Box>

              {String(produto.SUBGRUPO).trim().toLowerCase() === "desativados" && (
                <Button variant="outlined" size="small" color="primary" sx={{ p: 0, position: "absolute", top: 0, left: 100 }}>
                  Outlet
                </Button>
              )}

              {produto.COMPLEMENTO &&
                Number(produto.COMPLEMENTO.PRECO) > 0 &&
                Number(produto.COMPLEMENTO.PRECO) < Number(produto.PRECO) &&
                moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").isValid() &&
                moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
                moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").isValid() &&
                moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD") && (
                  <Button variant="outlined" size="small" color="success" sx={{ py: 0, px: 2, position: "absolute", top: 0, left: {xs: 10, sm: 10, md: 100, lg: 100, xl: 100} }}>
                    Preço Exclusivo Site
                  </Button>
                )}

              <Box
                sx={{
                  width: "auto",
                  position: "absolute",
                  top: 0,
                  right: 10,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <StarRating value={produto.RATIO} />

                <IconButton style={{ ...styleBtnAction }} size="small" onClick={handleClickShare}>
                  <ShareIcon style={styleBtnActionIcon} />
                </IconButton>

                <IconButton style={{ ...styleBtnAction }} size="small" onClick={handleClickFavorite}>
                  {stateContext.favoritos.includes(produto.CODIGO) ? <FavoriteIcon style={styleBtnActionIcon} /> : <FavoriteBorderIcon style={styleBtnActionIcon} />}
                </IconButton>
              </Box>
            </Box>

            {/* Mobile - Preço Mobile */}
            <Box
              sx={{
                display: { xs: "flex", sm: "flex", md: "none", lg: "none", xl: "none" },
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                mx: "auto",
                px: 2,
              }}
            >
              <Box>
                

                {produto.COMPLEMENTO &&
                Number(produto.COMPLEMENTO.PRECO) > 0 &&
                Number(produto.COMPLEMENTO.PRECO) < Number(produto.PRECO) &&
                moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
                moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                    <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                      {" "}
                      De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                    </Typography>
                    {produto.COMPLEMENTO && Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                      <>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.3rem" sx={{ textDecoration: "none !important" }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {`${Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().label}`}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "none !important" }}>
                          ou à vista por apenas {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", w: "100%" }}>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="2.0rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ) : produto.PREPRO > 0 &&
                  produto.PREPRO < produto.PRECO &&
                  moment(produto.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
                  moment(produto.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                      <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                        {" "}
                        De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                      </Typography>
                      {produto.COMPLEMENTO && Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                        <>
                          <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.3rem" sx={{ textDecoration: "none !important" }}>
                            {" Por apenas: "}
                          </Typography>
                          <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                            {`${Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().label}`}
                          </Typography>
                          <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "none !important" }}>
                            ou à vista por apenas {Diversos.maskPreco(produto.PREPRO)}
                          </Typography>
                        </>
                      ) : (
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", w: "100%" }}>
                          <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                            {" Por apenas: "}
                          </Typography>
                          <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="2.0rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                            {Diversos.maskPreco(produto.PREPRO)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                ) : (
                  <>
                    {produto.COMPLEMENTO && Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.3rem" sx={{ textDecoration: "none !important" }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {`${Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().label}`}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "none !important" }}>
                          ou à vista por apenas {Diversos.maskPreco(produto.PRECO)}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", w: "100%" }}>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="2.0rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {Diversos.maskPreco(produto.PRECO)}
                        </Typography>
                      </Box>
                    )}
                  </>
                )}

                {produto.ESTOQUE > 0 ? (
                  <Button type="button" variant="contained" color="success" size="large" fullWidth onClick={handleAddCart} sx={{ fontSize: "1.75rem" }} ref={comprarMobileRef}>
                    Comprar
                  </Button>
                ) : (
                  <Button type="button" variant="contained" disabled color="secondary" size="large" fullWidth onClick={() => null} sx={{ fontSize: "1.75rem" }}>
                    Indisponível
                  </Button>
                )}

                <div
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 15,
                  }}
                >
                  <Image
                    src="/bandeiras-aceitas-horizontal.png"
                    alt="Aceitamos as bandeiras: Visa, Master, Elo, Hiper e Pix"
                    loading="lazy"
                    width={400}
                    height={55}
                    style={{
                      width: 400,
                      maxWidth: "100%",
                      height: "auto",
                    }}
                  />
                </div>

                {renderCardFrete(
                  Diversos.maskCEP(state.freteCep),
                  (text) => setState((state) => ({ ...state, freteCep: Diversos.getnums(text) })),
                  state.freteData,
                  () => getShippingModes(state.freteCep)
                )}

                {renderCardBeneficios()}
              </Box>
            </Box>

            <Caracteristicas produto={produto} />
          </Grid>

          {/* Desktop - Preço Desktop */}
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            lg={5}
            xl={5}
            sx={{ px: 1, display: { xs: "none", sm: "none", md: "flex", lg: "flex", xl: "flex" }, flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}
          >
            <Typography color="dark" textAlign="left" variant="h1" fontFamily="Jost" fontWeight="600" fontSize="1.5rem">
              {produto.NOME}
            </Typography>

            {produto.bannerMarca?.path ? (
              <div className="w-100">
                <Link href={`/marca/${Diversos.toSeoUrl(produto.MARCA)}`}>
                  <Image
                    src={`https://dricor.cdn.tecworks.com.br/${produto.bannerMarca?.path}`}
                    alt={`Logo da marca ${produto.MARCA}`}
                    loading="lazy"
                    width={150}
                    height={150}
                    style={{
                      height: 80,
                      width: "auto",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </div>
            ) : null}

            {renderKits(produto, kits)}

            {renderVariacoes(produto, variacoes, setSelectedImage, setSelectedVariacao, selectedVariacao)}

            <p>
              <br />
            </p>

            <Box className="price-tag-container">

              {produto.COMPLEMENTO &&
              Number(produto.COMPLEMENTO.PRECO) > 0 &&
              Number(produto.COMPLEMENTO.PRECO) < Number(produto.PRECO) &&
              moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
              moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                  <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                    {" "}
                    De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                  </Typography>
                  {produto.COMPLEMENTO && Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                    <>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important" }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.8rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {`${Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().label}`}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "none !important" }}>
                        ou à vista por apenas {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="2.3rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : produto.PREPRO > 0 &&
                produto.PREPRO < produto.PRECO &&
                moment(produto.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
                moment(produto.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                    <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                      {" "}
                      De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                    </Typography>
                    {produto.COMPLEMENTO && Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                      <>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important" }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.8rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {`${Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().label}`}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "none !important" }}>
                          ou à vista por apenas {Diversos.maskPreco(produto.PREPRO)}
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", w: "100%" }}>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="2.3rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {Diversos.maskPreco(produto.PREPRO)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
              ) : (
                <>
                  {produto.COMPLEMENTO && Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important" }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.8rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {`${Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().label}`}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="1.0rem" sx={{ textDecoration: "none !important" }}>
                        ou à vista por apenas {Diversos.maskPreco(produto.PRECO)}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.4rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="2.3rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {Diversos.maskPreco(produto.PRECO)}
                      </Typography>
                    </Box>
                  )}
                </>
              )}

              {produto.ESTOQUE > 0 ? (
                <Button variant="contained" color="success" size="large" fullWidth onClick={handleAddCart} sx={{ fontSize: "1.75rem" }} ref={comprarRef}>
                  Comprar
                </Button>
              ) : (
                <Button variant="contained" disabled color="secondary" size="large" fullWidth onClick={() => null} sx={{ fontSize: "1.75rem" }}>
                  Indisponível
                </Button>
              )}

              <div
                style={{
                  width: "100%",
                  height: "auto",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 15,
                }}
              >
                <Image
                  src="/bandeiras-aceitas-horizontal.png"
                  alt="Aceitamos as bandeiras: Visa, Master, Elo, Hiper e Pix"
                  loading="lazy"
                  width={400}
                  height={55}
                  style={{
                    width: 400,
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </div>
            </Box>

            <p>
              <br />
            </p>

            {renderCardFrete(
              Diversos.maskCEP(state.freteCep),
              (text) => setState((state) => ({ ...state, freteCep: Diversos.getnums(text) })),
              state.freteData,
              () => getShippingModes(state.freteCep)
            )}

            {renderCardBeneficios()}
          </Grid>
        </Grid>

        {/* Botão fixo para mobile */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            display: { xs: state.showFixedButton ? "flex" : "none", sm: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
            py: 1,
            px: 1,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Box style={{flex: 5, py: 0, m: 0}}>
            <Box className="price-tag-container" sx={{py: '0 !important'}}>
              {produto.COMPLEMENTO &&
              Number(produto.COMPLEMENTO.PRECO) > 0 &&
              Number(produto.COMPLEMENTO.PRECO) < Number(produto.PRECO) &&
              moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
              moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%", p: 0 }}>
                  <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                    {" "}
                    De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                  </Typography>
                  {produto.COMPLEMENTO && Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                    <>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {`${Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().labelAbrev.replace("em até ", "")}`}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        ou {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.0rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.0rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : produto.PREPRO > 0 &&
                produto.PREPRO < produto.PRECO &&
                moment(produto.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
                moment(produto.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%" }}>
                    <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                      {" "}
                      De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                    </Typography>
                    {produto.COMPLEMENTO && Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                      <>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {`${Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().labelAbrev.replace("em até ", "")}`}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                          ou {Diversos.maskPreco(produto.PREPRO)}
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%" }}>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {Diversos.maskPreco(produto.PREPRO)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
              ) : (
                <>
                  {produto.COMPLEMENTO && Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {`${Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().labelAbrev.replace("em até ", "")}`}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        ou {Diversos.maskPreco(produto.PRECO)}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {Diversos.maskPreco(produto.PRECO)}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
          {
            produto.ESTOQUE > 0 ? (
              <Button variant="contained" color="success" size="small" fullWidth onClick={handleAddCart} sx={{ fontSize: "1.25rem", flex: 7 }}>
                Comprar
              </Button>
            ) : (
              <Button variant="contained" disabled color="secondary" size="small" fullWidth onClick={() => null} sx={{ fontSize: "1.25rem", flex: 7 }}>
                Indisponível
              </Button>
            )
          }
        </Box>

        {/* Botão fixo para desktop */}
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 24,
            display: { xs: "none", sm: state.showFixedButton ? "flex" : "none" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
            width: "175px",
            py: 1,
            px: 1,
            bgcolor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0px -2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Box style={{flex: 1, py: 0, m: 0}}>
            <Box className="price-tag-container" sx={{py: '0 !important'}}>
              {produto.COMPLEMENTO &&
              Number(produto.COMPLEMENTO.PRECO) > 0 &&
              Number(produto.COMPLEMENTO.PRECO) < Number(produto.PRECO) &&
              moment(produto.COMPLEMENTO.INIVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
              moment(produto.COMPLEMENTO.FIMVALIDADE, "DD/MM/YYYY").format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%", p: 0 }}>
                  <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                    {" "}
                    De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                  </Typography>
                  {produto.COMPLEMENTO && Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                    <>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {`${Diversos.getParcelas(produto.COMPLEMENTO.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().labelAbrev.replace("em até ", "")}`}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        ou {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                      </Typography>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.0rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.0rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {Diversos.maskPreco(produto.COMPLEMENTO.PRECO)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : produto.PREPRO > 0 &&
                produto.PREPRO < produto.PRECO &&
                moment(produto.INIPRO).format("YYYYMMDD") <= moment().format("YYYYMMDD") &&
                moment(produto.FIMPRO).format("YYYYMMDD") >= moment().format("YYYYMMDD") ? (
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                    <Typography variant="h4" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "line-through", color: grey[700] }}>
                      {" "}
                      De: <span> {Diversos.maskPreco(produto.PRECO)} </span>{" "}
                    </Typography>
                    {produto.COMPLEMENTO && Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                      <>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {`${Diversos.getParcelas(produto.PREPRO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().labelAbrev.replace("em até ", "")}`}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                          ou {Diversos.maskPreco(produto.PREPRO)}
                        </Typography>
                      </>
                    ) : (
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", w: "100%" }}>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                          {" Por apenas: "}
                        </Typography>
                        <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                          {Diversos.maskPreco(produto.PREPRO)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
              ) : (
                <>
                  {produto.COMPLEMENTO && Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.length > 1 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {`${Diversos.getParcelas(produto.PRECO, produto.COMPLEMENTO.PARCELADO).parcelas.pop().labelAbrev.replace("em até ", "")}`}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="500" fontSize="0.8rem" sx={{ textDecoration: "none !important" }}>
                        ou {Diversos.maskPreco(produto.PRECO)}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", w: "100%" }}>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="0.8rem" sx={{ textDecoration: "none !important", mr: 1.5 }}>
                        {" Por apenas: "}
                      </Typography>
                      <Typography variant="p" fontFamily="Jost" fontWeight="700" fontSize="1.1rem" sx={{ textDecoration: "none !important", color: "success.main" }}>
                        {Diversos.maskPreco(produto.PRECO)}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
          {
            produto.ESTOQUE > 0 ? (
              <Button variant="contained" color="success" size="small" fullWidth onClick={handleAddCart} sx={{ fontSize: "1.25rem", flex: 1 }}>
                Comprar
              </Button>
            ) : (
              <Button variant="contained" disabled color="secondary" size="small" fullWidth onClick={() => null} sx={{ fontSize: "1.25rem", flex: 1 }}>
                Indisponível
              </Button>
            )
          }
        </Box>

        <Grid container xs={12} sm={10} md={9} lg={9} xl={8} sx={{...styleContainerBody, mt: {xs: 0, sm: 0, md: 0}}}>
          <Grid item xs={12} sm={12} md={7} lg={7} xl={7} sx={{ pr: { xs: 0, sm: 0, md: 3, lg: 3, xl: 3 }, pl: { xs: 1, sm: 1, md: 0, lg: 0, xl: 0 } }}>
            <Typography color="primary" textAlign="left" variant="h3" fontFamily="Jost" fontWeight="400" fontSize="1.25rem">
              Detalhes
            </Typography>

            <p>
              <br />
            </p>

            <Typography color="black" textAlign="justify" variant="p" fontFamily="Jost" fontWeight="normal" fontSize="1rem">
              {produto.COMPLEMENTO?.DESCRICAO1}
            </Typography>

            <Accordion
              expanded={state.comoUsar}
              onChange={() => setState((state) => ({ ...state, comoUsar: !state.comoUsar }))}
              elevation={0}
              sx={{ w: "100%", p: 0, my: 2, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: grey[300] }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ w: "100%", p: 0 }}>
                <Typography color="primary" textAlign="left" variant="h3" fontFamily="Jost" fontWeight="400" fontSize="1.25rem">
                  Características
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="black" textAlign="justify" variant="p" fontFamily="Jost" fontWeight="normal" fontSize="1rem">
                  {produto.COMPLEMENTO?.DESCRICAO2}
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={state.especificacoes}
              onChange={() => setState((state) => ({ ...state, especificacoes: !state.especificacoes }))}
              elevation={0}
              sx={{ w: "100%", p: 0, my: 2, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: grey[300], borderTopWidth: 0 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ w: "100%", p: 0, borderWidth: 0 }}>
                <Typography color="primary" textAlign="left" variant="h3" fontFamily="Jost" fontWeight="400" fontSize="1.25rem">
                  Especificações
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="black" textAlign="justify" variant="p" fontFamily="Jost" fontWeight="normal" fontSize="1rem">
                  {produto.COMPLEMENTO?.DESCRICAO3}
                </Typography>
              </AccordionDetails>
            </Accordion>

            {/* {produto.COMPLEMENTO && produto.COMPLEMENTO?.VIDEO1 && (
            <Row className="mx-0 info-n-similars mt-2">
              <Col lg={12} className="product-details-col text-center">
                <Card>
                  <Card.Body>
                    <iframe
                      width="560"
                      height="315"
                      src={produto.COMPLEMENTO.VIDEO1}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )} */}

            {Number(produto.CODIGO) === Number(44377) ? (
              <Box>
                <Grid>
                  <Image
                    src={"/tratamento-uso-obrigatorio-plus-truss-260.jpeg"}
                    alt="Tratamento Uso Obrigatório Plus+ Truss 260ml"
                    width={970}
                    height={600}
                    style={{
                      width: "90%",
                      height: "auto",
                    }}
                  />
                </Grid>
              </Box>
            ) : null}

            {Number(produto.CODIGO) === Number(39982) ? (
              <Box>
                <Grid>
                  <Image
                    src={"/Rapunzel-Tônico-Capilar-Diva-Cosmeticos-250ml.jpg"}
                    alt="Rapunzel Tônico Capilar Dricor 250ml"
                    width={970}
                    height={600}
                    style={{
                      width: "90%",
                      height: "auto",
                    }}
                  />
                </Grid>
                <Grid>
                  <Image
                    src={"/rapunzel-cronograma-de-crescimento-diva.jpg"}
                    alt="Rapunzel Cronograma de Crescimento"
                    width={970}
                    height={600}
                    style={{
                      width: "90%",
                      height: "auto",
                    }}
                  />
                </Grid>
                <Grid>
                  <Image
                    src={"/rapunzel-ativos-diva-cosmeticos.jpg"}
                    alt="Rapunzel Ativos"
                    width={970}
                    height={600}
                    style={{
                      width: "90%",
                      height: "auto",
                    }}
                  />
                </Grid>
                <Grid>
                  <Image
                    src={"/porque-rapunzel-perfeito-diva-cosmeticos.jpg"}
                    alt="Porque Rapunzel é Perfeito"
                    width={970}
                    height={600}
                    style={{
                      width: "90%",
                      height: "auto",
                    }}
                  />
                </Grid>
                <Grid>
                  <Image
                    src={"/ritual-cronograma-para-crescimento.jpg"}
                    alt="Porque Rapunzel é Perfeito"
                    width={970}
                    height={600}
                    style={{
                      width: "90%",
                      height: "auto",
                    }}
                  />
                </Grid>
              </Box>
            ) : null}

            {stateContext.usuario && stateContext.usuario.codigo && stateContext.usuario.vendedor && stateContext.usuario.vendedor.CODIGO && (
              <Box>
                <Grid>
                  <Typography variant="h3" sx={{ fontSize: "1.8rem", fontFamily: "Jost", fontWeight: "700" }}>
                    Estoques
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Loja</TableCell>
                          <TableCell>Estoque</TableCell>
                        </TableRow>
                      </TableHead>
                      {state.estoquesIsLoading || !state.estoques || state.estoques.length <= 0 ? (
                        <TableRow>
                          <TableCell colSpan={2}>
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableBody>
                          {state.estoques.map((estoque) => (
                            <TableRow key={estoque.PROLOJA}>
                              <TableCell>{`${estoque?.lojaDados?.CODIGO} - ${estoque?.lojaDados?.NOME}`}</TableCell>
                              <TableCell>{String(estoque.ESTOQUE)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Grid>
              </Box>
            )}

            <Box className="row">
              <Grid>
                <div id="standoutDivAutomatico"></div>
              </Grid>
            </Box>
          </Grid>

          {/*}
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5} sx={{ px: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start" }}>
            <Typography color="primary" textAlign="left" variant="h3" fontFamily="Jost" fontWeight="400" fontSize="1.25rem">
              Avaliações
            </Typography>

            <Typography color="grey.500" textAlign="left" variant="p" fontFamily="Jost" fontWeight="400" fontSize="1rem" mt={2}>
              Preencha os campos abaixo para enviar seu comentário sobre a compra desse produto conosco.
            </Typography>

            {/* {!state.depoimentosIsLoading && state.depoimentos.length <= 0 ? null : ( 
            <div className="depoimento-content" style={{ width: "100%", height: "auto" }}>
              <Comentario produto={produto} />
              {/* <h3>Depoimentos de Clientes</h3>
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {state.depoimentosIsLoading ? (
                  <li key={0} style={{ marginBottom: "15px" }}>
                    <CircularProgress />
                  </li>
                ) : (
                  state.depoimentos.map((testimonial) => (
                    <li key={testimonial.id} style={{ marginBottom: "15px" }}>
                      <Typography variant="paragraph" color="text.primary" sx={{ fontSize: "0.95rem" }}>
                        <strong>{testimonial.nome}</strong>
                        {"  "}
                        {<StarRating value={testimonial.avaliacao} />}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" className="local-data" sx={{ fontSize: "0.7rem" }}>
                        {`${testimonial.cidade}, ${testimonial.uf} - ${moment(testimonial.data_criado, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY")}`}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" className="blockquote">
                        <p>{testimonial.comentario}</p>
                      </Typography>
                    </li>
                  ))
                )}
              </ul> 
            </div>
            {/* )} 
          </Grid>
          */}
        </Grid>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {state.recommendIsLoading ? <CircularProgress /> : <LazySliderCardProdu title="Outros clientes também viram..." produtos={state.recommendData} link="#" />}
      </Grid>
      
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        {state.similarIsLoading ? <CircularProgress /> : <LazySliderCardProdu title="Você pode gostar também de..." produtos={state.similarData} link="#" />}
      </Grid>
    </>
  );
});

ProdutoClient.displayName = "ProdutoClient";

export default ProdutoClient;
