"use client";

import { useState } from "react";
import { styleContainerBody } from "./style";
import { Grid, Divider, Typography, Accordion, AccordionSummary, AccordionDetails, Button, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import MarcaList from "../MarcaList";
import DepartamentoList from "../DepartamentoList";
import Ordenacao from "../Ordenacao";
import GrupoList from "../GrupoList";
import PrecoList from "../PrecoList";

export default function Facets({ marcas = [], departamentos = [], sort = "relevancia", grupos = [], preco = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      {/* Botão de filtros para mobile */}
      <Grid item xs={12} sx={{ display: { xs: "block", sm: "block", md: "none" }, mb: 2, px: 1 }}>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
          fullWidth
          sx={{ justifyContent: "flex-start", textTransform: "none" }}
        >
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Button>
      </Grid>

      {/* Filtros para mobile */}
      <Grid
        item
        xs={12}
        sx={{
          display: { xs: showFilters ? "block" : "none", sm: showFilters ? "block" : "none", md: "none" },
          mb: 2,
        }}
      >
        <Accordion expanded={expanded === "ordenacao"} onChange={handleAccordionChange("ordenacao")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Ordenação</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Ordenacao ordem={sort} sx={{ width: "100%" }} />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === "marcas"} onChange={handleAccordionChange("marcas")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Marcas</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MarcaList marcas={marcas} />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === "departamentos"} onChange={handleAccordionChange("departamentos")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Departamentos</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DepartamentoList departamentos={departamentos} />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === "categorias"} onChange={handleAccordionChange("categorias")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Categorias</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <GrupoList grupos={grupos} />
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === "preco"} onChange={handleAccordionChange("preco")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Preço</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <PrecoList preco={preco} />
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Filtros para desktop */}
      <Grid
        item
        xs={0}
        sm={0}
        md={2}
        lg={2}
        xl={2}
        sx={{
          ...styleContainerBody,
          display: { xs: "none", sm: "none", md: "block" },
          pt: 2,
          pr: 3,
          position: "sticky",
          top: "80px",
          height: "calc(100vh - 80px)",
          overflowY: "auto",
          alignSelf: "flex-start",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "80px",
            background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          },
          "& > *": {
            position: "relative",
            zIndex: 2,
          },
          // Ocultar barra de rolagem
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Ordenacao ordem={sort} sx={{ width: "95%" }} />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="h5" color="black" sx={{ fontSize: "1.0rem", fontWeight: "500" }}>
          Marcas
        </Typography>
        <MarcaList marcas={marcas} />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="h5" color="black" sx={{ fontSize: "1.0rem", fontWeight: "500" }}>
          Departamentos
        </Typography>
        <DepartamentoList departamentos={departamentos} />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="h5" color="black" sx={{ fontSize: "1.0rem", fontWeight: "500" }}>
          Categorias
        </Typography>
        <GrupoList grupos={grupos} />
        <Divider sx={{ mt: 2, mb: 2 }} />
        <Typography variant="h5" color="black" sx={{ fontSize: "1.0rem", fontWeight: "500" }}>
          Preço
        </Typography>
        <PrecoList preco={preco} />
      </Grid>
    </>
  );
}
