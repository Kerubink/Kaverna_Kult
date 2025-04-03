import React, { useState } from "react";
import { db } from "@/database/firebase_config"; // Configuração do Firebase
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const CheckOrderStatusPage: React.FC = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const orderStates = [
    { state: "Recebido", image: "./icons/iconsEntrega/mensagem-recebida.svg", description: "Recebemos o seu pedido e estamos processando as informações." },
    { state: "Pagamento Pendente", image: "./icons/iconsEntrega/pagamento-atrasado.svg", description: "Aguardando a confirmação do pagamento." },
    { state: "Pagamento Confirmado", image: "./icons/iconsEntrega/confirmacao-de-pagamento.svg", description: "O pagamento foi aprovado. Estamos preparando o pedido." },
    { state: "Em Produção", image: "./icons/iconsEntrega/producao-em-massa.svg", description: "Seu pedido está em produção. Estamos trabalhando para entregá-lo o mais rápido possível." },
    { state: "Empacotando", image: "./icons/iconsEntrega/caixa.svg", description: "Estamos empacotando seu pedido para envio." },
    { state: "Enviado", image: "./icons/iconsEntrega/enviado.svg", description: "Seu pedido foi enviado e está a caminho do endereço de entrega." },
    { state: "A Caminho", image: "./icons/iconsEntrega/monitorando.svg", description: "Seu pedido está a caminho do destino. Fique atento!" },
    { state: "Entregue", image: "./icons/iconsEntrega/caixa-de-entrega.svg", description: "O pedido foi entregue com sucesso no endereço informado." },
  ];

  const handleSearchOrder = async () => {
    if (!orderId) {
      setError("Por favor, insira um ID de pedido.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const orderRef = doc(db, "pedidos", orderId);
      const orderDoc = await getDoc(orderRef);

      if (orderDoc.exists()) {
        const order = orderDoc.data();
        setOrderData(order);
      } else {
        setError("Pedido não encontrado.");
      }
    } catch (err) {
      setError("Erro ao buscar o pedido.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeline = () => {
    if (!orderData) return null;

    if (orderData.status.statusAtual === "Cancelado") {
      return (
        <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Pedido Cancelado</h2>
          <p className="text-gray-800 text-lg mb-4">
            Parece que esse pedido foi cancelado. O pagamento não foi confirmado ou houve algum outro problema.
          </p>
          <p className="italic text-gray-600">
            {orderStates.find((state) => state.state === "Cancelado")?.description}
          </p>
          <p className="text-gray-700 mt-4">
            Se você acredita que houve um erro, entre em contato com o nosso suporte para mais informações.
          </p>
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="border-l-4 border-gray-300 pl-4">
          {orderStates.map((state) => {
            const isActive = orderData.status.statusAtual === state.state;
            return (
              <div key={state.state} className={`flex items-center mb-6 ${isActive ? "bg-blue-100 p-3 rounded-lg" : ""}`}>
                <div
                  className={`min-w-10 h-10 rounded-full flex items-center justify-center ${
                    isActive ? "bg-blue-500" : "bg-gray-300"
                  }`}
                >
                  <img
                    src={state.image}
                    alt={state.state}
                    className={`w-6 ${isActive ? "text-white" : ""}`}
                  />
                </div>
                <div className="ml-4">
                  <p className={`font-medium ${isActive ? "text-blue-500" : "text-gray-700"}`}>
                    {state.state}
                  </p>
                  <p className="text-sm text-gray-600">{state.description}</p>
                </div>
              </div>
            );
          })}
          <p className="text-gray-500 mt-4 italic">
            Última atualização em: {new Date(orderData.status.updatedAt).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-4">
      <div className="flex items-center justify-center relative w-full mb-8">
      <Link to="/" className="absolute left-3">
          <button className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>
          </button>
        </Link>
        <h1 className="text-lg font-bold text-gray-800">Consulta de Status do Pedidos</h1>
      </div>

      <div className="bg-white p-3 rounded-lg w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
            ID do Pedido
          </label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            placeholder="Digite o ID do pedido"
          />
        </div>

        <button
          onClick={handleSearchOrder}
          disabled={loading}
          className={`w-full p-2 rounded-md font-semibold text-white transition-all ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Carregando..." : "Buscar Status"}
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {orderData && <div className="mt-8">{renderTimeline()}</div>}

        <div className="mt-8 text-sm text-gray-600">
          <p>Para consultar o status de um pedido, entre com o ID do mesmo.</p>
          <p>Caso tenha dúvidas, entre em contato com o suporte pelo whatsapp.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckOrderStatusPage;
