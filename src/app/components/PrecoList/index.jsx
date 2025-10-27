"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Checkbox, Badge, List, ListItem, ListItemButton } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Diversos } from "@/app/lib/diversos";
import { Colors } from "@/app/style.constants";
import { stylePrecoList, stylePrecoListItem, stylePrecoCheckbox, stylePrecoBadge } from "./style";
import { useSearchParamsManager } from "@/app/hooks/useSearchParams";
import { useApp } from "@/app/context/AppContext";

export default function PrecoList({ preco = {}, onPrecoSelect }) {
  const { updateSearchParams, getAllSearchParams } = useSearchParamsManager();
  const { preco: precoFiltro } = getAllSearchParams();

  const { dispatch } = useApp();

  const [selectedPreco, setSelectedPreco] = useState(precoFiltro ? Array.from(precoFiltro.split(",")).map(String) : []);

  const handlePrecoToggle = (preco) => {
    const newSelected = selectedPreco.includes(preco) ? selectedPreco.filter((p) => p !== preco) : [...selectedPreco, preco];

    setSelectedPreco(newSelected);
    onPrecoSelect?.(newSelected);

    updateSearchParams({ preco: newSelected.join(",") });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { preco: newSelected },
    });
  };

  const handleLimpar = () => {
    setSelectedPreco([]);
    onPrecoSelect?.([]);
    updateSearchParams({ preco: "" });
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { preco: [] },
    });
  };

  useEffect(() => {
    const keys = Object.keys(preco);
    if (keys.length === 1) {
      setSelectedPreco([keys[0]]);
    }
  }, [preco]);

  return (
    <List sx={stylePrecoList}>
      {Object.entries(preco).map(([key, total]) => {
        if (!key) return null;

        return (
          <ListItem key={key} disablePadding sx={{ p: 0, maxWidth: "90%" }}>
            <ListItemButton size="small" sx={stylePrecoListItem} onClick={() => handlePrecoToggle(key)}>
              <Checkbox checked={selectedPreco.includes(key)} ss={stylePrecoCheckbox} />
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
                {Diversos.maskPreco(key)}
              </Typography>
              <Badge color="primary" size="small" variant="outlined" badgeContent={total} sx={stylePrecoBadge} />
            </ListItemButton>
          </ListItem>
        );
      })}

      <ListItem key="todos" disablePadding sx={{ p: 0, maxWidth: "90%" }}>
        <ListItemButton size="small" sx={stylePrecoListItem} onClick={handleLimpar}>
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
            Limpar preços
          </Typography>
        </ListItemButton>
      </ListItem>
    </List>
  );
}
