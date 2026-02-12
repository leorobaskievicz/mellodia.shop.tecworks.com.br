import React from "react";
import { Box, Container, Typography, Grid, Paper, Link, List, ListItem, ListItemIcon } from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import Image from "next/image";

export default function Sobre() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Sobre a Mellodia
      </Typography>
    </Container>
  );
}
