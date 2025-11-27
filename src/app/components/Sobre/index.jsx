import React from "react";
import { Box, Container, Typography, Grid, Paper, Link, List, ListItem, ListItemIcon } from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import Image from "next/image";

export default function Sobre() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Sobre a Dricor
      </Typography>
      <Typography variant="body1" paragraph>
        A empresa Dricor Armarinhos é uma empresa especializada no comércio atacadista e varejista de artigos de armarinhos e aviamentos.
      </Typography>
      <Typography variant="body1" paragraph>
        Fundada em 1993 na cidade de Curitiba Paraná, dispomos de 32 anos de tradição e qualidade na comercialização de nossos produtos, oferecendo uma ampla loja no Boqueirão.
      </Typography>
      <Typography variant="body1" paragraph>
        A Dricor Armarinhos começou com uma história de dedicação e respeito ao cliente que transformou a pequena Dricor Armarinhos em um dos maiores atacadistas e varejistas de
        todo o Brasil.
      </Typography>
      <Typography variant="body1" paragraph>
        Somos uma empresa comprometida com o sucesso de nossos clientes e buscamos cultivar uma relação duradoura com nossos clientes, baseada na qualidade do atendimento, no
        respeito e sempre buscando oferecer o melhor aos nossos clientes.
      </Typography>
      <Typography variant="body1" paragraph>
        Para melhor atender as necessidades dos nossos clientes, além do atendimento no balcão ou por whatsapp. Entre em contato e faça já o seu pedido! Atendemos clientes de todo
        o Brasil, oferecendo sempre produtos de alta qualidade, das melhores marcas e com os melhores preços do mercado!
      </Typography>
    </Container>
  );
}
