// src/services/freteService.ts

interface FreteParams {
    cepDestino: string;
    peso: number;
    quantidade: number;
  }
  
  interface FreteSimulado {
    valorSimulado: string;
    prazoEntrega: string;
    mensagemAviso: string;
  }
  
  // CEP de origem fixo (exemplo: São Paulo)
  const CEP_ORIGEM = "57025-000"; // Substitua com o CEP real da sua loja ou armazém
  
  // Função para simular o valor do frete com base no CEP de destino, peso e quantidade
  export function calcularFreteSimulado({ cepDestino, peso, quantidade }: FreteParams): FreteSimulado {
    // Usando uma fórmula de cálculo mais simples para simular o valor do frete
    const distancia = Math.abs(parseInt(cepDestino.replace("-", "").slice(0, 5)) - parseInt(CEP_ORIGEM.replace("-", "").slice(0, 5)));
  
    // Ajustando a faixa de preço baseada no peso
    let faixaPeso = 0;
    if (peso <= 0.5) faixaPeso = 10;  // Frete para itens leves
    else if (peso <= 1) faixaPeso = 15;  // Frete para itens até 1kg
    else if (peso <= 2) faixaPeso = 20;  // Frete para itens até 2kg
    else faixaPeso = 25; // Frete para itens acima de 2kg
  
    // Ajustando a faixa de preço baseada na quantidade
    let faixaQuantidade = 0;
    if (quantidade <= 3) faixaQuantidade = 5;
    else if (quantidade <= 5) faixaQuantidade = 10;
    else faixaQuantidade = 15;
  
    // Cálculo simulado com base na distância, peso e quantidade
    let valorSimulado = (faixaPeso + faixaQuantidade + (distancia / 1000)).toFixed(2);
  
    // O valor do frete não deve ser menor que R$ 10.00 para cobrir custos mínimos
    valorSimulado = Math.max(parseFloat(valorSimulado), 10).toFixed(2);
  
    // Definindo um prazo de entrega fictício
    const prazoEntrega = "3 a 5 dias úteis";
  
    // Mensagem de aviso
    const mensagemAviso = `Este é um valor simulado. Verifique o valor real no site dos Correios ou com o representante da loja.`;
  
    return {
      valorSimulado: `R$ ${valorSimulado}`,
      prazoEntrega,
      mensagemAviso,
    };
  }
  