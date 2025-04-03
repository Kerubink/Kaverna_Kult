export interface FreightData {
  sCepOrigem: string; // CEP de origem
  sCepDestino: string; // CEP de destino
  nVlPeso: string; // Peso em kg
  nCdFormato: string; // Formato: 1 = caixa/pacote
  nVlComprimento: string; // Comprimento em cm
  nVlAltura: string; // Altura em cm
  nVlLargura: string; // Largura em cm
  nVlDiametro: string; // Diâmetro em cm
  sCdMaoPropria: string; // Mão própria? (S/N)
  nVlValorDeclarado: string; // Valor declarado
  sCdAvisoRecebimento: string; // Aviso de recebimento? (S/N)
  nCdServico: string; // Código do serviço: 04014 = SEDEX, 04510 = PAC
}

export interface FreightResult {
  Valor: string;
  PrazoEntrega: string;
}

export const calculateFreight = async (data: FreightData): Promise<FreightResult> => {
    try {
      const response = await fetch('/api/frete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Erro ao calcular o frete');
      }
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro no serviço de frete:', error);
      throw error;
    }
  };
  