import React, { useState } from 'react';

const CheckoutFrete: React.FC = () => {
  const [cepDestino, setCepDestino] = useState('');

  return (
    <div>
      <h2>Calculadora de Frete</h2>
      <p>Calcule o valor do frete para o seu pedido clicando no link abaixo.</p>
      <label>
        Insira o seu CEP:
        <input
          type="text"
          value={cepDestino}
          onChange={(e) => setCepDestino(e.target.value)}
          placeholder="CEP do destino"
        />
      </label>
      <p>
        <a
          href={`https://www2.correios.com.br/sistemas/precosPrazos/precoprazo.php?cepOrigem=01001-000&cepDestino=${cepDestino}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Clique aqui para calcular o frete
        </a>
      </p>
      <p>
        O valor do frete será adicionado ao total da sua compra no momento do pagamento.
      </p>
    </div>
  );
};

export default CheckoutFrete;
