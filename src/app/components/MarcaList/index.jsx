"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Checkbox, Badge, List, ListItem, ListItemButton } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Diversos } from "@/app/lib/diversos";
import { Colors } from "@/app/style.constants";
import { styleMarcaList, styleMarcaListItem, styleMarcaCheckbox, styleMarcaBadge } from "./style";
import { useSearchParamsManager } from "@/app/hooks/useSearchParams";
import { useApp } from "@/app/context/AppContext";

export default function MarcaList({ marcas = {}, onMarcaSelect }) {
  const { updateSearchParams, getAllSearchParams } = useSearchParamsManager();
  const { marcas: marcasFiltro } = getAllSearchParams();

  const { dispatch } = useApp();

  const [selectedMarcas, setSelectedMarcas] = useState(marcasFiltro ? Array.from(marcasFiltro.split(",")) : []);

  const handleMarcaToggle = (marca) => {
    const newSelected = selectedMarcas.includes(marca) ? selectedMarcas.filter((m) => m !== marca) : [...selectedMarcas, marca];

    setSelectedMarcas(newSelected);
    onMarcaSelect?.(newSelected);

    updateSearchParams({ marcas: newSelected.join(",") });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { marcas: newSelected },
    });
  };

  const handleLimparMarcas = () => {
    setSelectedMarcas([]);
    onMarcaSelect?.([]);
    updateSearchParams({ marcas: "" });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { marcas: [] },
    });
  };

  useEffect(() => {
    const keys = Object.keys(marcas);
    if (keys.length === 1) {
      setSelectedMarcas([keys[0]]);
    }
  }, [marcas]);

  return (
    <List sx={styleMarcaList}>
      {Object.entries(marcas).map(([key, total]) => {
        if (!key) return null;

        return (
          <ListItem key={key} disablePadding sx={{ p: 0, maxWidth: "90%" }}>
            <ListItemButton size="small" sx={styleMarcaListItem} onClick={() => handleMarcaToggle(key)}>
              <Checkbox checked={selectedMarcas.includes(key)} sx={styleMarcaCheckbox} />
              <Typography
                variant="span"
                sx={{
                  flex: 1,
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  fontFamily: "Jost",
                  color: Colors.dark,
                }}
              >
                {Diversos.capitalizeAllWords(key)}
              </Typography>
              <Badge color="primary" size="small" variant="outlined" badgeContent={total} sx={styleMarcaBadge} />
            </ListItemButton>
          </ListItem>
        );
      })}

      <ListItem key="todos" disablePadding sx={{ p: 0, maxWidth: "90%" }}>
        <ListItemButton size="small" sx={styleMarcaListItem} onClick={handleLimparMarcas}>
          <Typography
            variant="span"
            color={red[600]}
            align="center"
            sx={{
              py: 1.5,
              flex: 1,
              fontSize: "0.9rem",
              fontWeight: "500",
              fontFamily: "Jost",
            }}
          >
            Limpar marcas
          </Typography>
        </ListItemButton>
      </ListItem>
    </List>
  );
}
