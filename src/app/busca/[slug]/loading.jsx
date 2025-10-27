import { Skeleton, Grid, Paper, Divider, Box, Typography } from "@mui/material";
import { styleContainer, styleContainerBody } from "./style";

export default function Loading() {
  return (
    <>
      <Grid container sx={styleContainer}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, mt: 1, mb: 1, py: 1 }}>
          <Skeleton variant="text" width="60%" height={30} />
        </Grid>

        <Grid item xs={0} sm={0} md={2} lg={2} xl={2} sx={{ ...styleContainerBody, display: { xs: "none", sm: "none", md: "block" }, pt: 2, pr: 3 }}>
          <Skeleton variant="rectangular" width="95%" height={40} />
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Typography variant="h5" color="black" sx={{ fontSize: "1.0rem", fontWeight: "500" }}>
            Marcas
          </Typography>
          <Skeleton variant="rectangular" width="95%" height={200} />
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Typography variant="h5" color="black" sx={{ fontSize: "1.0rem", fontWeight: "500" }}>
            Categorias
          </Typography>
          <Skeleton variant="rectangular" width="95%" height={200} />
        </Grid>

        <Grid container xs={12} sm={12} md={10} lg={10} xl={10} sx={{ ...styleContainerBody, p: 0, m: 0 }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBody}>
            <Skeleton variant="text" width="80%" height={40} />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={styleContainerBody}>
            <Skeleton variant="text" width="60%" height={30} />
          </Grid>

          <Grid container xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, px: 1, mt: 1 }}>
            <Paper
              variant="outlined"
              sx={{
                width: "100%",
                p: 1,
                textAlign: "center",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rectangular" width="20%" height={40} />
            </Paper>
          </Grid>

          <Grid container xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, gap: 2, mt: 2 }}>
            {[...Array(12)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                <Skeleton variant="rectangular" width="100%" height={300} sx={{ mb: 2 }} />
              </Grid>
            ))}
          </Grid>

          <Grid container xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerBody, alignItems: "center", justifyContent: "center" }}>
            <Skeleton variant="rectangular" width="60%" height={50} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
