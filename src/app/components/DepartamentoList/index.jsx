"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Checkbox, Badge, List, ListItem, ListItemButton } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Diversos } from "@/app/lib/diversos";
import { Colors } from "@/app/style.constants";
import { styleDepartamentoList, styleDepartamentoListItem, styleDepartamentoCheckbox, styleDepartamentoBadge } from "./style";
import { useSearchParamsManager } from "@/app/hooks/useSearchParams";
import { useApp } from "@/app/context/AppContext";

export default function DepartamentoList({ departamentos = {}, onDepartamentoSelect }) {
  const { updateSearchParams, getAllSearchParams } = useSearchParamsManager();
  const { departamentos: departamentosFiltro } = getAllSearchParams();

  const { dispatch } = useApp();

  const [selectedDepartamentos, setSelectedDepartamentos] = useState(departamentosFiltro ? Array.from(departamentosFiltro.split(",")).map(String) : []);

  const handleDepartamentoToggle = (departamento) => {
    const newSelected = selectedDepartamentos.includes(departamento) ? selectedDepartamentos.filter((d) => d !== departamento) : [...selectedDepartamentos, departamento];

    setSelectedDepartamentos(newSelected);
    onDepartamentoSelect?.(newSelected);

    updateSearchParams({ departamentos: newSelected.join(",") });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { departamentos: newSelected },
    });
  };

  const handleLimpar = () => {
    setSelectedDepartamentos([]);
    onDepartamentoSelect?.([]);
    updateSearchParams({ departamentos: "" });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { departamentos: [] },
    });
  };

  useEffect(() => {
    const keys = Object.keys(departamentos);
    if (keys.length === 1) {
      setSelectedDepartamentos([keys[0]]);
    }
  }, [departamentos]);

  return (
    <List sx={styleDepartamentoList}>
      {Object.entries(departamentos).map(([key, total]) => {
        if (!key) return null;

        return (
          <ListItem key={key} disablePadding sx={{ p: 0, maxWidth: "90%" }}>
            <ListItemButton size="small" sx={styleDepartamentoListItem} onClick={() => handleDepartamentoToggle(key)}>
              <Checkbox checked={selectedDepartamentos.includes(key)} sx={styleDepartamentoCheckbox} />
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
              <Badge color="primary" size="small" variant="outlined" badgeContent={total} sx={styleDepartamentoBadge} />
            </ListItemButton>
          </ListItem>
        );
      })}

      <ListItem key="todos" disablePadding sx={{ p: 0, maxWidth: "90%" }}>
        <ListItemButton size="small" sx={styleDepartamentoListItem} onClick={handleLimpar}>
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
            Limpar departamentos
          </Typography>
        </ListItemButton>
      </ListItem>
    </List>
  );
}
