"use client";

import { useMediaQuery } from "@mui/material";
import { Breadcrumbs, Link, Box } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

export default function ResponsiveBreadcrumb({paths = []}) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const displayPaths = isSmallScreen && paths.length > 3 ? [paths[0], { label: "...", disabled: true }, paths[paths.length - 1]] : paths;

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {displayPaths.map(
        (path, index) =>
          path !== null && (
            <Link key={index} color={path.disabled ? "text.disabled" : "inherit"} href={path.href} sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <Box component="span" sx={{ fontSize: "0.8rem", fontWeight: "400" }}>
                {index === 0 && <HomeIcon sx={{ mr: 0.5, mt: 0.5 }} fontSize="inherit" />}
                {path.label}
              </Box>
            </Link>
          )
      )}
    </Breadcrumbs>
  );
}
