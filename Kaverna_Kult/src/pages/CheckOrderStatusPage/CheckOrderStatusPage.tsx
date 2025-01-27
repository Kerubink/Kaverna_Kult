import React, { useState, useEffect } from "react";
import { db } from "@/database/firebase_config"; // Configuração do Firebase
import { doc, getDoc } from "firebase/firestore";

const CheckOrderStatusPage: React.FC = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const orderStates = [
    { state: "Em Análise", image: "/images/em-analise.png", description: "Pedido sendo analisado." },
    { state: "Pagamento Pendente", image: "/images/pagamento-pendente.png", description: "Aguardando pagamento." },
    { state: "Confirmado", image: "/images/confirmado.png", description: "Pedido confirmado." },
    { state: "Enviado para a Gráfica", image: "/images/enviado-para-grafica.png", description: "Enviado para produção." },
    { state: "Empacotando", image: "/images/empacotando.png", description: "Pedido sendo embalado." },
    { state: "Enviado", image: "/images/enviado.png", description: "Pedido enviado." },
    { state: "A Caminho", image: "/images/a-caminho.png", description: "Pedido a caminho." },
    { state: "Finalizado", image: "/images/finalizado.png", description: "Pedido finalizado." },
  ];

  // Função para buscar o pedido pelo ID e retornar os detalhes
  const handleSearchOrder = async () => {
    if (!orderId) {
      setError("Por favor, insira um ID de pedido.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const orderRef = doc(db, "pedidos", orderId); // Acessando a coleção "pedidos" e o documento pelo ID
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

    const lastUpdatedState = orderStates.find(state => state.state === orderData.status);
    const lastUpdatedTime = orderData.timestamp?.toDate().toLocaleString() || "Hora não disponível";

    return (
      <div className="relative">
        <div className="border-l-4 border-gray-300 ml-4 pl-6">
          {orderStates.map((state, index) => {
            const isActive = orderData.status === state.state;
            return (
              <div
                key={state.state}
                className={`flex items-center mb-4 ${isActive ? "bg-blue-100" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded-full ${isActive ? "bg-blue-500" : "bg-gray-300"} flex items-center justify-center`}
                >
                  <img src={state.image} alt={state.state} className="w-4 h-4" />
                </div>
                <div className={`ml-4 ${isActive ? "font-semibold text-blue-500" : ""}`}>
                  <p>{state.state}</p>
                  <p className="text-sm">{state.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {lastUpdatedState && (
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>Última atualização: {lastUpdatedState.state}</p>
            <p>Hora: {lastUpdatedTime}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Consultar Linha do Tempo do Pedido</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="orderId" className="block text-sm font-semibold text-gray-700">
            ID do Pedido
          </label>
          <input
            type="text"
            id="orderId"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            placeholder="Digite o ID do pedido"
          />
        </div>

        <button
          onClick={handleSearchOrder}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full"
        >
          {loading ? "Carregando..." : "Buscar Status"}
        </button>

        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}

        {orderData && renderTimeline()}
      </div>
    </div>
  );
};

export default CheckOrderStatusPage;
