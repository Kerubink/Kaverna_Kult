import React, { useState, useEffect } from "react";
import { db } from "@/database/firebase_config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const PedidosPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados possíveis para o pedido
  const orderStates = [
    "Em Análise",
    "Pagamento Pendente",
    "Confirmado",
    "Enviado para a Gráfica",
    "Empacotando",
    "Enviado",
    "A Caminho",
    "Finalizado",
  ];

  // Carrega os pedidos do Firestore
  const loadOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pedidos"));
      if (querySnapshot.empty) {
        console.log("Nenhum pedido encontrado.");
      }
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Pedidos carregados:", ordersList); // Verifique os pedidos carregados
      setOrders(ordersList);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      alert("Erro ao carregar pedidos");
    } finally {
      setLoading(false); // Assegure-se de que o loading será alterado para false
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const orderRef = doc(db, "pedidos", orderId);
    const currentTimestamp = new Date().toISOString(); // Captura o timestamp atual de atualização
  
    try {
      await updateDoc(orderRef, {
        stutus: {
          statusAtual: newStatus,
          updatedAt: currentTimestamp,
        }
      });
      console.log("Status atualizado com sucesso!");
      loadOrders(); // Recarrega os pedidos após a atualização
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };
  

  useEffect(() => {
    loadOrders();
  }, []);

  // Função para formatar a data do timestamp
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Pedidos</h1>
      {loading ? (
        <p>Carregando pedidos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] table-auto bg-white rounded-lg shadow-md table-layout-fixed">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-2 px-4 min-w-[120px]">ID do Pedido</th>
                <th className="py-2 px-4 min-w-[200px]">Cliente</th>
                <th className="py-2 px-4 min-w-[300px]">Itens</th>
                <th className="py-2 px-4 min-w-[120px]">Total</th>
                <th className="py-2 px-4 min-w-[250px]">Endereço</th>
                <th className="py-2 px-4 min-w-[150px]">Status</th>
                <th className="py-2 px-4 min-w-[150px]">Ações</th>
                <th className="py-2 px-4 min-w-[120px]">Data</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  {/* ID do Pedido */}
                  <td className="py-2 px-4">{order.id}</td>

                  {/* Cliente */}
                  <td className="py-2 px-4">
                    <p>Nome: {order.cliente?.nome || "N/A"}</p>
                    <p>Idade: {order.cliente?.idade || "N/A"}</p>
                    <p>telefone: {order.cliente?.telefone || "N/A"}</p>
                  </td>

                  {/* Itens do Pedido */}
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        const itemDetails = document.getElementById(
                          `itens-${order.id}`
                        );
                        if (itemDetails) {
                          itemDetails.classList.toggle("hidden");
                        }
                      }}
                    >
                      Mostrar Itens
                    </button>
                    <div
                      id={`itens-${order.id}`}
                      className="hidden mt-2 text-sm text-gray-600"
                    >
                      {order.itens.map((item: any, index: number) => (
                        <div key={index} className="mb-2">
                          <p>Nome: {item.nome}</p>
                          <p>Tamanho: {item.tamanho}</p>
                          <p>Cor: {item.cor}</p>
                          <p>Quantidade: {item.quantidade}</p>
                          <p>Coleção: {item.colecao}</p>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Total */}
                  <td className="py-2 px-4">
                    <p>Sem deconto: R$ {order.totalSemDescontos || order.total}</p>
                    <p>Com desconto: R$ {order.descontos?.valorComDesconto}</p>
                  </td>

                  {/* Endereço */}
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        const addressDetails = document.getElementById(
                          `endereco-${order.id}`
                        );
                        if (addressDetails) {
                          addressDetails.classList.toggle("hidden");
                        }
                      }}
                    >
                      Mostrar Endereço
                    </button>
                    <div
                      id={`endereco-${order.id}`}
                      className="hidden mt-2 text-sm text-gray-600"
                    >
                      <p>
                        {order.cliente.endereco?.logradouro},{" "}
                        {order.cliente.endereco?.numeroCasa}
                      </p>
                      <p>{order.cliente.endereco?.complemento}</p>
                      <p>
                        {order.cliente.endereco?.cep},{" "}
                        {order.cliente.endereco?.cidade} -{" "}
                        {order.cliente.endereco?.estado}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-2 px-4">
                    {order.status?.statusAtual || "Não definido"}
                  </td>

                  {/* Ações */}
                  <td className="py-2 px-4">
                    <select
                      value={order.status?.statusAtual || "Não definido"}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2"
                    >
                      {orderStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Data do Pedido */}
                  <td className="py-2 px-4">{formatDate(order.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PedidosPage;
