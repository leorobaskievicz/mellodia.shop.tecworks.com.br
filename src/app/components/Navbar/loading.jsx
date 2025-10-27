"use client";

import { Grid, Skeleton, Box } from "@mui/material";
import { Colors } from "@/app/style.constants";

export default function NavbarLoading() {
  return (
    <Grid container sx={{ ...styleContainer, display: { xs: "none", md: "flex" } }}>
      <Grid xs={12} sm={11} md={10} lg={9} xl={8} sx={{ ...styleContainerBody, position: "relative" }} container>
        <Box sx={{ display: "flex", gap: 2, width: "100%", overflowX: "auto", py: 1 }}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Skeleton key={item} variant="rectangular" width={120} height={40} />
          ))}
        </Box>
      </Grid>
    </Grid>
  );
}

const styleContainer = {
  width: "100%",
  backgroundColor: Colors.white,
  borderBottom: `1px solid ${Colors.secondaryBorder}`,
  py: 0,
};

const styleContainerBody = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  flexWrap: "nowrap",
  gap: 1,
  py: 0,
  mx: "auto",
  overflowX: "auto",
};
