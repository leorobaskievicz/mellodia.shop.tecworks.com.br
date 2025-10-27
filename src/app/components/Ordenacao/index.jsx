"use client";

import { Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useSearchParamsManager } from "@/app/hooks/useSearchParams";
import { useApp } from "@/app/context/AppContext";

export default function Ordenacao({ ordem, sx }) {
  const { updateSearchParams } = useSearchParamsManager();
  const { dispatch } = useApp();

  const handleChange = (event) => {
    const novaOrdem = event.target.value;
    updateSearchParams({ sort: novaOrdem });

    // Atualiza o estado global
    dispatch({
      type: "ATUALIZAR_FILTROS",
      payload: { ordenacao: novaOrdem },
    });
  };

  return (
    <Box sx={{ minWidth: 100, ...sx }}>
      <FormControl fullWidth size="small">
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={ordem}
          label="Ordenar por"
          onChange={handleChange}
          sx={{
            "& .MuiSelect-select": {
              py: 1,
            },
          }}
        >
          <MenuItem value="relevance">Mais relevantes</MenuItem>
          <MenuItem value="preco_asc">Menor preço</MenuItem>
          <MenuItem value="preco_desc">Maior preço</MenuItem>
          <MenuItem value="nome_asc">Nome (A-Z)</MenuItem>
          <MenuItem value="nome_desc">Nome (Z-A)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
