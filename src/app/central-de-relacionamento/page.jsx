"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Container, Typography, Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useApp } from "@/app/context/AppContext";

export default function CentralRelacionamento() {
  const router = useRouter();
  const { state: appState, dispatch } = useApp();
  const [state, setState] = useState({
    redirect: "",
    isLoading: false,
    aba: "entregas",
  });

  if (state.redirect) {
    return router.push(state.redirect);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: "bold" }}>
          Central de Relacionamento
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Tópicos mais buscados
        </Typography>
      </Box>

      <Tabs value={state.aba} onChange={(e, newValue) => setState({ ...state, aba: newValue })} sx={{ mb: 4 }}>
        <Tab value="entregas" label="Entregas" />
        <Tab value="trocas" label="Troca e Devolução" />
        <Tab value="pedidos" label="Meus Pedidos" />
        <Tab value="cadastro" label="Cadastro" />
        <Tab value="servicos" label="Serviços" />
        <Tab value="pagamento" label="Formas de Pagamento" />
      </Tabs>

      {state.aba === "entregas" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Entregas
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Qual é o prazo de entrega?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                O prazo de entrega varia de acordo com o CEP de sua residência e a opção de frete que você escolher. Quando realizar o seu pedido, ao selecionar "Finalizar Compra",
                você pode consultar os prazos e opções de fretes disponíveis para o seu endereço no carrinho. Você insere o CEP do seu endereço e serão exibidas automaticamente as
                opções de frete disponíveis. O prazo de entrega começa a contar após a confirmação do pagamento do seu pedido e é calculado em dias úteis. A sua entrega é calculada
                de acordo com o CEP fornecido e que encontra-se na finalização do seu pedido, logo abaixo do endereço de entrega.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Quais são os tipos de entregas disponíveis?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Normal:
                </Box>{" "}
                Modalidade para quem quer um preço mais em conta e não tem problema de esperar um pouquinho! Aqui o frete poderá ser grátis para compras acima de um valor mínimo de
                compra e você poderá verificar na oferta do carrinho ao inserir seu CEP ou se você tiver algum cupom relacionado e aplicável para o frete. Caso o seu pedido não
                atinja o valor mínimo para o frete grátis, o custo da entrega será calculado de acordo com o CEP do seu endereço de entrega (taxas e serviços não estão inclusos
                nesse valor).
                <br />
                <br />
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  Expressa:
                </Box>{" "}
                Ideal para quem quer receber logo as suas compras, esta opção de frete está disponível para algumas áreas do Brasil, por isso consulte as o CEP do endereço desejado
                para a entrega na página Checkout.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Qual é o valor do frete?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                O frete poderá ser grátis para compras acima de um valor mínimo de compra e você poderá verificar na oferta do carrinho ao inserir seu CEP. Se o seu pedido não
                atingir o valor mínimo para o frete grátis, o custo da entrega será calculado de acordo com o CEP do seu endereço de entrega (taxas e serviços não estão inclusos
                nesse valor). Assim, se você quiser que o seu pedido seja entregue ainda mais rápido do que nossa entrega normal, consulte as opções de frete disponíveis parao seu
                CEP.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Posso mudar o endereço de entrega?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Se você já finalizou o pedido, o endereço não poderá ser alterado. Se ainda assim, precisar de ajuda, entre em contato com a gente e vamos te ajudar. Caso queira
                mudar o endereço antes de fazer um pedido, basta fazer o login em sua conta e ir em "MEUS ENDEREÇOS" e adicionar ou excluir os endereços que desejar.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {state.aba === "trocas" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Troca e Devolução
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Recebi um produto danificado no pedido. O que devo fazer?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Ao identificar um produto danificado no pedido, entre em contato com a Diva através do Fale Conosco. Anexando uma foto do produto avariado. Após o envio você
                receberá um retorno com todas as orientações sobre a troca/devolução. O prazo para informar o recebimento de um item danificado no pedido é de até 7 dias corridos a
                contar da data de entrega do pedido.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Recebi meu pedido faltando itens. O que devo fazer?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Se após a conferência do pedido for identificado a falta de itens, entre em contato com a Diva através do Fale Conosco. Você receberá um retorno com todas as
                orientações sobre a reposição. O prazo para informar a falta de itens no pedido é de 3 dias corridos a contar da entrega do pedido.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Recebi um produto diferente do comprado. E agora?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Ao identificar um produto diferente do comprado, entre em contato com a Diva através do Fale Conosco. anexando uma foto do produto recebido. Após o envio você
                receberá um retorno com todas as orientações sobre a troca/devolução.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">A caixa/embalagem do meu pedido está violada. Devo receber o pedido?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Em caso de a caixa/embalagem chegar violada, recuse a entrega informando o motivo para o entregador. Após, nos avise sobre o ocorrido através Fale Conosco.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Recebi o pedido de outra pessoa (trocado). E agora?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Caso você receba o pedido de outra pessoa (trocado) entre em contato no Fale Conosco. informando sobre o ocorrido. Realizaremos a coleta do pedido trocado e
                providenciaremos o envio do seu pedido.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Quero devolver um produto. Como faço?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Você poderá fazer a solicitação de desistência através do Fale Conosco. Atenção! O prazo para desistência/devolução é de até 7 dias corridos a contar da data de
                entrega.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {state.aba === "pedidos" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Meus Pedidos
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como acompanhar o meu pedido?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Você receberá as atualizações pelo e-mail cadastrado, assim que concluir o pedido. Todas as atualizações estão disponíveis na sua conta e através dos e-mails que
                enviamos para você.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Meu pedido está atrasado, o que fazer?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Se o seu pedido estiver fora do prazo de entrega, envie um e-mail para{" "}
                <a href="mailto:sac@divacosmeticos.com.br" target="_blank" rel="noopener noreferrer">
                  {" "}
                  sac@divacosmeticos.com.br{" "}
                </a>{" "}
                e vamos ajudar você! Se desejar, também poderá por lá solicitar alterações no seu pedido, demandas especiais e até cancelar o pedido, se for o caso.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como saber se meu pedido foi aprovado?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Realizamos uma análise criteriosa de todos os pedidos recebidos e para a sua segurança somente são aprovados os pedidos que possuem todos os critérios positivos
                dessa análise. Assim que o pedido for aprovado, enviaremos um e-mail com a confirmação de pagamento.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {state.aba === "cadastro" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Cadastro
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como faço para alterar os meus dados cadastrais?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Faça seu login no site e clique em Minha Conta, ali você encontrará as opções para poder alterar seu cadastro. É só escolher a informação que deseja alterar. Caso
                você tenha alguma dúvida ou dificuldade, poderá enviar um e-mail para{" "}
                <a href="mailto:sac@divacosmeticos.com.br" target="_blank" rel="noopener noreferrer">
                  {" "}
                  sac@divacosmeticos.com.br{" "}
                </a>{" "}
                que iremos te ajudar.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como faço para me cadastrar no site?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Para realizar seu cadastro, clique na opção "Minha Conta" no topo do site. Em seguida, na parte inferior do site clique em "Não possuo cadastro ainda". Crie sua
                Conta, digite os dados solicitados, clique em Continuar e preencha os demais dados cadastrais solicitados. Pronto! Você já pode fazer as suas compras.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como resgatar a minha senha?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                No canto direito do site selecione Minha Conta, insira seu e-mail de cadastro e clique no botão Continuar, em seguida você vai ter duas opções:
                <ul>
                  <li>Esqueci minha senha: nessa opção você vai receber em seu e-mail as orientações para criar uma nova senha.</li>
                  <li>Acesso rápido por e-mail: você recebe um link em seu e-mail e ao clicar nele, acessa o site.</li>
                </ul>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {state.aba === "servicos" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Serviços
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como entrar em contato?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Para você falar conosco, pedimos a gentileza que nos contate por telefone no número (41) 98817-1723 ou enviar um e-mail através do nosso formulário.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como faço para cancelar minha compra?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Se o pagamento do pedido for cartão ou pix, entre em contato com a nossa central de relacionamento pelo telefone (41) 98817-1723 ou nos envie um e-mail através do
                formulário.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como faço minhas compras?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Para realizar suas compras, você pode escolher a categoria do produto que deseja no menu superior do site. Se você já sabe o que procurar, é só digitar no campo de
                busca, que a página abrirá direto no produto. Você também pode navegar pelas melhores marcas do mercado, o menu MARCAS e em cada produto que você clica indicamos a
                descrição, resultados e o conselho para aplicação. Após escolher os itens que deseja, clique no botão Comprar e então o site te orientará sobre os próximos passos
                até finalizar a sua compra.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      {state.aba === "pagamento" && (
        <Box>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Formas de Pagamento
          </Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Quais são os meios de pagamentos disponíveis?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                A Diva aceita pagamento por Cartão de Crédito. No cartão de crédito você pode parcelar as compras em até 6x sem juros em todos os departamentos desde que a parcela
                mínima seja de R$ 30,00.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Posso alterar a forma de pagamento de um pedido finalizado?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Quando um pedido é finalizado nenhuma alteração pode ser feita, mas se você precisar de alguma ajuda muito específica, envie e-mail para{" "}
                <a href="mailto:sac@divacosmeticos.com.br"> sac@divacosmeticos.com.br </a> que vamos ajudar você com esclarecimentos.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Posso efetuar o pagamento com 2 cartões de crédito?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Não, o pagamento pode ser efetuado em um cartão por pedido.</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Quais são as bandeiras de cartões de créditos aceitas?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Aceitamos as bandeiras Visa, MasterCard, American Express, Dinners Club e Elo e Hipercard. Para garantir sua segurança todos os pedidos passam por uma análise de
                dados cadastrais. Caso seja necessário entrar em contato para a confirmação de dados, é importante que seus dados estejam sempre completos e atualizados.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Como funciona o pagamento pelo PIX?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Na finalização da sua compra, escolha a opção PIX e clique em Finalizar Compra, logo após será gerado o QR Code para pagamento do site, o QR Code tem validade de 10
                minutos para pagamento, caso não seja efetuado seu pedido será cancelado automáticamente.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}

      <Box sx={{ mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Fale Conosco
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <WhatsAppIcon sx={{ fontSize: 40, color: "success.main" }} />
          <Typography variant="h6">41 98753-3683</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Seg. à Sex. das 9H às 18:00H
        </Typography>
      </Box>
    </Container>
  );
}
