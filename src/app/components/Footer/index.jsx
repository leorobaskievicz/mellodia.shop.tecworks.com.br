"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Facebook as FacebookIcon, Instagram, Instagram as InstagramIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Grid, Typography, List, ListItem, ListItemText, Button, TextField, Container, Box } from "@mui/material";
import {
  styleContainer,
  styleContainerContent,
  styleContainerContentItem,
  styleContainerContentItemTitle,
  styleContainerContentItemButton,
  styleContainerContentItemListItem,
} from "./style";
import FooterNewsletter from "@/app/components/FooterNewsletter";

export default function Footer({ children }) {
  const router = useRouter();

  return (
    <Grid container sx={styleContainer}>
      <Grid
        item
        xs={false}
        sm={false}
        md={1}
        lg={2}
        xl={2}
        sx={{ ...styleContainerContent, backgroundColor: "#F2F2F2", display: { xs: "none", sm: "none", md: "block" } }}
      />
      <Grid
        container
        xs={12}
        sm={12}
        md={9}
        lg={8}
        xl={8}
        sx={{ ...styleContainerContent, backgroundColor: "#F2F2F2" }}
      >
        <Grid item xs={6} sm={6} md={2} lg={2} xl={2} sx={styleContainerContentItem}>
          <Typography sx={styleContainerContentItemTitle}>Ajuda & Suporte</Typography>
          <List dense>
            <ListItem disableGutters sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Relacionamento com o cliente"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/central-de-relacionamento")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Política de Devolução"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/central-de-relacionamento?aba=trocas")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Política de Privacidade"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/politica-de-privacidade")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Política de Frete"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/politica-de-frete")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Consumidor.gov.br"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("https://consumidor.gov.br/")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Código de defesa do consumidor"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("https://consumidor.gov.br/")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Termos de Uso"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/politica-de-privacidade")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Outlet"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/outlet")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Nossas lojas"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/institucional/lojas")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Quem somos"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/institucional/sobre")}
              />
            </ListItem>
            {/* <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText primary="Promoções de cupons" sx={styleContainerContentItemButton} onClick={() => router.push("/institucional/promocoes-de-cupons")} />
            </ListItem> */}
          </List>
        </Grid>
        <Grid item xs={6} sm={6} md={2} lg={2} xl={2} sx={styleContainerContentItem}>
          <Typography sx={styleContainerContentItemTitle}>Departamentos</Typography>
          <List dense>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Produtos para cabelo"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/departamento/cabelo")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Perfumes importados"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/departamento/perfumes")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Maquiagem"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/departamento/maquiagem")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Profissional"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/departamento/profissionais")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Masculino"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/departamento/masculino")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Kits"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/departamento/kits")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Unhas"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/departamento/unhas")}
              />
            </ListItem>
            {/* <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText primary="Cupom de desconto" sx={styleContainerContentItemButton} onClick={() => router.push("/institucional/promocoes-de-cupons")} />
            </ListItem> */}
          </List>
        </Grid>
        <Grid item xs={6} sm={6} md={2} lg={3} xl={3} sx={styleContainerContentItem}>
          <Typography sx={styleContainerContentItemTitle}>Minha Conta</Typography>
          <List dense>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Dados pessoais"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/perfil/editar/info")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Meus endereços"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/perfil/editar/endereco")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Alterar senha"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/meu-cadastro#grid-alterar-senha")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Meus pedidos"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/consulta-pedidos")}
              />
            </ListItem>
          </List>
          <Typography sx={styleContainerContentItemTitle}>Relacionamento com o Cliente</Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            sx={{ px: 4, mt: 1 }}
            onClick={() => router.push("/institucional/atendimento")}
          >
            Atendimento
          </Button>
          <br />
          <Typography sx={styleContainerContentItemTitle}>Trabalhe conosco</Typography>
          <Button
            variant="contained"
            size="large"
            color="primary"
            sx={{ px: 4, mt: 1, mb: 2 }}
            onClick={() => router.push("/institucional/trabalhe-conosco")}
          >
            Envie seu currículo
          </Button>
        </Grid>
        <Grid item xs={6} sm={6} md={2} lg={2} xl={2} sx={styleContainerContentItem}>
          <Typography sx={styleContainerContentItemTitle}>Marcas</Typography>
          <List dense>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Amend"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/marca/amend")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Keune"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/marca/keune")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Truss"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/marca/truss")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Lola"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/marca/lola")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Vult"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/marca/vult")}
              />
            </ListItem>
            <ListItem sx={styleContainerContentItemListItem}>
              <ListItemText
                primary="Knut"
                sx={styleContainerContentItemButton}
                onClick={() => router.push("/marca/knut")}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={2}
          lg={3}
          xl={3}
          sx={{ ...styleContainerContentItem, alignItems: { xs: "center", md: "flex-start" }, mt: { xs: 4, md: 0 } }}
        >
          <Typography sx={styleContainerContentItemTitle}>
            Cadastre-se para receber novidades e promoções exclusivas
          </Typography>
          <Box>
            <FooterNewsletter />
          </Box>
          <Typography variant="overline" sx={{ pt: 1.3, textAlign: "center", lineHeight: 1.5 }}>
            Ao se cadastrar, você concorda em receber comunicações nos termos da nossa Política de Privacidade
          </Typography>
        </Grid>
      </Grid>
      <Grid
        item
        xs={false}
        sm={false}
        md={1}
        lg={2}
        xl={2}
        sx={{ ...styleContainerContent, backgroundColor: "#F2F2F2", display: { xs: "none", md: "block" } }}
      />
      <Grid container xs={12} sm={12} md={9} lg={8} xl={8} sx={{ ...styleContainerContent }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={4}
          xl={4}
          sx={{ ...styleContainerContentItem, alignItems: { xs: "center", md: "flex-start" }, mt: { xs: 2, md: 0 } }}
        >
          <Typography sx={styleContainerContentItemTitle}>Pagamento</Typography>
          <Image
            src="/bandeiras-aceitas-horizontal.png"
            priority
            alt="Formas de pagamento aceitas"
            width={375}
            height={55}
            style={{ width: "100%", height: "auto" }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={5}
          xl={5}
          sx={{ ...styleContainerContentItem, alignItems: { xs: "center", md: "flex-start" }, mt: { xs: 2, md: 0 } }}
        >
          <Typography sx={styleContainerContentItemTitle}>Segurança</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
            <span className={"justify-content-center justify-content-md-start"}>
              <div id="armored_website" style={{ width: "100%" }}>
                <param id="aw_preload" value="true" />
                <param id="aw_use_cdn" value="true" />
              </div>
            </span>
            <Image
              src="/clearsale-logo.png"
              alt="Site integrado a ClearSale"
              width={100}
              height={30}
              style={{ marginRight: 10 }}
            />
            <Image
              src="/rapidSSL.png"
              alt="Site usa certificado RapidSSL"
              width={100}
              height={30}
              style={{ marginRight: 10 }}
            />
            <Image src="/google.png" alt="Site seguro" width={100} height={30} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={3}
          xl={3}
          sx={{ ...styleContainerContentItem, alignItems: { xs: "center", md: "flex-start" }, mt: { xs: 2, md: 0 } }}
        >
          <Typography sx={styleContainerContentItemTitle}>Siga {process.env.NEXT_PUBLIC_STORE_NAME || 'nossa loja'}</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
            {process.env.NEXT_PUBLIC_FACEBOOK_URL && (
              <Link
                className="social-icon"
                href={process.env.NEXT_PUBLIC_FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                title={`Siga ${process.env.NEXT_PUBLIC_STORE_NAME || 'nossa loja'} no Facebook!`}
              >
                {" "}
                <FacebookIcon sx={{ fontSize: "2.2rem" }} />{" "}
              </Link>
            )}
            {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
              <Link
                href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                title={`Siga ${process.env.NEXT_PUBLIC_STORE_NAME || 'nossa loja'} no Instagram!`}
              >
                {" "}
                <Instagram sx={{ fontSize: "2.2rem" }} />{" "}
              </Link>
            )}
            {process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL && (
              <a href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL}>
                <Image
                  alt="Disponível no Google Play"
                  src="https://play.google.com/intl/pt-BR/badges/static/images/badges/pt-br_badge_web_generic.png"
                  className="app-download lazyload"
                  width={100}
                  height={40}
                />
              </a>
            )}
            {process.env.NEXT_PUBLIC_APP_STORE_URL && (
              <a href={process.env.NEXT_PUBLIC_APP_STORE_URL}>
                <Image
                  alt="Disponível no App Store"
                  src={"/appstore-download.svg"}
                  className="app-download lazyload"
                  width={120}
                  height={33}
                />
              </a>
            )}
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={9} lg={8} xl={8} sx={styleContainerContent}>
        <Grid xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerContentItem, textAlign: "center" }}>
          <Typography variant="overline" sx={{ fontSize: "0.8rem", pt: 1.3, textAlign: "center", lineHeight: 1.5 }}>
            Copyright © 2025 {process.env.NEXT_PUBLIC_SITE_URL || 'site'}. Todos os direitos reservados. Todo o conteúdo do site, todas as fotos,
            imagens, logotipos, marcas, dizeres, som, software, conjunto imagem, layout, trade dress, aqui veiculados
            são de propriedade exclusiva de {process.env.NEXT_PUBLIC_STORE_NAME || 'nossa loja'}. É vedada qualquer reprodução, total ou parcial, de qualquer
            elemento de identidade, sem expressa autorização. A violação de qualquer direito mencionado implicará na
            responsabilização cível e criminal nos termos da Lei. Os preços dos produtos estão sujeitos a alteração sem
            aviso prévio.
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={9} lg={8} xl={8} sx={styleContainerContent}>
        <Grid xs={12} sm={12} md={12} lg={12} xl={12} sx={{ ...styleContainerContentItem, textAlign: "center" }}>
          <Typography variant="overline" sx={{ fontSize: "0.8rem", pt: 0.2, textAlign: "center", lineHeight: 1.5 }}>
            {process.env.NEXT_PUBLIC_STORE_NAME || 'A loja'} se reserva o direito de corrigir qualquer possível erro de digitação ou gráfico e caso
            haja divergências entre os valores ofertados nos e-mails promocionais e valores do site, prevalecem as
            informações do site. {process.env.NEXT_PUBLIC_STORE_ADDRESS} - CNPJ {process.env.NEXT_PUBLIC_STORE_CNPJ}.
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={12} md={9} lg={8} xl={8} sx={styleContainerContent}>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ ...styleContainerContentItem, textAlign: "center", alignItems: "center", justifyContent: "center" }}
        >
          <Typography variant="overline" sx={{ fontSize: "0.7rem", pt: 0.2, textAlign: "center" }}>
            Desenvolvido por
            <a href="https://www.rm9brasil.com.br/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/agencia-rm9-02.svg"
                alt="RM9"
                width={100}
                height={30}
                style={{ height: 20, width: "auto", marginRight: 10, marginLeft: 10 }}
              />
            </a>
            <a href="https://www.tecworks.com.br/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/tecworks-branca.png"
                alt="TecWorks"
                width={100}
                height={30}
                style={{ height: 20, width: "auto" }}
              />
            </a>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
