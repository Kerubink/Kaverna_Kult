// src/pages/Admin/Pedidos.tsx
import React, { useState, useEffect } from "react";
import { db } from "@/database/firebase_config"; // Configuração do Firebase
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const PedidosPage = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const ordersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setOrders(ordersList);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const orderRef = doc(db, "orders", orderId);
    try {
      await updateDoc(orderRef, { status: newStatus });
      alert("Status do pedido atualizado!");
      loadOrders();
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div>
      <h1>Pedidos</h1>
      <table>
        <thead>
          <tr>
            <th>ID do Pedido</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.client}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => updateOrderStatus(order.id, "Em Processamento")}>Em Processamento</button>
                <button onClick={() => updateOrderStatus(order.id, "Enviado")}>Enviado</button>
                <button onClick={() => updateOrderStatus(order.id, "Entregue")}>Entregue</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidosPage;
