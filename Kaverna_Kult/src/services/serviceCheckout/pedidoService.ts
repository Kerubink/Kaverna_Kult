// src/services/pedidoService.ts
import { getFirestore, collection, addDoc } from "firebase/firestore";

interface Pedido {
  itens: {
    nome: string;
    tamanho: string;
    cor: string;
    quantidade: number;
    colecao: string;
  }[];
  total: number;
  cliente: {
    nome: string;
    telefone: string;
    idade: string;
    observacao: string;
    endereco: {
      cep: string;
      cidade: string;
      estado: string;
      numeroCasa: string;
      complemento?: string;
    };
  };
}

export const enviarPedido = async (pedido: Pedido): Promise<{ success: boolean; message?: string }> => {
  const db = getFirestore();
  try {
    // Envia o pedido para o Firestore
    await addDoc(collection(db, "pedidos"), pedido);
    
    // Retorna um sucesso
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar o pedido:", error);
    // Retorna um erro caso algo dê errado
    return { success: false, message: "Ocorreu um erro ao enviar o pedido. Tente novamente." };
  }
};
