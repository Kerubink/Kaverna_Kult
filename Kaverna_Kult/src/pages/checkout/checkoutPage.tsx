import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { calcularFreteSimulado } from "../../services/freteService"; // Importando a função de cálculo de frete

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const selectedItems =
    location.state?.items || JSON.parse(localStorage.getItem("selectedItems") || "[]");

  // Calculando o preço total dos itens
  const totalPrice = selectedItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  // Definindo os estados para frete
  const [cepDestino, setCepDestino] = useState('');
  const [pesoTotal, setPesoTotal] = useState(0);
  const [quantidadeTotal, setQuantidadeTotal] = useState(0);
  const [resultadoFrete, setResultadoFrete] = useState<any>(null);

  // Função para calcular o peso total e a quantidade de produtos
  const calcularPesoEQuantidade = () => {
    let peso = 0;
    let quantidade = 0;

    selectedItems.forEach((item: { peso: number, quantity: number }) => {
      peso += item.peso * item.quantity; // Peso total (peso de cada item * quantidade)
      quantidade += item.quantity; // Quantidade total de itens
    });

    setPesoTotal(peso);
    setQuantidadeTotal(quantidade);
  };

  // Função chamada ao submeter o cálculo do frete
  const handleCalcularFrete = () => {
    if (cepDestino) {
      const frete = calcularFreteSimulado({ cepDestino, peso: pesoTotal, quantidade: quantidadeTotal });
      setResultadoFrete(frete);
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  };

  // Carregar peso e quantidade ao carregar a página
  useEffect(() => {
    calcularPesoEQuantidade();
  }, [selectedItems]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
        <ul className="divide-y divide-gray-200">
          {selectedItems.map((item: any) => (
            <li key={item.id} className="flex items-center py-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-md object-cover"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  Tamanho: {item.selectedSize} | Cor:{" "}
                  <span
                    className="inline-block w-4 h-4 rounded-full border"
                    style={{ backgroundColor: item.selectedColor }}
                  ></span>
                </p>
                <p className="text-gray-700">
                  Quantidade: <span className="font-semibold">{item.quantity}</span>
                </p>
              </div>
              <div className="text-lg font-bold text-gray-800">
                R${(item.price * item.quantity).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span className="text-green-600">R${totalPrice.toFixed(2)}</span>
          </div>

          <div className="mt-4">
            <label htmlFor="cep" className="block text-gray-700 font-semibold">CEP de destino:</label>
            <input
              type="text"
              id="cep"
              value={cepDestino}
              onChange={(e) => setCepDestino(e.target.value)}
              placeholder="Digite o CEP"
              className="w-full mt-2 p-2 border rounded-md"
            />
            <button
              onClick={handleCalcularFrete}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md transition duration-200"
            >
              Calcular Frete
            </button>
          </div>

          {resultadoFrete && (
            <div className="mt-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Frete Simulado:</span>
                <span className="text-green-600">{resultadoFrete.valorSimulado}</span>
              </div>
              <p className="text-sm text-gray-500">Prazo de Entrega: {resultadoFrete.prazoEntrega}</p>
              <p className="text-sm text-gray-500 mt-2">{resultadoFrete.mensagemAviso}</p>
            </div>
          )}

          <button className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-medium shadow-md transition duration-200">
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
