import React from "react";

export default function PoliticaDePrivacidade() {
  return (
    <>
      <section className="politica-de-privacidade" style={{ margin: "60px auto", width: 800, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
        <h1> Política de Frete </h1>

        <p>Na mellodia, buscamos oferecer a melhor experiência de compra online. Confira abaixo as regras aplicáveis ao envio dos pedidos:</p>

        <article>
          <h2 style={{ marginTop: "20px" }}> 1. Frete Grátis </h2>
          <p>Compras acima de R$ 99,99 têm frete grátis, válido apenas para as regiões Sul e Sudeste.</p>
          <p>O frete grátis não se aplica à modalidade de Entrega Expressa.</p>
          <h2 style={{ marginTop: "20px" }}> 2. Entrega Expressa (Curitiba) </h2>
          <p>Disponível somente para a cidade de Curitiba/PR.</p>
          <p>O valor é calculado de acordo com a região/CEP informado no checkout.</p>
          <p>O prazo de entrega é de até 2 horas após a confirmação do pagamento.</p>
          <p>Esta modalidade não está incluída no benefício do frete grátis.</p>
          <h2 style={{ marginTop: "20px" }}> 3. Entregas via Motoboy </h2>
          Realizadas para Curitiba e regiões metropolitanas específicas:
          <p>Colombo</p>
          <p>Piraquara</p>
          <p>São José dos Pinhais (área central)</p>
          <p>Araucária</p>
          <p>Pinhais</p>
          <p>Almirante Tamandaré</p>
          <p>Nessas localidades, o prazo de entrega pode variar de acordo com o endereço e confirmação do pagamento.</p>
          <h2 style={{ marginTop: "20px" }}> 4. Outras Regiões do Brasil </h2>
          <p>Pedidos destinados a regiões fora do alcance do motoboy são enviados por transportadoras credenciadas pela mellodia.</p>
          <p>O prazo e o valor do frete são calculados automaticamente no momento da compra, conforme o CEP informado.</p>
          <h2 style={{ marginTop: "20px" }}> 5. Observações Gerais </h2>
          <p>O prazo de entrega começa a contar a partir da confirmação do pagamento.</p>
          <p>Em caso de imprevistos com a entrega (clima, trânsito, greves, etc.), o cliente será informado por nossos canais oficiais.</p>
          <p>Sempre confira seus dados de endereço antes de finalizar o pedido para evitar atrasos.</p>
        </article>
      </section>
    </>
  );
}
