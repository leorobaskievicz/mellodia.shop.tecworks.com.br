"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Checkbox, Badge, List, ListItem, ListItemButton } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Diversos } from "@/app/lib/diversos";
import { Colors } from "@/app/style.constants";
import { styleGruposList, styleGruposListItem, styleGruposCheckbox, styleGruposBadge } from "./style";
import { useSearchParamsManager } from "@/app/hooks/useSearchParams";
import { useApp } from "@/app/context/AppContext";

export default function GrupoList({ grupos = {}, onGrupoSelect }) {
  const { updateSearchParams, getAllSearchParams } = useSearchParamsManager();
  const { grupos: gruposFiltro } = getAllSearchParams();
  const { dispatch } = useApp();

  const [selectedGrupos, setSelectedGrupos] = useState(gruposFiltro ? Array.from(gruposFiltro.split(",")).map(String) : []);

  const handleGrupoToggle = (grupo) => {
    const newSelected = selectedGrupos.includes(grupo) ? selectedGrupos.filter((g) => g !== grupo) : [...selectedGrupos, grupo];

    setSelectedGrupos(newSelected);
    onGrupoSelect?.(newSelected);

    updateSearchParams({ grupos: newSelected.join(",") });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { grupos: newSelected },
    });
  };

  const handleLimpar = () => {
    setSelectedGrupos([]);
    onGrupoSelect?.([]);
    updateSearchParams({ grupos: "" });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { grupos: [] },
    });
  };

  useEffect(() => {
    const keys = Object.keys(grupos);
    if (keys.length === 1) {
      setSelectedGrupos([keys[0]]);
    }
  }, [grupos]);

  return (
    <List sx={styleGruposList}>
      {Object.entries(grupos).map(([key, total]) => {
        if (!key) return null;

        return (
          <ListItem key={key} disablePadding sx={{ p: 0, maxWidth: "90%" }}>
            <ListItemButton size="small" sx={styleGruposListItem} onClick={() => handleGrupoToggle(key)}>
              <Checkbox checked={selectedGrupos.includes(key)} sx={styleGruposCheckbox} />
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
              <Badge color="primary" size="small" variant="outlined" badgeContent={total} sx={styleGruposBadge} />
            </ListItemButton>
          </ListItem>
        );
      })}

      <ListItem key="todos" disablePadding sx={{ p: 0, maxWidth: "90%" }}>
        <ListItemButton size="small" sx={styleGruposListItem} onClick={handleLimpar}>
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
            Limpar categorias
          </Typography>
        </ListItemButton>
      </ListItem>
    </List>
  );
}
