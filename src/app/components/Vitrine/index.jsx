"use client";

import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import CardProdu from "@/app/components/CardProdu";
import { styleContainerBody } from "./style";
import insights from "@/app/lib/algoliaInsights";

const NoProductsFound = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        color: "text.secondary",
        p: 3,
      }}
    >
      <SearchOffIcon sx={{ fontSize: 60, mb: 2, color: "text.secondary" }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        Nenhum produto encontrado
      </Typography>
      <Typography variant="body2">Não encontramos produtos relacionados ao termo pesquisado, departamento ou marca selecionada.</Typography>
    </Box>
  );
};

export default function Vitrine({ produtos, title, algoliaReturn, page }) {
  useEffect(() => {
    if (window && window.dataLayer) {
      const itemList = [];

      produtos.forEach((produto, index) => {
        itemList.push({
          item_name: produto.NOME, // Name or ID is required.
          item_id: produto.CODIGO,
          price: produto.PREPRO > 0 && produto.PREPRO < produto.PRECO ? produto.PREPRO : produto.PRECO,
          item_brand: produto.MARCA,
          item_category: produto.NOMEGRUPO,
          item_list_name: title,
          index: index,
        });
      });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "view_item_list",
        ecommerce: {
          item_list_name: title,
          item_list_id: title,
          items: itemList,
        },
      });

      // console.log(algoliaReturn);

      if (algoliaReturn && algoliaReturn.queryID) {
        let eventName = "";

        switch (page) {
          case "busca":
            eventName = "Visualizou resultado de busca";
            break;
          case "departamento":
            eventName = "Visualizou resultado de busca por departamento";
            break;
          case "marca":
            eventName = "Visualizou resultado de busca por marca";
            break;
          case "promocao":
            eventName = "Visualizou resultado de busca por promocao";
            break;
          case "outlet":
            eventName = "Visualizou resultado de busca por outlet";
            break;
          default:
            eventName = "Visualizou vitrine de produtos";
            break;
        }

        insights("viewedFilters", {
          eventName: eventName,
          filters: algoliaReturn.facetsAplicados.split(" AND "),
          index: algoliaReturn.index,
        });
      }
    }
  }, []);

  if (!produtos || produtos.length <= 0) {
    return (
      <Box sx={styleContainerBody}>
        <NoProductsFound />
      </Box>
    );
  }

  return (
    <Box sx={styleContainerBody}>
      {produtos.map((row, idx) => (
        <CardProdu produ={row} idx={`produto-${row.CODIGO}`} key={`produto-${row.CODIGO}`} algoliaReturn={algoliaReturn} indexPage={idx} />
      ))}
    </Box>
  );
}
